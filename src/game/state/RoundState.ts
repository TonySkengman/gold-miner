import { emptyUpgrades, Upgrades, emptyBonuses, LevelBonuses } from './Upgrades';
import { LEVELS, LevelConfig } from './Levels';

export class RoundState {
    score = 0;
    strengthRemaining = 0;
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

    activateStrength(): void { this.strengthRemaining = 15; }

    get strengthMultiplier(): number { return this.strengthRemaining > 0 ? 2 : 1; }

    get money(): number { return this.startingMoney + this.score; }

    get target(): number { return this.config.target; }
    get finalLevel(): boolean { return this.level === LEVELS.length; }

    get finished(): boolean { return this.remaining <= 0; }
    get won(): boolean { return this.score >= this.target; }

    update(seconds: number): void {
        this.strengthRemaining = Math.max(0, this.strengthRemaining - seconds);
        this.remaining = Math.max(0, this.remaining - seconds);
    }
}
