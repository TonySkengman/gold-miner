import { milestonesFor, Milestone } from './Milestones';
import type { MysteryReward } from './MysteryRewards';
import { emptyUpgrades, Upgrades, emptyBonuses, LevelBonuses, remainingBonuses, luckVialDuration, streakVialDuration, timeVialSeconds, momentumSecondsPerCatch } from './Upgrades';
import { TreasureReward, treasureRewardLabel } from './TreasureRewards';
import { mineConfig, roundDuration, type MineKind } from './Mines';
import { LEVELS, LevelConfig } from './Levels';
import { isMineVial, type OreKind } from '../objects/Collectable';

export class RoundState {
    lives: number;
    readonly startingLives: number;
    score = 0;
    catchStreak = 0;
    streakVialSeconds = 0;
    momentumChargesRemaining = 0;
    luckSeconds = 0;
    get luckActive(): boolean { return this.luckSeconds > 0; }
    activateLuck(): void { this.luckSeconds = luckVialDuration(this.upgrades.vialBelt); }
    activateMomentum(): void { this.momentumChargesRemaining += 5; }

    /** Award immediately on a perfect latch; later dynamite does not undo it. */
    catchMomentum(perfect: boolean): number {
        if (!perfect || this.momentumChargesRemaining === 0) return 0;
        this.momentumChargesRemaining--;
        const seconds = momentumSecondsPerCatch(this.upgrades.vialBelt);
        this.remaining += seconds;
        return seconds;
    }


    get streakVialActive(): boolean { return this.streakMultiplier > 1; }

    private streakVialMultiplier = 1.5;

    get streakMultiplier(): number {
        return this.streakVialSeconds > 0 ? this.streakVialMultiplier : 1;
    }

    activateStreakVial(): void {
        const active = this.streakVialActive;
        this.streakVialMultiplier = active ? Math.min(2, this.streakVialMultiplier + 0.25) : 1.5;
        this.streakVialSeconds = active ? this.streakVialSeconds + 5 : streakVialDuration(this.upgrades.vialBelt);
    }

    /** Register a latch immediately; the returned bonus is paid only on delivery. */
    latchStreak(kind: OreKind): number {
        if (!['small', 'medium', 'large', 'giant', 'diamond', 'ruby', 'diamondRat', 'rubyRat', 'moneyBag', 'mysteryBag', 'treasureChest'].includes(kind)) return 0;
        this.catchStreak++;
        const bonus = this.currentStreakBonus;
        return bonus;
    }

    missShot(): void { this.catchStreak = 0; }

    /** Round the target-based step once so every catch adds the same amount. */
    get streakBonusStep(): number { return Math.round(this.target * (this.mine === 'goldBasin' ? 0.005 : this.mine === 'gemHollow' ? 0.02 : 0.01) / 5) * 5; }

    get currentStreakBonus(): number { return Math.max(0, this.catchStreak - 2) * this.streakBonusStep * this.streakMultiplier; }

    bonusMoney = 0;
    private claimedMilestones = 0;
    readonly milestones: readonly Milestone[];
    strengthCatches = 0;
    goldRushCatches = 0;
    dynamite: number;
    readonly upgrades: Upgrades;
    readonly bonuses: LevelBonuses;
    private readonly collectedBonuses = emptyBonuses();
    remaining = 60;
    readonly level: number;
    readonly config: LevelConfig;

    constructor(level = 1, readonly startingMoney = 0, upgrades: Upgrades = emptyUpgrades(), readonly startingDynamite = 3, bonuses: LevelBonuses = emptyBonuses(), lives = 3, readonly mine: MineKind = 'quarry', readonly startingAccumulatedGold = 0) {
        this.lives = this.startingLives = Math.max(1, Math.min(5, Math.floor(lives)));
        this.level = Number.isInteger(level) ? Math.max(1, Math.min(LEVELS.length, level)) : 1;
        this.bonuses = { ...emptyBonuses(), ...bonuses };
        this.remaining = roundDuration(mine, this.bonuses.extraTime, upgrades.vialBelt);
        this.upgrades = { ...emptyUpgrades(), ...upgrades };
        this.dynamite = startingDynamite;
        this.config = mineConfig(this.level, mine);
        this.milestones = milestonesFor(this.target, this.level);
        if (this.bonuses.luck > 0) this.activateLuck();
        if (this.bonuses.momentum > 0) this.activateMomentum();
        if (this.bonuses.strengthPotion > 0) this.activateStrength();
        if (this.bonuses.goldRush > 0) this.activateGoldRush();
        if (this.bonuses.streakVial > 0) this.activateStreakVial();
    }

    applyMysteryReward(reward: MysteryReward): string {
        if (reward.kind === 'money') {
            this.score += reward.amount;
            return `MYSTERY: +$${reward.amount}`;
        }
        if (reward.kind === 'life') {
            if (this.lives >= 5) return 'LIVES FULL (5 / 5)!';
            this.lives++;
            return '+1 LIFE!';
        }
        if (reward.kind === 'luck') {
            this.activateLuck();
            return `LUCK • ${this.luckSeconds} SECONDS!`;
        }
        if (reward.kind === 'momentum') {
            this.activateMomentum();
            return `MOMENTUM • ${this.momentumChargesRemaining} CHARGES!`;
        }
        if (reward.kind === 'extraTime') {
            return `+${this.addTime()} SECONDS!`;
        }
        if (reward.kind === 'streakVial') {
            this.activateStreakVial();
            return `STREAK BONUSES x${this.streakMultiplier} • ${Number(this.streakVialSeconds.toFixed(2))} SECONDS!`;
        }
        if (reward.kind === 'goldRush') {
            this.activateGoldRush();
            return `GOLD RUSH! ${this.goldRushCatches} GOLD NUGGETS`;
        }
        this.activateStrength();
        return `STRENGTH x2 • ${this.strengthCatches} CATCHES!`;
    }

    activateStrength(): void { this.strengthCatches += 2 + this.upgrades.vialBelt; }

    private readonly collectedUpgrades = emptyUpgrades();

    get nextUpgrades(): Upgrades {
        const upgrades = { ...this.upgrades };
        for (const kind of Object.keys(upgrades) as (keyof Upgrades)[]) {
            upgrades[kind] = Math.min(3, upgrades[kind] + this.collectedUpgrades[kind]);
        }
        return upgrades;
    }

    applyTreasureReward(reward: TreasureReward): string {
        if (reward.kind === 'money') this.score += reward.amount;
        else if (reward.kind === 'dynamite') this.dynamite += reward.amount;
        else this.collectedUpgrades[reward.kind] += reward.amount;
        return `${treasureRewardLabel(reward)}${reward.kind === 'money' || reward.kind === 'dynamite' ? '!' : ' (NEXT ROUND)!'}`;
    }

    get nextBonuses(): LevelBonuses {
        const stock = remainingBonuses(this.bonuses);
        return { momentum: stock.momentum, strengthPotion: stock.strengthPotion, goldRush: stock.goldRush, streakVial: stock.streakVial, luck: stock.luck, extraTime: stock.extraTime,
            prospectorsLens: stock.prospectorsLens, lightweightGrip: stock.lightweightGrip + this.collectedBonuses.lightweightGrip };
    }

    activateGoldRush(): void { this.goldRushCatches += 2 + this.upgrades.vialBelt; }

    /** Vials preserve Strength charges; Gold Rush uses only boosted gold nugget catches. */
    consumeCatch(kind: OreKind): number {
        const goldMultiplier = this.goldRushValue(100, kind) / 100;
        if (!isMineVial(kind)) {
            this.strengthCatches = Math.max(0, this.strengthCatches - 1);
        }
        if (goldMultiplier > 1) this.goldRushCatches--;
        const gold = ['small', 'medium', 'large', 'giant'].includes(kind);
        return goldMultiplier * (gold ? 1 + this.upgrades.gold * 0.1 : 1);
    }

    addTime(): number {
        const seconds = timeVialSeconds(this.upgrades.vialBelt);
        this.remaining += seconds;
        return seconds;
    }

    goldRushValue(value: number, kind: OreKind): number {
        const gold = kind === 'small' || kind === 'medium' || kind === 'large' || kind === 'giant';
        return this.goldRushCatches > 0 && gold ? Math.round(value * 1.5) : value;
    }

    get gemPolishMultiplier(): number { return 1 + this.upgrades.diamonds * 0.1; }

    get strengthMultiplier(): number { return this.strengthCatches > 0 ? 2 : 1; }

    /** Gross run earnings, unaffected by purchases or failure penalties. */
    get accumulatedGold(): number { return this.startingAccumulatedGold + this.score + this.bonusMoney; }

    get money(): number { return this.startingMoney + this.score + this.bonusMoney; }

    /** Failed rounds preserve the existing balance plus half of the new earnings. */
    get retainedMoney(): number {
        return this.won ? this.money : this.startingMoney + Math.floor((this.money - this.startingMoney) / 2);
    }

    get nextMilestone(): Milestone | undefined { return this.milestones[this.claimedMilestones]; }

    get milestoneProgress(): number {
        const next = this.nextMilestone;
        if (!next) return 1;
        const previous = this.claimedMilestones === 0 ? this.target
            : Math.ceil(this.target * this.milestones[this.claimedMilestones - 1].fraction);
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
        this.luckSeconds = Math.max(0, this.luckSeconds - seconds);
        this.remaining = Math.max(0, this.remaining - seconds);
        this.streakVialSeconds = Math.max(0, this.streakVialSeconds - seconds);
    }
}
