import { safetyGripDisarmSeconds, safetyGripLaunchMultiplier } from '../state/Upgrades';
import { releaseGemDeposit } from './GemDeposits';
import { catchFeedbackY, clawCollisionRadius } from './Aiming';
import { soundEffects } from '../audio/SoundEffects';
import { detonateArea, dynamiteBlastRadius, detonateBarrel, showBarrelExplosion, TNT_BLAST_RADIUS } from './Explosions';
import { WORLD } from '../state/World';
import { GameObjects, Scene } from 'phaser';
import { Collectable, isMineVial } from './Collectable';
import { treasureRewardValue } from '../state/TreasureRewards';

type ClawMode = 'idle' | 'extending' | 'retracting';
const RETURN_SWING_OFFSET = 25 * Math.PI / 180;

export class Claw {
    aftershockCharges = 0;
    private aftershockShot = false;
    secondChanceCharges = 0;
    powderRadiusScale = 0;
    private powderEffectSeconds = 0;
    safetyGrip = false;
    safetyGripTier = 0;
    private mode: ClawMode = 'idle';
    private angle = -0.8;
    private launchAngle = this.angle;
    private swingDirection = 1;
    private length = 30;
    private caught: Collectable | null = null;
    private disarmRemaining = 0;
    private disarmLabel: GameObjects.Text | null = null;
    private caughtValue = 0;
    private perfectBonus = 0;
    private perfectHaul = false;
    private haulingStrength = 1;
    private distanceReturnMultiplier = 1;
    private gripOffsetX = 0;
    private gripOffsetY = 0;
    private readonly grabReach = 18;
    private dynamite: GameObjects.Graphics | null = null;
    private throwElapsed = 0;
    private thrownPowderScale = 0;
    private readonly graphic: GameObjects.Graphics;
    private get origin(): { x: number; y: number } { return { x: WORLD.centerX, y: WORLD.pivotY }; }

    constructor(private readonly scene: Scene, private readonly onCollect: (value: number, object: Collectable, perfectBonus: number) => void, private readonly retrievalMultiplier = 1, private readonly diamondMultiplier = 1, private readonly strengthBoost: () => number = () => 1, private readonly lightweightGrip = false, private readonly onCatch: (object: Collectable, perfect: boolean) => number = () => 1, private readonly onMiss: () => void = () => {}, private readonly onShatter: (vial: Collectable, remainingHaul: number) => void = () => {}) {
        this.graphic = scene.add.graphics().setData('responsiveIgnore', true).setDepth(5);
        this.draw();
    }

    /** Includes a haul with dynamite already in flight. */
    get hasPendingCatch(): boolean { return this.caught !== null; }

    get isIdle(): boolean { return this.mode === 'idle'; }

    get isHauling(): boolean { return this.mode === 'retracting' && this.caught !== null && !this.dynamite; }

    get hauledDeposit(): Collectable | null {
        return this.isHauling && this.caught?.gemDeposit ? this.caught : null;
    }

    get haulingWeight(): number { return this.isHauling ? this.caught!.haulingWeight(this.lightweightGrip) : 0; }

    get retrievalSpeed(): number {
        return this.mode === 'retracting' && !this.dynamite && this.disarmRemaining <= 0
            ? 275.4 * (this.aftershockShot ? 2 : 1) * this.retrievalMultiplier * this.distanceReturnMultiplier * (this.caught ? this.haulingStrength : 1) * (this.caught && this.perfectHaul ? 1.35 : 1) / (1 + (this.caught?.haulingWeight(this.lightweightGrip) ?? 0)) : 0;
    }

    resize(oldWidth: number): void {
        const dx = Math.sin(this.angle) * this.length * (WORLD.width - 130) / (oldWidth - 130);
        const dy = Math.cos(this.angle) * this.length;
        this.angle = Math.atan2(dx, dy);
        this.length = Math.hypot(dx, dy);
        this.gripOffsetX *= (WORLD.width - 130) / (oldWidth - 130);
        this.draw();
    }

    launch(): void {
        if (this.mode === 'idle') {
            this.launchAngle = this.angle;
            this.distanceReturnMultiplier = 1;
            this.aftershockShot = this.aftershockCharges > 0;
            if (this.aftershockShot) this.aftershockCharges--;
            this.mode = 'extending';
            soundEffects.play('launch');
        } else if (this.mode === 'extending' && this.secondChanceCharges > 0) {
            this.secondChanceCharges--;
            this.mode = 'retracting';
        }
    }

    throwDynamite(): boolean {
        if (this.mode !== 'retracting' || !this.caught || this.dynamite) return false;
        this.disarmRemaining = 0;
        this.disarmLabel?.destroy();
        this.disarmLabel = null;
        soundEffects.play('throw');
        this.thrownPowderScale = this.powderRadiusScale;
        this.throwElapsed = 0;
        this.dynamite = this.scene.add.graphics().setDepth(6);
        this.dynamite.fillStyle(0xc43c2f).fillRoundedRect(-5, -12, 10, 24, 2);
        this.dynamite.lineStyle(2, 0x563926).lineBetween(0, -12, 3, -18);
        this.dynamite.fillStyle(0xffdc55).fillCircle(3, -18, 3);
        return true;
    }

    private updateDynamite(seconds: number, objects: Collectable[]): void {
        if (!this.dynamite || !this.caught) return;
        this.throwElapsed += seconds;
        const progress = Math.min(1, this.throwElapsed / 0.35);
        const x = this.origin.x + (this.caught.x - this.origin.x) * progress;
        const y = this.origin.y + (this.caught.y - this.origin.y) * progress - Math.sin(progress * Math.PI) * 45;
        this.dynamite.setPosition(x, y).setRotation(progress * Math.PI * 4);
        if (progress < 1) return;
        this.dynamite.destroy();
        this.dynamite = null;
        const blasted = this.caught;
        blasted.destroy();
        const vial = isMineVial(blasted.kind);
        const areaBlast = !vial && (this.thrownPowderScale > 0 || blasted.isExplosive);
        if (vial) this.onShatter(blasted, Math.max(0, this.length - 30));
        if (areaBlast) {
            const radius = this.thrownPowderScale > 0
                ? (blasted.isExplosive ? TNT_BLAST_RADIUS * 1.5 : dynamiteBlastRadius(blasted.radius)) * this.thrownPowderScale
                : TNT_BLAST_RADIUS;
            detonateArea(blasted.x, blasted.y, radius, objects,
                (blastX, blastY, radius) => showBarrelExplosion(this.scene, blastX, blastY, radius),
                deposit => releaseGemDeposit(this.scene, deposit, objects));
        }
        // Release caught treasure after the area blast so the new loot survives it.
        releaseGemDeposit(this.scene, blasted, objects);
        this.caught = null;
        this.perfectHaul = false;
        this.perfectBonus = 0;
        if (areaBlast || vial) return;
        soundEffects.play('explosion');
        // A short, simple burst marks the hit. Destroyed ore awards no money.
        const burst = this.scene.add.graphics().setPosition(x, y).setDepth(6);
        burst.fillStyle(0xffa32b).fillCircle(0, 0, 26);
        burst.fillStyle(0xffe486).fillCircle(0, 0, 15);
        this.scene.tweens.add({ targets: burst, alpha: 0, duration: 180, onComplete: () => burst.destroy() });
    }

    update(seconds: number, objects: Collectable[]): void {
        this.powderEffectSeconds = this.powderRadiusScale > 0 ? this.powderEffectSeconds + seconds : 0;
        if (this.mode === 'idle') {
            this.angle += this.swingDirection * seconds * 1.2705;
            if (this.angle > WORLD.maxAngle || this.angle < -WORLD.maxAngle) {
                this.angle = Math.max(-WORLD.maxAngle, Math.min(WORLD.maxAngle, this.angle));
                this.swingDirection *= -1;
            }
        } else if (this.mode === 'extending') {
            const oldLength = this.length;
            const edgeRange = Math.min(WORLD.clawRange, (WORLD.floorY - this.origin.y) / Math.cos(this.angle), WORLD.sideReach / Math.max(0.001, Math.abs(Math.sin(this.angle))));
            this.length = Math.min(edgeRange, this.length + 352 * (this.safetyGrip ? safetyGripLaunchMultiplier(this.safetyGripTier) : 1) * (this.aftershockShot ? 2 : 1) * seconds);
            // Swept segment collision prevents tunnelling even on slow frames.
            let first: Collectable | null = null;
            let hitLength = this.length;
            for (const object of objects) {
                if (!object.available) continue;
                const dx = object.x - this.origin.x;
                const dy = object.y - this.origin.y;
                const along = dx * Math.sin(this.angle) + dy * Math.cos(this.angle);
                const across = Math.abs(dx * Math.cos(this.angle) - dy * Math.sin(this.angle));
                const radius = clawCollisionRadius(object.radius);
                if (across > radius) continue;
                const entry = along - Math.sqrt(radius * radius - across * across) - this.grabReach;
                const exit = along + Math.sqrt(radius * radius - across * across) - this.grabReach;
                if (exit >= oldLength && entry <= hitLength) {
                    first = object;
                    hitLength = Math.max(oldLength, entry);
                }
            }
            // Snapshot the return distance for loaded and empty returns alike,
            // including after dynamite. Beyond a full straight-down return, speed
            // scales proportionally so equal-weight hauls take the same time.
            const baselineReturnDistance = WORLD.floorY - this.origin.y - 30;
            this.distanceReturnMultiplier = Math.max(1,
                (hitLength - 30) / Math.max(1, baselineReturnDistance));
            if (first) {
                this.length = hitLength;
                if (first.isExplosive && !this.safetyGrip) {
                    this.mode = 'retracting';
                    detonateBarrel(first, objects, (x, y) => showBarrelExplosion(this.scene, x, y),
                        deposit => releaseGemDeposit(this.scene, deposit, objects));
                    this.draw();
                    return;
                }
                if (first.openChest(this.scene)) {
                    soundEffects.play('chestOpen');
                    this.mode = 'retracting';
                    this.draw();
                    return;
                }
                first.prepareCatch();
                if (first.isExplosive) {
                    this.disarmRemaining = safetyGripDisarmSeconds(this.safetyGripTier);
                    this.disarmLabel = this.scene.add.text(first.x, first.y - first.radius - 25, `DISARMING… ${this.disarmRemaining.toFixed(1)}s`, {
                        fontFamily: 'Arial', fontSize: 15, fontStyle: 'bold', color: '#bcf58b',
                        backgroundColor: '#253d29', padding: { x: 8, y: 4 }
                    }).setOrigin(0.5).setDepth(17);
                }
                // Snapshot both boosts before spending a charge, so the final charged haul stays boosted.
                this.haulingStrength = this.strengthBoost();
                const across = Math.abs((first.x - this.origin.x) * Math.cos(this.angle)
                    - (first.y - this.origin.y) * Math.sin(this.angle));
                const eligible = ['small', 'medium', 'large', 'giant', 'diamond', 'ruby',
                    'moneyBag', 'diamondRat', 'rubyRat', 'mysteryBag', 'treasureChest',
                    'strengthPotion', 'goldRush', 'timeVial', 'streakVial', 'luck', 'momentum'].includes(first.kind);
                const perfect = eligible && across <= Math.min(10, first.radius * 0.3);
                this.caughtValue = Math.round(first.collectionValue(this.diamondMultiplier) * this.onCatch(first, perfect));
                this.perfectBonus = perfect ? Math.ceil(this.caughtValue * 35 / 1000) * 10 : 0;
                this.perfectHaul = perfect;
                if (perfect) this.showPerfectCatch(first);
                const catchValue = first.treasureReward ? treasureRewardValue(first.treasureReward) : this.caughtValue;
                const valuable = first.celebrateCatch(this.scene, catchValue);
                soundEffects.play(perfect ? 'perfectCatch' : valuable ? 'valuableCatch' : 'catch', catchValue);
                this.caught = first;
                first.depositIntegrity?.begin(this.length - 30);
                // Preserve the contact position instead of snapping the ore's centre to the rope.
                this.gripOffsetX = first.x - (this.origin.x + Math.sin(this.angle) * this.length);
                this.gripOffsetY = first.y - (this.origin.y + Math.cos(this.angle) * this.length);
                first.available = false;
                first.hideTreasureLabel();
                this.mode = 'retracting';
            } else if (this.length >= edgeRange) {
                this.mode = 'retracting';
                this.onMiss();
            }
        } else {
            if (this.dynamite) {
                this.updateDynamite(seconds, objects);
                this.draw();
                return;
            }
            if (this.disarmRemaining > 0) {
                this.disarmRemaining = Math.max(0, this.disarmRemaining - seconds);
                this.disarmLabel?.setText(`DISARMING… ${this.disarmRemaining.toFixed(1)}s`);
                if (this.disarmRemaining === 0) {
                    const label = this.disarmLabel;
                    this.disarmLabel = null;
                    label?.setText('DISARMED • +1 DYNAMITE ON DELIVERY');
                    if (label) this.scene.tweens.add({ targets: label, alpha: 0, y: label.y - 20,
                        delay: 650, duration: 350, onComplete: () => label.destroy() });
                }
                this.draw();
                return;
            }
            const previousLength = this.length;
            this.length = Math.max(30, this.length - this.retrievalSpeed * seconds);
            this.caught?.advanceDepositHaul(this.scene, previousLength - this.length);
            if (this.length <= 30) {
                if (this.caught) {
                    soundEffects.play('collect');
                    this.onCollect(this.caughtValue, this.caught, this.perfectBonus);
                    this.caught.destroy();
                    this.caught = null;
                    this.perfectHaul = false;
                }
                this.aftershockShot = false;
                const nextAngle = this.launchAngle + this.swingDirection * RETURN_SWING_OFFSET;
                if (Math.abs(nextAngle) > WORLD.maxAngle) this.swingDirection *= -1;
                this.angle = this.launchAngle + this.swingDirection * RETURN_SWING_OFFSET;
                this.mode = 'idle';
            }
        }
        if (this.caught) this.caught.moveTo(this.origin.x + Math.sin(this.angle) * this.length + this.gripOffsetX, this.origin.y + Math.cos(this.angle) * this.length + this.gripOffsetY);
        this.draw();
    }

    private showPerfectCatch(object: Collectable): void {
        const burst = this.scene.add.graphics().setPosition(object.x, object.y).setDepth(15);
        burst.fillStyle(0xffdf65, 0.35).fillCircle(0, 0, object.radius + 8);
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            burst.lineStyle(3, i % 2 ? 0xffffff : 0xffd34d)
                .lineBetween(Math.cos(angle) * 12, Math.sin(angle) * 12,
                    Math.cos(angle) * 32, Math.sin(angle) * 32);
        }
        this.scene.tweens.add({ targets: burst, scale: 1.7, alpha: 0, duration: 320,
            onComplete: () => burst.destroy() });
        const label = this.scene.add.text(Math.max(150, Math.min(WORLD.width - 150, object.x)),
            catchFeedbackY(object.y, object.radius) - 110,
            this.perfectBonus > 0 ? `PERFECT! +$${this.perfectBonus}\nON DELIVERY` : 'PERFECT!\nREEL BOOST', {
                fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#ffe685',
                stroke: '#483126', strokeThickness: 5, align: 'center'
            }).setOrigin(0.5).setDepth(16);
        this.scene.tweens.add({ targets: label, y: label.y - 35, alpha: 0, delay: 550,
            duration: 450, onComplete: () => label.destroy() });
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
            this.graphic.lineStyle(this.safetyGrip ? 10 : 8, 0x3d494f);
            this.graphic.beginPath().moveTo(x, y).lineTo(a.x, a.y).lineTo(b.x, b.y).lineTo(c.x, c.y).strokePath();
            this.graphic.lineStyle(4, 0xbac9cd);
            this.graphic.beginPath().moveTo(x, y).lineTo(a.x, a.y).lineTo(b.x, b.y).lineTo(c.x, c.y).strokePath();
            if (this.safetyGrip) {
                // Reinforced green pads follow both empty and loaded jaw shapes.
                this.graphic.lineStyle(9, 0x547f3b).lineBetween(b.x, b.y, c.x, c.y);
                this.graphic.lineStyle(3, 0xc6eaa0).lineBetween(b.x, b.y, c.x, c.y);
            }
            this.graphic.fillStyle(0x6b7e87).fillCircle(a.x, a.y, 3);
        }
        this.graphic.fillStyle(0x3d494f).fillCircle(x, y, 8);
        this.graphic.fillStyle(this.safetyGrip ? 0x547f3b : 0x94a8b0).fillCircle(x, y, 5);
        this.graphic.fillStyle(0xe2e9e7).fillCircle(x - 1, y - 1, 2);
        if (this.powderRadiusScale > 0) {
            // A lit collar at the cable connection follows the claw's angle.
            const left = point(-6, -7);
            const right = point(6, -7);
            const pulse = (1 - Math.cos(this.powderEffectSeconds * Math.PI * 2 / 1.8)) / 2;
            this.graphic.lineStyle(16 + pulse * 4, 0xff8c24, 0.16 + pulse * 0.14).lineBetween(left.x, left.y, right.x, right.y);
            this.graphic.lineStyle(10 + pulse * 2, 0xff8c24, 0.3 + pulse * 0.2).lineBetween(left.x, left.y, right.x, right.y);
            this.graphic.lineStyle(6, 0xf58a23).lineBetween(left.x, left.y, right.x, right.y);
            this.graphic.lineStyle(2, 0xffdc83).lineBetween(left.x, left.y, right.x, right.y);
            // Two brief sparks per cycle stay above the jaws and fade locally.
            for (let i = 0; i < 2; i++) {
                const age = (this.powderEffectSeconds + i * 0.18) % 1.4;
                if (age >= 0.38) continue;
                const progress = age / 0.38;
                const side = i === 0 ? -1 : 1;
                const spark = point(side * (7 + progress * 10), -8 - progress * 12);
                const tail = point(side * (6 + progress * 8), -6 - progress * 10);
                this.graphic.lineStyle(2, 0xffb64b, 1 - progress)
                    .lineBetween(tail.x, tail.y, spark.x, spark.y);
                this.graphic.fillStyle(0xffedb0, 1 - progress).fillCircle(spark.x, spark.y, 1.5);
            }

        }

    }
}
