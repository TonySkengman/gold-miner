export interface ToolToggles { safetyGrip?: boolean; blastPowder?: boolean; autoFinishLevel?: boolean; }
export interface Upgrades { safetyGrip: number; blastPowder: number; strength: number; gold: number; diamonds: number; vialBelt: number; }
export interface LevelBonuses { momentum: number; strengthPotion: number; goldRush: number; luck: number; extraTime: number; lightweightGrip: number; prospectorsLens: number; streakVial: number; }
export type UpgradeKind = keyof Upgrades;
export type ShopItemKind = UpgradeKind | 'dynamite' | 'lifeVial' | keyof LevelBonuses;
export const emptyUpgrades = (): Upgrades => ({ safetyGrip: 0, blastPowder: 0, strength: 0, gold: 0, diamonds: 0, vialBelt: 0 });
export const emptyBonuses = (): LevelBonuses => ({ momentum: 0, strengthPotion: 0, goldRush: 0, luck: 0, extraTime: 0, lightweightGrip: 0, prospectorsLens: 0, streakVial: 0 });
export const remainingBonuses = (bonuses: LevelBonuses): LevelBonuses => ({
    momentum: Math.max(0, bonuses.momentum - 1),
    strengthPotion: Math.max(0, bonuses.strengthPotion - 1),
    goldRush: Math.max(0, bonuses.goldRush - 1),
    luck: Math.max(0, bonuses.luck - 1),
    extraTime: Math.max(0, bonuses.extraTime - 1),
    lightweightGrip: Math.max(0, bonuses.lightweightGrip - 1),
    streakVial: Math.max(0, bonuses.streakVial - 1),
    prospectorsLens: Math.max(0, bonuses.prospectorsLens - 1)
});
export const isPermanentUpgrade = (kind: ShopItemKind): kind is UpgradeKind => kind === 'safetyGrip' || kind === 'blastPowder' || kind === 'strength' || kind === 'gold' || kind === 'diamonds' || kind === 'vialBelt';
export const UPGRADE_LIMIT = 3;
export const upgradeLimit = (_kind: UpgradeKind): number => UPGRADE_LIMIT;
export const luckVialDuration = (vialBelt: number): number => 20 + Math.max(0, Math.min(3, vialBelt) - 1) * 5;
export const momentumSecondsPerCatch = (vialBelt: number): number => 3 + Math.max(0, Math.min(3, vialBelt) - 1);
export const timeVialSeconds = (vialBelt: number): number => 10 + Math.max(0, Math.min(3, vialBelt) - 1) * 5;
export const streakVialDuration = (vialBelt: number): number => 15 + Math.max(0, Math.min(3, vialBelt) - 1) * 5;
export const safetyGripLaunchMultiplier = (tier: number): number => 0.75 + Math.max(0, Math.min(3, tier) - 1) * 0.05;
export const safetyGripDisarmSeconds = (tier: number): number => 3.5 - Math.max(0, Math.min(3, tier) - 1) * 0.5;
export const UPGRADE_INFO = {
    safetyGrip: { name: 'Safety Grip', description: 'Toggle with → or click to catch TNT barrels and TNT rats safely. While ON, launch speed is reduced by 25% / 20% / 15% at tiers 1 / 2 / 3; hauling speed is unchanged. Disarming takes 3.5 / 3 / 2.5 seconds at tiers 1 / 2 / 3 before hauling. Deliver for +1 dynamite, no money. Nearby explosions still detonate free TNT. Starts ON; remembers your choice between levels and retries. Toggle only while the claw is idle. Lasts for this run', basePrice: 1500 },
    blastPowder: { name: 'Blast Powder', description: 'Caught vials trigger their own shatter effects, unaffected by Blast Powder. Other thrown dynamite creates size-based blasts; dynamiting caught TNT gives +50% radius. Contact and chain TNT blasts stay normal. Tiers 2/3 add +20%/+40% radius over tier 1. Toggle with ← or click, including during launch and hauling. Thrown dynamite keeps its effect from throw time. Remembers your toggle between levels and retries. Lasts for this run', basePrice: 1500 },
    momentum: { name: 'Momentum vial', description: 'Starts the round with five charges; mine and mystery vials add five charges on delivery: each perfect catch instantly adds 3/4/5 seconds at Vial Belt tiers 1/2/3 (3 without the belt) and uses one charge. Each purchase covers one round. Shatter a caught vial: Aftershock adds three charges. Each charge doubles launch and return speed for one shot.', basePrice: 1250 },
    strengthPotion: { name: 'Strength vial', description: 'Double reel speed for 2 catches, plus Vial Belt. Mine vials add catches. Each purchase covers one round. Shatter a caught vial: Rock Breaker clears ordinary rocks within 200px, preserving gem-bearing rocks.', basePrice: 1000 },
    goldRush: { name: 'Gold Rush vial', description: 'Gold nuggets pay +50% for 2 catches, plus Vial Belt. Mine vials add catches. Each purchase covers one round. Shatter a caught vial: Golden Touch gives nearby nuggets +50% value for this level within 300px; does not stack.', basePrice: 1000 },
    streakVial: { name: 'Streak vial', description: 'Starts the round with x1.5 streak bonuses for 15 seconds (20/25 at Vial Belt tiers 2/3). Catch another while active to add 5 seconds and increase the multiplier by +0.25x, up to x2. Shatter a caught vial: Streak Spark adds 2 catch-streak steps.', basePrice: 1000 },
    prospectorsLens: { name: 'Prospector’s Lens', description: 'Reveals cash-bag values and the exact contents of mystery bags and treasure chests. Each purchase covers one round', basePrice: 1500 },
    lifeVial: { name: 'Life vial', description: 'Restores one life immediately, up to five lives', basePrice: 5000 },
    strength: { name: 'Stronger winch', description: '+10% retrieval speed per tier. Lasts for this run', basePrice: 1000 },
    gold: { name: 'Gold polish', description: '+15% gold nugget value per tier. Stacks with Gold Rush. Lasts for this run', basePrice: 1250 },
    diamonds: { name: 'Gem polish', description: '+15% diamond and ruby value per tier. Lasts for this run', basePrice: 1250 },
    vialBelt: { name: 'Vial Belt', description: '+1 Strength and Gold Rush catch per tier. Initial Streak effects last 15/20/25 seconds and Time vials add 10/15/20 seconds at tiers 1/2/3. Luck lasts 20/25/30 seconds. Momentum adds 3/4/5 seconds per perfect catch; each vial gives five charges. Lasts for this run', basePrice: 2000 },
    dynamite: { name: 'Dynamite', description: 'One stick: ↑ destroys a caught item or triggers a caught vial’s special shatter effect. Safety Grip recovers one stick per safely delivered TNT barrel or rat. Unused sticks carry over', basePrice: 750 },
    luck: { name: 'Luck vial', description: 'Active for 20/25/30 seconds at Vial Belt tiers 1/2/3 (20 without the belt). Shop stock activates at round start; mine and mystery vials activate on delivery and refresh the duration. Cash bags roll $300–$400; mystery-bag cash rolls $500–$650. Chests have 50% upgrade, 25% cash and 25% dynamite odds (50/50 cash/dynamite when all upgrades are maxed). Each purchase covers one round. Shatter a caught vial: Lucky Find rolls two drops to catch: small rock, small gold, diamond or ruby. Deeper shatters favor gems.', basePrice: 1000 },
    extraTime: { name: 'Time vial', description: 'Adds 10 seconds without Vial Belt or at tier 1, 15 at tier 2, 20 at tier 3. Shop vials apply at round start; caught vials apply on delivery. Shatter a caught vial: Each shattered Time vial adds three recall charges for the current level. Press Down or click again during launch to spend one charge and recall the empty claw without breaking your streak.', basePrice: 1000 },
    lightweightGrip: { name: 'Lightweight Grip', description: 'Reduces rock hauling weight by 40%, including gem-bearing rocks. Each purchase covers one round', basePrice: 250 }
};
export const upgradePrice = (kind: ShopItemKind, upgrades: Upgrades): number =>
    kind === 'vialBelt' ? UPGRADE_INFO.vialBelt.basePrice + upgrades.vialBelt * 1500
        : UPGRADE_INFO[kind].basePrice * (isPermanentUpgrade(kind) ? upgrades[kind] + 1 : 1);
export function itemSoldOut(kind: ShopItemKind, upgrades: Upgrades, lives = 3): boolean {
    return kind === 'lifeVial' ? lives >= 5 : isPermanentUpgrade(kind) && upgrades[kind] >= upgradeLimit(kind);
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

export const cashBagValue = (value: number, luck: number, random: () => number = Math.random): number =>
    luck > 0 ? 300 + Math.floor(random() * 11) * 10 : value;

/** Radius growth is relative to the unlocked tier-1 effect. */
export const blastPowderScale = (tier: number): number => tier > 0 ? 1 + (tier - 1) * 0.2 : 0;
