export type MysteryReward = { kind: 'money'; amount: number } | { kind: 'dynamite' } | { kind: 'strength' };

/** Mostly money, with a wide payout range and occasional supplies or strength. */
export function rollMysteryReward(random: () => number = Math.random): MysteryReward {
    const roll = random();
    if (roll >= 0.85) return { kind: 'strength' };
    if (roll >= 0.65) return { kind: 'dynamite' };
    const tier = random();
    // Cash payouts: 10% small, 25% medium, 65% high.
    const amount = tier < 0.1 ? 10 + Math.floor(random() * 10) * 10
        : tier < 0.35 ? 150 + Math.floor(random() * 8) * 50
        : 550 + Math.floor(random() * 6) * 50;
    return { kind: 'money', amount };
}
