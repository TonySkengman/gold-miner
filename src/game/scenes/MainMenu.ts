import { showGameGuide } from '../ui/GameGuide';
import { responsiveLayout } from '../ui/ResponsiveLayout';
import { WORLD } from '../state/World';
import { Scene } from 'phaser';
import { drawEnvironment } from '../art/drawEnvironment';
import { MinerAnimator } from '../art/MinerAnimator';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';
import { LEVELS } from '../state/Levels';
import { menuButton, RUN_START_Y } from '../ui/menuButton';

export class MainMenu extends Scene {
    constructor() { super('MainMenu'); }

    create(): void {
        drawEnvironment(this);
        new MinerAnimator(this);
        this.add.rectangle(WORLD.centerX, 590, 820, 700, 0x211f1d, 0.96).setStrokeStyle(4, 0xc29659);
        this.add.text(WORLD.centerX, 320, 'GOLD MINER', { fontFamily: 'Arial', fontSize: 64, fontStyle: 'bold', color: '#ffda69', stroke: '#483126', strokeThickness: 6 }).setOrigin(0.5);
        this.add.text(WORLD.centerX, 385, `${LEVELS.length} caves. One fortune to make.`, { fontFamily: 'Arial', fontSize: 25, color: '#fff3cc' }).setOrigin(0.5);
        this.add.text(WORLD.centerX, 450, 'THE BASICS', { fontFamily: 'Arial', fontSize: 25, fontStyle: 'bold', color: '#ffda69' }).setOrigin(0.5);
        this.add.text(WORLD.centerX, 590,
            '↓ / CLICK    Launch the claw\n↑    Throw dynamite at a caught object\n← / →    Toggle Blast Powder / Safety Grip\nP / ESC    Pause or resume\n\nReach the target before time runs out.\nStart with 3 lives. Each failed level costs one.\nExplore the full guide for treasure, tools and upgrades.',
            { fontFamily: 'Arial', fontSize: 20, color: '#fff3cc', align: 'center', lineSpacing: 5 }
        ).setOrigin(0.5);
        const guideButton = menuButton(this, WORLD.centerX, 780, 'GAME GUIDE', () => showGameGuide(this));
        guideButton.setBackgroundColor('#70452a');
        guideButton.on('pointerover', () => guideButton.setBackgroundColor('#8a5937'));
        guideButton.on('pointerout', () => guideButton.setBackgroundColor('#70452a'));
        let starting = false;
        menuButton(this, WORLD.centerX, RUN_START_Y, 'START NEW GAME', () => {
            if (starting) return;
            starting = true;
            soundEffects.unlock();
            this.scene.start('MineSelection', { level: 1, money: 0, dynamite: 3, lives: 3 });
        });
        addSoundButton(this, 32, 24);
        responsiveLayout(this);
    }
}
