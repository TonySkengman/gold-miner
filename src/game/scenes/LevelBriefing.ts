import type { ToolToggles } from '../state/Upgrades';
import { responsiveLayout } from '../ui/ResponsiveLayout';
import { WORLD } from '../state/World';
import { drawLives } from '../ui/LivesDisplay';
import { Scene } from 'phaser';
import { drawEnvironment } from '../art/drawEnvironment';
import { drawShopProduct } from '../art/drawShop';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';
import { LEVELS } from '../state/Levels';
import { MINES, mineConfig, roundDuration, type MineKind } from '../state/Mines';
import { LAYOUTS } from '../state/Layouts';
import { milestonesFor } from '../state/Milestones';
import { LevelBonuses, ShopItemKind, Upgrades, emptyBonuses, timeVialSeconds, momentumSecondsPerCatch, luckVialDuration, safetyGripLaunchMultiplier } from '../state/Upgrades';
import { menuButton, RUN_START_Y } from '../ui/menuButton';

interface BriefingData {
    toolToggles?: ToolToggles;
    mine?: MineKind;
    lives?: number;
    level?: number;
    money?: number;
    accumulatedGold?: number;
    upgrades?: Upgrades;
    dynamite?: number;
    bonuses?: LevelBonuses;
    levelSeed?: number;
}

export class LevelBriefing extends Scene {
    constructor() { super('LevelBriefing'); }

    create(data: BriefingData = {}): void {
        const level = Number.isInteger(data.level) ? Math.max(1, Math.min(LEVELS.length, data.level!)) : 1;
        const config = mineConfig(level, data.mine);
        const layout = LAYOUTS[config.layout];
        const bonuses = { ...emptyBonuses(), ...data.bonuses };
        drawEnvironment(this, config.layout, data.mine);
        this.add.rectangle(WORLD.centerX, 495, 840, 860, 0x211f1d, 0.97).setStrokeStyle(4, 0xc29659);
        const text = (y: number, label: string, size = 22, color = '#fff3cc') =>
            this.add.text(WORLD.centerX, y, label, {
                fontFamily: 'Arial', fontSize: size, color, align: 'center',
                wordWrap: { width: 740 }, lineSpacing: 8
            }).setOrigin(0.5);

        text(131, `LEVEL ${level} / ${LEVELS.length}`, 26, '#e5c58f');
        drawLives(this, WORLD.centerX + 288, 131, data.lives ?? 3);
        text(186, `${MINES[data.mine ?? 'quarry'].name} — ${layout.name}`.toUpperCase(), 30, '#ffda69').setFontStyle('bold');
        text(257, 'GOLD TARGET', 21, '#e5c58f');
        text(312, `$${config.target}`, 64, '#ffda69').setFontStyle('bold');
        text(375, `Collect $${config.target} this round to pass. Starting money does not count.`, 20);
        text(416, `${roundDuration(data.mine, bonuses.extraTime, data.upgrades?.vialBelt ?? 0)} SECONDS`, 25, '#bcf58b');
        text(450, `${layout.hint}\nBlast gem-studded rocks early. Aim for exposed gems to leave their rocks behind.`, 19).setOrigin(0.5, 0);

        const prepared: { kind: ShopItemKind; name: string; detail: string }[] = [];
        const dynamite = data.dynamite ?? 3;
        if (dynamite > 0) prepared.push({ kind: 'dynamite', name: 'Dynamite', detail: `${dynamite} sticks available` });
        if ((data.upgrades?.blastPowder ?? 0) > 0) prepared.push({ kind: 'blastPowder', name: 'Blast Powder', detail: `Tier ${data.upgrades!.blastPowder} • ${data.toolToggles?.blastPowder === true ? 'ON' : 'OFF'}\n← / click: toggle` });
        if ((data.upgrades?.safetyGrip ?? 0) > 0) prepared.push({ kind: 'safetyGrip', name: 'Safety Grip', detail: `${data.toolToggles?.safetyGrip === true ? `ON • −${Math.round((1 - safetyGripLaunchMultiplier(data.upgrades!.safetyGrip)) * 100)}% launch` : 'OFF'}\n→ before launch` });
        if (bonuses.luck > 0) prepared.push({ kind: 'luck', name: 'Luck vial', detail: `Richer bags & chests\n${luckVialDuration(data.upgrades?.vialBelt ?? 0)} seconds` });
        if (bonuses.momentum > 0) prepared.push({ kind: 'momentum', name: 'Momentum vial', detail: `+${momentumSecondsPerCatch(data.upgrades?.vialBelt ?? 0)}s per perfect\n5 charges` });
        if (bonuses.extraTime > 0) prepared.push({ kind: 'extraTime', name: 'Time vial', detail: `+${timeVialSeconds(data.upgrades?.vialBelt ?? 0)} seconds` });
        if (bonuses.lightweightGrip > 0) prepared.push({ kind: 'lightweightGrip', name: 'Lightweight Grip', detail: 'Rock weight\n-40%' });
        if (bonuses.streakVial > 0) prepared.push({ kind: 'streakVial', name: 'Streak vial', detail: 'Streak bonuses x1.5' });
        if (bonuses.strengthPotion > 0) prepared.push({ kind: 'strengthPotion', name: 'Strength vial', detail: `${2 + (data.upgrades?.vialBelt ?? 0)} catches at x2` });
        if (bonuses.goldRush > 0) prepared.push({ kind: 'goldRush', name: 'Gold Rush vial', detail: `${2 + (data.upgrades?.vialBelt ?? 0)} gold catches +50%` });
        text(533, 'PREPARED FOR THIS ROUND', 20, '#e5c58f');
        const cardTop = 558;
        const wrapped = prepared.length > 5;
        const columns = Math.max(1, Math.min(5, prepared.length));
        const cardHeight = wrapped ? 96 : 136;
        const spacing = Math.min(190, 760 / columns);
        
        prepared.forEach((item, index) => {
            const row = Math.floor(index / columns);
            const rowCount = Math.min(columns, prepared.length - row * columns);
            const x = WORLD.centerX + (index % columns - (rowCount - 1) / 2) * spacing;
            const top = cardTop + row * (cardHeight + 8);
            this.add.rectangle(x, top + cardHeight / 2, spacing - 14, cardHeight, 0x3c3329).setStrokeStyle(1, 0x8e603c);
            this.add.text(x, top + (wrapped ? 6 : 18), item.name, {
                fontFamily: 'Arial', fontSize: wrapped ? 14 : 18, fontStyle: 'bold', color: '#ffda69', align: 'center', wordWrap: { width: spacing - 20 }
            }).setOrigin(0.5, wrapped ? 0 : 0.5);
            drawShopProduct(this, x, top + (wrapped ? 40 : 59), item.kind, wrapped ? 0.3 : 0.4);
            this.add.text(x, top + (wrapped ? 64 : 106), item.detail, {
                fontFamily: 'Arial', fontSize: wrapped ? 12 : 16, color: '#bcf58b', align: 'center', lineSpacing: 2, wordWrap: { width: spacing - 20 }
            }).setOrigin(0.5, wrapped ? 0 : 0.5);
        });
        if (prepared.length === 0) text(626, 'Nothing prepared for this round.', 22, '#c7bba6');
        text(wrapped ? 790 : 754, 'KEEP MINING FOR BONUSES', 20, '#e5c58f');
        text(wrapped ? 816 : 786, milestonesFor(config.target, level).map(m => `$${Math.ceil(config.target * m.fraction)}: ${m.label}`).join('   •   '), 20, '#ffda69');

        let starting = false;
        let confirmingEndRun = false;
        menuButton(this, WORLD.centerX, RUN_START_Y, 'START MINING', () => {
            if (starting || confirmingEndRun) return;
            starting = true;
            soundEffects.unlock();
            this.scene.start('Game', { ...data, level });
        });
        if (level > 1) {
            const backToShop = menuButton(this, WORLD.centerX + 285, RUN_START_Y, 'BACK TO SHOP', () => {
                if (starting || confirmingEndRun) return;
                starting = true;
                soundEffects.unlock();
                this.scene.start('UpgradeShop', {
                    ...data, level, lives: data.lives ?? 3, money: data.money ?? 0,
                    dynamite: data.dynamite ?? 3, returningFromBriefing: true
                });
            });
            backToShop.setFontSize(20).setPadding(20, 12).setBackgroundColor('#594534');
            backToShop.removeAllListeners('pointerover');
            backToShop.removeAllListeners('pointerout');
            backToShop.on('pointerover', () => backToShop.setBackgroundColor('#705840'));
            backToShop.on('pointerout', () => backToShop.setBackgroundColor('#594534'));
        }
        const endRun = menuButton(this, WORLD.centerX - 285, RUN_START_Y, 'END RUN', () => {
            if (!starting) showEndConfirmation(true);
        });
        endRun.setFontSize(20).setPadding(20, 12).setBackgroundColor('#8e493c');
        endRun.removeAllListeners('pointerover');
        endRun.removeAllListeners('pointerout');
        endRun.on('pointerover', () => endRun.setBackgroundColor('#a95a49'));
        endRun.on('pointerout', () => endRun.setBackgroundColor('#8e493c'));

        const shade = this.add.rectangle(WORLD.centerX, 480, WORLD.width, WORLD.height, 0x11151a, 0.82)
            .setData('responsiveFullWidth', true).setInteractive();
        const panel = this.add.rectangle(WORLD.centerX, 480, 680, 300, 0x211f1d)
            .setStrokeStyle(4, 0xc29659);
        const heading = text(393, 'END THIS RUN?', 32, '#ffda69');
        const warning = text(468, 'Your progress in this run will be lost.\nReturn to the main menu?', 22);
        const cancel = menuButton(this, WORLD.centerX - 150, 563, 'KEEP PLAYING', () => showEndConfirmation(false));
        const confirm = menuButton(this, WORLD.centerX + 150, 563, 'END RUN', () => {
            if (!confirmingEndRun || starting) return;
            starting = true;
            this.scene.start('MainMenu');
        });
        confirm.setBackgroundColor('#8e493c');
        confirm.removeAllListeners('pointerover');
        confirm.removeAllListeners('pointerout');
        confirm.on('pointerover', () => confirm.setBackgroundColor('#a95a49'));
        confirm.on('pointerout', () => confirm.setBackgroundColor('#8e493c'));
        const confirmation = [shade, panel, heading, warning, cancel, confirm];
        confirmation.forEach((item, index) => item.setDepth(100 + index).setVisible(false));
        const showEndConfirmation = (visible: boolean) => {
            if (starting) return;
            confirmingEndRun = visible;
            confirmation.forEach(item => item.setVisible(visible));
        };
        const closeConfirmation = () => showEndConfirmation(false);
        this.input.keyboard?.on('keydown-ESC', closeConfirmation);
        this.events.once('shutdown', () => this.input.keyboard?.off('keydown-ESC', closeConfirmation));
        addSoundButton(this, 32, 24);
        responsiveLayout(this);
    }
}
