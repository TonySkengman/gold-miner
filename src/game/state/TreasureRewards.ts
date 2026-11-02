import { emptyUpgrades, upgradeLimit, UPGRADE_INFO, type UpgradeKind, type Upgrades } from './Upgrades';

export type TreasureReward = { kind: 'money' | 'dynamite' | UpgradeKind; amount: number };

/** Luck favors eligible upgrade tiers; a fully maxed pool splits cash/dynamite equally. */
export function rollTreasureReward(random: () => number = Math.random, upgrades: Upgrades = emptyUpgrades(), luck = 0): TreasureReward {
    const available = (Object.keys(upgrades) as UpgradeKind[]).filter(kind => upgrades[kind] < upgradeLimit(kind));
    const roll = random();
    const amount = random();
    const cashChance = available.length === 0 ? 0.5 : luck > 0 ? 0.25 : 1 / 3;
    const dynamiteThreshold = available.length === 0 ? 1 : luck > 0 ? 0.5 : 2 / 3;
    if (roll < cashChance) return { kind: 'money', amount: 600 + Math.floor(amount * 13) * 50 };
    if (roll < dynamiteThreshold) return { kind: 'dynamite', amount: 2 + Math.floor(amount * 2) };
    return { kind: available[Math.min(available.length - 1, Math.floor(amount * available.length))], amount: 1 };
}

export function treasureRewardLabel(reward: TreasureReward): string {
    if (reward.kind === 'money') return `$${reward.amount} GOLD`;
    if (reward.kind === 'dynamite') return `${reward.amount} DYNAMITE`;
    return `+1 ${UPGRADE_INFO[reward.kind].name.toUpperCase()} TIER`;
}

export function treasureRewardValue(reward: TreasureReward): number {
    if (reward.kind === 'money') return reward.amount;
    if (reward.kind === 'dynamite') return reward.amount * 750;
    return reward.amount * UPGRADE_INFO[reward.kind].basePrice;
}
