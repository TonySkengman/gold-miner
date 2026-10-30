export interface Upgrades { strength: number; diamonds: number; }
export interface LevelBonuses { luck: boolean; extraTime: boolean; }
export type UpgradeKind = keyof Upgrades;
export type ShopItemKind = UpgradeKind | 'dynamite' | keyof LevelBonuses;
export const emptyUpgrades = (): Upgrades => ({ strength: 0, diamonds: 0 });
export const emptyBonuses = (): LevelBonuses => ({ luck: false, extraTime: false });
export const isPermanentUpgrade = (kind: ShopItemKind): kind is UpgradeKind => kind === 'strength' || kind === 'diamonds';
export const UPGRADE_LIMIT = 3;
export const UPGRADE_INFO = {
    strength: { name: 'Stronger winch', description: '+10% retrieval speed per tier. Lasts for this run', basePrice: 1000 },
    diamonds: { name: 'Diamond polish', description: '+15% diamond value per tier. Lasts for this run', basePrice: 1250 },
    dynamite: { name: 'Dynamite', description: 'One stick. Unused dynamite carries over; no free refills', basePrice: 750 },
    luck: { name: 'Luck potion', description: 'Money bags pay at least $250 in the next level only', basePrice: 500 },
    extraTime: { name: 'Extra time', description: '+15 seconds in the next level only. One purchase per visit', basePrice: 600 }
};
export const upgradePrice = (kind: ShopItemKind, upgrades: Upgrades): number =>
    UPGRADE_INFO[kind].basePrice * (isPermanentUpgrade(kind) ? upgrades[kind] + 1 : 1);
export function itemSoldOut(kind: ShopItemKind, upgrades: Upgrades, bonuses: LevelBonuses): boolean {
    return isPermanentUpgrade(kind) ? upgrades[kind] >= UPGRADE_LIMIT
        : kind === 'dynamite' ? false : bonuses[kind];
}

export function purchaseUpgrade(kind: ShopItemKind, money: number, upgrades: Upgrades, dynamite = 0, bonuses = emptyBonuses()): { money: number; upgrades: Upgrades; dynamite: number; bonuses: LevelBonuses } | null {
    const price = upgradePrice(kind, upgrades);
    if (itemSoldOut(kind, upgrades, bonuses) || money < price) return null;
    return {
        money: money - price,
        upgrades: isPermanentUpgrade(kind) ? { ...upgrades, [kind]: upgrades[kind] + 1 } : { ...upgrades },
        dynamite: dynamite + (kind === 'dynamite' ? 1 : 0),
        bonuses: kind === 'luck' || kind === 'extraTime' ? { ...bonuses, [kind]: true } : { ...bonuses }
    };
}
