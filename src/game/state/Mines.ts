import { LEVELS, type LevelConfig } from './Levels';

export type MineKind = 'quarry' | 'goldBasin' | 'gemHollow';
export const MINES = {
    quarry: { name: 'Old Quarry', fee: 0, targetMultiplier: 1, description: 'A balanced mix of gold, gems and supplies.', detail: 'Standard treasure • Standard target', color: 0xcca676 },
    goldBasin: { name: 'Gold Basin', fee: 600, targetMultiplier: 1.15, description: 'Heavy gold with scarce gems and bags. No chests or gem-carrying rats.', detail: '+7 giant +2 large gold • Less filler • Higher target', color: 0xffd45d },
    gemHollow: { name: 'Gem Hollow', fee: 900, targetMultiplier: 1.2, description: 'Scattered gems between extra rocks. Aim through the gaps.', detail: '+4 diamonds +3 rubies • No gold • Higher target', color: 0x78dfeb }
} as const;

export function mineConfig(level: number, mine: MineKind = 'quarry'): LevelConfig {
    const base = LEVELS[level - 1];
    const rocks = mine === 'goldBasin' ? {
        rocks: 1,
        largeRocks: 0,
        heavyRocks: 0,
        tnt: Math.min(3, base.tnt)
    } : mine === 'gemHollow' ? { tnt: Math.min(3, base.tnt) } : {};
    const previousTarget = Math.round(base.target * MINES[mine].targetMultiplier / 50) * 50;
    const target = mine === 'quarry' ? previousTarget : Math.round(previousTarget * 1.35 / 50) * 50;
    return { ...base, ...rocks, layout: mine === 'goldBasin' ? 'goldPocket' : base.layout, mine, target };
}
