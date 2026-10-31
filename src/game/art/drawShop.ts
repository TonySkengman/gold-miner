import type { Scene, GameObjects } from 'phaser';
import type { ShopItemKind } from '../state/Upgrades';

/** Original shape-drawn trading stall and its shopkeeper. */
export function drawShop(scene: Scene): void {
    const g = scene.add.graphics();
    g.fillStyle(0xb9dce0).fillRect(0, 0, 1024, 960);
    g.fillStyle(0x91ad77).fillTriangle(0, 370, 190, 200, 430, 370).fillTriangle(680, 370, 880, 230, 1024, 370);
    g.fillStyle(0xb99766).fillRect(0, 370, 1024, 590);
    g.fillStyle(0xc9ac7b).fillEllipse(510, 670, 950, 130);
    g.fillStyle(0x64442e).fillRect(66, 205, 18, 485).fillRect(940, 205, 18, 485);
    g.fillStyle(0x936039).fillRect(83, 300, 858, 280);
    g.lineStyle(2, 0x7b4f31);
    for (let x = 100; x < 940; x += 60) g.lineBetween(x, 300, x, 580);
    // Striped canvas awning.
    for (let i = 0; i < 10; i++) {
        g.fillStyle(i % 2 ? 0xffe6ad : 0xad4936).fillRect(57 + i * 91, 205, 91, 85);
        g.fillRoundedRect(57 + i * 91, 270, 91, 35, 12);
    }
    g.fillStyle(0x513b2a).fillRoundedRect(310, 141, 404, 80, 8);
    g.lineStyle(3, 0xcf9d55).strokeRoundedRect(316, 147, 392, 68, 5);
    // Shopkeeper: hat, friendly face, moustache, rolled sleeves and apron.
    g.fillStyle(0x4d4237).fillRoundedRect(148, 578, 48, 40, 8).fillRoundedRect(216, 578, 48, 40, 8);
    g.fillStyle(0x719073).fillRoundedRect(140, 422, 128, 166, 20);
    g.fillStyle(0xd2ac77).fillRoundedRect(160, 450, 89, 133, 7);
    g.lineStyle(7, 0xc29560).lineBetween(170, 425, 180, 477).lineBetween(238, 425, 228, 477);
    g.fillStyle(0x9f774d).fillRoundedRect(178, 505, 52, 38, 5);
    g.lineStyle(23, 0x719073).lineBetween(144, 447, 127, 526).lineBetween(265, 449, 286, 520);
    g.fillStyle(0xf2c392).fillCircle(126, 535, 13).fillCircle(287, 531, 13);
    g.fillStyle(0xdba778).fillCircle(154, 381, 12).fillCircle(255, 381, 12);
    g.fillStyle(0xf2c392).fillRoundedRect(157, 329, 96, 103, 30);
    g.fillStyle(0x60422f).fillEllipse(183, 353, 25, 8).fillEllipse(226, 353, 25, 8);
    g.fillStyle(0x342c25).fillCircle(185, 371, 4).fillCircle(225, 371, 4);
    g.fillStyle(0xdba778).fillEllipse(205, 386, 20, 18);
    g.fillStyle(0x60422f).fillEllipse(191, 399, 30, 13).fillEllipse(219, 399, 30, 13);
    g.lineStyle(3, 0x9e6148).lineBetween(198, 414, 212, 414);
    g.fillStyle(0x694c32).fillRoundedRect(151, 307, 106, 38, 13).fillRoundedRect(134, 335, 140, 13, 5);
    g.fillStyle(0xd0a05a).fillRect(152, 327, 104, 8);
    // Counter overlays the shopkeeper's lower body and supports the products.
    g.fillStyle(0x573a28).fillRoundedRect(87, 592, 851, 24, 4);
    g.fillStyle(0x9f6b3e).fillRect(99, 616, 827, 64);
    g.lineStyle(2, 0x75492c);
    for (let x = 111; x < 926; x += 80) g.lineBetween(x, 619, x, 678);
    g.fillStyle(0xd09a5e).fillRect(87, 591, 851, 6);
}

export function drawShopProduct(scene: Scene, x: number, y: number, kind: ShopItemKind, scale = 1): GameObjects.Graphics {
    const g = scene.add.graphics().setPosition(x, y).setScale(scale);
    if (kind === 'prospectorsLens') {
        g.lineStyle(15, 0x79512e).lineBetween(20, 22, 48, 50);
        g.fillStyle(0x92dce8).lineStyle(7, 0xc79949).fillCircle(-5, -6, 33).strokeCircle(-5, -6, 33);
        g.lineStyle(4, 0xe9ffff).lineBetween(-24, -7, -8, -23).lineBetween(-12, 5, 7, -14);
    } else if (kind === 'lifeVial') {
        g.fillStyle(0xf1c9cc).lineStyle(3, 0x793341);
        g.fillRoundedRect(-24, -25, 48, 65, 14).strokeRoundedRect(-24, -25, 48, 65, 14);
        g.fillStyle(0xd94b52).fillRoundedRect(-18, -5, 36, 38, 9);
        g.fillStyle(0xb68b4e).fillRoundedRect(-15, -42, 30, 20, 4);
        g.fillStyle(0xffe8e8).fillCircle(-7, 5, 9).fillCircle(7, 5, 9).fillTriangle(-16, 7, 16, 7, 0, 25);
        g.lineStyle(3, 0xffffff).lineBetween(-15, -17, -15, -8);
    } else if (kind === 'rockPolish') {
        g.fillStyle(0x8a969f).lineStyle(3, 0x414952);
        g.beginPath().moveTo(-43, 19).lineTo(-34, -10).lineTo(-5, -23)
            .lineTo(24, -8).lineTo(32, 23).lineTo(-9, 34).closePath().fillPath().strokePath();
        g.fillStyle(0xd9b95e).fillTriangle(-34, -10, -5, -23, -13, 17)
            .fillTriangle(-5, -23, 24, -8, -13, 17);
        g.fillStyle(0xdba34d).lineStyle(3, 0x79552c);
        g.fillRoundedRect(19, -29, 28, 48, 5).strokeRoundedRect(19, -29, 28, 48, 5);
        g.fillStyle(0x725039).fillRoundedRect(23, -40, 20, 14, 3);
        g.fillStyle(0xffedbb).fillRect(23, -14, 20, 16);
        g.lineStyle(3, 0xfff4c2).lineBetween(-33, -31, -15, -31).lineBetween(-24, -40, -24, -22);
    } else if (kind === 'luck') {
        g.fillStyle(0xb7aacd).lineStyle(3, 0x59416f);
        g.fillRoundedRect(-15, -46, 30, 30, 5).strokeRoundedRect(-15, -46, 30, 30, 5);
        g.fillEllipse(0, 9, 74, 72).strokeEllipse(0, 9, 74, 72);
        g.fillStyle(0x9e5dc3).fillEllipse(0, 16, 62, 48);
        g.fillStyle(0xdba4ef).fillEllipse(-16, 7, 10, 23);
        g.fillStyle(0xb68b4e).fillRoundedRect(-18, -54, 36, 14, 3);
        g.fillStyle(0xffdf79).fillCircle(-5, 4, 8).fillCircle(7, 4, 8).fillCircle(-5, 16, 8).fillCircle(7, 16, 8);
        g.lineStyle(3, 0xffdf79).lineBetween(1, 15, 4, 32);
    } else if (kind === 'extraTime') {
        g.fillStyle(0xb4833d).fillRoundedRect(-7, -56, 14, 18, 3).fillRoundedRect(-17, -60, 34, 9, 3);
        g.fillStyle(0xdfb85e).lineStyle(4, 0x79552c).fillCircle(0, 0, 45).strokeCircle(0, 0, 45);
        g.fillStyle(0xffedbb).fillCircle(0, 0, 36);
        g.lineStyle(3, 0x79552c);
        for (let i = 0; i < 12; i++) {
            const a = i * Math.PI / 6;
            g.lineBetween(Math.sin(a) * 29, Math.cos(a) * 29, Math.sin(a) * 33, Math.cos(a) * 33);
        }
        g.lineStyle(4, 0x483126).lineBetween(0, 0, 0, -24).lineBetween(0, 0, 19, 12);
        g.fillStyle(0x79552c).fillCircle(0, 0, 4);
    } else if (kind === 'strength') {
        g.fillStyle(0x6a4a31).fillRect(-47, 27, 94, 14).fillRect(-39, -14, 10, 45).fillRect(29, -14, 10, 45);
        g.fillStyle(0x414f56).fillCircle(-27, 0, 30).fillCircle(27, 0, 30);
        g.fillStyle(0xb58750).fillRect(-27, -24, 54, 48);
        g.lineStyle(3, 0x79542e);
        for (let i = -22; i < 27; i += 7) g.lineBetween(i, -22, i, 22);
        g.fillStyle(0x83969e).fillCircle(-27, 0, 23).fillCircle(27, 0, 23);
        g.fillStyle(0x39464d).fillCircle(-27, 0, 6).fillCircle(27, 0, 6);
        g.lineStyle(7, 0x39464d).lineBetween(27, 0, 61, 0).lineBetween(61, 0, 61, -25);
        g.fillStyle(0x79512e).fillRoundedRect(52, -32, 18, 13, 4);
    } else if (kind === 'diamonds') {
        g.save().translateCanvas(-21, 2).scaleCanvas(0.7, 0.7);
        g.fillStyle(0x70e6f5).lineStyle(3, 0x287e9a);
        g.beginPath().moveTo(-48, -15).lineTo(-26, -42).lineTo(26, -42)
            .lineTo(48, -15).lineTo(0, 43).closePath().fillPath().strokePath();
        g.fillStyle(0xe8ffff).fillTriangle(-48, -15, 0, -42, 0, 43);
        g.lineStyle(2, 0x3196b1).lineBetween(-48, -15, 48, -15).lineBetween(-26, -15, 0, 43).lineBetween(26, -15, 0, 43);
        g.lineStyle(3, 0xfff4c2).lineBetween(53, -42, 69, -42).lineBetween(61, -50, 61, -34);
        g.restore();
        // A faceted ruby beside the diamond identifies polish for both gems.
        g.fillStyle(0xe83864).lineStyle(3, 0x751d42);
        g.beginPath().moveTo(16, -24).lineTo(39, -24).lineTo(52, -7)
            .lineTo(43, 20).lineTo(28, 34).lineTo(10, 20).lineTo(4, -7)
            .closePath().fillPath().strokePath();
        g.fillStyle(0xffa6bb).fillTriangle(16, -24, 28, -7, 4, -7);
        g.fillStyle(0xff6288).fillTriangle(4, -7, 28, -7, 28, 34);
        g.fillStyle(0x9f2152).fillTriangle(52, -7, 28, 34, 43, 20);
        g.lineStyle(2, 0xffd2dd).lineBetween(4, -7, 52, -7).lineBetween(28, -7, 39, -24);
    } else {
        g.fillStyle(0x69442c).fillRoundedRect(-56, 16, 112, 22, 4);
        for (const x of [-28, 0, 28]) {
            g.fillStyle(0xbd3e30).lineStyle(2, 0x793126).fillRoundedRect(x - 10, -38, 20, 67, 4).strokeRoundedRect(x - 10, -38, 20, 67, 4);
            g.fillStyle(0xe1664a).fillRect(x - 6, -34, 4, 57);
            g.lineStyle(2, 0x76532f).lineBetween(x, -38, x + 4, -49);
        }
        g.fillStyle(0xc29659).fillRect(-43, -6, 86, 10);
    }
    return g;
}
