import { WORLD } from '../state/World';

export interface AimCircle { x: number; y: number; radius: number; }
export const clawCollisionRadius = (radius: number): number => radius * 0.9 + 6;
const MIN_AIM_GAP = 0.024;

/** Reserve a usable angular opening, rather than merely preventing visual overlap. */
export function findClearAim(target: AimCircle, hazards: readonly AimCircle[]): number | null {
    const dx = target.x - 512;
    const dy = target.y - 210;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dx, dy);
    const halfWidth = Math.asin(Math.min(1, (clawCollisionRadius(target.radius) - 4) / distance));
    let gaps: [number, number][] = [[Math.max(-1.05, angle - halfWidth), Math.min(1.05, angle + halfWidth)]];
    for (const hazard of hazards) {
        const hx = hazard.x - 512;
        const hy = hazard.y - 210;
        const hd = Math.hypot(hx, hy);
        const radius = clawCollisionRadius(hazard.radius) + 3;
        // Objects wholly behind the treasure cannot obstruct the incoming claw.
        if (hd - radius > distance + clawCollisionRadius(target.radius)) continue;
        const centre = Math.atan2(hx, hy);
        const spread = Math.asin(Math.min(1, radius / hd));
        const low = centre - spread;
        const high = centre + spread;
        gaps = gaps.flatMap(([start, end]): [number, number][] => {
            if (high <= start || low >= end) return [[start, end]];
            const remaining: [number, number][] = [];
            if (low > start) remaining.push([start, low]);
            if (high < end) remaining.push([high, end]);
            return remaining;
        });
        if (!gaps.length) return null;
    }
    const widest = gaps.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
    if (!widest || widest[1] - widest[0] < MIN_AIM_GAP) return null;
    const aim = (widest[0] + widest[1]) / 2;
    const along = dx * Math.sin(aim) + dy * Math.cos(aim);
    const across = dx * Math.cos(aim) - dy * Math.sin(aim);
    const radius = clawCollisionRadius(target.radius);
    const entry = along - Math.sqrt(radius * radius - across * across) - 18;
    const range = Math.min(WORLD.clawRange, (WORLD.floorY - 210) / Math.cos(aim), 488 / Math.max(0.001, Math.abs(Math.sin(aim))));
    return entry <= range ? aim : null;
}
