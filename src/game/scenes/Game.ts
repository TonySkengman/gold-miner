import type { ToolToggles } from '../state/Upgrades';
import { drawShopProduct } from '../art/drawShop';
import { MineClock } from '../ui/MineClock';
import { MINES, type MineKind } from '../state/Mines';
import { responsiveLayout } from '../ui/ResponsiveLayout';
import { catchFeedbackY } from '../objects/Aiming';
import { BuffKind, drawBuffIcon } from '../ui/BuffIcon';
import { drawLives } from '../ui/LivesDisplay';
import { newLevelSeed, seededRandom } from '../state/Random';
import { MilestoneProgress } from '../ui/MilestoneProgress';
import { MysteryReward, rollMysteryReward } from '../state/MysteryRewards';
import { DynamiteInventory } from '../ui/DynamiteInventory';
import { LAYOUTS } from '../state/Layouts';
import { MinerAnimator } from '../art/MinerAnimator';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';
import { WORLD } from '../state/World';
import { blastPowderScale, cashBagValue, LevelBonuses, Upgrades } from '../state/Upgrades';
import { Scene, GameObjects } from 'phaser';
import { Claw } from '../objects/Claw';
import { Collectable, generateCollectables } from '../objects/Collectable';
import { RoundState } from '../state/RoundState';
import { LEVELS } from '../state/Levels';
import { drawEnvironment } from '../art/drawEnvironment';

export class Game extends Scene {
    private toolToggles: ToolToggles;
    private levelSeed: number;
    private mysteryRewards = new Map<Collectable, MysteryReward>();
    private ended = false;
    private pausing = false;
    private autoFinishLevel = false;
    private round: RoundState;
    private claw: Claw;
    private miner: MinerAnimator;
    private objects: Collectable[];
    private milestoneProgress: MilestoneProgress;
    private scoreText: GameObjects.Text;
    private streakText: GameObjects.Text;
    private progressText: GameObjects.Text;
    private dynamiteInventory: DynamiteInventory;
    private strengthText: GameObjects.Text;
    private streakVialText: GameObjects.Text;
    private goldRushText: GameObjects.Text;
    private buffIcons: GameObjects.Graphics[] = [];
    private momentumText?: GameObjects.Text;
    private passiveBuffTexts: GameObjects.Text[] = [];
    private mineClock: MineClock;
    private livesIcons: GameObjects.Graphics;
    private displayedLives = -1;
    private depositHint: GameObjects.Text;

    constructor() { super('Game'); }

    private get statusX(): number {
        // Reserve space for the right-hand level panel on narrow windows.
        return WORLD.centerX + Math.min(230, 150 + Math.max(0, (WORLD.width - 1024) / 2));
    }

    create(data: { toolToggles?: ToolToggles; level?: number; money?: number; upgrades?: Upgrades; dynamite?: number; bonuses?: LevelBonuses; levelSeed?: number; lives?: number; mine?: MineKind } = {}): void {
        this.toolToggles = { ...data.toolToggles };
        this.autoFinishLevel = this.toolToggles.autoFinishLevel ?? false;
        this.levelSeed = data.levelSeed ?? newLevelSeed();
        const rewardRandom = seededRandom(this.levelSeed ^ 0x51ed270b);
        this.mysteryRewards = new Map();
        this.displayedLives = -1;
        this.ended = false;
        this.pausing = false;
        this.passiveBuffTexts = [];
        this.momentumText = undefined;
        this.buffIcons = [];
        this.round = new RoundState(data.level, data.money, data.upgrades, data.dynamite, data.bonuses, data.lives, data.mine);
        drawEnvironment(this, this.round.config.layout, this.round.mine);
        this.miner = new MinerAnimator(this);
        this.mineClock = new MineClock(this, this.round.remaining);
        this.objects = generateCollectables(this, this.round.config, seededRandom(this.levelSeed));
        for (const object of this.objects) {
            if (this.round.bonuses.prospectorsLens && object.kind === 'treasureChest') {
                object.revealTreasureReward(this);
            }
            if (this.round.bonuses.prospectorsLens && object.kind === 'moneyBag') {
                const amount = cashBagValue(object.value, this.round.bonuses.luck);
                object.revealMysteryReward(this, { kind: 'money', amount });
            }
            if (object.kind !== 'mysteryBag') continue;
            const reward = rollMysteryReward(rewardRandom);
            this.mysteryRewards.set(object, reward);
            if (this.round.bonuses.prospectorsLens) object.revealMysteryReward(this, reward);
        }
        const streakBonuses = new WeakMap<Collectable, number>();
        this.claw = new Claw(this, (value, object, perfectBonus) => {
            const streakBonus = streakBonuses.get(object) ?? 0;
            streakBonuses.delete(object);
            this.round.score += streakBonus + perfectBonus;
            const showValue = (amount: number, label = `+$${amount}`) => this.showCollectionValue(amount,
                `${label}${perfectBonus > 0 ? `\nPERFECT +$${perfectBonus}` : ''}${streakBonus > 0 ? `\nSTREAK ${this.round.catchStreak}  +$${streakBonus}` : ''}`);
            if (object.isExplosive) {
                this.round.dynamite++;
                showValue(0, '+1 DYNAMITE');
                return;
            }
            if (object.kind === 'treasureChest' && object.treasureReward) {
                showValue(0, this.round.applyTreasureReward(object.treasureReward));
                this.miner.reactTo(object.kind);
                return;
            }
            if (object.kind === 'streakVial') {
                this.round.activateStreakVial();
                showValue(0, `STREAK BONUSES x${this.round.streakMultiplier} — ${this.round.streakVialSeconds} SECONDS!`);
                return;
            }
            if (object.kind === 'goldRush') {
                this.round.activateGoldRush();
                showValue(0, `GOLD RUSH! ${this.round.goldRushCatches} GOLD NUGGETS`);
                return;
            }
            if (object.kind === 'timeVial') {
                this.round.addTime();
                showValue(0, '+15 SECONDS!');
                return;
            }
            if (object.kind === 'mysteryBag') {
                showValue(0, this.round.applyMysteryReward(this.mysteryRewards.get(object)!));
                return;
            }
            if (object.kind === 'strengthPotion') {
                this.round.activateStrength();
                showValue(0, `STRENGTH x2 • ${this.round.strengthCatches} CATCHES!`);
                return;
            }
            const earned = object.kind === 'moneyBag' ? cashBagValue(value, this.round.bonuses.luck) : value;
            this.round.score += earned;
            this.miner.reactTo(object.kind);
            showValue(earned);
        }, 1 + this.round.upgrades.strength * 0.1, 1 + this.round.upgrades.diamonds * 0.15,
        () => this.round.strengthMultiplier, this.round.bonuses.lightweightGrip > 0,
        (object, perfect) => {
            const momentumSeconds = this.round.catchMomentum(perfect);
            if (momentumSeconds > 0) {
                const popup = this.add.text(Math.max(150, Math.min(WORLD.width - 150, object.x)),
                    catchFeedbackY(object.y, object.radius) - 165, `MOMENTUM +${momentumSeconds}s`, {
                        fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#9cf2e7',
                        backgroundColor: '#253e42', padding: { x: 8, y: 5 }
                    }).setOrigin(0.5).setDepth(17);
                this.tweens.add({ targets: popup, y: popup.y - 30, alpha: 0, delay: 550,
                    duration: 450, onComplete: () => popup.destroy() });
            }
            // Embedded gems advance the streak; deposits without a visible gem stay neutral.
            const ordinaryRock = !object.gemDeposit && !object.mountedGem
                && ['rock', 'mediumRock', 'heavyRock', 'largeRock'].includes(object.kind);
            if (ordinaryRock || object.kind === 'rat') this.round.missShot();
            const bonus = this.round.latchStreak(object.mountedGem?.kind ?? object.kind);
            streakBonuses.set(object, bonus);
            if (bonus > 0) this.showStreakCatch(object, bonus);
            return this.round.consumeCatch(object.kind);
        }, () => this.round.missShot());
        const style = { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#fff3cc' };
        this.add.rectangle(WORLD.centerX, 44, WORLD.width, 88, 0x483126).setData('responsiveFullWidth', true);
        const moneyX = 166;
        this.add.rectangle(moneyX, 44, 268, 44, 0x263e2c)
            .setStrokeStyle(2, 0xcbb26b).setData('responsiveAnchor', 'left');
        const bill = this.add.graphics().setPosition(moneyX - 91, 44).setScale(0.75).setData('responsiveAnchor', 'left');
        bill.fillStyle(0x80af76).fillRoundedRect(-30, -19, 60, 38, 4);
        bill.lineStyle(2, 0xd4e5a4).strokeRoundedRect(-25, -14, 50, 28, 3);
        bill.fillStyle(0xb8d394).fillEllipse(0, 0, 22, 27);
        this.add.text(moneyX - 91, 44, '$', { fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#315538' })
            .setOrigin(0.5).setData('responsiveAnchor', 'left');
        this.scoreText = this.add.text(moneyX + 30, 44, '', {
            fontFamily: 'Arial', fontSize: 28, fontStyle: 'bold', color: '#fff1af'
        }).setOrigin(0.5).setData('responsiveAnchor', 'left');
        this.milestoneProgress = new MilestoneProgress(this);
        this.progressText = this.add.text(WORLD.centerX, 12, '', { ...style, fontSize: 22 }).setOrigin(0.5, 0);
        const levelPanel = this.add.text(WORLD.width - 34, 112, `LEVEL ${this.round.level} / ${LEVELS.length}\nMode: ${MINES[this.round.mine].name}\nLevel Name: ${LAYOUTS[this.round.config.layout].name}`, {
            fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#483126',
            backgroundColor: '#ffedbb', padding: { x: 12, y: 8 }, lineSpacing: 4
        }).setOrigin(1, 0);
        this.streakText = this.add.text(this.statusX, 164, '', {
            fontFamily: 'Arial', fontSize: 16, fontStyle: 'bold', color: '#ffe06a',
            backgroundColor: '#483126', padding: { x: 8, y: 7 }, align: 'center'
        }).setOrigin(0.5, 0).setData('responsiveAnchor', 'center');
        this.streakText.setData('responsiveRedraw', () => this.streakText.setX(this.statusX));
        const lifeBar = this.add.rectangle(this.statusX, 131, 190, 40, 0xffedbb).setData('responsiveAnchor', 'center');
        lifeBar.setData('responsiveRedraw', () => lifeBar.setX(this.statusX));
        this.livesIcons = drawLives(this, this.statusX, 131, this.round.lives).setData('responsiveIgnore', true);
        const blastIndicator = drawShopProduct(this, WORLD.centerX - 82, 155, 'blastPowder', 0.45)
            .setData('responsiveAnchor', 'center').setDepth(8).setVisible(false);
        const safetyIndicator = drawShopProduct(this, WORLD.centerX + 82, 155, 'safetyGrip', 0.45)
            .setData('responsiveAnchor', 'center').setDepth(8).setVisible(false);
        const leftHudStart = this.children.length;
        this.dynamiteInventory = new DynamiteInventory(this, 32, 100, 146);
        let blastEnabled = this.round.upgrades.blastPowder > 0 && (this.toolToggles.blastPowder ?? true);
        this.claw.powderRadiusScale = blastEnabled ? blastPowderScale(this.round.upgrades.blastPowder) : 0;
        const blastPanel = this.add.rectangle(32, 158, 300, 44, 0xffedbb).setOrigin(0)
            .setInteractive({ useHandCursor: true });
        this.add.rectangle(42, 158, 280, 1, 0xc29659).setOrigin(0);
        drawShopProduct(this, 59, 180, 'blastPowder', 0.43);
        this.add.text(86, 160, 'BLAST POWDER  [←]', {
            fontFamily: 'Arial', fontSize: 14, fontStyle: 'bold', color: '#483126'
        });
        const blastToggle = this.add.text(86, 179, '', {
            fontFamily: 'Arial', fontSize: 14, fontStyle: 'bold', color: '#ffffff',
            padding: { x: 8, y: 3 }
        });
        const refreshBlastToggle = () => {
            blastIndicator.setVisible(blastEnabled);
            blastToggle
            .setText(this.round.upgrades.blastPowder > 0
                ? `T${this.round.upgrades.blastPowder} ${blastEnabled ? 'ON' : 'OFF'} — click / [←]` : 'NOT OWNED — buy in shop')
            .setBackgroundColor(blastEnabled ? '#547f3b' : '#70452a');
        };
        refreshBlastToggle();
        let toggleFeedback: GameObjects.Text | undefined;
        const showToggleLock = (name: string) => {
            if (toggleFeedback) {
                this.tweens.killTweensOf(toggleFeedback);
                toggleFeedback.destroy();
            }
            toggleFeedback = this.add.text(WORLD.centerX, 272,
                `${name}: wait for the claw to return\nChoose before launching`, {
                    fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#ffe5ac',
                    backgroundColor: '#70452a', padding: { x: 12, y: 8 }, align: 'center'
                }).setOrigin(0.5).setDepth(30).setData('responsiveAnchor', 'center');
            const message = toggleFeedback;
            this.tweens.add({ targets: message, y: 250, alpha: 0, delay: 650, duration: 450,
                onComplete: () => {
                    message.destroy();
                    if (toggleFeedback === message) toggleFeedback = undefined;
                } });
        };
        const toggleBlastPowder = () => {
            if (this.ended || this.round.upgrades.blastPowder <= 0) return;
            blastEnabled = !blastEnabled;
            this.toolToggles.blastPowder = blastEnabled;
            this.claw.powderRadiusScale = blastEnabled ? blastPowderScale(this.round.upgrades.blastPowder) : 0;
            refreshBlastToggle();
        };
        blastPanel.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            toggleBlastPowder();
        });
        this.claw.safetyGrip = this.round.upgrades.safetyGrip > 0 && (this.toolToggles.safetyGrip ?? true);
        const safetyPanel = this.add.rectangle(32, 202, 300, 44, 0xffedbb).setOrigin(0)
            .setInteractive({ useHandCursor: true });
        this.add.rectangle(42, 202, 280, 1, 0xc29659).setOrigin(0);
        drawShopProduct(this, 59, 224, 'safetyGrip', 0.4);
        this.add.text(86, 204, 'SAFETY GRIP  [→]', {
            fontFamily: 'Arial', fontSize: 14, fontStyle: 'bold', color: '#483126'
        });
        const safetyText = this.add.text(86, 223, '', {
            fontFamily: 'Arial', fontSize: 14, fontStyle: 'bold', color: '#ffffff', padding: { x: 8, y: 3 }
        });
        const refreshSafetyGrip = () => {
            safetyIndicator.setVisible(this.claw.safetyGrip);
            safetyText
            .setText(this.round.upgrades.safetyGrip > 0
                ? `${this.claw.safetyGrip ? 'ON' : 'OFF'} — click / [→]` : 'NOT OWNED — buy in shop')
            .setBackgroundColor(this.claw.safetyGrip ? '#547f3b' : '#70452a');
        };
        const toggleSafetyGrip = () => {
            if (this.ended || this.round.finished || this.round.upgrades.safetyGrip <= 0) return;
            if (!this.claw.isIdle) {
                showToggleLock('Safety Grip');
                return;
            }
            this.claw.safetyGrip = !this.claw.safetyGrip;
            this.toolToggles.safetyGrip = this.claw.safetyGrip;
            refreshSafetyGrip();
        };
        refreshSafetyGrip();
        safetyPanel.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            toggleSafetyGrip();
        });
        this.strengthText = this.add.text(32, 213, '', {
            fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#bcf58b',
            backgroundColor: '#253d29', padding: { x: 10, y: 6 }
        }).setVisible(false);
        this.goldRushText = this.add.text(32, 251, '', {
            fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#ffe06a',
            backgroundColor: '#483126', padding: { x: 10, y: 6 }
        }).setVisible(false);
        if (this.round.bonuses.luck) this.passiveBuffTexts.push(this.add.text(32, 251, 'LUCK: cash bags +$200', {
            fontFamily: 'Arial', fontSize: 17, color: '#ecc4ff', backgroundColor: '#42304b',
            padding: { x: 8, y: 5 }
        }));
        if (this.round.bonuses.momentum > 0) {
            this.momentumText = this.add.text(32, 251, 'MOMENTUM: 10s left', {
                fontFamily: 'Arial', fontSize: 17, color: '#9cf2e7', backgroundColor: '#253e42', padding: { x: 8, y: 5 }
            });
            this.passiveBuffTexts.push(this.momentumText);
        }
        if (this.round.bonuses.lightweightGrip) this.passiveBuffTexts.push(this.add.text(32, 251, 'LIGHTWEIGHT GRIP: rock weight -40%', {
            fontFamily: 'Arial', fontSize: 17, color: '#ffe5ac', backgroundColor: '#483126',
            padding: { x: 8, y: 5 }
        }));
        this.streakVialText = this.add.text(32, 251, 'STREAK VIAL: bonuses x1.5', {
            fontFamily: 'Arial', fontSize: 17, color: '#e7c5ff', backgroundColor: '#42304b',
            padding: { x: 8, y: 5 }
        }).setVisible(false);
        this.passiveBuffTexts.push(this.streakVialText);
        // Compact buff rows stay above the mine floor.
        [this.strengthText, this.goldRushText, ...this.passiveBuffTexts]
            .forEach(text => text.setFontSize(14).setPadding(8, 4).setWordWrapWidth(270));
        const buffKinds: BuffKind[] = ['strength', 'goldRush'];
        if (this.round.bonuses.luck) buffKinds.push('luck');
        if (this.round.bonuses.momentum > 0) buffKinds.push('momentum');
        if (this.round.bonuses.lightweightGrip) buffKinds.push('lightweightGrip');
        buffKinds.push('streakVial');
        this.buffIcons = buffKinds.map(kind => drawBuffIcon(this, kind).setVisible(false));
        // Keep equipment and buffs together to the left of the clock, including on resize.
        const leftHudItems = this.children.list.slice(leftHudStart) as (GameObjects.GameObject & GameObjects.Components.Transform)[];
        for (const item of leftHudItems) {
            item.x -= 32;
            item.y -= 100;
        }
        const leftHud = this.add.container(32, 100, leftHudItems);
        const layoutLeftHud = () => {
            const clockX = Math.max(372, WORLD.centerX - 210);
            leftHud.setScale(Math.min(1, (clockX - 70 - 32) / 650, (WORLD.groundY - 100) / 146));
        };
        leftHud.setData('responsiveRedraw', layoutLeftHud);
        layoutLeftHud();
        const soundButton = addSoundButton(this, WORLD.width - 284, 24).setData('responsiveAnchor', 'right');
        const pause = (confirmExit = false) => {
            if (this.ended || this.pausing || this.scene.isPaused()) return;
            this.pausing = true;
            this.scene.launch('PauseMenu', { confirmExit });
            this.scene.pause();
        };
        const pauseButton = this.add.text(WORLD.width - 32, 24, 'Pause [P]', {
            fontFamily: 'Arial', fontSize: 18, color: '#ffffff', backgroundColor: '#70452a',
            padding: { x: 12, y: 8 }
        }).setOrigin(1, 0).setData('responsiveAnchor', 'right').setDepth(20).setInteractive({ useHandCursor: true });
        pauseButton.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            pause();
        });
        const controlGap = pauseButton.x - pauseButton.width - (soundButton.x + soundButton.width);
        const menuButton = this.add.text(soundButton.x - controlGap, 24, 'Main Menu', {
            fontFamily: 'Arial', fontSize: 18, color: '#ffffff', backgroundColor: '#70452a',
            padding: { x: 12, y: 8 }
        }).setOrigin(1, 0).setData('responsiveAnchor', 'right').setDepth(20).setInteractive({ useHandCursor: true });
        menuButton.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            pause(true);
        });
        menuButton.setX(WORLD.width - 32);
        soundButton.setX(menuButton.x - menuButton.width - controlGap - soundButton.width);
        pauseButton.setX(soundButton.x - controlGap);
        for (const button of [pauseButton, soundButton, menuButton]) {
            button.setY(44 - button.height / 2);
        }
        const finishButtonsX = levelPanel.x - levelPanel.width - 18;
        const finishButton = this.add.text(finishButtonsX, 112, 'Finish Level', {
            fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#ffffff',
            backgroundColor: '#547f3b', padding: { x: 16, y: 10 }
        }).setOrigin(1, 0).setData('responsiveAnchor', 'right').setInteractive({ useHandCursor: true });
        finishButton.on('pointerover', () => finishButton.setBackgroundColor('#659b47'));
        finishButton.on('pointerout', () => finishButton.setBackgroundColor('#547f3b'));
        finishButton.on('pointerdown', (
            _pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData
        ) => {
            event.stopPropagation();
            this.finishLevel();
        });
        const autoFinishButton = this.add.text(finishButtonsX, 166, '', {
            fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#ffffff',
            padding: { x: 12, y: 9 }
        }).setOrigin(1, 0).setData('responsiveAnchor', 'right').setInteractive({ useHandCursor: true });
        const updateAutoFinishButton = () => autoFinishButton
            .setText(`Auto Finish Level: ${this.autoFinishLevel ? 'ON' : 'OFF'}`)
            .setBackgroundColor(this.autoFinishLevel ? '#547f3b' : '#70452a');
        updateAutoFinishButton();
        autoFinishButton.on('pointerdown', (
            _pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData
        ) => {
            event.stopPropagation();
            if (this.ended) return;
            this.autoFinishLevel = !this.autoFinishLevel;
            this.toolToggles.autoFinishLevel = this.autoFinishLevel;
            updateAutoFinishButton();
        });
        this.add.rectangle(WORLD.centerX, WORLD.footerY, WORLD.width, 46, 0x483126).setData('responsiveFullWidth', true);
        this.add.text(WORLD.centerX, WORLD.footerY, '↓ / CLICK: Launch claw   •   ↑: Dynamite   •   ←: Blast Powder   •   →: Safety Grip', { fontFamily: 'Arial', fontSize: 18, color: '#fff3cc' }).setOrigin(0.5);
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
        const onSafetyGrip = (event: KeyboardEvent) => { if (!event.repeat) toggleSafetyGrip(); };
        const onPauseKey = (event: KeyboardEvent) => { if (!event.repeat) pause(); };
        const onBlastPowder = (event: KeyboardEvent) => { if (!event.repeat) toggleBlastPowder(); };
        keyboard?.addCapture(['DOWN', 'UP', 'LEFT', 'RIGHT', 'P', 'ESC']);
        keyboard?.on('keydown-LEFT', onBlastPowder);
        keyboard?.on('keydown-RIGHT', onSafetyGrip);
        keyboard?.on('keydown-P', onPauseKey);
        keyboard?.on('keydown-ESC', onPauseKey);
        const onBlur = () => pause();
        this.game.events.on('blur', onBlur);
        const onResume = () => { this.pausing = false; };
        this.events.on('resume', onResume);
        keyboard?.on('keydown-DOWN', onKey);
        keyboard?.on('keydown-UP', onDynamite);
        this.input.on('pointerdown', launch);
        this.events.once('shutdown', () => {
            keyboard?.off('keydown-DOWN', onKey);
            keyboard?.off('keydown-UP', onDynamite);
            keyboard?.off('keydown-LEFT', onBlastPowder);
            keyboard?.off('keydown-RIGHT', onSafetyGrip);
            keyboard?.off('keydown-P', onPauseKey);
            keyboard?.off('keydown-ESC', onPauseKey);
            keyboard?.removeCapture(['DOWN', 'UP', 'LEFT', 'RIGHT', 'P', 'ESC']);
            this.game.events.off('blur', onBlur);
            this.events.off('resume', onResume);
            this.input.off('pointerdown', launch);
        });
        this.depositHint = this.add.text(WORLD.centerX, 320, '', {
            fontFamily: 'Arial', fontSize: 19, fontStyle: 'bold', color: '#9ef5ff',
            backgroundColor: '#302e2b', align: 'center', padding: { x: 12, y: 8 }
        }).setOrigin(0.5, 1).setDepth(11).setVisible(false);
        this.updateHud();
        responsiveLayout(this, oldWidth => {
            this.displayedLives = -1;
            this.updateHud();
            for (const object of this.objects) {
                if (object.isMountedGem) continue;
                object.moveTo(65 + (object.x - 65) * (WORLD.width - 130) / (oldWidth - 130), object.y);
            }
            this.claw.resize(oldWidth);
        });
    }

    update(_time: number, delta: number): void {
        if (this.ended) return;
        const seconds = delta / 1000;
        // Small simulation steps keep movement and collisions stable across frame rates.
        let pending = seconds;
        while (pending > 0) {
            // At zero, only an already hooked catch may finish. No late launches or latches.
            if (this.round.finished && !this.claw.hasPendingCatch) break;
            const step = Math.min(pending, 1 / 120,
                this.round.remaining > 0 ? this.round.remaining : Infinity);
            for (const object of this.objects) object.update(step, this.objects);
            this.claw.update(step, this.objects);
            this.miner.update(step, this.claw.retrievalSpeed, this.claw.isHauling, this.claw.haulingWeight);
            this.round.update(step);
            pending -= step;
            if (this.autoFinishLevel && this.round.won) break;
        }
        this.updateHud();
        if ((this.autoFinishLevel && this.round.won)
            || (this.round.finished && !this.claw.hasPendingCatch)) this.finishLevel();
    }

    private showStreakCatch(object: Collectable, bonus: number): void {
        const streak = this.round.catchStreak;
        const intensity = Math.min(1, (streak - 3) / 9);
        const color = streak >= 10 ? '#ffad65' : '#ffe06a';
        const label = this.add.text(0, 0, `STREAK ${streak}!\n+$${bonus} ON DELIVERY`, {
            fontFamily: 'Arial', fontSize: 25 + Math.round(intensity * 5), fontStyle: 'bold',
            color, align: 'center', stroke: '#483126', strokeThickness: 5
        }).setOrigin(0.5).setDepth(14).setScale(0.55);
        // Keep feedback readable at the edges and above the bottom controls.
        const halfWidth = label.width * 1.15 / 2 + 16;
        label.setPosition(Math.max(halfWidth, Math.min(WORLD.width - halfWidth, object.x)),
            catchFeedbackY(object.y, object.radius));
        this.tweens.add({ targets: label, scale: 1, duration: 240, ease: 'Back.easeOut' });
        this.tweens.add({ targets: label, y: label.y - 35, alpha: 0, delay: 550,
            duration: 450, ease: 'Sine.easeOut', onComplete: () => label.destroy() });
        const burst = this.add.graphics().setPosition(object.x, object.y).setDepth(13);
        const radius = object.radius + 12;
        burst.lineStyle(3, 0xffdf65, 0.85).strokeCircle(0, 0, radius);
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            burst.lineStyle(3, i % 2 ? 0xffffff : 0xffc45c)
                .lineBetween(Math.cos(angle) * (radius + 5), Math.sin(angle) * (radius + 5),
                    Math.cos(angle) * (radius + 15), Math.sin(angle) * (radius + 15));
        }
        this.tweens.add({ targets: burst, scale: 1.4 + intensity * 0.3, alpha: 0,
            duration: 350, ease: 'Cubic.easeOut', onComplete: () => burst.destroy() });
    }

    private showCollectionValue(value: number, label = `+$${value}`): void {
        const popup = this.add.text(WORLD.centerX, 320, label, {
            fontFamily: 'Arial', fontSize: 28, fontStyle: 'bold', color: '#ffe06a',
            stroke: '#483126', strokeThickness: 4
        }).setOrigin(0.5, 0).setDepth(10);
        this.tweens.add({
            targets: popup, y: 290, alpha: 0, duration: 1100,
            ease: 'Sine.easeOut', onComplete: () => popup.destroy()
        });
    }

    private finishLevel(): void {
        if (this.ended) return;
        this.ended = true;
        this.round.remaining = 0;
        soundEffects.play(this.round.won ? 'win' : 'lose');
        const lives = this.round.won ? this.round.lives : Math.max(0, this.round.startingLives - 1);
        this.scene.start('UpgradeShop', {
            toolToggles: { ...this.toolToggles },
            lives,
            failed: !this.round.won,
            mine: this.round.mine,
            levelSeed: this.round.won ? undefined : this.levelSeed,
            bonuses: this.round.won ? this.round.nextBonuses : this.round.bonuses,
            dynamite: this.round.won ? this.round.dynamite : this.round.startingDynamite,
            level: this.round.won && !this.round.finalLevel ? this.round.level + 1 : this.round.level,
            money: this.round.retainedMoney,
            upgrades: this.round.upgrades,
            result: {
                toolToggles: { ...this.toolToggles },
                lives, mine: this.round.mine, levelSeed: this.levelSeed, bonuses: this.round.bonuses,
                dynamite: this.round.dynamite, startingDynamite: this.round.startingDynamite,
                upgrades: this.round.upgrades,
                money: this.round.retainedMoney, startingMoney: this.round.startingMoney,
                score: this.round.score, target: this.round.target, won: this.round.won,
                level: this.round.level, finalLevel: this.round.finalLevel
            }
        });
    }

    private updateHud(): void {
        if (this.displayedLives !== this.round.lives) {
            this.livesIcons.destroy();
            this.livesIcons = drawLives(this, this.statusX, 131, this.round.lives).setData('responsiveIgnore', true);
            this.displayedLives = this.round.lives;
        }
        const deposit = this.claw.hauledDeposit;
        this.depositHint.setVisible(deposit !== null);
        if (deposit) {
            this.depositHint.setText(this.round.dynamite > 0
                ? (deposit.depositIntegrity?.stage === 2
                    ? 'BREAKING APART! Hidden treasure is crumbling!\n↑ Blast now to save the remaining treasure!'
                    : deposit.depositIntegrity?.stage === 1
                        ? 'CRACKING! Gold is falling out!\n↑ Blast now to preserve the treasure.'
                        : 'INTACT — full reward\n↑ Blast now, or haul closer and risk losing treasure.')
                : 'Hidden treasure inside!\nNo dynamite left.');
            this.depositHint.setColor(deposit.depositIntegrity?.stage === 2 ? '#ff9390'
                : deposit.depositIntegrity?.stage === 1 ? '#ffe06a' : '#9ef5ff');
            const halfWidth = this.depositHint.width / 2 + 16;
            this.depositHint.setPosition(
                Math.max(halfWidth, Math.min(WORLD.width - halfWidth, deposit.x)),
                Math.max(320, deposit.y - deposit.radius - 14)
            );
        }
        const rewards = this.round.claimMilestones();
        if (rewards.length) {
            soundEffects.play('buy');
            const popup = this.add.text(WORLD.centerX, 305, `BONUS!  ${rewards.map(reward => reward.label).join('  •  ')}`, {
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
        this.streakVialText.setVisible(this.round.streakVialActive);
        this.streakVialText.setText(`STREAK BONUSES x${this.round.streakMultiplier}  ${this.round.streakVialSeconds > 0
            ? `${Math.ceil(this.round.streakVialSeconds)}s` : 'FULL LEVEL'}`);
        this.momentumText?.setText(`MOMENTUM: ${10 - this.round.momentumSecondsEarned}s left`);
        let buffY = 0;
        const buffTexts = [this.strengthText, this.goldRushText, ...this.passiveBuffTexts];
        for (const [index, text] of buffTexts.entries()) {
            const icon = this.buffIcons[index];
            icon.setVisible(text.visible);
            if (!text.visible) continue;
            text.setPosition(350, buffY);
            icon.setPosition(330, buffY + text.height / 2);
            buffY += text.height + 5;
        }
        this.streakText.setText(`CATCH STREAK  ${this.round.catchStreak}\nCurrent bonus: +$${this.round.currentStreakBonus}`);
        this.dynamiteInventory.update(this.round.dynamite);
        this.scoreText.setText(`$${this.round.money.toLocaleString('en-US')}`);
        this.scoreText.setScale(Math.min(1, 168 / this.scoreText.width));
        this.progressText.setY(this.round.won ? 12 : 20);
        this.progressText.setText(`LEVEL GOLD  $${this.round.score} / $${this.round.target}`);
        this.mineClock.update(this.round.remaining, this.round.finished && this.claw.hasPendingCatch);
    }

}
