import { MILESTONES, Milestone } from './Milestones';
import type { MysteryReward } from './MysteryRewards';
import { emptyUpgrades, Upgrades, emptyBonuses, LevelBonuses, remainingBonuses } from './Upgrades';
import { TreasureReward, treasureRewardLabel } from './TreasureRewards';
import { LEVELS, LevelConfig } from './Levels';
import type { OreKind } from '../objects/Collectable';

export class RoundState {
    lives: number;
    readonly startingLives: number;
    score = 0;
    catchStreak = 0;
    streakVialSeconds = 0;

    get streakVialActive(): boolean { return this.streakMultiplier > 1; }

    get streakMultiplier(): number {
        if (this.bonuses.streakVial > 0) return this.streakVialSeconds > 0 ? 3 : 2;
        return this.streakVialSeconds > 0 ? 2 : 1;
    }

    activateStreakVial(): void { this.streakVialSeconds = this.bonuses.streakVial > 0 ? 15 : 30; }

    /** Register a latch immediately; the returned bonus is paid only on delivery. */
    latchStreak(kind: OreKind): number {
        if (!['small', 'medium', 'large', 'giant', 'diamond', 'ruby', 'moneyBag', 'mysteryBag', 'treasureChest'].includes(kind)) return 0;
        this.catchStreak++;
        const bonus = this.currentStreakBonus;
        return bonus;
    }

    missShot(): void { this.catchStreak = 0; }

    get currentStreakBonus(): number { return Math.max(0, this.catchStreak - 2) * 25 * this.streakMultiplier; }

    bonusMoney = 0;
    private claimedMilestones = 0;
    strengthCatches = 0;
    goldRushCatches = 0;
    dynamite: number;
    readonly upgrades: Upgrades;
    readonly bonuses: LevelBonuses;
    private readonly collectedBonuses = emptyBonuses();
    remaining = 60;
    readonly level: number;
    readonly config: LevelConfig;

    constructor(level = 1, readonly startingMoney = 0, upgrades: Upgrades = emptyUpgrades(), readonly startingDynamite = 3, bonuses: LevelBonuses = emptyBonuses(), lives = 3) {
        this.lives = this.startingLives = Math.max(1, Math.min(5, Math.floor(lives)));
        this.level = Number.isInteger(level) ? Math.max(1, Math.min(LEVELS.length, level)) : 1;
        this.bonuses = { ...emptyBonuses(), ...bonuses };
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
        return 'STRENGTH x2 • 3 CATCHES!';
    }

    activateStrength(): void { this.strengthCatches = 3; }

    applyTreasureReward(reward: TreasureReward): string {
        if (reward.kind === 'life') {
            if (this.lives >= 5) return 'LIVES FULL (5 / 5)!';
            this.lives++;
            return '+1 LIFE!';
        }
        if (reward.kind === 'money') this.score += reward.amount;
        else if (reward.kind === 'dynamite') this.dynamite += reward.amount;
        else this.collectedBonuses[reward.kind] += reward.amount;
        return `${treasureRewardLabel(reward)}${reward.kind === 'luck' || reward.kind === 'lightweightGrip' ? ' (STORED)' : '!'}`;
    }

    get nextBonuses(): LevelBonuses {
        const stock = remainingBonuses(this.bonuses);
        return { streakVial: stock.streakVial, luck: stock.luck + this.collectedBonuses.luck, extraTime: stock.extraTime,
            prospectorsLens: stock.prospectorsLens, lightweightGrip: stock.lightweightGrip + this.collectedBonuses.lightweightGrip };
    }

    activateGoldRush(): void { this.goldRushCatches = 3; }

    /** Strength uses every latch; gold rush uses only boosted gold nugget catches. */
    consumeCatch(kind: OreKind): number {
        const goldMultiplier = this.goldRushValue(100, kind) / 100;
        this.strengthCatches = Math.max(0, this.strengthCatches - 1);
        if (goldMultiplier > 1) this.goldRushCatches--;
        return goldMultiplier;
    }

    addTime(): void { this.remaining += 15; }

    goldRushValue(value: number, kind: OreKind): number {
        const gold = kind === 'small' || kind === 'medium' || kind === 'large' || kind === 'giant';
        return this.goldRushCatches > 0 && gold ? Math.round(value * 1.5) : value;
    }

    get strengthMultiplier(): number { return this.strengthCatches > 0 ? 2 : 1; }

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
        this.remaining = Math.max(0, this.remaining - seconds);
        this.streakVialSeconds = Math.max(0, this.streakVialSeconds - seconds);
    }
}
