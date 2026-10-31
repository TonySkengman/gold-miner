export interface Upgrades { strength: number; diamonds: number; }
export interface LevelBonuses { luck: number; extraTime: number; rockPolish: number; }
export type UpgradeKind = keyof Upgrades;
export type ShopItemKind = UpgradeKind | 'dynamite' | keyof LevelBonuses;
export const emptyUpgrades = (): Upgrades => ({ strength: 0, diamonds: 0 });
export const emptyBonuses = (): LevelBonuses => ({ luck: 0, extraTime: 0, rockPolish: 0 });
export const remainingBonuses = (bonuses: LevelBonuses): LevelBonuses => ({
    luck: Math.max(0, bonuses.luck - 1),
    extraTime: Math.max(0, bonuses.extraTime - 1),
    rockPolish: Math.max(0, bonuses.rockPolish - 1)
});
export const POLISHED_ROCK_VALUES = { rock: 50, mediumRock: 100, heavyRock: 125, largeRock: 150 };
export const isPermanentUpgrade = (kind: ShopItemKind): kind is UpgradeKind => kind === 'strength' || kind === 'diamonds';
export const UPGRADE_LIMIT = 3;
export const UPGRADE_INFO = {
    strength: { name: 'Stronger winch', description: '+10% retrieval speed per tier. Lasts for this run', basePrice: 1000 },
    diamonds: { name: 'Gem polish', description: '+15% diamond and ruby value per tier. Lasts for this run', basePrice: 1250 },
    dynamite: { name: 'Dynamite', description: 'One stick. Unused dynamite carries over; no free refills', basePrice: 750 },
    luck: { name: 'Luck potion', description: 'Money bags pay at least $250. Each purchase covers one round', basePrice: 500 },
    extraTime: { name: 'Extra time', description: '+15 seconds per round. Each purchase covers one round', basePrice: 600 },
    rockPolish: { name: 'Rock polish', description: 'Rocks pay $50; large rocks pay $150. Each purchase covers one round', basePrice: 250 }
};
export const upgradePrice = (kind: ShopItemKind, upgrades: Upgrades): number =>
    UPGRADE_INFO[kind].basePrice * (isPermanentUpgrade(kind) ? upgrades[kind] + 1 : 1);
export function itemSoldOut(kind: ShopItemKind, upgrades: Upgrades): boolean {
    return isPermanentUpgrade(kind) && upgrades[kind] >= UPGRADE_LIMIT;
}

export function purchaseUpgrade(kind: ShopItemKind, money: number, upgrades: Upgrades, dynamite = 0, bonuses = emptyBonuses()): { money: number; upgrades: Upgrades; dynamite: number; bonuses: LevelBonuses } | null {
    const price = upgradePrice(kind, upgrades);
    if (itemSoldOut(kind, upgrades) || money < price) return null;
    return {
        money: money - price,
        upgrades: isPermanentUpgrade(kind) ? { ...upgrades, [kind]: upgrades[kind] + 1 } : { ...upgrades },
        dynamite: dynamite + (kind === 'dynamite' ? 1 : 0),
        bonuses: !isPermanentUpgrade(kind) && kind !== 'dynamite' ? { ...bonuses, [kind]: bonuses[kind] + 1 } : { ...bonuses }
    };
}
