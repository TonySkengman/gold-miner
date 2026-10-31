import { PauseMenu } from './scenes/PauseMenu';
import { LevelBriefing } from './scenes/LevelBriefing';
import { WORLD } from './state/World';
import { UpgradeShop } from './scenes/UpgradeShop';
import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: WORLD.width,
    height: WORLD.height,
    parent: 'game-container',
    backgroundColor: '#483126',
    scale: { mode: Scale.FIT, autoCenter: Scale.CENTER_BOTH },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        LevelBriefing,
        MainGame,
        GameOver,
        UpgradeShop,
        PauseMenu
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
