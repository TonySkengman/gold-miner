import { Upgrades } from '../state/Upgrades';
import { Scene, GameObjects } from 'phaser';
import { Claw } from '../objects/Claw';
import { Collectable, generateCollectables } from '../objects/Collectable';
import { RoundState } from '../state/RoundState';
import { LEVELS } from '../state/Levels';
import { drawEnvironment } from '../art/drawEnvironment';

export class Game extends Scene {
    private ended = false;
    private round: RoundState;
    private claw: Claw;
    private objects: Collectable[];
    private scoreText: GameObjects.Text;
    private progressText: GameObjects.Text;
    private dynamiteText: GameObjects.Text;
    private timeText: GameObjects.Text;

    constructor() { super('Game'); }

    create(data: { level?: number; money?: number; upgrades?: Upgrades } = {}): void {
        this.ended = false;
        this.round = new RoundState(data.level, data.money, data.upgrades);
        drawEnvironment(this);
        this.objects = generateCollectables(this, this.round.config);
        this.claw = new Claw(this, value => {
            this.round.score += value;
            this.showCollectionValue(value);
        }, 1 + this.round.upgrades.strength * 0.2, 1 + this.round.upgrades.diamonds * 0.25);
        const style = { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#fff3cc' };
        this.add.rectangle(512, 44, 1024, 88, 0x483126);
        this.scoreText = this.add.text(32, 29, '', style);
        this.progressText = this.add.text(512, 29, '', { ...style, fontSize: 22 }).setOrigin(0.5, 0);
        this.timeText = this.add.text(990, 29, '', style).setOrigin(1, 0);
        this.add.text(990, 112, `LEVEL ${this.round.level} / ${LEVELS.length}`, {
            fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#483126',
            backgroundColor: '#ffedbb', padding: { x: 12, y: 8 }
        }).setOrigin(1, 0);
        this.dynamiteText = this.add.text(32, 105, '', {
            fontFamily: 'Arial', fontSize: 20, fontStyle: 'bold', color: '#483126',
            backgroundColor: '#ffedbb', padding: { x: 12, y: 8 }
        });
        const finishButton = this.add.text(990, 166, 'Finish Level', {
            fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#ffffff',
            backgroundColor: '#547f3b', padding: { x: 16, y: 10 }
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        finishButton.on('pointerover', () => finishButton.setBackgroundColor('#659b47'));
        finishButton.on('pointerout', () => finishButton.setBackgroundColor('#547f3b'));
        finishButton.on('pointerdown', (
            _pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData
        ) => {
            event.stopPropagation();
            this.finishLevel();
        });
        this.add.rectangle(512, 745, 1024, 46, 0x483126);
        this.add.text(512, 745, '↓ / CLICK: drop claw   •   ↑: dynamite (destroys caught object, no gold)', { fontFamily: 'Arial', fontSize: 18, color: '#fff3cc' }).setOrigin(0.5);
        const launch = () => { if (!this.ended && !this.round.finished) this.claw.launch(); };
        const keyboard = this.input.keyboard;
        const onKey = (event: KeyboardEvent) => { if (!event.repeat) launch(); };
        const onDynamite = (event: KeyboardEvent) => {
            if (event.repeat || this.ended || this.round.finished || this.round.dynamite <= 0) return;
            if (this.claw.throwDynamite()) {
                this.round.dynamite--;
                this.updateHud();
            }
        };
        keyboard?.addCapture(['DOWN', 'UP']);
        keyboard?.on('keydown-DOWN', onKey);
        keyboard?.on('keydown-UP', onDynamite);
        this.input.on('pointerdown', launch);
        this.events.once('shutdown', () => {
            keyboard?.off('keydown-DOWN', onKey);
            keyboard?.off('keydown-UP', onDynamite);
            keyboard?.removeCapture(['DOWN', 'UP']);
            this.input.off('pointerdown', launch);
        });
        this.updateHud();
    }

    update(_time: number, delta: number): void {
        if (this.ended || this.round.finished) return;
        const seconds = Math.min(delta / 1000, this.round.remaining);
        // Small simulation steps keep movement and collisions stable across frame rates.
        let pending = seconds;
        while (pending > 0) {
            const step = Math.min(pending, 1 / 120);
            for (const object of this.objects) object.update(step, this.objects);
            this.claw.update(step, this.objects);
            pending -= step;
        }
        this.round.update(seconds);
        this.updateHud();
        if (this.round.finished) this.finishLevel();
    }

    private showCollectionValue(value: number): void {
        const popup = this.add.text(565, 195, `+$${value}`, {
            fontFamily: 'Arial', fontSize: 28, fontStyle: 'bold', color: '#ffe06a',
            stroke: '#483126', strokeThickness: 4
        }).setOrigin(0, 0.5).setDepth(10);
        this.tweens.add({
            targets: popup, y: 155, alpha: 0, duration: 1100,
            ease: 'Sine.easeOut', onComplete: () => popup.destroy()
        });
    }

    private finishLevel(): void {
        if (this.ended) return;
        this.ended = true;
        this.round.remaining = 0;
        this.scene.start('GameOver', {
            upgrades: this.round.upgrades,
            money: this.round.money, startingMoney: this.round.startingMoney,
            score: this.round.score, target: this.round.target, won: this.round.won,
            level: this.round.level, finalLevel: this.round.finalLevel
        });
    }

    private updateHud(): void {
        this.dynamiteText.setText(this.round.dynamite > 0
            ? `DYNAMITE  ${this.round.dynamite} / ${this.round.dynamiteCapacity}  [↑]`
            : `DYNAMITE  0 / ${this.round.dynamiteCapacity}  •  EMPTY`);
        this.dynamiteText.setColor(this.round.dynamite > 0 ? '#483126' : '#a1382a');
        this.scoreText.setText(`MONEY  $${this.round.money}`);
        this.progressText.setText(`LEVEL GOLD  $${this.round.score} / $${this.round.target}`);
        this.timeText.setText(`TIME  ${Math.ceil(this.round.remaining)}s`);
        this.timeText.setColor(this.round.remaining <= 10 ? '#ff9b7c' : '#fff3cc');
    }

}
