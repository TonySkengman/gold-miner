import { WORLD } from '../state/World';

export interface AimCircle { x: number; y: number; radius: number; }
export const clawCollisionRadius = (radius: number): number => radius * 0.9 + 6;
/** Shared anchor keeps simultaneous catch labels separated, including at mine edges. */
export const catchFeedbackY = (y: number, radius: number): number =>
    Math.max(410, Math.min(WORLD.footerY - 75, y - radius - 30));
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

/** Embedded gems overlap their host: compare first contact instead of treating its shadow as solid. */
export function findExposedGemAim(target: AimCircle, obstacles: readonly AimCircle[]): number | null {
    const centre = Math.atan2(target.x - 512, target.y - 210);
    const distance = Math.hypot(target.x - 512, target.y - 210);
    const spread = Math.asin(Math.min(1, (clawCollisionRadius(target.radius) - 3) / distance));
    const start = Math.max(-1.05, centre - spread);
    const end = Math.min(1.05, centre + spread);
    let runStart = start;
    let bestStart = start;
    let bestWidth = 0;
    const entry = (circle: AimCircle, angle: number): number => {
        const dx = circle.x - 512;
        const dy = circle.y - 210;
        const along = dx * Math.sin(angle) + dy * Math.cos(angle);
        const across = Math.abs(dx * Math.cos(angle) - dy * Math.sin(angle));
        const radius = clawCollisionRadius(circle.radius);
        return across <= radius ? along - Math.sqrt(radius * radius - across * across) - 18 : Infinity;
    };
    for (let step = 0; step <= 80; step++) {
        const angle = start + (end - start) * step / 80;
        const hit = entry(target, angle);
        const range = Math.min(WORLD.clawRange, (WORLD.floorY - 210) / Math.cos(angle),
            488 / Math.max(0.001, Math.abs(Math.sin(angle))));
        const clear = hit >= 30 && hit <= range && obstacles.every(other => entry(other, angle) > hit + 2);
        if (!clear) runStart = angle;
        else if (angle - runStart > bestWidth) {
            bestStart = runStart;
            bestWidth = angle - runStart;
        }
    }
    return bestWidth >= 0.012 ? bestStart + bestWidth / 2 : null;
}
