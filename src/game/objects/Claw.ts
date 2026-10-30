import { soundEffects } from '../audio/SoundEffects';
import { detonateBarrel, showBarrelExplosion } from './Explosions';
import { WORLD } from '../state/World';
import { GameObjects, Scene } from 'phaser';
import { Collectable } from './Collectable';

type ClawMode = 'idle' | 'extending' | 'retracting';

export class Claw {
    private mode: ClawMode = 'idle';
    private angle = -0.8;
    private swingDirection = 1;
    private length = 30;
    private caught: Collectable | null = null;
    private gripOffsetX = 0;
    private gripOffsetY = 0;
    private readonly grabReach = 18;
    private dynamite: GameObjects.Graphics | null = null;
    private throwElapsed = 0;
    private readonly graphic: GameObjects.Graphics;
    private readonly origin = { x: 512, y: 210 };

    constructor(private readonly scene: Scene, private readonly onCollect: (value: number, object: Collectable) => void, private readonly retrievalMultiplier = 1, private readonly diamondMultiplier = 1, private readonly strengthBoost: () => number = () => 1) {
        this.graphic = scene.add.graphics().setDepth(5);
        this.draw();
    }

    get isHauling(): boolean { return this.mode === 'retracting' && this.caught !== null && !this.dynamite; }

    get haulingWeight(): number { return this.isHauling ? this.caught!.weight : 0; }

    get retrievalSpeed(): number {
        return this.mode === 'retracting' && !this.dynamite
            ? 360 * this.retrievalMultiplier * this.strengthBoost() / (1 + (this.caught?.weight ?? 0)) : 0;
    }

    launch(): void {
        if (this.mode === 'idle') {
            this.mode = 'extending';
            soundEffects.play('launch');
        }
    }

    throwDynamite(): boolean {
        if (this.mode !== 'retracting' || !this.caught || this.dynamite) return false;
        soundEffects.play('throw');
        this.throwElapsed = 0;
        this.dynamite = this.scene.add.graphics().setDepth(6);
        this.dynamite.fillStyle(0xc43c2f).fillRoundedRect(-5, -12, 10, 24, 2);
        this.dynamite.lineStyle(2, 0x563926).lineBetween(0, -12, 3, -18);
        this.dynamite.fillStyle(0xffdc55).fillCircle(3, -18, 3);
        return true;
    }

    private updateDynamite(seconds: number): void {
        if (!this.dynamite || !this.caught) return;
        this.throwElapsed += seconds;
        const progress = Math.min(1, this.throwElapsed / 0.35);
        const x = this.origin.x + (this.caught.x - this.origin.x) * progress;
        const y = this.origin.y + (this.caught.y - this.origin.y) * progress - Math.sin(progress * Math.PI) * 45;
        this.dynamite.setPosition(x, y).setRotation(progress * Math.PI * 4);
        if (progress < 1) return;
        this.dynamite.destroy();
        this.dynamite = null;
        this.caught.destroy();
        this.caught = null;
        soundEffects.play('explosion');
        // A short, simple burst marks the hit. Destroyed ore awards no money.
        const burst = this.scene.add.graphics().setPosition(x, y).setDepth(6);
        burst.fillStyle(0xffa32b).fillCircle(0, 0, 26);
        burst.fillStyle(0xffe486).fillCircle(0, 0, 15);
        this.scene.tweens.add({ targets: burst, alpha: 0, duration: 180, onComplete: () => burst.destroy() });
    }

    update(seconds: number, objects: Collectable[]): void {
        if (this.mode === 'idle') {
            this.angle += this.swingDirection * seconds * 1.155;
            if (this.angle > 1.05 || this.angle < -1.05) {
                this.angle = Math.max(-1.05, Math.min(1.05, this.angle));
                this.swingDirection *= -1;
            }
        } else if (this.mode === 'extending') {
            const oldLength = this.length;
            const edgeRange = Math.min(WORLD.clawRange, (WORLD.floorY - this.origin.y) / Math.cos(this.angle), 488 / Math.max(0.001, Math.abs(Math.sin(this.angle))));
            this.length = Math.min(edgeRange, this.length + 352 * seconds);
            // Swept segment collision prevents tunnelling even on slow frames.
            let first: Collectable | null = null;
            let hitLength = this.length;
            for (const object of objects) {
                if (!object.available) continue;
                const dx = object.x - this.origin.x;
                const dy = object.y - this.origin.y;
                const along = dx * Math.sin(this.angle) + dy * Math.cos(this.angle);
                const across = Math.abs(dx * Math.cos(this.angle) - dy * Math.sin(this.angle));
                const radius = object.radius * 0.9 + 6;
                if (across > radius) continue;
                const entry = along - Math.sqrt(radius * radius - across * across) - this.grabReach;
                const exit = along + Math.sqrt(radius * radius - across * across) - this.grabReach;
                if (exit >= oldLength && entry <= hitLength) {
                    first = object;
                    hitLength = Math.max(oldLength, entry);
                }
            }
            if (first) {
                this.length = hitLength;
                if (first.kind === 'tnt') {
                    this.mode = 'retracting';
                    detonateBarrel(first, objects, (x, y) => showBarrelExplosion(this.scene, x, y));
                    this.draw();
                    return;
                }
                soundEffects.play('catch');
                this.caught = first;
                // Preserve the contact position instead of snapping the ore's centre to the rope.
                this.gripOffsetX = first.x - (this.origin.x + Math.sin(this.angle) * this.length);
                this.gripOffsetY = first.y - (this.origin.y + Math.cos(this.angle) * this.length);
                first.available = false;
                this.mode = 'retracting';
            } else if (this.length >= edgeRange) this.mode = 'retracting';
        } else {
            if (this.dynamite) {
                this.updateDynamite(seconds);
                this.draw();
                return;
            }
            this.length = Math.max(30, this.length - this.retrievalSpeed * seconds);
            if (this.length <= 30) {
                if (this.caught) {
                    soundEffects.play('collect');
                    this.onCollect(this.caught.collectionValue(this.diamondMultiplier), this.caught);
                    this.caught.destroy();
                    this.caught = null;
                }
                this.mode = 'idle';
            }
        }
        if (this.caught) this.caught.moveTo(this.origin.x + Math.sin(this.angle) * this.length + this.gripOffsetX, this.origin.y + Math.cos(this.angle) * this.length + this.gripOffsetY);
        this.draw();
    }

    private draw(): void {
        const x = this.origin.x + Math.sin(this.angle) * this.length;
        const y = this.origin.y + Math.cos(this.angle) * this.length;
        this.graphic.clear().lineStyle(4, 0x503b2b);
        this.graphic.lineBetween(this.origin.x, this.origin.y, x, y);
        this.graphic.lineStyle(1, 0xc49d68);
        this.graphic.lineBetween(this.origin.x - 1, this.origin.y, x - 1, y);

        const point = (side: number, down: number) => ({ x: x + Math.cos(this.angle) * side + Math.sin(this.angle) * down, y: y - Math.sin(this.angle) * side + Math.cos(this.angle) * down });
        const gripSide = this.gripOffsetX * Math.cos(this.angle) - this.gripOffsetY * Math.sin(this.angle);
        const gripDown = this.gripOffsetX * Math.sin(this.angle) + this.gripOffsetY * Math.cos(this.angle);
        const radius = (this.caught?.radius ?? 0) * 0.9;
        for (const sign of [-1, 1]) {
            // Loaded fingers wrap around the actual object, including off-centre catches.
            const a = this.caught ? point(gripSide + sign * radius * 0.85, gripDown - radius * 0.5) : point(sign * 12, 10);
            const b = this.caught ? point(gripSide + sign * radius, gripDown + radius * 0.2) : point(sign * 19, 22);
            const c = this.caught ? point(gripSide + sign * radius * 0.55, gripDown + radius * 0.8) : point(sign * 12, 27);
            this.graphic.lineStyle(8, 0x3d494f);
            this.graphic.beginPath().moveTo(x, y).lineTo(a.x, a.y).lineTo(b.x, b.y).lineTo(c.x, c.y).strokePath();
            this.graphic.lineStyle(4, 0xbac9cd);
            this.graphic.beginPath().moveTo(x, y).lineTo(a.x, a.y).lineTo(b.x, b.y).lineTo(c.x, c.y).strokePath();
            this.graphic.fillStyle(0x6b7e87).fillCircle(a.x, a.y, 3);
        }
        this.graphic.fillStyle(0x3d494f).fillCircle(x, y, 8);
        this.graphic.fillStyle(0x94a8b0).fillCircle(x, y, 5);
        this.graphic.fillStyle(0xe2e9e7).fillCircle(x - 1, y - 1, 2);
    }
}
