import { Scene } from 'phaser';
import { LEVELS } from '../state/Levels';
import { newLevelSeed } from '../state/Random';
import { MINES, type MineKind } from '../state/Mines';
import { emptyUpgrades, emptyBonuses, type Upgrades, type LevelBonuses } from '../state/Upgrades';
import { WORLD } from '../state/World';
import { responsiveLayout } from '../ui/ResponsiveLayout';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';

interface MineSelectionData {
    levelSeed?: number;
    level: number; money: number; lives: number; upgrades?: Upgrades;
    dynamite: number; bonuses?: LevelBonuses;
}

export class MineSelection extends Scene {
    constructor() { super('MineSelection'); }

    private drawCaveBackground(): void {
        const g = this.add.graphics().setData('responsiveAnchor', 'center');
        const draw = () => {
            const w = WORLD.width;
            const cx = WORLD.centerX;
            g.clear();
            g.fillStyle(0x222720).fillRect(0, 0, w, WORLD.height);
            // Broad warm light reveals rock texture instead of an empty black interior.
            for (let radius = 560; radius > 100; radius -= 70) {
                g.fillStyle(0xe7b65e, 0.01).fillEllipse(cx, 510, radius * 2, radius * 1.4);
            }
            for (let row = 0; row < 7; row++) {
                g.lineStyle(2, 0x79715a, 0.1).beginPath()
                    .moveTo(110, 180 + row * 100).lineTo(w * 0.3, 157 + row * 100)
                    .lineTo(w * 0.65, 186 + row * 100).lineTo(w - 110, 169 + row * 100).strokePath();
            }
            g.fillStyle(0x2b2921).fillRect(0, 835, w, 125);
            // Treasure light shines out from the large cave behind the mode cards.
            // Pools extend into the visible gaps and edges without washing out the rock frame.
            const treasureLights = [
                { x: cx - 480, y: 580, color: 0xf4bd43 },
                { x: cx, y: 420, color: 0x54c5f4 },
                { x: cx - 187, y: 640, color: 0x54c5f4 },
                { x: cx + 187, y: 640, color: 0x54c5f4 },
                { x: cx + 480, y: 580, color: 0xb565e8 }
            ];
            for (const light of treasureLights) {
                for (let ring = 12; ring >= 1; ring--) {
                    const radius = ring * 27;
                    g.fillStyle(light.color, 0.018 + (12 - ring) * 0.001)
                        .fillEllipse(light.x, light.y, radius * 2, radius * 2.2);
                }
                // Reflections along the cave floor make the sources feel inside the tunnel.
                for (let ring = 7; ring >= 1; ring--) {
                    g.fillStyle(light.color, 0.025).fillEllipse(light.x, 851, ring * 58, ring * 10);
                }
            }
            // Layered rock walls frame the entrance to a timber-supported mine.
            for (let layer = 0; layer < 3; layer++) {
                const edge = 110 - layer * 32;
                g.fillStyle([0x252d29, 0x30372e, 0x3b3e31][layer]);
                for (const side of [-1, 1]) {
                    const wallX = side < 0 ? 0 : w;
                    g.beginPath().moveTo(wallX, 0);
                    for (let row = 0; row <= 10; row++) {
                        const inset = edge + 25 * Math.sin(row * 2.3 + layer);
                        g.lineTo(side < 0 ? inset : w - inset, row * 96);
                    }
                    g.lineTo(wallX, WORLD.height).closePath().fillPath();
                }
            }
            g.fillStyle(0x30342b).beginPath().moveTo(0, 0).lineTo(w, 0)
                .lineTo(w, 65).lineTo(w * 0.78, 42).lineTo(w * 0.6, 75)
                .lineTo(w * 0.4, 58).lineTo(w * 0.2, 85).lineTo(0, 60).closePath().fillPath();
            // Perspective rails disappear into the darkness behind the cards.
            for (const side of [-1, 1]) {
                g.lineStyle(6, 0x53574c).lineBetween(cx + side * 65, 700, cx + side * 330, 960);
            }
            for (let i = 0; i < 6; i++) {
                const y = 842 + i * 24;
                const spread = 65 + (y - 700) * 1.02;
                g.lineStyle(8, 0x483c2c).lineBetween(cx - spread, y, cx + spread, y);
            }
            for (const side of [-1, 1]) {
                const x = side < 0 ? 105 : w - 105;
                g.fillStyle(0x493823).fillRect(x - 16, 78, 32, 760);
                g.fillStyle(0x6b5132).fillRect(x - 12, 78, 7, 760);
                g.lineStyle(3, 0x292720).lineBetween(x - 20, 137, x + 20, 137)
                    .lineBetween(x - 20, 735, x + 20, 735);
                g.lineStyle(4, 0x777361).lineBetween(x, 105, x, 258);
                // Soft amber lantern light, kept to the margins for readable cards.
                for (let radius = 140; radius >= 40; radius -= 20) {
                    g.fillStyle(0xffba55, 0.018).fillCircle(x, 286, radius);
                }
                g.fillStyle(0x292b25).fillRoundedRect(x - 20, 258, 40, 55, 5);
                g.fillStyle(0xffd27b).fillRoundedRect(x - 13, 265, 26, 39, 3);
                g.fillStyle(0xffedb2).fillRect(x - 5, 268, 10, 32);
                g.lineStyle(4, 0x64543a).strokeRoundedRect(x - 19, 258, 38, 55, 4)
                    .lineBetween(x - 19, 286, x + 19, 286);
            }
            g.fillStyle(0x5c452d).fillRect(77, 77, Math.max(0, w - 154), 22);
            g.fillStyle(0x8b693d).fillRect(77, 77, Math.max(0, w - 154), 5);
            // Sparse mineral seams and rubble tie the backdrop to the playable caves.
            for (let i = 0; i < 16; i++) {
                const x = (i * 173 + 31) % w;
                const y = 914 + (i % 3) * 16;
                g.fillStyle(i % 3 === 0 ? 0x61563a : 0x414337)
                    .fillEllipse(x, y, 18 + i % 4 * 8, 10 + i % 3 * 5);
            }
            g.lineStyle(3, 0x8d7848, 0.55).beginPath().moveTo(24, 440)
                .lineTo(42, 458).lineTo(30, 480).lineTo(52, 497).strokePath();
            g.lineStyle(3, 0x688e94, 0.5).beginPath().moveTo(w - 30, 530)
                .lineTo(w - 49, 552).lineTo(w - 35, 576).strokePath();
        };
        g.setData('responsiveRedraw', draw);
        draw();
    }

    create(data: MineSelectionData): void {
        const prepared = { ...data, levelSeed: data.levelSeed ?? newLevelSeed(), upgrades: { ...emptyUpgrades(), ...data.upgrades }, bonuses: { ...emptyBonuses(), ...data.bonuses } };
        this.cameras.main.setBackgroundColor(0x252a25);
        this.drawCaveBackground();
        addSoundButton(this, 32, 16);
        const label = (x: number, y: number, value: string, size = 22, color = '#fff3cc', width = 250) =>
            this.add.text(x, y, value, { fontFamily: 'Arial', fontSize: size, color, align: 'center', wordWrap: { width }, lineSpacing: 8 })
                .setOrigin(0.5).setData('responsiveAnchor', 'center');
        label(WORLD.centerX, 105, 'CHOOSE YOUR GAME MODE', 32, '#ffda69', 900).setFontStyle('bold');
        label(WORLD.centerX, 169, 'Choose once for this run.', 20, '#e5c58f', 900);
        let entering = false;
        const modeOrder: MineKind[] = ['goldBasin', 'quarry', 'gemHollow'];
        modeOrder.forEach((kind, index) => {
            const mine = MINES[kind];
            const standard = kind === 'quarry';
            const x = WORLD.centerX + (index - 1) * 338;
            this.add.rectangle(x, 516, standard ? 350 : 278, standard ? 636 : 576,
                kind === 'gemHollow' ? 0x2a2b45 : kind === 'goldBasin' ? 0x493821 : 0x493d2d)
                .setStrokeStyle(standard ? 4 : 2, standard ? 0xffda69 : mine.color)
                .setData('responsiveAnchor', 'center');
            if (standard) {
                const glow = this.add.rectangle(x, 226, 382, 76, 0xffcf54, 0.12)
                    .setData('responsiveAnchor', 'center');
                this.tweens.add({ targets: glow, alpha: 0.45, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
                const ribbon = this.add.graphics().setPosition(x, 226).setData('responsiveAnchor', 'center');
                // Folded ends and a raised, framed face give the featured mode a real ribbon.
                ribbon.fillStyle(0x8a4f21).fillTriangle(-187, -23, -159, -23, -159, 40)
                    .fillTriangle(187, -23, 159, -23, 159, 40);
                ribbon.fillStyle(0x211b13, 0.6).fillRoundedRect(-181, -27, 366, 64, 6);
                ribbon.fillStyle(0xb77a27).fillRoundedRect(-183, -32, 366, 64, 5);
                ribbon.fillStyle(0xffd267).fillRoundedRect(-180, -30, 360, 58, 4);
                ribbon.lineStyle(2, 0xfff0b3).strokeRoundedRect(-175, -25, 350, 48, 3);
                ribbon.lineStyle(2, 0xd7a044).lineBetween(-173, 21, 173, 21);
                for (const side of [-1, 1]) {
                    const starX = side * 153;
                    ribbon.fillStyle(0x80521e).beginPath();
                    for (let point = 0; point < 10; point++) {
                        const angle = -Math.PI / 2 + point * Math.PI / 5;
                        const radius = point % 2 ? 5 : 11;
                        const px = starX + Math.cos(angle) * radius;
                        const py = -6 + Math.sin(angle) * radius;
                        if (point === 0) ribbon.moveTo(px, py);
                        else ribbon.lineTo(px, py);
                    }
                    ribbon.closePath().fillPath();
                }
                label(x, 219, 'STANDARD MODE', 25, '#3b2918', 290).setFontStyle('bold');
                label(x, 241, 'RECOMMENDED FIRST RUN', 11, '#705026', 290).setFontStyle('bold');
            } else {
                label(x, 246, 'ALTERNATIVE MODE', 13, '#d2c5ad').setFontStyle('bold');
            }
            label(x, 285, mine.name, standard ? 32 : 27, '#ffda69', standard ? 326 : 250).setFontStyle('bold');
            label(x, 315, mine.playstyle, 13, '#bcf58b').setFontStyle('bold');
            const g = this.add.graphics().setPosition(x, standard ? 413 : 403).setData('responsiveAnchor', 'center');
            if (standard) g.setScale(1.12);
            g.fillStyle(kind === 'gemHollow' ? 0x525579 : kind === 'goldBasin' ? 0x9a793e : 0x746351).fillRoundedRect(-92, -66, 184, 132, 53);
            g.fillStyle(kind === 'gemHollow' ? 0x1d2440 : 0x20251d).fillRoundedRect(-67, -48, 134, 114, 42);
            if (standard) {
            // Small, softly lit treasures sit fully inside the dark tunnel opening.
            g.fillStyle(0xffca57, 0.07).fillEllipse(0, 36, 100, 48);
            for (const [px, py] of [[-42, 43], [-29, 51]]) {
                g.fillStyle(0xdca333).fillEllipse(px, py, 23, 15);
                g.fillStyle(0xffdf83).fillEllipse(px - 3, py - 3, 12, 5);
            }
            for (const [px, py, color, highlight] of [[28, 29, 0x62c8e3, 0xd2faff], [48, 44, 0xd74770, 0xffb0c6]]) {
                g.fillStyle(color, 0.1).fillCircle(px, py, 15);
                g.fillStyle(color).fillTriangle(px - 9, py - 3, px + 9, py - 3, px, py + 12);
                g.fillStyle(highlight).fillTriangle(px - 9, py - 3, px, py - 10, px + 9, py - 3);
            }
            for (const [px, py] of [[-43, 33], [30, 14], [49, 31]]) {
                g.lineStyle(2, 0xfff1c0, 0.85).lineBetween(px - 4, py, px + 4, py)
                    .lineBetween(px, py - 5, px, py + 5);
            }
            }
            if (kind === 'gemHollow') {
                for (const side of [-1, 1]) {
                    g.fillStyle(0x77d7e7, 0.12).fillCircle(side * 62, 4, 46);
                    g.fillStyle(0x79cbdc).fillTriangle(side * 74, -40, side * 45, -9, side * 76, 12);
                    g.fillStyle(0xad83dc).fillTriangle(side * 69, 66, side * 43, 15, side * 31, 66);
                    g.lineStyle(2, 0xdcecff, 0.6).lineBetween(side * 69, 61, side * 43, 15);
                }
                g.fillStyle(0x8074b0).fillTriangle(-15, -56, 5, -56, -3, -16);
                // Large cut gems make the mine's reward immediately recognizable.
                for (const [px, py, size, ruby] of [[-24, 11, 29, false], [25, 30, 27, true], [-6, 49, 16, false]] as const) {
                    g.fillStyle(ruby ? 0xe94c83 : 0x66dbf2, 0.12).fillCircle(px, py, size * 1.5);
                    g.fillStyle(ruby ? 0xc32c63 : 0x39a8d7).lineStyle(2, ruby ? 0xff98b4 : 0xc0f5ff)
                        .beginPath().moveTo(px - size, py - 3).lineTo(px - size * 0.5, py - size * 0.65)
                        .lineTo(px + size * 0.5, py - size * 0.65).lineTo(px + size, py - 3)
                        .lineTo(px, py + size).closePath().fillPath().strokePath();
                    g.fillStyle(ruby ? 0xffb4cf : 0xe3ffff)
                        .fillTriangle(px - size, py - 3, px, py - size * 0.65, px, py + size);
                    g.lineStyle(2, ruby ? 0xff83ae : 0x8be6ff).lineBetween(px - size, py - 3, px + size, py - 3);
                    g.lineStyle(2, 0xffffff).lineBetween(px + size - 4, py - size, px + size + 4, py - size)
                        .lineBetween(px + size, py - size - 4, px + size, py - size + 4);
                }
            } else {
                g.lineStyle(10, 0x9d7041).lineBetween(-75, 65, -75, -55).lineBetween(75, 65, 75, -55).lineBetween(-86, -55, 86, -55);
                g.lineStyle(4, 0x665746).lineBetween(-40, 66, -16, 13).lineBetween(40, 66, 16, 13);
                if (kind === 'goldBasin') {
                    g.lineStyle(4, 0xe9bd5f).beginPath().moveTo(-88, -20).lineTo(-69, -3).lineTo(-89, 21).strokePath();
                    g.fillStyle(0xffca57, 0.12).fillCircle(0, 15, 50);
                    // A mound of oversized, angular nuggets emphasizes heavy gold hauls.
                    for (const [px, py, size] of [[-35, 37, 23], [28, 40, 29], [-3, 9, 36], [-6, 52, 22]]) {
                        g.fillStyle(0xe9b540).lineStyle(2, 0x9d661c).beginPath()
                            .moveTo(px - size, py + 4).lineTo(px - size * 0.7, py - size * 0.6)
                            .lineTo(px, py - size * 0.85).lineTo(px + size * 0.8, py - size * 0.4)
                            .lineTo(px + size, py + size * 0.4).lineTo(px + size * 0.3, py + size * 0.7)
                            .lineTo(px - size * 0.7, py + size * 0.6).closePath().fillPath().strokePath();
                        g.fillStyle(0xffe18a).fillTriangle(px - size * 0.7, py - size * 0.6,
                            px, py - size * 0.85, px - size * 0.3, py + size * 0.4);
                        g.fillStyle(0xffcb42).fillTriangle(px, py - size * 0.85,
                            px + size * 0.8, py - size * 0.4, px + size * 0.3, py + size * 0.7);
                    }
                    for (const [px, py] of [[-35, 8], [23, -24], [47, 18]]) {
                        g.lineStyle(3, 0xfff1b8).lineBetween(px - 5, py, px + 5, py)
                            .lineBetween(px, py - 7, px, py + 7);
                    }
                } else {
                    // A warm treasure-filled entrance reflects the standard mode's varied loot.
                    g.fillStyle(0xffcf65, 0.1).fillCircle(0, 20, 46);
                    g.fillStyle(0x090e0c, 0.5).fillEllipse(0, 56, 112, 22);
                    g.fillStyle(0x56321d).fillRoundedRect(-29, 13, 58, 43, 5);
                    g.fillStyle(0xa56730).fillRoundedRect(-29, 13, 58, 21, 5);
                    g.fillStyle(0x78451f).fillRect(-27, 35, 54, 19);
                    g.lineStyle(2, 0xe6b957).strokeRoundedRect(-29, 13, 58, 43, 5);
                    g.fillStyle(0xd7a649).fillRect(-20, 14, 5, 41).fillRect(15, 14, 5, 41);
                    g.lineStyle(2, 0x452818).lineBetween(-28, 34, 28, 34);
                    g.fillStyle(0xffdc79).fillRoundedRect(-5, 29, 10, 13, 2);
                    g.fillStyle(0x56321d).fillCircle(0, 34, 2);
                    g.fillStyle(0xe6ad34).fillEllipse(-48, 51, 27, 19).fillEllipse(-35, 61, 24, 15);
                    g.fillStyle(0xffdc73).fillEllipse(-51, 47, 15, 8);
                    g.fillStyle(0x58c4e6).fillTriangle(36, 44, 55, 44, 45, 64);
                    g.fillStyle(0xc4f5ff).fillTriangle(36, 44, 45, 36, 55, 44);
                    g.fillStyle(0xb63e65).fillTriangle(49, 61, 66, 61, 58, 74);
                    g.fillStyle(0xff8ca8).fillTriangle(49, 61, 57, 53, 66, 61);
                    g.lineStyle(2, 0xffe7a1).lineBetween(-42, 24, -42, 34).lineBetween(-47, 29, -37, 29);
                    g.lineStyle(2, 0xd9faff).lineBetween(48, 9, 48, 19).lineBetween(43, 14, 53, 14);
                }
            }
            for (const side of [-1, 1]) {
                g.fillStyle(mine.color);
                if (kind === 'gemHollow') g.fillTriangle(side * 94, 39, side * 113, 64, side * 74, 64);
                else {
                    g.fillEllipse(side * 91, 57, 38, 27);
                    if (standard) {
                        g.fillStyle(0xffda69).fillEllipse(side * 94, 52, 20, 10);
                    }
                }
            }
            label(x, standard ? 573 : 549, mine.description, standard ? 20 : 18, '#fff3cc', standard ? 294 : 250);
            label(x, 674, mine.subtext, standard ? 16 : 15, '#e5c58f', standard ? 286 : 238);
            const button = this.add.text(x, 765, 'START RUN', {
                fontFamily: 'Arial', fontSize: standard ? 25 : 22, fontStyle: 'bold', color: standard ? '#302719' : '#ffffff',
                backgroundColor: standard ? '#ffda69' : '#547f3b', padding: { x: standard ? 30 : 18, y: 15 }
            }).setOrigin(0.5).setData('responsiveAnchor', 'center');
            button.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
                if (entering) return;
                entering = true;
                soundEffects.unlock();
                this.scene.start('LevelBriefing', { ...prepared, mine: kind });
            });
        });
        label(WORLD.centerX, 870, `Your mode lasts for the full ${LEVELS.length}-level run, including retries.`, 20, '#e5c58f', 900);
        responsiveLayout(this);
    }
}
