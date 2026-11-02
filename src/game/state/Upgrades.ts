export interface Upgrades { strength: number; gold: number; diamonds: number; vialBelt: number; }
export interface LevelBonuses { blastPowder: number; momentum: number; strengthPotion: number; goldRush: number; luck: number; extraTime: number; lightweightGrip: number; prospectorsLens: number; streakVial: number; }
export type UpgradeKind = keyof Upgrades;
export type ShopItemKind = UpgradeKind | 'dynamite' | 'lifeVial' | keyof LevelBonuses;
export const emptyUpgrades = (): Upgrades => ({ strength: 0, gold: 0, diamonds: 0, vialBelt: 0 });
export const emptyBonuses = (): LevelBonuses => ({ blastPowder: 0, momentum: 0, strengthPotion: 0, goldRush: 0, luck: 0, extraTime: 0, lightweightGrip: 0, prospectorsLens: 0, streakVial: 0 });
export const remainingBonuses = (bonuses: LevelBonuses): LevelBonuses => ({
    blastPowder: Math.max(0, bonuses.blastPowder - 1),
    momentum: Math.max(0, bonuses.momentum - 1),
    strengthPotion: Math.max(0, bonuses.strengthPotion - 1),
    goldRush: Math.max(0, bonuses.goldRush - 1),
    luck: Math.max(0, bonuses.luck - 1),
    extraTime: Math.max(0, bonuses.extraTime - 1),
    lightweightGrip: Math.max(0, bonuses.lightweightGrip - 1),
    streakVial: Math.max(0, bonuses.streakVial - 1),
    prospectorsLens: Math.max(0, bonuses.prospectorsLens - 1)
});
export const isPermanentUpgrade = (kind: ShopItemKind): kind is UpgradeKind => kind === 'strength' || kind === 'gold' || kind === 'diamonds' || kind === 'vialBelt';
export const UPGRADE_LIMIT = 3;
export const UPGRADE_INFO = {
    blastPowder: { name: 'Blast Powder', description: 'Thrown dynamite blasts nearby objects; bigger caught items create bigger blasts. TNT barrels and rats gain +50% radius. Toggle beside dynamite. Each purchase covers one round', basePrice: 1500 },
    momentum: { name: 'Momentum vial', description: 'Perfect catches instantly add 2 seconds, up to 10 seconds per round. Each purchase covers one round', basePrice: 1250 },
    strengthPotion: { name: 'Strength vial', description: 'Double reel speed for 2 catches, plus Vial Belt. Mine vials add catches. Each purchase covers one round', basePrice: 1000 },
    goldRush: { name: 'Gold Rush vial', description: 'Gold nuggets pay +50% for 2 catches, plus Vial Belt. Mine vials add catches. Each purchase covers one round', basePrice: 1000 },
    streakVial: { name: 'Streak vial', description: 'Multiplies streak bonuses by 1.5 for one full round. Catching a mine streak vial boosts them to x2 for 15 seconds', basePrice: 1000 },
    prospectorsLens: { name: 'Prospector’s Lens', description: 'Reveals cash-bag values and the exact contents of mystery bags and treasure chests. Each purchase covers one round', basePrice: 1500 },
    lifeVial: { name: 'Life vial', description: 'Restores one life immediately, up to five lives', basePrice: 3000 },
    strength: { name: 'Stronger winch', description: '+10% retrieval speed per tier. Lasts for this run', basePrice: 1000 },
    gold: { name: 'Gold polish', description: '+15% gold nugget value per tier. Stacks with Gold Rush. Lasts for this run', basePrice: 1250 },
    diamonds: { name: 'Gem polish', description: '+15% diamond and ruby value per tier. Lasts for this run', basePrice: 1250 },
    vialBelt: { name: 'Vial Belt', description: '+1 Strength and Gold Rush catch and +5 seconds to caught Streak vials per tier. Lasts for this run', basePrice: 2000 },
    dynamite: { name: 'Dynamite', description: 'One stick. Unused dynamite carries over; no free refills', basePrice: 750 },
    luck: { name: 'Luck vial', description: 'Cash bags pay an extra $200 each. Each purchase covers one round', basePrice: 1000 },
    extraTime: { name: 'Time vial', description: 'Start the next round with +15 seconds. Same effect as a mine Time vial', basePrice: 1000 },
    lightweightGrip: { name: 'Lightweight Grip', description: 'Reduces rock hauling weight by 40%, including gem-bearing rocks. Each purchase covers one round', basePrice: 250 }
};
export const upgradePrice = (kind: ShopItemKind, upgrades: Upgrades): number =>
    kind === 'vialBelt' ? UPGRADE_INFO.vialBelt.basePrice + upgrades.vialBelt * 1500
        : UPGRADE_INFO[kind].basePrice * (isPermanentUpgrade(kind) ? upgrades[kind] + 1 : 1);
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

export const cashBagValue = (value: number, luck: number): number => value + (luck > 0 ? 200 : 0);
