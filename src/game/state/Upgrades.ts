export interface Upgrades { strength: number; diamonds: number; dynamite: number; }
export type UpgradeKind = keyof Upgrades;
export const emptyUpgrades = (): Upgrades => ({ strength: 0, diamonds: 0, dynamite: 0 });
export const UPGRADE_LIMIT = 3;
export const UPGRADE_INFO = {
    strength: { name: 'Stronger winch', description: '+20% retrieval speed per tier', basePrice: 300 },
    diamonds: { name: 'Diamond polish', description: '+25% diamond value per tier', basePrice: 400 },
    dynamite: { name: 'Dynamite belt', description: '+1 dynamite each level per tier', basePrice: 150 }
};
export const upgradePrice = (kind: UpgradeKind, upgrades: Upgrades): number => UPGRADE_INFO[kind].basePrice * (upgrades[kind] + 1);

export function purchaseUpgrade(kind: UpgradeKind, money: number, upgrades: Upgrades): { money: number; upgrades: Upgrades } | null {
    const price = upgradePrice(kind, upgrades);
    if (upgrades[kind] >= UPGRADE_LIMIT || money < price) return null;
    return { money: money - price, upgrades: { ...upgrades, [kind]: upgrades[kind] + 1 } };
}
