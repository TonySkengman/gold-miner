import { showGameGuide } from '../ui/GameGuide';
import { responsiveLayout } from '../ui/ResponsiveLayout';
import { WORLD } from '../state/World';
import { Scene, GameObjects } from 'phaser';
import { addSoundButton } from '../audio/SoundEffects';
import { menuButton } from '../ui/menuButton';

export class PauseMenu extends Scene {
    constructor() { super('PauseMenu'); }

    create(data: { confirmExit?: boolean } = {}): void {
        this.add.rectangle(WORLD.centerX, 480, WORLD.width, WORLD.height, 0x11151a, 0.78).setData('responsiveFullWidth', true).setInteractive();
        this.add.rectangle(WORLD.centerX, 480, 720, 700, 0xffedbb).setStrokeStyle(4, 0xc29659);
        this.add.text(WORLD.centerX, 280, 'PAUSED', { fontFamily: 'Arial', fontSize: 46, fontStyle: 'bold', color: '#70452a' }).setOrigin(0.5);
        const instructions = this.add.text(WORLD.centerX, 345, '↓ / CLICK: launch    •    ↑: dynamite\n←: toggle Blast Powder (when owned)\n→: toggle Safety Grip (when owned)\nP / ESC: resume\nSafety Grip toggles only while the claw is idle.\nThe timer and all movement are stopped.', { fontFamily: 'Arial', fontSize: 22, color: '#483126', align: 'center', lineSpacing: 8 }).setOrigin(0.5, 0);
        const resumeY = instructions.y + instructions.height + 62;
        let leaving = false;
        const resume = () => {
            if (leaving) return;
            leaving = true;
            this.scene.resume('Game');
            this.scene.stop();
        };
        const guideButton = menuButton(this, WORLD.centerX, resumeY, 'GAME GUIDE', () => showGameGuide(this));
        guideButton.setBackgroundColor('#70452a');
        guideButton.on('pointerover', () => guideButton.setBackgroundColor('#8a5937'));
        guideButton.on('pointerout', () => guideButton.setBackgroundColor('#70452a'));
        menuButton(this, WORLD.centerX, resumeY + 85, 'RESUME', resume);
        let confirming = false;
        const endRunButton = menuButton(this, WORLD.centerX, resumeY + 170, 'END RUN', () => showConfirmation(true));
        endRunButton.setBackgroundColor('#8e493c');
        endRunButton.on('pointerover', () => endRunButton.setBackgroundColor('#a85848'));
        endRunButton.on('pointerout', () => endRunButton.setBackgroundColor('#8e493c'));
        const pauseHud = [...this.children.list];
        const shade = this.add.rectangle(WORLD.centerX, 480, WORLD.width, WORLD.height, 0x11151a, 0.9)
            .setData('responsiveFullWidth', true).setInteractive().setDepth(30);
        const panel = this.add.rectangle(WORLD.centerX, 480, 680, 300, 0xffedbb).setStrokeStyle(4, 0xc29659).setDepth(31);
        const heading = this.add.text(WORLD.centerX, 390, 'RETURN TO MAIN MENU?', {
            fontFamily: 'Arial', fontSize: 30, fontStyle: 'bold', color: '#70452a'
        }).setOrigin(0.5).setDepth(32);
        const warning = this.add.text(WORLD.centerX, 465, 'Your progress in this run will be lost.\nAre you sure you want to leave?', {
            fontFamily: 'Arial', fontSize: 22, color: '#483126', align: 'center', lineSpacing: 10
        }).setOrigin(0.5).setDepth(32);
        const cancel = menuButton(this, WORLD.centerX - 160, 560, 'CANCEL', () => {
            if (data.confirmExit) resume();
            else showConfirmation(false);
        }).setDepth(32);
        const confirm = menuButton(this, WORLD.centerX + 150, 560, 'END RUN', () => {
            if (leaving) return;
            leaving = true;
            this.scene.stop('Game');
            this.scene.start('MainMenu');
        }).setDepth(32);
        confirm.setBackgroundColor('#8e493c');
        confirm.on('pointerover', () => confirm.setBackgroundColor('#a85848'));
        confirm.on('pointerout', () => confirm.setBackgroundColor('#8e493c'));
        const confirmation = [shade, panel, heading, warning, cancel, confirm];
        const showConfirmation = (visible: boolean) => {
            confirming = visible;
            confirmation.forEach(item => item.setVisible(visible));
            pauseHud.forEach(item => {
                if (item instanceof GameObjects.Text || item instanceof GameObjects.Rectangle) item.setVisible(!visible);
            });
        };
        showConfirmation(data.confirmExit ?? false);
        const onKey = (event: KeyboardEvent) => {
            if (event.repeat) return;
            if (confirming && !data.confirmExit) showConfirmation(false);
            else resume();
        };
        this.input.keyboard?.on('keydown-P', onKey);
        this.input.keyboard?.on('keydown-ESC', onKey);
        this.events.once('shutdown', () => {
            this.input.keyboard?.off('keydown-P', onKey);
            this.input.keyboard?.off('keydown-ESC', onKey);
        });
        addSoundButton(this, 32, 24).setVisible(!data.confirmExit);
        responsiveLayout(this);
    }
}
