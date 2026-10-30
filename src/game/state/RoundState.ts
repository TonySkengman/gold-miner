import { emptyUpgrades, Upgrades } from './Upgrades';
import { LEVELS, LevelConfig } from './Levels';

export class RoundState {
    score = 0;
    dynamite: number;
    readonly upgrades: Upgrades;
    remaining = 60;
    readonly level: number;
    readonly config: LevelConfig;

    constructor(level = 1, readonly startingMoney = 0, upgrades: Upgrades = emptyUpgrades()) {
        this.level = Number.isInteger(level) ? Math.max(1, Math.min(LEVELS.length, level)) : 1;
        this.upgrades = { ...upgrades };
        this.dynamite = this.dynamiteCapacity;
        this.config = LEVELS[this.level - 1];
    }

    get dynamiteCapacity(): number { return 3 + this.upgrades.dynamite; }

    get money(): number { return this.startingMoney + this.score; }

    get target(): number { return this.config.target; }
    get finalLevel(): boolean { return this.level === LEVELS.length; }

    get finished(): boolean { return this.remaining <= 0; }
    get won(): boolean { return this.score >= this.target; }

    update(seconds: number): void {
        this.remaining = Math.max(0, this.remaining - seconds);
    }
}
