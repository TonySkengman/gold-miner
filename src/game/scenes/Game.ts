import { BuffKind, drawBuffIcon } from '../ui/BuffIcon';
import { drawLives } from '../ui/LivesDisplay';
import { newLevelSeed, seededRandom } from '../state/Random';
import { MilestoneProgress } from '../ui/MilestoneProgress';
import { rollMysteryReward } from '../state/MysteryRewards';
import { DynamiteInventory } from '../ui/DynamiteInventory';
import { LAYOUTS } from '../state/Layouts';
import { MinerAnimator } from '../art/MinerAnimator';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';
import { WORLD } from '../state/World';
import { LevelBonuses, Upgrades } from '../state/Upgrades';
import { Scene, GameObjects } from 'phaser';
import { Claw } from '../objects/Claw';
import { Collectable, generateCollectables } from '../objects/Collectable';
import { RoundState } from '../state/RoundState';
import { LEVELS } from '../state/Levels';
import { drawEnvironment } from '../art/drawEnvironment';

export class Game extends Scene {
    private levelSeed: number;
    private rewardRandom: () => number;
    private ended = false;
    private pausing = false;
    private round: RoundState;
    private claw: Claw;
    private miner: MinerAnimator;
    private objects: Collectable[];
    private milestoneProgress: MilestoneProgress;
    private scoreText: GameObjects.Text;
    private progressText: GameObjects.Text;
    private dynamiteInventory: DynamiteInventory;
    private strengthText: GameObjects.Text;
    private goldRushText: GameObjects.Text;
    private buffIcons: GameObjects.Graphics[] = [];
    private passiveBuffTexts: GameObjects.Text[] = [];
    private timeText: GameObjects.Text;
    private livesIcons: GameObjects.Graphics;
    private displayedLives = -1;
    private depositHint: GameObjects.Text;

    constructor() { super('Game'); }

    create(data: { level?: number; money?: number; upgrades?: Upgrades; dynamite?: number; bonuses?: LevelBonuses; levelSeed?: number; lives?: number } = {}): void {
        this.levelSeed = data.levelSeed ?? newLevelSeed();
        this.rewardRandom = seededRandom(this.levelSeed ^ 0x51ed270b);
        this.displayedLives = -1;
        this.ended = false;
        this.pausing = false;
        this.passiveBuffTexts = [];
        this.buffIcons = [];
        this.round = new RoundState(data.level, data.money, data.upgrades, data.dynamite, data.bonuses, data.lives);
        drawEnvironment(this, this.round.config.layout);
        this.miner = new MinerAnimator(this);
        this.objects = generateCollectables(this, this.round.config, seededRandom(this.levelSeed));
        this.claw = new Claw(this, (value, object) => {
            if (object.kind === 'treasureChest' && object.treasureReward) {
                this.showCollectionValue(0, this.round.applyTreasureReward(object.treasureReward));
                this.miner.reactTo(object.kind);
                return;
            }
            if (object.kind === 'goldRush') {
                this.round.activateGoldRush();
                this.showCollectionValue(0, 'GOLD RUSH! 2 GOLD NUGGETS');
                return;
            }
            if (object.kind === 'timeVial') {
                this.round.addTime();
                this.showCollectionValue(0, '+8 SECONDS!');
                return;
            }
            if (object.kind === 'mysteryBag') {
                this.showCollectionValue(0, this.round.applyMysteryReward(rollMysteryReward(this.rewardRandom)));
                return;
            }
            if (object.kind === 'strengthPotion') {
                this.round.activateStrength();
                this.showCollectionValue(0, 'STRENGTH x2 • 2 CATCHES!');
                return;
            }
            const earned = this.round.bonuses.luck && object.kind === 'moneyBag'
                ? Math.max(250, value) : value;
            this.round.score += earned;
            this.miner.reactTo(object.kind);
            this.showCollectionValue(earned);
        }, 1 + this.round.upgrades.strength * 0.1, 1 + this.round.upgrades.diamonds * 0.15,
        () => this.round.strengthMultiplier, this.round.bonuses.rockPolish > 0,
        object => this.round.consumeCatch(object.kind));
        const style = { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#fff3cc' };
        this.add.rectangle(512, 44, 1024, 88, 0x483126);
        this.scoreText = this.add.text(32, 29, '', style);
        this.milestoneProgress = new MilestoneProgress(this);
        this.progressText = this.add.text(512, 29, '', { ...style, fontSize: 22 }).setOrigin(0.5, 0);
        this.timeText = this.add.text(990, 29, '', style).setOrigin(1, 0);
        this.add.text(990, 112, `LEVEL ${this.round.level} / ${LEVELS.length}`, {
            fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#483126',
            backgroundColor: '#ffedbb', padding: { x: 12, y: 8 }
        }).setOrigin(1, 0);
        this.add.rectangle(690, 131, 190, 40, 0xffedbb);
        this.livesIcons = drawLives(this, 690, 131, this.round.lives);
        this.dynamiteInventory = new DynamiteInventory(this, 32, 100);
        this.strengthText = this.add.text(32, 213, '', {
            fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#bcf58b',
            backgroundColor: '#253d29', padding: { x: 10, y: 6 }
        }).setVisible(false);
        this.goldRushText = this.add.text(32, 251, '', {
            fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#ffe06a',
            backgroundColor: '#483126', padding: { x: 10, y: 6 }
        }).setVisible(false);
        if (this.round.bonuses.luck) this.passiveBuffTexts.push(this.add.text(32, 251, 'LUCK: bags pay $250+', {
            fontFamily: 'Arial', fontSize: 17, color: '#ecc4ff', backgroundColor: '#42304b',
            padding: { x: 8, y: 5 }
        }));
        if (this.round.bonuses.rockPolish) this.passiveBuffTexts.push(this.add.text(32, 251, 'ROCK POLISH: rocks $50 / $150', {
            fontFamily: 'Arial', fontSize: 17, color: '#ffe5ac', backgroundColor: '#483126',
            padding: { x: 8, y: 5 }
        }));
        const buffKinds: BuffKind[] = ['strength', 'goldRush'];
        if (this.round.bonuses.luck) buffKinds.push('luck');
        if (this.round.bonuses.rockPolish) buffKinds.push('rockPolish');
        this.buffIcons = buffKinds.map(kind => drawBuffIcon(this, kind).setVisible(false));
        addSoundButton(this, 32, 166);
        this.add.text(512, 263, LAYOUTS[this.round.config.layout].name.toUpperCase(), {
            fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#e5c58f',
            backgroundColor: '#302e2b', padding: { x: 12, y: 6 }
        }).setOrigin(0.5);
        const pause = () => {
            if (this.ended || this.pausing || this.scene.isPaused()) return;
            this.pausing = true;
            this.scene.launch('PauseMenu');
            this.scene.pause();
        };
        const pauseButton = this.add.text(172, 166, 'Pause [P]', {
            fontFamily: 'Arial', fontSize: 18, color: '#ffffff', backgroundColor: '#70452a',
            padding: { x: 12, y: 8 }
        }).setInteractive({ useHandCursor: true });
        pauseButton.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            pause();
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
        this.add.rectangle(512, WORLD.footerY, 1024, 46, 0x483126);
        this.add.text(512, WORLD.footerY, '↓ / CLICK: drop claw   •   ↑: dynamite (gem-studded rocks release treasure)', { fontFamily: 'Arial', fontSize: 18, color: '#fff3cc' }).setOrigin(0.5);
        const launch = () => { soundEffects.unlock(); if (!this.ended && !this.round.finished) this.claw.launch(); };
        const keyboard = this.input.keyboard;
        const onKey = (event: KeyboardEvent) => { if (!event.repeat) launch(); };
        const onDynamite = (event: KeyboardEvent) => {
            soundEffects.unlock();
            if (event.repeat || this.ended || this.round.finished || this.round.dynamite <= 0) return;
            if (this.claw.throwDynamite()) {
                this.round.dynamite--;
                this.updateHud();
            }
        };
        const onPauseKey = (event: KeyboardEvent) => { if (!event.repeat) pause(); };
        keyboard?.addCapture(['DOWN', 'UP', 'P', 'ESC']);
        keyboard?.on('keydown-P', onPauseKey);
        keyboard?.on('keydown-ESC', onPauseKey);
        this.game.events.on('blur', pause);
        const onResume = () => { this.pausing = false; };
        this.events.on('resume', onResume);
        keyboard?.on('keydown-DOWN', onKey);
        keyboard?.on('keydown-UP', onDynamite);
        this.input.on('pointerdown', launch);
        this.events.once('shutdown', () => {
            keyboard?.off('keydown-DOWN', onKey);
            keyboard?.off('keydown-UP', onDynamite);
            keyboard?.off('keydown-P', onPauseKey);
            keyboard?.off('keydown-ESC', onPauseKey);
            keyboard?.removeCapture(['DOWN', 'UP', 'P', 'ESC']);
            this.game.events.off('blur', pause);
            this.events.off('resume', onResume);
            this.input.off('pointerdown', launch);
        });
        this.depositHint = this.add.text(512, 320, '', {
            fontFamily: 'Arial', fontSize: 19, fontStyle: 'bold', color: '#9ef5ff',
            backgroundColor: '#302e2b', align: 'center', padding: { x: 12, y: 8 }
        }).setOrigin(0.5, 1).setDepth(11).setVisible(false);
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
            this.miner.update(step, this.claw.retrievalSpeed, this.claw.isHauling, this.claw.haulingWeight);
            this.round.update(step);
            pending -= step;
        }
        this.updateHud();
        if (this.round.finished) this.finishLevel();
    }

    private showCollectionValue(value: number, label = `+$${value}`): void {
        const popup = this.add.text(565, 195, label, {
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
        soundEffects.play(this.round.won ? 'win' : 'lose');
        if (this.round.won && !this.round.finalLevel) {
            this.scene.start('UpgradeShop', {
                lives: this.round.lives,
                bonuses: this.round.nextBonuses,
                dynamite: this.round.dynamite,
                level: this.round.level + 1, money: this.round.money, upgrades: this.round.upgrades
            });
            return;
        }
        this.scene.start('GameOver', {
            lives: this.round.won ? this.round.lives : Math.max(0, this.round.startingLives - 1),
            levelSeed: this.levelSeed,
            bonuses: this.round.bonuses,
            dynamite: this.round.dynamite, startingDynamite: this.round.startingDynamite,
            upgrades: this.round.upgrades,
            money: this.round.money, startingMoney: this.round.startingMoney,
            score: this.round.score, target: this.round.target, won: this.round.won,
            level: this.round.level, finalLevel: this.round.finalLevel
        });
    }

    private updateHud(): void {
        if (this.displayedLives !== this.round.lives) {
            this.livesIcons.destroy();
            this.livesIcons = drawLives(this, 690, 131, this.round.lives);
            this.displayedLives = this.round.lives;
        }
        const deposit = this.claw.hauledDeposit;
        this.depositHint.setVisible(deposit !== null);
        if (deposit) {
            this.depositHint.setText(this.round.dynamite > 0
                ? '↑ Use dynamite to reveal what’s inside!'
                : 'Hidden treasure inside!\nNo dynamite left.');
            const halfWidth = this.depositHint.width / 2 + 16;
            this.depositHint.setPosition(
                Math.max(halfWidth, Math.min(WORLD.width - halfWidth, deposit.x)),
                Math.max(320, deposit.y - deposit.radius - 14)
            );
        }
        const rewards = this.round.claimMilestones();
        if (rewards.length) {
            soundEffects.play('buy');
            const popup = this.add.text(512, 305, `BONUS!  ${rewards.map(reward => reward.label).join('  •  ')}`, {
                fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#bcf58b',
                backgroundColor: '#253d29', padding: { x: 14, y: 8 }
            }).setOrigin(0.5).setDepth(12);
            this.tweens.add({ targets: popup, y: 291, alpha: 0, delay: 1400, duration: 450, onComplete: () => popup.destroy() });
        }
        this.milestoneProgress.update(this.round);
        this.strengthText.setVisible(this.round.strengthCatches > 0);
        this.strengthText.setText(`STRENGTH x2  ${this.round.strengthCatches} catches`);
        this.goldRushText.setVisible(this.round.goldRushCatches > 0);
        this.goldRushText.setText(`GOLD RUSH +50%  ${this.round.goldRushCatches} gold nuggets`);
        let buffY = 213;
        const buffTexts = [this.strengthText, this.goldRushText, ...this.passiveBuffTexts];
        for (const [index, text] of buffTexts.entries()) {
            const icon = this.buffIcons[index];
            icon.setVisible(text.visible);
            if (!text.visible) continue;
            text.setPosition(68, buffY);
            icon.setPosition(48, buffY + text.height / 2);
            buffY += text.height + 5;
        }
        this.dynamiteInventory.update(this.round.dynamite);
        this.scoreText.setText(`MONEY  $${this.round.money}`);
        this.progressText.setText(`LEVEL GOLD  $${this.round.score} / $${this.round.target}`);
        this.timeText.setText(`TIME  ${Math.ceil(this.round.remaining)}s`);
        this.timeText.setColor(this.round.remaining <= 10 ? '#ff9b7c' : '#fff3cc');
    }

}
