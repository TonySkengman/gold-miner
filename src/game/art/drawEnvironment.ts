import { Scene } from 'phaser';

/** Original vector scenery, drawn once so the playfield stays inexpensive. */
export function drawEnvironment(scene: Scene): void {
    const g = scene.add.graphics();
    g.fillStyle(0xb5e2e8).fillRect(0, 0, 1024, 248);
    g.fillStyle(0xffedac).fillCircle(875, 140, 32);
    g.fillStyle(0xffffff);
    for (const [x, y] of [[170, 162], [710, 123]]) {
        g.fillEllipse(x, y, 110, 22).fillCircle(x - 20, y - 8, 18).fillCircle(x + 8, y - 13, 23);
    }
    g.fillStyle(0x9dbb86).fillTriangle(0, 240, 190, 155, 380, 240).fillTriangle(650, 240, 840, 166, 1080, 240);
    g.fillStyle(0x80a668).fillTriangle(30, 240, 310, 185, 560, 240);
    g.fillStyle(0xa97448).fillRect(0, 248, 1024, 490);
    g.fillStyle(0x9c663f).fillRect(0, 405, 1024, 120);
    g.fillStyle(0x8b5839).fillRect(0, 600, 1024, 138);
    // Broken sediment seams and small pebbles keep the underground readable.
    g.lineStyle(3, 0x825033, 0.55);
    for (let row = 0; row < 3; row++) {
        const y = 350 + row * 145;
        for (let x = 0; x < 1024; x += 155) {
            g.lineBetween(x, y, x + 48, y + 4);
            g.lineBetween(x + 48, y + 4, x + 100, y - 3);
        }
    }
    for (let i = 0; i < 110; i++) {
        const x = 12 + (i * 137) % 1000;
        const y = 275 + (i * 73) % 440;
        g.fillStyle(i % 3 ? 0x794d33 : 0xc18b58, 0.6).fillEllipse(x, y, i % 3 + 3, 3);
    }
    g.fillStyle(0x70472d).fillRect(0, 249, 1024, 7);
    g.fillStyle(0x648b3d).fillRect(0, 238, 1024, 11);
    g.lineStyle(2, 0x83a950);
    for (let x = 4; x < 1024; x += 19) g.lineBetween(x, 240, x + 4, 234);

    // Timber platform and braces frame the fixed rope pivot at (512, 210).
    g.lineStyle(9, 0x543824).lineBetween(464, 236, 494, 209).lineBetween(560, 236, 530, 209);
    g.fillStyle(0x70472e).fillRoundedRect(458, 204, 108, 14, 3);
    g.fillStyle(0xbb8750).fillRect(460, 204, 104, 4);
    g.fillStyle(0x593c2b).fillRect(468, 218, 10, 20).fillRect(546, 218, 10, 20);

    // Boots, overalls, sleeves, hands, and a bearded face.
    g.fillStyle(0x49372d).fillRoundedRect(486, 195, 24, 10, 3).fillRoundedRect(516, 195, 24, 10, 3);
    g.fillStyle(0x355e83).fillRoundedRect(491, 171, 42, 25, 5);
    g.fillStyle(0xb94d39).fillRoundedRect(489, 161, 46, 21, 7);
    g.fillStyle(0x477ca1).fillRect(500, 164, 6, 23).fillRect(520, 164, 6, 23).fillRect(499, 178, 28, 16);
    g.fillStyle(0xe8be57).fillCircle(503, 181, 2).fillCircle(523, 181, 2);
    g.lineStyle(10, 0xb94d39).lineBetween(491, 173, 479, 188).lineBetween(532, 173, 545, 189);
    g.fillStyle(0xf1c08e).fillCircle(479, 189, 6).fillCircle(545, 189, 6);
    g.fillStyle(0xdba274).fillCircle(492, 150, 5).fillCircle(534, 150, 5);
    g.fillStyle(0xf1c08e).fillRoundedRect(494, 134, 38, 37, 12);
    g.fillStyle(0xe9e3cc).fillEllipse(513, 165, 33, 25);
    g.fillStyle(0xf1c08e).fillEllipse(513, 153, 12, 11);
    g.fillStyle(0xfff5df).fillEllipse(505, 160, 14, 6).fillEllipse(521, 160, 14, 6);
    g.fillStyle(0x3c3027).fillCircle(504, 148, 2).fillCircle(522, 148, 2);
    g.lineStyle(2, 0x80644a).lineBetween(500, 143, 507, 142).lineBetween(519, 142, 526, 143);
    g.fillStyle(0xb87b20).fillRoundedRect(488, 130, 50, 13, 4);
    g.fillStyle(0xeebc35).fillRoundedRect(493, 113, 40, 25, 11);
    g.fillStyle(0xffda53).fillRoundedRect(498, 116, 12, 18, 5);
    g.fillStyle(0x687176).fillCircle(513, 129, 9);
    g.fillStyle(0xfff2bb).fillCircle(513, 129, 6);

    // Iron winch spool, coiled rope, and side crank.
    g.fillStyle(0x414b50).fillCircle(512, 207, 17);
    g.fillStyle(0xc2945f).fillCircle(512, 207, 13);
    g.lineStyle(2, 0x775031).strokeCircle(512, 207, 9).strokeCircle(512, 207, 5);
    g.fillStyle(0xa5b0b0).fillCircle(512, 207, 3);
    g.lineStyle(4, 0x414b50).lineBetween(529, 207, 541, 207).lineBetween(541, 207, 541, 191);
    g.fillStyle(0x61422c).fillRoundedRect(536, 186, 11, 8, 3);
}
