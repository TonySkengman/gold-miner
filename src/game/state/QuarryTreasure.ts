import type { OreKind } from '../objects/Collectable';

export type QuarryTreasureKind = 'moneyBag' | 'diamond' | 'ruby' | 'mysteryBag' | 'treasureChest';
export interface TreasureSpawnRule { kind: QuarryTreasureKind; minimum: number; bonusChance: number; }

const clampLevel = (level: number): number => Math.max(1, Math.min(30, Math.floor(level)));
const minimumAt = (level: number, initial: number, milestones: readonly number[]): number =>
    initial + milestones.filter(milestone => clampLevel(level) >= milestone).length;
const chanceAt = (level: number, initial: number): number => Math.min(0.85, (initial + (clampLevel(level) - 1) * 2) / 100);

/** Independently trigger a bonus, then add 1/2/3 with weights 60%/30%/10%. */
export function rollQuarryBonus(chance: number, random: () => number): number {
    if (random() >= Math.max(0, Math.min(1, chance))) return 0;
    const amount = random();
    return amount < 0.6 ? 1 : amount < 0.9 ? 2 : 3;
}

export function quarryTreasureRules(level: number): TreasureSpawnRule[] {
    return [
        { kind: 'moneyBag', minimum: minimumAt(level, 1, [10, 22]), bonusChance: chanceAt(level, 20) },
        { kind: 'diamond', minimum: minimumAt(level, 2, [13, 25]), bonusChance: chanceAt(level, 15) },
        { kind: 'ruby', minimum: minimumAt(level, 1, [10, 22]), bonusChance: chanceAt(level, 10) },
        { kind: 'mysteryBag', minimum: minimumAt(level, 1, [16]), bonusChance: chanceAt(level, 15) },
        { kind: 'treasureChest', minimum: minimumAt(level, 0, [13]), bonusChance: chanceAt(level, 10) }
    ];
}

/** Roll once before placement retries; every item type gets its own rolls. */
export function rollQuarryTreasure(level: number, random: () => number): OreKind[] {
    return quarryTreasureRules(level).flatMap(({ kind, minimum, bonusChance }) =>
        Array<OreKind>(minimum + rollQuarryBonus(bonusChance, random)).fill(kind));
}

export function quarryRockRules(level: number) {
    return [
        { kind: 'deposit' as const, minimum: minimumAt(level, 0, [7]), bonusChance: chanceAt(level, 20) },
        { kind: 'mounted' as const, minimum: minimumAt(level, 0, [16]), bonusChance: chanceAt(level, 15) },
        { kind: 'combined' as const, minimum: minimumAt(level, 0, [25]), bonusChance: chanceAt(level, 10) }
    ];
}

export function rollQuarryRocks(level: number, random: () => number) {
    const counts = { deposit: 0, mounted: 0, combined: 0 };
    for (const rule of quarryRockRules(level)) {
        counts[rule.kind] = rule.minimum + rollQuarryBonus(rule.bonusChance, random);
    }
    return counts;
}

/** Add non-paying hazards gradually, preserving room for precise shots. */
export function quarryObstacleRules(level: number) {
    const current = clampLevel(level);
    const extraRocks = [7, 16, 25].filter(milestone => current >= milestone).length;
    return {
        extraRocks,
        extraRats: extraRocks,
        extraTnt: [10, 22].filter(milestone => current >= milestone).length,
        gemRatCap: current < 16 ? 1 : 2
    };
}
