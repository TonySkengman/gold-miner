export interface Upgrades { strength: number; diamonds: number; }
export type UpgradeKind = keyof Upgrades;
export type ShopItemKind = UpgradeKind | 'dynamite';
export const emptyUpgrades = (): Upgrades => ({ strength: 0, diamonds: 0 });
export const UPGRADE_LIMIT = 3;
export const UPGRADE_INFO = {
    strength: { name: 'Stronger winch', description: '+20% retrieval speed per tier', basePrice: 300 },
    diamonds: { name: 'Diamond polish', description: '+25% diamond value per tier', basePrice: 400 },
    dynamite: { name: 'Dynamite', description: 'One stick. Unused dynamite carries over; no free refills', basePrice: 750 }
};
export const upgradePrice = (kind: ShopItemKind, upgrades: Upgrades): number =>
    kind === 'dynamite' ? UPGRADE_INFO.dynamite.basePrice : UPGRADE_INFO[kind].basePrice * (upgrades[kind] + 1);

export function purchaseUpgrade(kind: ShopItemKind, money: number, upgrades: Upgrades, dynamite = 0): { money: number; upgrades: Upgrades; dynamite: number } | null {
    const price = upgradePrice(kind, upgrades);
    if ((kind !== 'dynamite' && upgrades[kind] >= UPGRADE_LIMIT) || money < price) return null;
    return {
        money: money - price,
        upgrades: kind === 'dynamite' ? { ...upgrades } : { ...upgrades, [kind]: upgrades[kind] + 1 },
        dynamite: dynamite + (kind === 'dynamite' ? 1 : 0)
    };
}
