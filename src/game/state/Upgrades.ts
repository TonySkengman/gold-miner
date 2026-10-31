export interface Upgrades { strength: number; diamonds: number; }
export interface LevelBonuses { luck: number; extraTime: number; lightweightGrip: number; prospectorsLens: number; streakVial: number; }
export type UpgradeKind = keyof Upgrades;
export type ShopItemKind = UpgradeKind | 'dynamite' | 'lifeVial' | keyof LevelBonuses;
export const emptyUpgrades = (): Upgrades => ({ strength: 0, diamonds: 0 });
export const emptyBonuses = (): LevelBonuses => ({ luck: 0, extraTime: 0, lightweightGrip: 0, prospectorsLens: 0, streakVial: 0 });
export const remainingBonuses = (bonuses: LevelBonuses): LevelBonuses => ({
    luck: Math.max(0, bonuses.luck - 1),
    extraTime: Math.max(0, bonuses.extraTime - 1),
    lightweightGrip: Math.max(0, bonuses.lightweightGrip - 1),
    streakVial: Math.max(0, bonuses.streakVial - 1),
    prospectorsLens: Math.max(0, bonuses.prospectorsLens - 1)
});
export const isPermanentUpgrade = (kind: ShopItemKind): kind is UpgradeKind => kind === 'strength' || kind === 'diamonds';
export const UPGRADE_LIMIT = 3;
export const UPGRADE_INFO = {
    streakVial: { name: 'Streak vial', description: 'Doubles streak bonuses for one full round. Catching a mine streak vial boosts them to x3 for 15 seconds', basePrice: 1000 },
    prospectorsLens: { name: 'Prospector’s Lens', description: 'Reveals cash-bag values and the exact contents of mystery bags and treasure chests. Each purchase covers one round', basePrice: 1500 },
    lifeVial: { name: 'Life vial', description: 'Restores one life immediately, up to five lives', basePrice: 3000 },
    strength: { name: 'Stronger winch', description: '+10% retrieval speed per tier. Lasts for this run', basePrice: 1000 },
    diamonds: { name: 'Gem polish', description: '+15% diamond and ruby value per tier. Lasts for this run', basePrice: 1250 },
    dynamite: { name: 'Dynamite', description: 'One stick. Unused dynamite carries over; no free refills', basePrice: 750 },
    luck: { name: 'Luck potion', description: 'Money bags pay at least $250. Each purchase covers one round', basePrice: 500 },
    extraTime: { name: 'Extra time', description: '+15 seconds per round. Each purchase covers one round', basePrice: 600 },
    lightweightGrip: { name: 'Lightweight Grip', description: 'Reduces rock hauling weight by 40%, including gem-bearing rocks. Each purchase covers one round', basePrice: 250 }
};
export const upgradePrice = (kind: ShopItemKind, upgrades: Upgrades): number =>
    UPGRADE_INFO[kind].basePrice * (isPermanentUpgrade(kind) ? upgrades[kind] + 1 : 1);
export function itemSoldOut(kind: ShopItemKind, upgrades: Upgrades, lives = 3): boolean {
    return kind === 'lifeVial' ? lives >= 5 : isPermanentUpgrade(kind) && upgrades[kind] >= UPGRADE_LIMIT;
}

export function purchaseUpgrade(kind: ShopItemKind, money: number, upgrades: Upgrades, dynamite = 0, bonuses = emptyBonuses(), lives = 3): { lives: number; money: number; upgrades: Upgrades; dynamite: number; bonuses: LevelBonuses } | null {
    const price = upgradePrice(kind, upgrades);
    if (itemSoldOut(kind, upgrades, lives) || money < price) return null;
    return {
        lives: lives + (kind === 'lifeVial' ? 1 : 0),
        money: money - price,
        upgrades: isPermanentUpgrade(kind) ? { ...upgrades, [kind]: upgrades[kind] + 1 } : { ...upgrades },
        dynamite: dynamite + (kind === 'dynamite' ? 1 : 0),
        bonuses: !isPermanentUpgrade(kind) && kind !== 'dynamite' && kind !== 'lifeVial' ? { ...bonuses, [kind]: bonuses[kind] + 1 } : { ...bonuses }
    };
}
