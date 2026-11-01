import { Scene } from 'phaser';
import { MINES, mineConfig, type MineKind } from '../state/Mines';
import type { Upgrades, LevelBonuses } from '../state/Upgrades';
import { WORLD } from '../state/World';
import { responsiveLayout } from '../ui/ResponsiveLayout';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';

interface MineSelectionData {
    level: number; money: number; lives: number; upgrades: Upgrades;
    dynamite: number; bonuses: LevelBonuses;
}

export class MineSelection extends Scene {
    constructor() { super('MineSelection'); }

    create(data: MineSelectionData): void {
        this.cameras.main.setBackgroundColor(0x252a25);
        addSoundButton(this, 32, 16);
        const label = (x: number, y: number, value: string, size = 22, color = '#fff3cc', width = 250) =>
            this.add.text(x, y, value, { fontFamily: 'Arial', fontSize: size, color, align: 'center', wordWrap: { width }, lineSpacing: 8 })
                .setOrigin(0.5).setData('responsiveAnchor', 'center');
        label(WORLD.centerX, 105, `CHOOSE YOUR NEXT MINE — LEVEL ${data.level}`, 32, '#ffda69', 900).setFontStyle('bold');
        label(WORLD.centerX, 169, `MONEY $${data.money} • Entry is paid once. Retries keep your mine and layout.`, 20, '#e5c58f', 900);
        let entering = false;
        (Object.keys(MINES) as MineKind[]).forEach((kind, index) => {
            const mine = MINES[kind];
            const x = WORLD.centerX + (index - 1) * 294;
            const affordable = data.money >= mine.fee;
            this.add.rectangle(x, 498, 278, 556, kind === 'gemHollow' ? 0x2a2b45 : kind === 'goldBasin' ? 0x493821 : 0x3c3329).setStrokeStyle(3, mine.color).setData('responsiveAnchor', 'center');
            label(x, 261, mine.name, 27, '#ffda69').setFontStyle('bold');
            const g = this.add.graphics().setPosition(x, 367).setData('responsiveAnchor', 'center');
            g.fillStyle(kind === 'gemHollow' ? 0x525579 : kind === 'goldBasin' ? 0x9a793e : 0x746351).fillRoundedRect(-92, -66, 184, 132, 53);
            g.fillStyle(kind === 'gemHollow' ? 0x151b38 : 0x111816).fillRoundedRect(-67, -48, 134, 114, 42);
            if (kind === 'gemHollow') {
                for (const side of [-1, 1]) {
                    g.fillStyle(0x77d7e7, 0.12).fillCircle(side * 62, 4, 46);
                    g.fillStyle(0x79cbdc).fillTriangle(side * 74, -40, side * 45, -9, side * 76, 12);
                    g.fillStyle(0xad83dc).fillTriangle(side * 69, 66, side * 43, 15, side * 31, 66);
                    g.lineStyle(2, 0xdcecff, 0.6).lineBetween(side * 69, 61, side * 43, 15);
                }
                g.fillStyle(0x8074b0).fillTriangle(-15, -56, 5, -56, -3, -16);
            } else {
                g.lineStyle(10, 0x9d7041).lineBetween(-75, 65, -75, -55).lineBetween(75, 65, 75, -55).lineBetween(-86, -55, 86, -55);
                g.lineStyle(4, 0x665746).lineBetween(-40, 66, -16, 13).lineBetween(40, 66, 16, 13);
                if (kind === 'goldBasin') {
                    g.lineStyle(4, 0xe9bd5f).beginPath().moveTo(-88, -20).lineTo(-69, -3).lineTo(-89, 21).strokePath();
                    g.fillStyle(0xffca57, 0.12).fillCircle(0, 15, 50);
                    g.fillStyle(0xe9b540).fillEllipse(-20, 46, 35, 25).fillEllipse(20, 53, 42, 28);
                } else {
                    g.fillStyle(0x88857b).fillEllipse(-28, 52, 46, 23).fillEllipse(23, 59, 33, 17);
                }
            }
            for (const side of [-1, 1]) {
                g.fillStyle(mine.color);
                if (kind === 'gemHollow') g.fillTriangle(side * 94, 39, side * 113, 64, side * 74, 64);
                else g.fillEllipse(side * 91, 57, 38, 27);
            }
            label(x, 477, `TARGET $${mineConfig(data.level, kind).target}`, 27, '#bcf58b').setFontStyle('bold');
            label(x, 547, mine.description, 19);
            label(x, 629, mine.detail, 17, '#e5c58f');
            const button = this.add.text(x, 715, mine.fee ? `ENTER — $${mine.fee}` : 'ENTER — FREE', {
                fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#ffffff',
                backgroundColor: affordable ? '#547f3b' : '#827968', padding: { x: 18, y: 15 }
            }).setOrigin(0.5).setData('responsiveAnchor', 'center');
            if (affordable) button.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
                if (entering) return;
                entering = true;
                soundEffects.unlock();
                soundEffects.play('buy');
                this.scene.start('LevelBriefing', { ...data, mine: kind, money: data.money - mine.fee });
            });
            else label(x, 756, 'Not enough money', 15, '#f3a790');
        });
        label(WORLD.centerX, 840, 'Paid routes add treasure and raise the target. Your starting money never counts toward it.', 20, '#e5c58f', 900);
        responsiveLayout(this);
    }
}
