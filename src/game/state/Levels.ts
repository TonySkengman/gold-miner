export interface LevelConfig {
    target: number;
    rocks: number;
    largeRocks: number;
    minimumDepth: number;
    diamonds: number;
    moneyBags: number;
    rats: number;
    diamondRats: number;
}

export const LEVELS: readonly LevelConfig[] = [
    { target: 650, rocks: 3, largeRocks: 1, minimumDepth: 320, diamonds: 0, moneyBags: 0, rats: 0, diamondRats: 0 },
    { target: 850, rocks: 4, largeRocks: 1, minimumDepth: 335, diamonds: 0, moneyBags: 1, rats: 0, diamondRats: 0 },
    { target: 1050, rocks: 4, largeRocks: 2, minimumDepth: 350, diamonds: 1, moneyBags: 1, rats: 2, diamondRats: 0 },
    { target: 1250, rocks: 5, largeRocks: 2, minimumDepth: 365, diamonds: 1, moneyBags: 2, rats: 3, diamondRats: 1 },
    { target: 1450, rocks: 5, largeRocks: 3, minimumDepth: 380, diamonds: 2, moneyBags: 2, rats: 4, diamondRats: 2 }
];
