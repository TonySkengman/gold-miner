import type { Scene } from 'phaser';
import { soundEffects } from '../audio/SoundEffects';
import type { Collectable } from './Collectable';

export const TNT_BLAST_RADIUS = 135;

/** Bigger hauled objects produce a wider powder-assisted dynamite blast. */
export const dynamiteBlastRadius = (caughtRadius: number): number => caughtRadius * 2.5;

/** Resolve the impact and each chained TNT once. Release deposits after all blasts. */
export function detonateArea(x: number, y: number, radius: number, objects: Collectable[],
    onBlast: (x: number, y: number, radius: number) => void,
    onDepositBlast?: (deposit: Collectable) => void, chainRadius = TNT_BLAST_RADIUS): void {
    const deposits: Collectable[] = [];
    const pending = [{ x, y, radius }];
    while (pending.length) {
        const current = pending.pop()!;
        for (const object of objects) {
            if (!object.available || Math.hypot(object.x - current.x, object.y - current.y) > current.radius + object.radius) continue;
            // Destroy immediately so overlapping chain blasts cannot queue this object twice.
            object.destroy();
            if (object.isExplosive) {
                pending.push({ x: object.x, y: object.y, radius: chainRadius });
            } else if (object.gemDeposit) deposits.push(object);
        }
        onBlast(current.x, current.y, current.radius);
    }
    deposits.forEach(deposit => onDepositBlast?.(deposit));
}

/** Only free objects are affected and destroyed ore awards no money. */
export function detonateBarrel(barrel: Collectable, objects: Collectable[], onBlast: (x: number, y: number) => void, onDepositBlast?: (deposit: Collectable) => void, radius = TNT_BLAST_RADIUS): void {
    if (!barrel.isExplosive || !barrel.available) return;
    const { x, y } = barrel;
    barrel.destroy();
    detonateArea(x, y, radius, objects, onBlast, onDepositBlast, radius);
}

export function showBarrelExplosion(scene: Scene, x: number, y: number, radius = TNT_BLAST_RADIUS): void {
    soundEffects.play('explosion');
    const burst = scene.add.graphics().setPosition(x, y).setDepth(8);
    burst.fillStyle(0xff9b2f, 0.55).fillCircle(0, 0, radius);
    burst.lineStyle(3, 0xffdd7b).strokeCircle(0, 0, radius);
    burst.fillStyle(0xffe59a).fillCircle(0, 0, 26);
    scene.tweens.add({ targets: burst, alpha: 0, duration: 350, onComplete: () => burst.destroy() });
}
