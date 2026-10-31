import { TNT_BLAST_RADIUS } from './Explosions';
import { findClearAim } from './Aiming';
import { RAT_LANE_Y } from '../state/Layouts';
import { WORLD } from '../state/World';
import { POLISHED_ROCK_VALUES } from '../state/Upgrades';
import { GameObjects, Scene } from 'phaser';
import { LEVELS, LevelConfig } from '../state/Levels';

export type OreKind = 'small' | 'medium' | 'large' | 'giant' | 'rock' | 'largeRock' | 'diamond' | 'moneyBag' | 'rat' | 'diamondRat' | 'tnt' | 'strengthPotion' | 'goldRush' | 'timeVial' | 'mysteryBag';
const TYPES = {
    goldRush: { radius: 19, value: 0, weight: 0.2, color: 0xffc52e },
    timeVial: { radius: 19, value: 0, weight: 0.2, color: 0x66d9fa },
    mysteryBag: { radius: 30, value: 0, weight: 3, color: 0x837097 },
    strengthPotion: { radius: 19, value: 0, weight: 0.2, color: 0x80d65b },
    tnt: { radius: 40, value: 0, weight: 1, color: 0xbb3c2d },
    rat: { radius: 21, value: 2, weight: 0.1, color: 0x88766a },
    diamondRat: { radius: 24, value: 602, weight: 0.2, color: 0x88766a },
    diamond: { radius: 17, value: 600, weight: 0.4, color: 0x70e6f5 },
    moneyBag: { radius: 22, value: 0, weight: 1.2, color: 0xc49450 },
    small: { radius: 15, value: 90, weight: 0.6, color: 0xffdf49 },
    medium: { radius: 32, value: 180, weight: 1.5, color: 0xffca28 },
    large: { radius: 48, value: 300, weight: 3, color: 0xf5b51b },
    giant: { radius: 72, value: 500, weight: 4.8, color: 0xf0b21d },
    largeRock: { radius: 62, value: 25, weight: 5.5, color: 0x7e8993 },
    rock: { radius: 30, value: 15, weight: 3.8, color: 0x89939b }
};

export class Collectable {
    readonly radius: number;
    readonly value: number;
    readonly weight: number;
    readonly graphic: GameObjects.Graphics;
    available = true;
    private direction: number;
    private readonly speed: number;
    private catchGlow?: GameObjects.Graphics;

    constructor(scene: Scene, public x: number, public y: number, readonly kind: OreKind, ratSpeed = 1, random: () => number = Math.random) {
        this.direction = random() < 0.5 ? -1 : 1;
        this.speed = (80 + random() * 30) * 0.85 * ratSpeed;
        const type = TYPES[kind];
        this.radius = type.radius;
        this.value = kind === 'moneyBag' ? 50 + Math.floor(random() * 15) * 25 : type.value;
        this.weight = type.weight;
        this.graphic = scene.add.graphics().setPosition(x, y);
        const r = this.radius;
        const g = this.graphic;
        if (kind === 'strengthPotion' || kind === 'goldRush' || kind === 'timeVial') {
            g.fillStyle(0x9fc9bd).lineStyle(3, 0x365c50);
            g.beginPath().moveTo(-6, -13).lineTo(-6, -5).lineTo(-14, 3)
                .lineTo(-14, 13).lineTo(-8, 17).lineTo(8, 17).lineTo(14, 13)
                .lineTo(14, 3).lineTo(6, -5).lineTo(6, -13).closePath().fillPath().strokePath();
            g.fillStyle(type.color).fillRoundedRect(-10, 3, 20, 11, 3);
            g.fillStyle(kind === 'goldRush' ? 0xffee9a : kind === 'timeVial' ? 0xd5f8ff : 0xaff17d).fillRect(-8, 4, 4, 7);
            g.fillStyle(0xad7c43).lineStyle(2, 0x694729)
                .fillRoundedRect(-7, -18, 14, 7, 2).strokeRoundedRect(-7, -18, 14, 7, 2);
            if (kind === 'goldRush') {
                g.fillStyle(0xfff1af).lineStyle(1, 0x986019);
                g.beginPath().moveTo(-6, 6).lineTo(-2, 1).lineTo(4, 2)
                    .lineTo(7, 8).lineTo(0, 12).closePath().fillPath().strokePath();
            } else if (kind === 'timeVial') {
                g.fillStyle(0xe8ffff).fillCircle(0, 6, 7);
                g.lineStyle(1.5, 0x287e9a).strokeCircle(0, 6, 7)
                    .lineBetween(0, 6, 0, 1).lineBetween(0, 6, 4, 8);
            } else {
                g.fillStyle(0xfff1af).fillTriangle(2, -1, -4, 7, 1, 7).fillTriangle(-1, 5, 4, 5, -2, 13);
            }
            g.lineStyle(2, 0xe0f6de).lineBetween(-9, -1, -11, 2);
            return;
        }
        if (kind === 'tnt') {
            const w = r * 0.65;
            const h = r * 0.82;
            g.fillStyle(type.color).lineStyle(3, 0x633128);
            g.fillRoundedRect(-w, -h, w * 2, h * 2, 7).strokeRoundedRect(-w, -h, w * 2, h * 2, 7);
            g.fillStyle(0x8d3027).fillRect(w * 0.5, -h + 5, w * 0.4, h * 2 - 10);
            g.fillStyle(0xdf6245).fillRect(-w * 0.73, -h + 6, w * 0.2, h * 2 - 12);
            g.fillStyle(0x7b4636).fillEllipse(0, -h + 3, w * 2, 10);
            g.lineStyle(2, 0x4b3a30).strokeEllipse(0, -h + 3, w * 2, 10);
            g.fillStyle(0x5d6262).fillRect(-w - 1, -h * 0.58, w * 2 + 2, 7).fillRect(-w - 1, h * 0.52, w * 2 + 2, 7);
            g.lineStyle(1, 0x9aa09b).lineBetween(-w, -h * 0.58, w, -h * 0.58)
                .lineBetween(-w, h * 0.52, w, h * 0.52);
            g.fillStyle(0xffe7a3).fillRoundedRect(-w + 4, -11, w * 2 - 8, 24, 2);
            g.lineStyle(3, 0x793524);
            for (const x of [-14, 14]) g.lineBetween(x - 4, -5, x + 4, -5).lineBetween(x, -5, x, 7);
            g.beginPath().moveTo(-5, 7).lineTo(-5, -5).lineTo(5, 7).lineTo(5, -5).strokePath();
            return;
        }
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
        if (kind === 'moneyBag' || kind === 'mysteryBag') {
            const mystery = kind === 'mysteryBag';
            g.save().scaleCanvas(r / 22, r / 22);
            // Faceted canvas, dark contour and warm highlights match the ore art.
            g.fillStyle(type.color).lineStyle(3, mystery ? 0x48364f : 0x73502c);
            g.beginPath().moveTo(-5, -10).lineTo(-13, -3).lineTo(-18, 8)
                .lineTo(-14, 17).lineTo(-4, 20).lineTo(12, 18).lineTo(18, 11)
                .lineTo(15, 0).lineTo(6, -10).closePath().fillPath().strokePath();
            g.fillStyle(mystery ? 0xb6a0c6 : 0xe2b66c);
            g.beginPath().moveTo(-5, -9).lineTo(-12, 0).lineTo(-13, 10)
                .lineTo(-7, 15).lineTo(-5, 2).lineTo(0, -6).closePath().fillPath();
            g.fillStyle(mystery ? 0x675279 : 0xa37239);
            g.beginPath().moveTo(6, -8).lineTo(11, 5).lineTo(9, 14)
                .lineTo(-4, 18).lineTo(11, 17).lineTo(16, 10).lineTo(13, 1).closePath().fillPath();
            // Gathered mouth and a knotted rope replace the old flat triangle.
            g.fillStyle(type.color).lineStyle(2, mystery ? 0x48364f : 0x73502c);
            g.beginPath().moveTo(-5, -10).lineTo(-10, -20).lineTo(-2, -18)
                .lineTo(6, -21).lineTo(9, -19).lineTo(5, -10).closePath().fillPath().strokePath();
            g.lineStyle(2, 0x9a6c35).lineBetween(-3, -17, -1, -11).lineBetween(5, -18, 3, -11);
            g.lineStyle(3, 0x66472a).lineBetween(-7, -10, 7, -10);
            g.lineStyle(2, 0xe4bf7b).lineBetween(-6, -11, 6, -11);
            g.lineStyle(2, 0x66472a).strokeEllipse(9, -10, 8, 5).lineBetween(7, -8, 12, -4);
            if (mystery) {
                g.lineStyle(3, 0xffedb7);
                g.beginPath().moveTo(-6, 0).lineTo(-5, -4).lineTo(3, -5)
                    .lineTo(7, -1).lineTo(6, 3).lineTo(0, 7).lineTo(0, 9).strokePath();
                g.fillStyle(0xffedb7).fillCircle(0, 14, 1.7);
                g.restore();
                return;
            }
            // A painted dollar sign identifies a cash sack; payout stays random.
            g.lineStyle(2.5, 0x67472a);
            g.beginPath().moveTo(6, -1).lineTo(-1, -2).lineTo(-5, 1).lineTo(-3, 5)
                .lineTo(4, 7).lineTo(5, 10).lineTo(1, 13).lineTo(-6, 12).strokePath();
            g.lineBetween(0, -5, 0, 15);
            g.restore();
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

    /** Catch feedback uses known values only: sealed mystery bags keep their secret. */
    celebrateCatch(scene: Scene, value = this.value): boolean {
        if (value < 90) return false;
        const intensity = Math.min(1, Math.max(0, (value - 90) / 660));
        const color = this.kind === 'diamond' || this.kind === 'diamondRat' ? 0x9ef5ff : 0xffe48a;
        const glow = scene.add.graphics().setPosition(this.x, this.y).setDepth(4);
        this.catchGlow = glow;
        const r = this.radius;
        if (intensity > 0.1) glow.fillStyle(color, intensity * 0.16).fillCircle(0, 0, r + 10);
        if (intensity > 0.3) glow.lineStyle(2, color, intensity * 0.7).strokeCircle(0, 0, r + 6);
        const count = 1 + Math.round(intensity * 11);
        for (let i = 0; i < count; i++) {
            const angle = i * Math.PI * 2 / count;
            const distance = r + 12 + (i % 2) * 9;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const size = (i % 2 === 0 ? 2.5 : 2) + intensity * 5;
            glow.fillStyle(i % 2 === 0 ? 0xffffff : color);
            glow.fillTriangle(x - size, y, x, y - 2, x + size, y);
            glow.fillTriangle(x - size, y, x, y + 2, x + size, y);
            glow.fillTriangle(x, y - size, x - 2, y, x, y + size);
            glow.fillTriangle(x, y - size, x + 2, y, x, y + size);
        }
        // A bright glint sweeps across the face while the burst follows the hauled ore.
        glow.lineStyle(1 + intensity * 2, 0xffffff, 0.3 + intensity * 0.6)
            .lineBetween(-r * 0.35, -r * 0.4, r * 0.15, r * 0.15);
        glow.setAlpha(0.45 + intensity * 0.55);
        scene.tweens.add({
            targets: glow, scale: 1.05 + intensity * 0.65, alpha: 0,
            duration: 200 + intensity * 750, ease: 'Cubic.easeOut',
            onComplete: () => { glow.destroy(); if (this.catchGlow === glow) this.catchGlow = undefined; }
        });
        return true;
    }

    collectionValue(diamondMultiplier = 1, rockPolish = false): number {
        if (rockPolish && (this.kind === 'rock' || this.kind === 'largeRock')) return POLISHED_ROCK_VALUES[this.kind];
        if (this.kind === 'diamondRat') return 2 + Math.round(TYPES.diamond.value * diamondMultiplier);
        return Math.round(this.value * (this.kind === 'diamond' ? diamondMultiplier : 1));
    }

    update(seconds: number, objects: Collectable[]): void {
        if (!this.available || !this.isRat) return;
        const nextX = this.x + this.direction * this.speed * seconds;
        const dx = nextX - 512;
        const dy = this.y - 210;
        const blocked = Math.hypot(dx, dy) > WORLD.spawnRange - this.radius
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
        this.catchGlow?.setPosition(x, y);
    }

    destroy(): void {
        this.available = false;
        if (this.catchGlow) {
            this.catchGlow.scene.tweens.killTweensOf(this.catchGlow);
            this.catchGlow.destroy();
            this.catchGlow = undefined;
        }
        this.graphic.destroy();
    }
}

/** Valuable catches require a longer trip; mystery bags keep an unknown payout. */
export function spawnDepthRange(kind: OreKind, minimumDepth: number): [number, number] {
    switch (kind) {
        case 'strengthPotion':
        case 'goldRush':
        case 'timeVial': return [minimumDepth, 860];
        case 'tnt': return [400, 820];
        case 'diamond': return [800, 880];
        case 'diamondRat': return [570, 700];
        case 'giant': return [700, 840];
        case 'large': return [570, 730];
        case 'mysteryBag': return [570, 800];
        case 'moneyBag': return [570, 820];
        case 'medium': return [Math.max(minimumDepth, 440), 620];
        case 'small': return [minimumDepth, 500];
        default: return [minimumDepth, 880];
    }
}

const isStaticHazard = (kind: OreKind): boolean => kind === 'rock' || kind === 'largeRock';
const needsAimingGap = (kind: OreKind): boolean => !isStaticHazard(kind) && kind !== 'tnt' && kind !== 'rat' && kind !== 'diamondRat';

export function generateCollectables(scene: Scene, level: LevelConfig = LEVELS[0], random: () => number = Math.random): Collectable[] {
    // Place the largest objects first; retry the whole layout if it becomes crowded.
    const kinds: OreKind[] = [
        'giant', ...Array<OreKind>(level.largeRocks).fill('largeRock'),
        'large', ...Array<OreKind>(level.rocks).fill('rock'),
        ...Array<OreKind>(level.tnt).fill('tnt'),
        'medium', 'medium', 'medium',
        ...Array<OreKind>(level.moneyBags).fill('moneyBag'),
        ...Array<OreKind>(level.diamonds).fill('diamond'),
        'small', 'small', 'small', 'small', 'strengthPotion', 'goldRush', 'timeVial', 'mysteryBag',
        ...Array<OreKind>(level.rats).fill('rat'),
        ...Array<OreKind>(level.diamondRats).fill('diamondRat')
    ];
    kinds.sort((a, b) => TYPES[b].radius - TYPES[a].radius);
    for (let layout = 0; layout < 50; layout++) {
        const positions: { x: number; y: number; radius: number; kind: OreKind }[] = [];
        for (const [index, kind] of kinds.entries()) {
            const radius = TYPES[kind].radius;
            const [minY, maxY] = spawnDepthRange(kind, level.minimumDepth);
            for (let attempt = 0; attempt < 2000; attempt++) {
                let x = 65 + random() * 894;
                let y = minY + random() * (maxY - minY);
                const gold = kind === 'small' || kind === 'medium' || kind === 'large' || kind === 'giant';
                const rock = kind === 'rock' || kind === 'largeRock';
                if (level.layout === 'goldPocket') {
                    if (gold) x = 260 + random() * 504;
                    if (rock) y = 500 + random() * 280;
                } else if (level.layout === 'ratTunnels') {
                    if (kind === 'rat') y = RAT_LANE_Y + random() * 8 - 4;
                    // Leave an actual open horizontal route for the nuisance rats.
                    else if (y + radius > RAT_LANE_Y - 38 && y - radius < RAT_LANE_Y + 38) continue;
                } else if (level.layout === 'explosiveCavern') {
                    const anchors = positions.filter(position => kind === 'tnt'
                        ? position.kind === 'giant' || position.kind === 'large'
                        : position.kind === 'tnt');
                    if ((kind === 'tnt' || kind === 'diamond') && anchors.length && attempt < 300) {
                        const anchor = anchors[Math.floor(random() * anchors.length)];
                        const angle = random() * Math.PI * 2;
                        const separation = radius + anchor.radius + 20 + random() * 25;
                        x = anchor.x + Math.cos(angle) * separation;
                        y = anchor.y + Math.sin(angle) * separation;
                        if (y < minY || y > maxY) continue;
                    }
                } else if (level.layout === 'deepMine' && (gold || kind === 'moneyBag')) {
                    const deeperMin = Math.min(860 - radius, minY + (kind === 'small' ? 80 : 55));
                    const deeperMax = Math.min(890 - radius, maxY + 55);
                    y = deeperMin + random() * (deeperMax - deeperMin);
                }
                const dx = x - 512;
                const dy = y - 210;
                if (x - radius < 40 || x + radius > WORLD.width - 40 || y + radius > WORLD.floorY || Math.hypot(dx, dy) > WORLD.spawnRange - radius || Math.abs(Math.atan2(dx, dy)) > 1.05) continue;
                if (positions.some(other => Math.hypot(x - other.x, y - other.y) < radius + other.radius + 18)) continue;
                // Include the other barrel's hit radius, plus a gap beyond the blast edge.
                if (kind === 'tnt' && positions.some(other => other.kind === 'tnt'
                    && Math.hypot(x - other.x, y - other.y) < TNT_BLAST_RADIUS + Math.max(radius, other.radius) + 25)) continue;
                const candidate = { x, y, radius, kind };
                const hazards = positions.filter(other => isStaticHazard(other.kind));
                if (isStaticHazard(kind)) {
                    hazards.push(candidate);
                    if (positions.some(other => needsAimingGap(other.kind) && findClearAim(other, hazards) === null)) continue;
                } else if (needsAimingGap(kind) && findClearAim(candidate, hazards) === null) continue;
                positions.push(candidate);
                break;
            }
            if (positions.length < index + 1) break;
        }
        if (positions.length === kinds.length) {
            return positions.map(({ x, y, kind }) => new Collectable(scene, x, y, kind, level.ratSpeed, random));
        }
    }
    throw new Error('Could not generate a complete mining layout.');
}
