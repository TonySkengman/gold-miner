import { GameObjects, Scene } from 'phaser';
import { LEVELS, LevelConfig } from '../state/Levels';

export type OreKind = 'small' | 'medium' | 'large' | 'giant' | 'rock' | 'largeRock' | 'diamond' | 'moneyBag' | 'rat' | 'diamondRat';
const TYPES = {
    rat: { radius: 21, value: 2, weight: 1.4, color: 0x88766a },
    diamondRat: { radius: 24, value: 602, weight: 1.6, color: 0x88766a },
    diamond: { radius: 17, value: 600, weight: 0.4, color: 0x70e6f5 },
    moneyBag: { radius: 22, value: 0, weight: 1.2, color: 0xd7b47c },
    small: { radius: 15, value: 90, weight: 0.6, color: 0xffdf49 },
    medium: { radius: 24, value: 180, weight: 1.5, color: 0xffca28 },
    large: { radius: 35, value: 300, weight: 3, color: 0xf5b51b },
    giant: { radius: 52, value: 500, weight: 4.8, color: 0xf0b21d },
    largeRock: { radius: 45, value: 25, weight: 5.5, color: 0x7e8993 },
    rock: { radius: 26, value: 15, weight: 3.8, color: 0x89939b }
};

export class Collectable {
    readonly radius: number;
    readonly value: number;
    readonly weight: number;
    readonly graphic: GameObjects.Graphics;
    available = true;
    private direction = Math.random() < 0.5 ? -1 : 1;
    private readonly speed = 45 + Math.random() * 20;

    constructor(scene: Scene, public x: number, public y: number, readonly kind: OreKind) {
        const type = TYPES[kind];
        this.radius = type.radius;
        this.value = kind === 'moneyBag' ? 50 + Math.floor(Math.random() * 15) * 25 : type.value;
        this.weight = type.weight;
        this.graphic = scene.add.graphics().setPosition(x, y);
        const r = this.radius;
        const g = this.graphic;
        if (this.isRat) {
            g.lineStyle(3, 0xbe9687);
            g.beginPath().moveTo(-12, 3).lineTo(-19, 0).lineTo(-20, -6).strokePath();
            g.fillStyle(type.color).lineStyle(2, 0x51483f);
            g.fillEllipse(-2, 2, 29, 20).strokeEllipse(-2, 2, 29, 20);
            g.fillTriangle(6, -5, 20, 5, 6, 9);
            g.fillStyle(0xb8998a).fillCircle(6, -7, 7);
            g.fillStyle(0xe3b5ab).fillCircle(6, -7, 4).fillCircle(19, 5, 2);
            g.fillStyle(0x201f1d).fillCircle(12, 0, 2);
            g.lineStyle(3, 0x51483f).lineBetween(-10, 10, -6, 12).lineBetween(6, 10, 10, 12);
            if (kind === 'diamondRat') {
                g.fillStyle(0x70e6f5).lineStyle(2, 0x287e9a);
                g.beginPath().moveTo(-12, -14).lineTo(-7, -20).lineTo(1, -20)
                    .lineTo(6, -14).lineTo(-3, -5).closePath().fillPath().strokePath();
                g.lineStyle(1, 0xe8ffff).lineBetween(-12, -14, 6, -14).lineBetween(-7, -20, -3, -5);
            }
            g.setScale(this.direction, 1);
            return;
        }
        if (kind === 'diamond') {
            g.fillStyle(type.color).lineStyle(2, 0x287e9a);
            g.beginPath().moveTo(-r, -r * 0.25).lineTo(-r * 0.5, -r * 0.75)
                .lineTo(r * 0.5, -r * 0.75).lineTo(r, -r * 0.25).lineTo(0, r)
                .closePath().fillPath().strokePath();
            g.fillStyle(0xe8ffff).fillTriangle(-r, -r * 0.25, 0, -r * 0.75, 0, r);
            g.lineStyle(1, 0x3196b1).lineBetween(-r, -r * 0.25, r, -r * 0.25)
                .lineBetween(-r * 0.5, -r * 0.25, 0, r).lineBetween(r * 0.5, -r * 0.25, 0, r);
            return;
        }
        if (kind === 'moneyBag') {
            g.fillStyle(type.color).lineStyle(2, 0x795734);
            g.fillEllipse(0, r * 0.2, r * 1.7, r * 1.5).strokeEllipse(0, r * 0.2, r * 1.7, r * 1.5);
            g.fillTriangle(-r * 0.45, -r * 0.9, r * 0.45, -r * 0.9, 0, -r * 0.2);
            g.lineStyle(4, 0x795734).lineBetween(-r * 0.3, -r * 0.45, r * 0.3, -r * 0.45);
            // A question mark keeps the bag's payout a mystery until collection.
            g.lineStyle(3, 0x795734);
            g.beginPath().moveTo(-5, -1).lineTo(-3, -5).lineTo(4, -5)
                .lineTo(6, -1).lineTo(0, 4).lineTo(0, 7).strokePath();
            g.fillStyle(0x795734).fillCircle(0, 12, 2);
            return;
        }
        const rock = kind === 'rock' || kind === 'largeRock';
        // Uneven silhouettes and flat facets distinguish ore from round pebbles.
        const outline = rock
            ? [[-0.95, 0.25], [-0.8, -0.5], [-0.25, -0.9], [0.5, -0.78], [0.95, -0.15], [0.8, 0.65], [0.1, 0.9], [-0.6, 0.75]]
            : [[-0.95, 0.1], [-0.7, -0.55], [-0.28, -0.6], [0.05, -0.94], [0.65, -0.68], [0.93, -0.05], [0.65, 0.65], [-0.1, 0.9], [-0.65, 0.65]];
        g.fillStyle(type.color).lineStyle(3, rock ? 0x414952 : 0x986019);
        g.beginPath();
        outline.forEach(([x, y], index) => {
            if (index === 0) g.moveTo(x * r, y * r);
            else g.lineTo(x * r, y * r);
        });
        g.closePath().fillPath().strokePath();
        g.fillStyle(rock ? 0xb6bfc3 : 0xffe889);
        g.fillTriangle(-0.7 * r, -0.5 * r, -0.25 * r, -0.65 * r, -0.35 * r, 0.1 * r);
        g.fillTriangle(-0.25 * r, -0.65 * r, 0.5 * r, -0.6 * r, 0.1 * r, -0.1 * r);
        g.fillStyle(rock ? 0x68757e : 0xd99a20);
        g.fillTriangle(0.1 * r, -0.1 * r, 0.85 * r, -0.05 * r, 0.6 * r, 0.6 * r);
        g.fillTriangle(-0.6 * r, 0.6 * r, 0.6 * r, 0.6 * r, -0.1 * r, 0.8 * r);
        if (rock) {
            g.lineStyle(2, 0x535f68);
            g.beginPath().moveTo(-0.1 * r, -0.5 * r).lineTo(0.12 * r, -0.12 * r)
                .lineTo(-0.12 * r, 0.2 * r).lineTo(0.1 * r, 0.5 * r).strokePath();
            g.fillStyle(0x58636c).fillEllipse(-0.5 * r, 0.3 * r, 5, 3).fillEllipse(0.5 * r, -0.35 * r, 4, 3);
        } else {
            g.lineStyle(2, 0xfff6c7);
            const x = -0.36 * r;
            const y = -0.33 * r;
            g.lineBetween(x - 4, y, x + 4, y).lineBetween(x, y - 4, x, y + 4);
        }
    }

    get isRat(): boolean { return this.kind === 'rat' || this.kind === 'diamondRat'; }

    collectionValue(diamondMultiplier = 1): number {
        if (this.kind === 'diamondRat') return 2 + Math.round(TYPES.diamond.value * diamondMultiplier);
        return Math.round(this.value * (this.kind === 'diamond' ? diamondMultiplier : 1));
    }

    update(seconds: number, objects: Collectable[]): void {
        if (!this.available || !this.isRat) return;
        const nextX = this.x + this.direction * this.speed * seconds;
        const dx = nextX - 512;
        const dy = this.y - 210;
        const blocked = Math.hypot(dx, dy) > 565 - this.radius
            || Math.abs(Math.atan2(dx, dy)) > 1.05
            || objects.some(other => other !== this && other.available
                && Math.hypot(nextX - other.x, this.y - other.y) < this.radius + other.radius + 4);
        if (blocked) this.direction *= -1;
        else this.moveTo(nextX, this.y);
        this.graphic.setScale(this.direction, 1);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.graphic.setPosition(x, y);
    }

    destroy(): void { this.graphic.destroy(); }
}

export function generateCollectables(scene: Scene, level: LevelConfig = LEVELS[0]): Collectable[] {
    // Place the largest objects first; retry the whole layout if it becomes crowded.
    const kinds: OreKind[] = [
        'giant', ...Array<OreKind>(level.largeRocks).fill('largeRock'),
        'large', ...Array<OreKind>(level.rocks).fill('rock'),
        'medium', 'medium', 'medium',
        ...Array<OreKind>(level.moneyBags).fill('moneyBag'),
        ...Array<OreKind>(level.diamonds).fill('diamond'),
        'small', 'small', 'small', 'small',
        ...Array<OreKind>(level.rats).fill('rat'),
        ...Array<OreKind>(level.diamondRats).fill('diamondRat')
    ];
    for (let layout = 0; layout < 50; layout++) {
        const positions: { x: number; y: number; radius: number; kind: OreKind }[] = [];
        for (const [index, kind] of kinds.entries()) {
            const radius = TYPES[kind].radius;
            for (let attempt = 0; attempt < 2000; attempt++) {
                const x = 65 + Math.random() * 894;
                const y = level.minimumDepth + Math.random() * (680 - level.minimumDepth);
                const dx = x - 512;
                const dy = y - 210;
                if (y + radius > 710 || Math.hypot(dx, dy) > 565 - radius || Math.abs(Math.atan2(dx, dy)) > 1.05) continue;
                if (positions.some(other => Math.hypot(x - other.x, y - other.y) < radius + other.radius + 18)) continue;
                positions.push({ x, y, radius, kind });
                break;
            }
            if (positions.length < index + 1) break;
        }
        if (positions.length === kinds.length) {
            return positions.map(({ x, y, kind }) => new Collectable(scene, x, y, kind));
        }
    }
    throw new Error('Could not generate a complete mining layout.');
}
