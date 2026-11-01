import type { OreKind } from '../objects/Collectable';

export type QuarryTreasureKind = 'moneyBag' | 'diamond' | 'ruby' | 'mysteryBag' | 'treasureChest';
export interface TreasureSpawnRule { kind: QuarryTreasureKind; minimum: number; bonusChance: number; }

const clampLevel = (level: number): number => Math.max(1, Math.min(30, Math.floor(level)));
const minimumAt = (level: number, initial: number, milestones: readonly number[]): number =>
    initial + milestones.filter(milestone => clampLevel(level) >= milestone).length;
const chanceAt = (level: number, initial: number): number => Math.min(1.5, (initial + (clampLevel(level) - 1) * 5) / 100);

/** Above 100%, shift linearly from 60/30/10 to 10/60/30 at 150%.
 * The rating increases bonus size, never the maximum of three extras.
 */
export function rollQuarryBonus(chance: number, random: () => number): number {
    const rating = Math.max(0, Math.min(1.5, chance));
    if (random() >= Math.min(1, rating)) return 0;
    const overflow = Math.max(0, rating - 1) / 0.5;
    const oneChance = 0.6 - overflow * 0.5;
    const twoChance = 0.3 + overflow * 0.3;
    const amount = random();
    return amount < oneChance ? 1 : amount < oneChance + twoChance ? 2 : 3;
}

export function quarryTreasureRules(level: number): TreasureSpawnRule[] {
    return [
        { kind: 'moneyBag', minimum: minimumAt(level, 1, [4, 13, 22]), bonusChance: chanceAt(level, 20) },
        { kind: 'diamond', minimum: minimumAt(level, 1, [7, 16, 25]), bonusChance: chanceAt(level, 15) },
        { kind: 'ruby', minimum: minimumAt(level, 0, [4, 13, 22]), bonusChance: chanceAt(level, 10) },
        { kind: 'mysteryBag', minimum: minimumAt(level, 1, [10, 19, 28]), bonusChance: chanceAt(level, 15) },
        { kind: 'treasureChest', minimum: minimumAt(level, 0, [7, 19]), bonusChance: chanceAt(level, 10) }
    ];
}

/** Roll once before placement retries; every item type gets its own rolls. */
export function rollQuarryTreasure(level: number, random: () => number): OreKind[] {
    return quarryTreasureRules(level).flatMap(({ kind, minimum, bonusChance }) =>
        Array<OreKind>(minimum + rollQuarryBonus(bonusChance, random)).fill(kind));
}

export function quarryRockRules(level: number) {
    return [
        { kind: 'deposit' as const, minimum: minimumAt(level, 0, [4, 16]), bonusChance: chanceAt(level, 20) },
        { kind: 'mounted' as const, minimum: minimumAt(level, 0, [10, 25]), bonusChance: chanceAt(level, 15) },
        { kind: 'combined' as const, minimum: minimumAt(level, 0, [13, 28]), bonusChance: chanceAt(level, 10) }
    ];
}

export function rollQuarryRocks(level: number, random: () => number) {
    const counts = { deposit: 0, mounted: 0, combined: 0 };
    for (const rule of quarryRockRules(level)) {
        counts[rule.kind] = rule.minimum + rollQuarryBonus(rule.bonusChance, random);
    }
    return counts;
}
