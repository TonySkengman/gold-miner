export type TreasureReward = { kind: 'money' | 'dynamite' | 'luck' | 'rockPolish'; amount: number };

/** Equal chances for the four rewards; rolled from the level's seeded stream. */
export function rollTreasureReward(random: () => number = Math.random): TreasureReward {
    const roll = random();
    const amount = random();
    if (roll < 0.25) return { kind: 'money', amount: 400 + Math.floor(amount * 11) * 50 };
    if (roll < 0.5) return { kind: 'dynamite', amount: 2 + Math.floor(amount * 2) };
    if (roll < 0.75) return { kind: 'luck', amount: 1 + Math.floor(amount * 2) };
    return { kind: 'rockPolish', amount: 2 + Math.floor(amount * 2) };
}

export function treasureRewardLabel(reward: TreasureReward): string {
    switch (reward.kind) {
        case 'money': return `$${reward.amount} GOLD`;
        case 'dynamite': return `${reward.amount} DYNAMITE`;
        case 'luck': return `${reward.amount} LUCK ${reward.amount === 1 ? 'POTION' : 'POTIONS'}`;
        case 'rockPolish': return `${reward.amount} ROCK POLISH`;
    }
}

export function treasureRewardValue(reward: TreasureReward): number {
    return reward.amount * (reward.kind === 'money' ? 1 : reward.kind === 'dynamite' ? 750 : reward.kind === 'luck' ? 500 : 250);
}
