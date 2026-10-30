import { Scene, GameObjects } from 'phaser';
import { Claw } from '../objects/Claw';
import { Collectable, generateCollectables } from '../objects/Collectable';
import { RoundState } from '../state/RoundState';

export class Game extends Scene {
    private round: RoundState;
    private claw: Claw;
    private objects: Collectable[];
    private scoreText: GameObjects.Text;
    private timeText: GameObjects.Text;

    constructor() { super('Game'); }

    create(): void {
        this.round = new RoundState();
        this.drawEnvironment();
        this.objects = generateCollectables(this);
        this.claw = new Claw(this, value => { this.round.score += value; });
        const style = { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#fff3cc' };
        this.add.rectangle(512, 44, 1024, 88, 0x483126);
        this.scoreText = this.add.text(32, 29, '', style);
        this.add.text(512, 29, `TARGET  $${this.round.target}`, style).setOrigin(0.5, 0);
        this.timeText = this.add.text(990, 29, '', style).setOrigin(1, 0);
        this.add.rectangle(512, 745, 1024, 46, 0x483126);
        this.add.text(512, 745, 'SPACE / CLICK to drop  •  Big gold pays more, rocks pull slowly!', { fontFamily: 'Arial', fontSize: 18, color: '#fff3cc' }).setOrigin(0.5);
        const launch = () => { if (!this.round.finished) this.claw.launch(); };
        const keyboard = this.input.keyboard;
        const onKey = (event: KeyboardEvent) => { if (!event.repeat) launch(); };
        keyboard?.addCapture('SPACE');
        keyboard?.on('keydown-SPACE', onKey);
        this.input.on('pointerdown', launch);
        this.events.once('shutdown', () => {
            keyboard?.off('keydown-SPACE', onKey);
            keyboard?.removeCapture('SPACE');
            this.input.off('pointerdown', launch);
        });
        this.updateHud();
    }

    update(_time: number, delta: number): void {
        if (this.round.finished) return;
        const seconds = Math.min(delta / 1000, this.round.remaining);
        // Small simulation steps keep movement and collisions stable across frame rates.
        let pending = seconds;
        while (pending > 0) {
            const step = Math.min(pending, 1 / 120);
            this.claw.update(step, this.objects);
            pending -= step;
        }
        this.round.update(seconds);
        this.updateHud();
        if (this.round.finished) this.scene.start('GameOver', { score: this.round.score, target: this.round.target, won: this.round.won });
    }

    private updateHud(): void {
        this.scoreText.setText(`GOLD  $${this.round.score}`);
        this.timeText.setText(`TIME  ${Math.ceil(this.round.remaining)}s`);
        this.timeText.setColor(this.round.remaining <= 10 ? '#ff9b7c' : '#fff3cc');
    }

    private drawEnvironment(): void {
        const g = this.add.graphics();
        g.fillStyle(0xa8dce5).fillRect(0, 0, 1024, 240);
        g.fillStyle(0xffeaa1).fillCircle(875, 140, 38);
        g.fillStyle(0xffffff).fillEllipse(180, 135, 130, 32).fillEllipse(735, 116, 100, 26);
        g.fillStyle(0x91b970).fillTriangle(0, 240, 200, 147, 380, 240).fillTriangle(650, 240, 820, 174, 1024, 240);
        g.fillStyle(0x9d663f).fillRect(0, 248, 1024, 490);
        g.fillStyle(0x8a5435).fillRect(0, 430, 1024, 20).fillRect(0, 635, 1024, 25);
        g.fillStyle(0x66402d);
        for (let i = 0; i < 90; i++) g.fillCircle(12 + (i * 137) % 1000, 275 + (i * 73) % 440, 2);
        g.fillStyle(0x659343).fillRect(0, 238, 1024, 12);
        // Wooden winch and an original, simple shape-drawn miner.
        g.fillStyle(0x71472b).fillRect(472, 210, 80, 12).fillRect(480, 218, 9, 21).fillRect(535, 218, 9, 21);
        g.fillStyle(0x315d8a).fillRoundedRect(497, 168, 30, 38, 6);
        g.fillStyle(0xf2bd86).fillCircle(512, 154, 18);
        g.fillStyle(0x70452a).fillEllipse(512, 165, 29, 15);
        g.fillStyle(0xffce36).fillRoundedRect(491, 132, 42, 15, 5).fillRect(485, 144, 54, 6);
        g.fillStyle(0xfff5c7).fillCircle(512, 140, 6);
        g.fillStyle(0x282b2e).fillCircle(506, 154, 2).fillCircle(519, 154, 2);
        g.fillStyle(0xc58b47).fillCircle(512, 208, 13);
        g.lineStyle(3, 0x70452a).strokeCircle(512, 208, 13);
    }
}
