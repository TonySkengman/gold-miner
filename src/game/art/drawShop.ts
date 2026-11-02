import { Math as PhaserMath } from 'phaser';
import { WORLD } from '../state/World';
import type { Scene, GameObjects } from 'phaser';
import type { ShopItemKind } from '../state/Upgrades';

/** Original shape-drawn trading stall and its shopkeeper. */
export function drawShop(scene: Scene, showVendor = true): void {
    const g = scene.add.graphics();
    const draw = () => {
    g.clear();
    g.save();
    g.fillStyle(0xb9dce0).fillRect(0, 0, WORLD.width, WORLD.height);
    g.fillStyle(0xb99766).fillRect(0, 370, WORLD.width, WORLD.height - 370);
    g.translateCanvas(WORLD.centerX - 512, 0);
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
    if (showVendor) {
        g.fillStyle(0x513b2a).fillRoundedRect(310, 141, 404, 80, 8);
        g.lineStyle(3, 0xcf9d55).strokeRoundedRect(316, 147, 392, 68, 5);
    }
    if (showVendor) {
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
    }
    // Counter overlays the shopkeeper's lower body and supports the products.
    g.fillStyle(0x573a28).fillRoundedRect(87, 592, 851, 24, 4);
    g.fillStyle(0x9f6b3e).fillRect(99, 616, 827, 64);
    g.lineStyle(2, 0x75492c);
    for (let x = 111; x < 926; x += 80) g.lineBetween(x, 619, x, 678);
    g.fillStyle(0xd09a5e).fillRect(87, 591, 851, 6);
    // Iron fasteners, worn wood grain and a small brass keeper's nameplate.
    for (const x of [75, 949]) {
        g.fillStyle(0x392d24).fillCircle(x, 320, 5).fillCircle(x, 570, 5);
        g.fillStyle(0xc6b087).fillCircle(x - 1, 319, 2).fillCircle(x - 1, 569, 2);
    }
    g.lineStyle(1, 0xb6804a, 0.55);
    for (let x = 117; x < 920; x += 80) {
        g.lineBetween(x, 632, x + 45, 632);
        g.lineBetween(x + 10, 657, x + 58, 657);
    }
    g.fillStyle(0x493323).fillRoundedRect(130, 623, 146, 36, 5);
    g.lineStyle(2, 0xc89b54).strokeRoundedRect(133, 626, 140, 30, 4);
    g.fillStyle(0xd9b66c).fillCircle(140, 641, 2).fillCircle(266, 641, 2);
    g.restore();
    };
    g.setData('responsiveRedraw', draw);
    draw();
}

export function drawShopProduct(scene: Scene, x: number, y: number, kind: ShopItemKind | 'streakVial', scale = 1): GameObjects.Graphics {
    const g = scene.add.graphics().setPosition(x, y).setScale(scale);
    if (kind === 'strengthPotion' || kind === 'goldRush') {
        drawMineVial(g, kind, 2.4);
    } else if (kind === 'vialBelt') {
        g.fillStyle(0x4a2e20).fillRoundedRect(-65, -9, 130, 44, 9);
        g.fillStyle(0x95603b).lineStyle(3, 0x573623);
        g.fillRoundedRect(-65, -16, 130, 40, 7).strokeRoundedRect(-65, -16, 130, 40, 7);
        for (const [index, color] of [0x8bd665, 0xffd65a, 0xa75ae0].entries()) {
            const x = (index - 1) * 39;
            g.fillStyle(0xe4f1ed).lineStyle(2, 0x42565a);
            g.fillRoundedRect(x - 13, -35, 26, 47, 7).strokeRoundedRect(x - 13, -35, 26, 47, 7);
            g.fillStyle(color).fillRoundedRect(x - 9, -19, 18, 27, 4);
            g.fillStyle(0xc49a5c).fillRoundedRect(x - 10, -43, 20, 11, 3);
            g.fillStyle(0x68432c).fillRect(x - 16, -2, 32, 12);
            g.lineStyle(2, 0xffffff).lineBetween(x - 6, -29, x - 6, -23);
        }
        g.lineStyle(4, 0xe4ba62).strokeRoundedRect(-13, 9, 26, 22, 3);
    } else if (kind === 'prospectorsLens') {
        g.lineStyle(15, 0x79512e).lineBetween(20, 22, 48, 50);
        g.fillStyle(0x92dce8).lineStyle(7, 0xc79949).fillCircle(-5, -6, 33).strokeCircle(-5, -6, 33);
        g.lineStyle(4, 0xe9ffff).lineBetween(-24, -7, -8, -23).lineBetween(-12, 5, 7, -14);
    } else if (kind === 'streakVial') {
        drawMineVial(g, kind, 2.4);
    } else if (kind === 'lifeVial') {
        g.fillStyle(0xf1c9cc).lineStyle(3, 0x793341);
        g.fillRoundedRect(-24, -25, 48, 65, 14).strokeRoundedRect(-24, -25, 48, 65, 14);
        g.fillStyle(0xd94b52).fillRoundedRect(-18, -5, 36, 38, 9);
        g.fillStyle(0xb68b4e).fillRoundedRect(-15, -42, 30, 20, 4);
        g.fillStyle(0xffe8e8).fillCircle(-7, 5, 9).fillCircle(7, 5, 9).fillTriangle(-16, 7, 16, 7, 0, 25);
        g.lineStyle(3, 0xffffff).lineBetween(-15, -17, -15, -8);
    } else if (kind === 'lightweightGrip') {
        // Slim steel claw and upward arrows represent a lighter rock haul.
        g.lineStyle(8, 0x3d494f).lineBetween(0, -48, 0, -18);
        g.lineStyle(4, 0xc5e5ec).lineBetween(-1, -48, -1, -18);
        for (const side of [-1, 1]) {
            g.lineStyle(9, 0x466875).beginPath().moveTo(0, -18)
                .lineTo(side * 28, 0).lineTo(side * 23, 28).lineTo(side * 10, 36).strokePath();
            g.lineStyle(4, 0xb8dce5).beginPath().moveTo(0, -18)
                .lineTo(side * 28, 0).lineTo(side * 23, 28).lineTo(side * 10, 36).strokePath();
            const x = side * 44;
            g.lineStyle(3, 0xffdf79).lineBetween(x, 14, x, -14)
                .lineBetween(x, -14, x - 7, -5).lineBetween(x, -14, x + 7, -5);
        }
        g.fillStyle(0x8a969f).lineStyle(2, 0x414952);
        g.fillRoundedRect(-13, 8, 26, 20, 6).strokeRoundedRect(-13, 8, 26, 20, 6);
    } else if (kind === 'luck' || kind === 'momentum') {
        drawMineVial(g, kind, 2.4);
    } else if (kind === 'safetyGrip') {
        // Reinforced gripping jaws with green rubber pads and a locking collar.
        g.lineStyle(10, 0x35494b).lineBetween(0, -43, 0, -23);
        g.lineStyle(4, 0xd2e3df).lineBetween(-2, -42, -2, -24);
        for (const side of [-1, 1]) {
            g.lineStyle(13, 0x35494b).beginPath().moveTo(side * 7, -21)
                .lineTo(side * 30, -5).lineTo(side * 26, 22).lineTo(side * 10, 34).strokePath();
            g.lineStyle(7, 0xb3c8c4).beginPath().moveTo(side * 7, -21)
                .lineTo(side * 30, -5).lineTo(side * 26, 22).lineTo(side * 10, 34).strokePath();
            g.lineStyle(10, 0x547f3b).lineBetween(side * 25, 17, side * 11, 29);
            g.lineStyle(3, 0xc6eaa0).lineBetween(side * 23, 17, side * 10, 28);
            g.fillStyle(0x35494b).fillCircle(side * 29, -4, 5);
            g.fillStyle(0xe0e8ce).fillCircle(side * 29, -5, 2);
        }
        g.fillStyle(0x547f3b).lineStyle(3, 0x35494b)
            .fillRoundedRect(-16, -29, 32, 17, 4).strokeRoundedRect(-16, -29, 32, 17, 4);
        g.lineStyle(3, 0xc6eaa0).lineBetween(-9, -24, 9, -24);
    } else if (kind === 'blastPowder') {
        // A sealed powder tin with an expanding blast emblem.
        g.fillStyle(0x754936).lineStyle(5, 0xffe6a6)
            .fillRoundedRect(-30, -30, 60, 66, 7).strokeRoundedRect(-30, -30, 60, 66, 7);
        g.fillStyle(0xbba176).fillRoundedRect(-34, -38, 68, 13, 3)
            .strokeRoundedRect(-34, -38, 68, 13, 3);
        g.fillStyle(0xffd36a).fillCircle(0, 3, 21);
        g.lineStyle(3, 0xa84626).strokeCircle(0, 3, 15);
        for (let i = 0; i < 8; i++) {
            const a = i * Math.PI / 4;
            g.lineBetween(Math.cos(a) * 8, 3 + Math.sin(a) * 8,
                Math.cos(a) * 18, 3 + Math.sin(a) * 18);
        }
    } else if (kind === 'extraTime') {
        drawTimeVial(g, 2.4);
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
    } else if (kind === 'gold') {
        // Polished nugget and bright glints distinguish gold polish from gem polish.
        g.fillStyle(0xe5a923).lineStyle(3, 0x94621d);
        g.beginPath().moveTo(-44, 12).lineTo(-32, -21).lineTo(-9, -32)
            .lineTo(25, -24).lineTo(45, 4).lineTo(30, 31).lineTo(-18, 36)
            .closePath().fillPath().strokePath();
        g.fillStyle(0xffdf69).fillTriangle(-32, -21, -9, -32, -18, 36);
        g.fillStyle(0xffca3e).fillTriangle(-9, -32, 25, -24, 30, 31);
        g.lineStyle(4, 0xfff6cd).lineBetween(26, -43, 26, -23)
            .lineBetween(16, -33, 36, -33);
        g.lineStyle(3, 0xfff6cd).lineBetween(-43, -1, -43, 13)
            .lineBetween(-50, 6, -36, 6);
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

/** Natural proportions and restrained facial expressions for the foreground trader. */
export function drawShopkeeper(scene: Scene, x: number, y: number, scale = 1, emotion: 'neutral' | 'happy' | 'sad' = 'neutral'): GameObjects.Graphics {
    const g = scene.add.graphics().setPosition(x, y).setScale(scale);
    // Ground shadow, boots and trouser legs.
    g.fillStyle(0x151714, 0.45).fillEllipse(0, 143, 160, 23);
    g.fillStyle(0x343b3a).fillRoundedRect(-48, 55, 41, 82, 6).fillRoundedRect(8, 55, 41, 82, 6);
    g.fillStyle(0x222a2a).fillRect(-14, 62, 9, 69).fillRect(40, 63, 8, 65);
    g.fillStyle(0x342a23).fillRoundedRect(-53, 125, 48, 20, 5).fillRoundedRect(7, 125, 51, 20, 5);
    g.lineStyle(2, 0x645344).lineBetween(-50, 141, -6, 141).lineBetween(10, 141, 56, 141);
    // Broad shoulders taper into a worn canvas apron.
    g.fillStyle(0x59645a).fillPoints([{ x: -31, y: -69 }, { x: -66, y: -52 }, { x: -56, y: 45 }, { x: 55, y: 45 }, { x: 65, y: -50 }, { x: 30, y: -69 }].map(point => new PhaserMath.Vector2(point.x, point.y)), true);
    g.fillStyle(0x3c4942).fillTriangle(39, -59, 65, -50, 53, 46);
    if (emotion === 'sad') {
        // Bent elbows and open palms make a small, readable shrug.
        g.lineStyle(23, 0x4a574d).lineBetween(-57, -43, -77, -20).lineBetween(57, -43, 77, -20);
        g.lineStyle(18, 0x768074).lineBetween(-77, -20, -81, -30).lineBetween(77, -20, 81, -30);
        g.lineStyle(14, 0xb78b6c).lineBetween(-81, -31, -85, -58).lineBetween(81, -31, 85, -58);
        g.fillStyle(0xc29a78).fillEllipse(-85, -64, 23, 13).fillEllipse(85, -64, 23, 13);
        g.lineStyle(2, 0x88674f).lineBetween(-94, -65, -80, -65).lineBetween(80, -65, 94, -65);
        g.lineStyle(5, 0xc29a78).lineBetween(-81, -61, -76, -68).lineBetween(81, -61, 76, -68);
    } else {
        g.lineStyle(23, 0x4a574d).lineBetween(-57, -43, -68, 6).lineBetween(57, -43, 67, 6);
        g.lineStyle(18, 0x768074).lineBetween(-68, 1, -66, 17).lineBetween(67, 1, 65, 17);
        g.lineStyle(14, 0xb78b6c).lineBetween(-66, 19, -60, 53).lineBetween(65, 19, 59, 53);
        g.fillStyle(0xc29a78).fillEllipse(-59, 57, 16, 24).fillEllipse(58, 57, 16, 24);
        g.lineStyle(1, 0x88674f).lineBetween(-63, 55, -60, 65).lineBetween(61, 55, 58, 65);
    }
    g.fillStyle(0x8a7353).fillPoints([{ x: -34, y: -48 }, { x: 32, y: -48 }, { x: 45, y: 91 }, { x: -46, y: 91 }].map(point => new PhaserMath.Vector2(point.x, point.y)), true);
    g.fillStyle(0x746047).fillTriangle(25, -45, 45, 91, 25, 91);
    g.lineStyle(5, 0xa38a64).lineBetween(-28, -66, -23, -32).lineBetween(28, -66, 24, -32);
    g.lineStyle(1, 0xb29a72).strokeRect(-25, 13, 50, 37).lineBetween(-38, 83, 36, 83);
    g.fillStyle(0x786347).fillRect(-23, 15, 46, 5);
    g.lineStyle(2, 0x66563e).lineBetween(-16, 54, -22, 78).lineBetween(16, 47, 22, 75);
    // Smaller head, shaded jaw, ears and a weathered face.
    g.fillStyle(0xa77b5c).fillRect(-13, -85, 26, 24);
    g.fillStyle(0x9d765c).fillEllipse(-29, -107, 12, 22).fillEllipse(29, -107, 12, 22);
    g.fillStyle(0xbc9475).fillRoundedRect(-29, -142, 58, 74, 20);
    g.fillStyle(0xa57e62).fillEllipse(19, -104, 19, 52);
    g.fillStyle(0xd0ac88).fillEllipse(-9, -118, 30, 41);
    g.fillStyle(0x797568).fillEllipse(-25, -124, 10, 25).fillEllipse(25, -124, 10, 25);
    g.lineStyle(2, 0x65564a).lineBetween(-21, -118, -7, emotion === 'sad' ? -122 : -119).lineBetween(7, emotion === 'sad' ? -122 : -119, 21, -118);
    g.fillStyle(0xddd2b6).fillEllipse(-14, -112, 12, 5).fillEllipse(14, -112, 12, 5);
    g.fillStyle(0x343b36).fillCircle(-13, -112, 2).fillCircle(13, -112, 2);
    g.lineStyle(1, 0x937057).lineBetween(-23, -105, -18, -102).lineBetween(18, -102, 24, -105).lineBetween(-14, -129, 11, -129);
    g.fillStyle(0xa67c5a).fillTriangle(1, -113, -5, -97, 7, -97);
    g.lineStyle(1, 0xd0ab85).lineBetween(-2, -111, -5, -99);
    g.fillStyle(0x777164).fillEllipse(-8, -91, 19, 7).fillEllipse(8, -91, 19, 7);
    g.lineStyle(2, 0x6f5142);
    g.beginPath();
    g.moveTo(-11, emotion === 'happy' ? -86 : -83);
    g.lineTo(0, emotion === 'happy' ? -81 : emotion === 'sad' ? -87 : -83);
    g.lineTo(11, emotion === 'happy' ? -86 : -83);
    g.strokePath();
    g.lineStyle(1, 0x99765d).lineBetween(-9, -75, 7, -75);
    // Creased felt hat, leather band and brass buckle.
    g.fillStyle(0x4b4437).fillPoints([{ x: -34, y: -142 }, { x: -27, y: -169 }, { x: -8, y: -174 }, { x: 4, y: -166 }, { x: 22, y: -173 }, { x: 32, y: -140 }].map(point => new PhaserMath.Vector2(point.x, point.y)), true);
    g.fillStyle(0x635742).fillTriangle(-27, -165, -8, -169, -17, -144);
    g.fillStyle(0x392f27).fillRect(-32, -148, 63, 9);
    g.fillStyle(0x4b4234).fillEllipse(0, -138, 91, 14);
    g.lineStyle(2, 0x817054).lineBetween(-42, -138, 38, -136);
    g.lineStyle(2, 0xb0965a).strokeRect(12, -148, 10, 9);
    return g;
}

/** Shared Time vial artwork for mine catches and shop/briefing icons. */
export function drawTimeVial(g: GameObjects.Graphics, scale = 1): void {
    g.save().scaleCanvas(scale, scale);
    g.fillStyle(0x9fc9bd).lineStyle(3, 0x365c50);
    g.beginPath().moveTo(-6, -13).lineTo(-6, -5).lineTo(-14, 3)
        .lineTo(-14, 13).lineTo(-8, 17).lineTo(8, 17).lineTo(14, 13)
        .lineTo(14, 3).lineTo(6, -5).lineTo(6, -13).closePath().fillPath().strokePath();
    g.fillStyle(0x66d9fa).fillRoundedRect(-10, 3, 20, 11, 3);
    g.fillStyle(0xd5f8ff).fillRect(-8, 4, 4, 7);
    g.fillStyle(0xad7c43).lineStyle(2, 0x694729)
        .fillRoundedRect(-7, -18, 14, 7, 2).strokeRoundedRect(-7, -18, 14, 7, 2);
    g.fillStyle(0xe8ffff).fillCircle(0, 6, 7);
    g.lineStyle(1.5, 0x287e9a).strokeCircle(0, 6, 7)
        .lineBetween(0, 6, 0, 1).lineBetween(0, 6, 4, 8);
    g.lineStyle(2, 0xe0f6de).lineBetween(-9, -1, -11, 2);
    g.restore();
}

/** Consistent vial artwork for mine buffs and shop Luck. */
export function drawMineVial(g: GameObjects.Graphics, kind: 'strengthPotion' | 'goldRush' | 'streakVial' | 'luck' | 'momentum', scale = 1): void {
    g.save().scaleCanvas(scale, scale);
    g.fillStyle(0x9fc9bd).lineStyle(3, 0x365c50);
    g.beginPath().moveTo(-6, -13).lineTo(-6, -5).lineTo(-14, 3)
        .lineTo(-14, 13).lineTo(-8, 17).lineTo(8, 17).lineTo(14, 13)
        .lineTo(14, 3).lineTo(6, -5).lineTo(6, -13).closePath().fillPath().strokePath();
    g.fillStyle(kind === 'goldRush' ? 0xffc52e : kind === 'streakVial' ? 0xa75ae0 : kind === 'luck' ? 0x9e5dc3 : kind === 'momentum' ? 0x39c9b3 : 0x80d65b).fillRoundedRect(-10, 3, 20, 11, 3);
    g.fillStyle(kind === 'goldRush' ? 0xffee9a : kind === 'luck' ? 0xdba4ef : kind === 'momentum' ? 0xc3fff2 : 0xaff17d).fillRect(-8, 4, 4, 7);
    g.fillStyle(0xad7c43).lineStyle(2, 0x694729)
        .fillRoundedRect(-7, -18, 14, 7, 2).strokeRoundedRect(-7, -18, 14, 7, 2);
    if (kind === 'streakVial') {
        for (const x of [-5, 5]) {
            g.fillStyle(0xffe68c).fillTriangle(x + 2, -1, x - 4, 7, x + 1, 7)
                .fillTriangle(x - 1, 5, x + 4, 5, x - 2, 13);
        }
    } else if (kind === 'momentum') {
        // Clock and upward chevron connect precise catches with earned time.
        g.fillStyle(0xe8ffff).fillCircle(0, 6, 6);
        g.lineStyle(1.2, 0x176d66).strokeCircle(0, 6, 6)
            .lineBetween(0, 6, 0, 2).lineBetween(0, 6, 3, 8);
        g.lineStyle(1.5, 0xffe68c).lineBetween(-4, -2, 0, -6).lineBetween(0, -6, 4, -2);
    } else if (kind === 'luck') {
        g.fillStyle(0xffdf79).fillCircle(-2.5, 3, 3).fillCircle(2.5, 3, 3)
            .fillCircle(-2.5, 8, 3).fillCircle(2.5, 8, 3);
        g.lineStyle(1.5, 0xffdf79).lineBetween(0, 8, 2, 14);
    } else if (kind === 'goldRush') {
        g.fillStyle(0xfff1af).lineStyle(1, 0x986019);
        g.beginPath().moveTo(-6, 6).lineTo(-2, 1).lineTo(4, 2)
            .lineTo(7, 8).lineTo(0, 12).closePath().fillPath().strokePath();
    } else {
        g.fillStyle(0xfff1af).fillTriangle(2, -1, -4, 7, 1, 7).fillTriangle(-1, 5, 4, 5, -2, 13);
    }
    g.lineStyle(2, 0xe0f6de).lineBetween(-9, -1, -11, 2);
    g.restore();
}
