import { GameObjects, Scene } from 'phaser';
import { Collectable } from './Collectable';

type ClawMode = 'idle' | 'extending' | 'retracting';

export class Claw {
    private mode: ClawMode = 'idle';
    private angle = -0.8;
    private swingDirection = 1;
    private length = 30;
    private caught: Collectable | null = null;
    private readonly graphic: GameObjects.Graphics;
    private readonly origin = { x: 512, y: 210 };

    constructor(scene: Scene, private readonly onCollect: (value: number) => void) {
        this.graphic = scene.add.graphics().setDepth(5);
        this.draw();
    }

    launch(): void {
        if (this.mode === 'idle') this.mode = 'extending';
    }

    update(seconds: number, objects: Collectable[]): void {
        if (this.mode === 'idle') {
            this.angle += this.swingDirection * seconds * 0.95;
            if (this.angle > 1.05 || this.angle < -1.05) {
                this.angle = Math.max(-1.05, Math.min(1.05, this.angle));
                this.swingDirection *= -1;
            }
        } else if (this.mode === 'extending') {
            const oldLength = this.length;
            const edgeRange = Math.min(570, 530 / Math.cos(this.angle), 488 / Math.max(0.001, Math.abs(Math.sin(this.angle))));
            this.length = Math.min(edgeRange, this.length + 440 * seconds);
            // Swept segment collision prevents tunnelling even on slow frames.
            let first: Collectable | null = null;
            let hitLength = this.length;
            for (const object of objects) {
                if (!object.available) continue;
                const dx = object.x - this.origin.x;
                const dy = object.y - this.origin.y;
                const along = dx * Math.sin(this.angle) + dy * Math.cos(this.angle);
                const across = Math.abs(dx * Math.cos(this.angle) - dy * Math.sin(this.angle));
                const radius = object.radius + 8;
                if (across > radius) continue;
                const entry = along - Math.sqrt(radius * radius - across * across);
                const exit = along + Math.sqrt(radius * radius - across * across);
                if (exit >= oldLength && entry <= hitLength) {
                    first = object;
                    hitLength = Math.max(oldLength, entry);
                }
            }
            if (first) {
                this.length = hitLength;
                this.caught = first;
                first.available = false;
                this.mode = 'retracting';
            } else if (this.length >= edgeRange) this.mode = 'retracting';
        } else {
            this.length = Math.max(30, this.length - 360 / (1 + (this.caught?.weight ?? 0)) * seconds);
            if (this.length <= 30) {
                if (this.caught) {
                    this.onCollect(this.caught.value);
                    this.caught.destroy();
                    this.caught = null;
                }
                this.mode = 'idle';
            }
        }
        if (this.caught) this.caught.moveTo(this.origin.x + Math.sin(this.angle) * this.length, this.origin.y + Math.cos(this.angle) * this.length);
        this.draw();
    }

    private draw(): void {
        const x = this.origin.x + Math.sin(this.angle) * this.length;
        const y = this.origin.y + Math.cos(this.angle) * this.length;
        this.graphic.clear().lineStyle(3, 0x563926);
        this.graphic.lineBetween(this.origin.x, this.origin.y, x, y);
        this.graphic.lineStyle(5, 0xdee5e7);
        const point = (side: number, down: number) => ({ x: x + Math.cos(this.angle) * side + Math.sin(this.angle) * down, y: y - Math.sin(this.angle) * side + Math.cos(this.angle) * down });
        for (const sign of [-1, 1]) {
            const a = point(sign * 12, 9);
            const b = point(sign * (this.caught ? 7 : 17), 21);
            this.graphic.lineBetween(x, y, a.x, a.y);
            this.graphic.lineBetween(a.x, a.y, b.x, b.y);
        }
        this.graphic.fillStyle(0x59666e).fillCircle(x, y, 5);
    }
}
