import { Scene } from 'phaser';

interface Result { score: number; target: number; won: boolean; }

export class GameOver extends Scene {
    constructor() { super('GameOver'); }

    create(result: Result): void {
        this.cameras.main.setBackgroundColor(0x483126);
        this.add.rectangle(512, 374, 660, 440, 0xffedbb).setStrokeStyle(6, 0xc58b47);
        this.add.text(512, 245, result.won ? 'STRIKE IT RICH!' : 'SHIFT OVER!', { fontFamily: 'Arial', fontSize: 48, fontStyle: 'bold', color: '#70452a' }).setOrigin(0.5);
        this.add.text(512, 340, `You collected $${result.score}\nTarget: $${result.target}`, { fontFamily: 'Arial', fontSize: 30, color: '#483126', align: 'center', lineSpacing: 12 }).setOrigin(0.5);
        this.add.text(512, 422, result.won ? 'Great haul! You reached your target.' : 'Try aiming for the gold next time!', { fontFamily: 'Arial', fontSize: 21, color: '#70452a' }).setOrigin(0.5);
        const button = this.add.rectangle(512, 510, 250, 66, 0x547f3b).setStrokeStyle(3, 0x365725).setInteractive({ useHandCursor: true });
        this.add.text(512, 510, 'PLAY AGAIN', { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
        button.on('pointerover', () => button.setFillStyle(0x659b47));
        button.on('pointerout', () => button.setFillStyle(0x547f3b));
        button.once('pointerdown', () => this.scene.start('Game'));
    }
}
