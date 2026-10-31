import { MILESTONES, Milestone } from './Milestones';
import type { MysteryReward } from './MysteryRewards';
import { emptyUpgrades, Upgrades, emptyBonuses, LevelBonuses } from './Upgrades';
import { LEVELS, LevelConfig } from './Levels';
import type { OreKind } from '../objects/Collectable';

export class RoundState {
    score = 0;
    bonusMoney = 0;
    private claimedMilestones = 0;
    strengthRemaining = 0;
    goldRushRemaining = 0;
    dynamite: number;
    readonly upgrades: Upgrades;
    readonly bonuses: LevelBonuses;
    remaining = 60;
    readonly level: number;
    readonly config: LevelConfig;

    constructor(level = 1, readonly startingMoney = 0, upgrades: Upgrades = emptyUpgrades(), readonly startingDynamite = 3, bonuses: LevelBonuses = emptyBonuses()) {
        this.level = Number.isInteger(level) ? Math.max(1, Math.min(LEVELS.length, level)) : 1;
        this.bonuses = { ...bonuses };
        this.remaining = bonuses.extraTime ? 75 : 60;
        this.upgrades = { ...upgrades };
        this.dynamite = startingDynamite;
        this.config = LEVELS[this.level - 1];
    }

    applyMysteryReward(reward: MysteryReward): string {
        if (reward.kind === 'money') {
            this.score += reward.amount;
            return `MYSTERY: +$${reward.amount}`;
        }
        if (reward.kind === 'dynamite') {
            this.dynamite++;
            return '+1 DYNAMITE!';
        }
        this.activateStrength();
        return 'STRENGTH x2!';
    }

    activateStrength(): void { this.strengthRemaining = 15; }

    activateGoldRush(): void { this.goldRushRemaining = 12; }

    addTime(): void { this.remaining += 8; }

    goldRushValue(value: number, kind: OreKind): number {
        const gold = kind === 'small' || kind === 'medium' || kind === 'large' || kind === 'giant';
        return this.goldRushRemaining > 0 && gold ? Math.round(value * 1.5) : value;
    }

    get strengthMultiplier(): number { return this.strengthRemaining > 0 ? 2 : 1; }

    get money(): number { return this.startingMoney + this.score + this.bonusMoney; }

    get nextMilestone(): Milestone | undefined { return MILESTONES[this.claimedMilestones]; }

    get milestoneProgress(): number {
        const next = this.nextMilestone;
        if (!next) return 1;
        const previous = this.claimedMilestones === 0 ? this.target
            : Math.ceil(this.target * MILESTONES[this.claimedMilestones - 1].fraction);
        const threshold = Math.ceil(this.target * next.fraction);
        return Math.max(0, Math.min(1, (this.score - previous) / (threshold - previous)));
    }

    claimMilestones(): Milestone[] {
        const earned: Milestone[] = [];
        while (this.nextMilestone && this.score >= Math.ceil(this.target * this.nextMilestone.fraction)) {
            const milestone = this.nextMilestone;
            this.claimedMilestones++;
            if (milestone.kind === 'money') this.bonusMoney += milestone.amount;
            else this.dynamite += milestone.amount;
            earned.push(milestone);
        }
        return earned;
    }

    get target(): number { return this.config.target; }
    get finalLevel(): boolean { return this.level === LEVELS.length; }

    get finished(): boolean { return this.remaining <= 0; }
    get won(): boolean { return this.score >= this.target; }

    update(seconds: number): void {
        this.strengthRemaining = Math.max(0, this.strengthRemaining - seconds);
        this.goldRushRemaining = Math.max(0, this.goldRushRemaining - seconds);
        this.remaining = Math.max(0, this.remaining - seconds);
    }
}
