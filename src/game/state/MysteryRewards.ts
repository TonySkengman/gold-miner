import { timeVialSeconds, luckVialDuration } from './Upgrades';

export type MysteryReward = { kind: 'money'; amount: number } | { kind: 'strength' | 'goldRush' | 'streakVial' | 'extraTime' | 'life' | 'luck' | 'momentum' };

const VIALS = ['strength', 'goldRush', 'streakVial', 'extraTime', 'life', 'luck', 'momentum'] as const;

export function mysteryRewardLabel(reward: MysteryReward, vialBelt = 0): string {
    if (reward.kind === 'money') return `$${reward.amount}`;
    const labels = { strength: 'STRENGTH x2', goldRush: 'GOLD RUSH',
        streakVial: 'STREAK VIAL', extraTime: `+${timeVialSeconds(vialBelt)} SECONDS`, life: '+1 LIFE',
        luck: `LUCK ${luckVialDuration(vialBelt)}s`, momentum: 'MOMENTUM +5 CHARGES' };
    return labels[reward.kind];
}

/** 50% cash, 50% evenly shared between all seven shop vials. */
export function rollMysteryReward(random: () => number = Math.random, luck = 0): MysteryReward {
    const roll = random();
    if (roll >= 0.5) return { kind: VIALS[Math.min(VIALS.length - 1, Math.floor(random() * VIALS.length))] };
    const minimum = luck > 0 ? 500 : 250;
    const steps = luck > 0 ? 16 : 41;
    return { kind: 'money', amount: minimum + Math.floor(random() * steps) * 10 };
}
