import type { Scene } from 'phaser';
import type { RoundState } from '../state/RoundState';
import { WORLD } from '../state/World';
import { soundEffects } from '../audio/SoundEffects';
import { findClearAim } from './Aiming';
import { Collectable } from './Collectable';

const rocks = ['rock', 'mediumRock', 'heavyRock', 'largeRock'];
const gold = ['small', 'medium', 'large', 'giant'];

/** A caught vial replaces the destructive powder blast with its own utility burst. */
export function shatterVial(scene: Scene, vial: Collectable, objects: Collectable[], round: RoundState,
    aftershock: () => void, random: () => number): void {
    const radius = 200;
    const nearby = objects.filter(object => object.available
        && Math.hypot(object.x - vial.x, object.y - vial.y) <= radius);
    let color = 0x66d9fa;
    let label = '';
    if (vial.kind === 'strengthPotion') {
        color = 0x80d65b;
        let count = 0;
        for (const object of nearby) {
            if (!rocks.includes(object.kind) || object.gemDeposit || object.mountedGem) continue;
            for (let i = 0; i < 6; i++) {
                const shard = scene.add.rectangle(object.x, object.y, 9, 7, 0x89939b).setDepth(8);
                const angle = i * Math.PI / 3;
                scene.tweens.add({ targets: shard, x: object.x + Math.cos(angle) * 45,
                    y: object.y + Math.sin(angle) * 45, alpha: 0, angle: 150, duration: 450,
                    onComplete: () => shard.destroy() });
            }
            object.destroy();
            count++;
        }
        label = `ROCK BREAKER • ${count} ROCKS CLEARED`;
    } else if (vial.kind === 'goldRush') {
        color = 0xffd45d;
        let count = 0;
        for (const object of nearby) {
            if (!gold.includes(object.kind) || object.goldenTouch) continue;
            object.goldenTouch = true;
            object.graphic.lineStyle(3, color, 0.85).strokeCircle(0, 0, object.radius + 4);
            count++;
        }
        label = `GOLDEN TOUCH • ${count} NUGGETS +25%`;
    } else if (vial.kind === 'streakVial') {
        color = 0xf07835;
        round.catchStreak += 2;
        label = 'STREAK SPARK • +2 STREAK STEPS';
    } else if (vial.kind === 'momentum') {
        color = 0x39c9b3;
        aftershock();
        label = 'AFTERSHOCK • DOUBLE CLAW SPEED • 6s';
    } else if (vial.kind === 'luck') {
        color = 0x9e5dc3;
        const kind = random() < 0.5 ? 'diamond' : 'ruby';
        const r = kind === 'diamond' ? 17 : 15;
        let position: { x: number; y: number } | undefined;
        // The destroyed vial leaves room; search close to it first.
        for (let ring = 0; ring <= 20 && !position; ring++) {
            for (let i = 0; i < 24; i++) {
                const angle = i * Math.PI / 12;
                const x = vial.x + Math.cos(angle) * ring * 24;
                const y = vial.y + Math.sin(angle) * ring * 24;
                if (x < r + 40 || x > WORLD.width - r - 40 || y < 320 || y + r > WORLD.floorY
                    || Math.abs(Math.atan2(x - WORLD.centerX, y - WORLD.pivotY)) > WORLD.maxAngle) continue;
                const obstacles = objects.filter(object => object.available);
                if (obstacles.some(object => Math.hypot(x - object.x, y - object.y) < r + object.radius + 6)) continue;
                if (findClearAim({ x, y, radius: r }, obstacles.filter(object => rocks.includes(object.kind))) === null) continue;
                position = { x, y };
                break;
            }
        }
        const drop = new Collectable(scene, position?.x ?? vial.x, position?.y ?? vial.y, kind, 1, random);
        objects.push(drop);
        if (round.bonuses.prospectorsLens) drop.revealMysteryReward(scene, { kind: 'money', amount: drop.collectionValue(1 + round.upgrades.diamonds * 0.15) });
        label = `LUCKY FIND • ${kind.toUpperCase()} REVEALED`;

    } else if (vial.kind === 'timeVial') {
        let count = 0;
        for (const object of nearby.sort((a, b) => a.y - b.y)) {
            if (object.isMountedGem || ![...gold, 'diamond', 'ruby', 'moneyBag', 'mysteryBag', 'treasureChest'].includes(object.kind)) continue;
            // Move along the full path; stop before a rock or other object, keeping catches reachable.
            const fromY = object.y;
            for (let rise = 4; rise <= 120; rise += 4) {
                const y = fromY - rise;
                if (y - object.radius < WORLD.groundY + 30
                    || Math.abs(Math.atan2(object.x - WORLD.centerX, y - WORLD.pivotY)) > WORLD.maxAngle
                    || objects.some(other => other !== object && other.available
                        && Math.hypot(object.x - other.x, y - other.y) < object.radius + other.radius + 4)) break;
                object.moveTo(object.x, y);
            }
            if (object.y < fromY) count++;
        }
        label = `TIME WARP • ${count} TREASURES LIFTED`;
    }
    soundEffects.play('explosion');
    const burst = scene.add.graphics().setPosition(vial.x, vial.y).setDepth(8);
    burst.fillStyle(color, 0.18).fillCircle(0, 0, radius);
    burst.lineStyle(4, color).strokeCircle(0, 0, radius);
    scene.tweens.add({ targets: burst, alpha: 0, scale: 1.1, duration: 600, onComplete: () => burst.destroy() });
    const text = scene.add.text(Math.max(240, Math.min(WORLD.width - 240, vial.x)),
        Math.max(300, vial.y - 60), label, { fontFamily: 'Arial', fontSize: 20, fontStyle: 'bold',
            color: '#ffffff', stroke: '#302838', strokeThickness: 5, align: 'center', wordWrap: { width: 460 } })
        .setOrigin(0.5).setDepth(17);
    scene.tweens.add({ targets: text, y: text.y - 30, alpha: 0, delay: 1100, duration: 450, onComplete: () => text.destroy() });
}
