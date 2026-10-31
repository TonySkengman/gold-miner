import { LayoutKind, RAT_LANE_Y } from '../state/Layouts';
import { WORLD } from '../state/World';
import { Scene } from 'phaser';

/** Original vector scenery, drawn once so the playfield stays inexpensive. */
export function drawEnvironment(scene: Scene, layout?: LayoutKind): void {
    const g = scene.add.graphics();
    const draw = () => {
    g.clear();
    // Enclosed stone chamber, with a darker shaft descending below the miner.
    g.fillStyle(0x252b32).fillRect(0, 0, WORLD.width, WORLD.height);
    g.fillStyle(0x343b42).fillEllipse(WORLD.centerX, 230, 810, 370);
    g.fillStyle(0x171d24).fillEllipse(WORLD.centerX, 212, 260, 245);
    g.fillStyle(0x645344).fillRect(0, WORLD.groundY, WORLD.width, WORLD.height - WORLD.groundY);
    g.fillStyle(0x584b40).fillRect(0, 430, WORLD.width, 220);
    g.fillStyle(0x4b423c).fillRect(0, 650, WORLD.width, 150);
    g.fillStyle(0x3e3936).fillRect(0, 800, WORLD.width, 160);
    g.lineStyle(2, 0x9c8060, 0.3);
    for (let row = 0; row < 4; row++) {
        const y = 345 + row * 150;
        for (let x = 50; x < WORLD.width - 34; x += 155) {
            g.beginPath().moveTo(x, y).lineTo(x + 32, y - 9).lineTo(x + 69, y + 7).lineTo(x + 103, y + 2).strokePath();
        }
    }
    for (let i = 0; i < Math.ceil(WORLD.width / 6); i++) {
        const x = 42 + (i * 137) % (WORLD.width - 84);
        const y = 275 + (i * 73) % 630;
        g.fillStyle(i % 3 ? 0x2c2c2c : 0x9e8464, 0.45).fillEllipse(x, y, i % 3 + 3, 3);
    }
    if (layout === 'ratTunnels') {
        g.fillStyle(0x302e2c).fillRoundedRect(46, RAT_LANE_Y - 32, WORLD.width - 92, 64, 25);
        g.lineStyle(2, 0x78634e).lineBetween(65, RAT_LANE_Y + 32, WORLD.width - 65, RAT_LANE_Y + 32);
    } else if (layout === 'goldPocket') {
        g.fillStyle(0xd3a34c, 0.08).fillEllipse(WORLD.centerX, 665, 560, 400);
    } else if (layout === 'deepMine') {
        g.fillStyle(0x171d24, 0.2).fillRect(40, 720, WORLD.width - 80, 190);
    } else if (layout === 'explosiveCavern') {
        g.lineStyle(2, 0xb06d45, 0.4);
        for (let x = 90; x < WORLD.width - 64; x += 170) {
            g.beginPath().moveTo(x, 730).lineTo(x + 25, 765).lineTo(x + 5, 790).lineTo(x + 30, 820).strokePath();
        }
    }
    // Rough ceiling, stalactites and side walls frame the usable mining area.
    g.fillStyle(0x171d24).fillRect(0, 80, WORLD.width, 18);
    for (let i = 0; i < Math.ceil(WORLD.width / 79); i++) {
        const x = i * 79;
        g.fillTriangle(x, 89, x + 70, 89, x + 26, 112 + (i * 13) % 35);
    }
    for (let y = 100; y < 935; y += 80) {
        g.fillStyle(0x282d32).fillTriangle(0, y, 0, y + 100, 29 + (y % 21), y + 45);
        g.fillTriangle(WORLD.width, y - 10, WORLD.width, y + 100, WORLD.width - 31 - (y % 17), y + 55);
        g.lineStyle(2, 0x465057).lineBetween(7, y + 10, 23, y + 37);
    }
    g.save().translateCanvas(WORLD.centerX - 512, 0);
    // A timber-supported tunnel and warm lanterns replace the outdoor horizon.
    g.fillStyle(0x503b2c).fillRect(344, 105, 18, 137).fillRect(662, 105, 18, 137);
    g.fillStyle(0x84603e).fillRect(337, 103, 350, 18);
    g.lineStyle(3, 0xa07a50).lineBetween(346, 108, 677, 108).lineBetween(350, 125, 350, 237).lineBetween(668, 125, 668, 237);
    for (const x of [385, 639]) {
        g.fillStyle(0xffc66b, 0.06).fillCircle(x, 171, 60);
        g.fillStyle(0xffc66b, 0.09).fillCircle(x, 171, 38);
        g.lineStyle(2, 0x151b20).lineBetween(x, 120, x, 150);
        g.fillStyle(0x262c30).fillRoundedRect(x - 10, 150, 20, 33, 4);
        g.fillStyle(0xf4b951).fillRect(x - 6, 156, 12, 20);
        g.fillStyle(0xffe4a0).fillRect(x - 2, 158, 4, 16);
        g.lineStyle(2, 0x262c30).lineBetween(x - 8, 170, x + 8, 170);
    }
    g.restore();
    // Rough ledges leave the centre open for the descending rope.
    g.fillStyle(0x302e2b).fillRect(0, 235, WORLD.centerX - 48, 20).fillRect(WORLD.centerX + 48, 235, WORLD.centerX - 48, 20);
    g.lineStyle(3, 0x8f7960).lineBetween(0, 236, WORLD.centerX - 49, 236).lineBetween(WORLD.centerX + 49, 236, WORLD.width, 236);

    g.save().translateCanvas(WORLD.centerX - 512, 0);
    // Timber platform and braces frame the centered rope pivot.
    g.lineStyle(9, 0x543824).lineBetween(464, 236, 494, 209).lineBetween(560, 236, 530, 209);
    g.fillStyle(0x70472e).fillRoundedRect(458, 204, 108, 14, 3);
    g.fillStyle(0xbb8750).fillRect(460, 204, 104, 4);
    g.fillStyle(0x593c2b).fillRect(468, 218, 10, 20).fillRect(546, 218, 10, 20);
    g.restore();

    };
    g.setData('responsiveRedraw', draw);
    draw();
}
