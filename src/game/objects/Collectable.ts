import { GameObjects, Scene } from 'phaser';

export type OreKind = 'small' | 'medium' | 'large' | 'rock';
const TYPES = {
    small: { radius: 15, value: 90, weight: 0.6, color: 0xffdf49 },
    medium: { radius: 24, value: 180, weight: 1.5, color: 0xffca28 },
    large: { radius: 35, value: 300, weight: 3, color: 0xf5b51b },
    rock: { radius: 26, value: 15, weight: 3.8, color: 0x89939b }
};

export class Collectable {
    readonly radius: number;
    readonly value: number;
    readonly weight: number;
    readonly graphic: GameObjects.Graphics;
    available = true;

    constructor(scene: Scene, public x: number, public y: number, kind: OreKind) {
        const type = TYPES[kind];
        this.radius = type.radius;
        this.value = type.value;
        this.weight = type.weight;
        this.graphic = scene.add.graphics().setPosition(x, y);
        const r = this.radius;
        this.graphic.fillStyle(type.color).lineStyle(3, kind === 'rock' ? 0x505963 : 0xa66c16);
        this.graphic.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const radius = r * (i % 2 === 0 ? 1 : 0.86);
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) this.graphic.moveTo(px, py);
            else this.graphic.lineTo(px, py);
        }
        this.graphic.closePath().fillPath().strokePath();
        this.graphic.fillStyle(kind === 'rock' ? 0xb4bcc0 : 0xffef99);
        this.graphic.fillEllipse(-r * 0.25, -r * 0.28, r * 0.65, r * 0.3);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.graphic.setPosition(x, y);
    }

    destroy(): void { this.graphic.destroy(); }
}

export function generateCollectables(scene: Scene): Collectable[] {
    const objects: Collectable[] = [];
    const kinds: OreKind[] = ['large', 'large', 'medium', 'medium', 'medium', 'small', 'small', 'small', 'small', 'rock', 'rock', 'rock', 'rock'];
    for (const kind of kinds) {
        const radius = TYPES[kind].radius;
        for (let attempt = 0; attempt < 400; attempt++) {
            const x = 65 + Math.random() * 894;
            const y = 320 + Math.random() * 360;
            // Keep every nugget inside the claw's reachable fan and away from its neighbours.
            const dx = x - 512;
            const dy = y - 210;
            if (Math.hypot(dx, dy) > 565 - radius || Math.abs(Math.atan2(dx, dy)) > 1.05) continue;
            if (objects.some(other => Math.hypot(x - other.x, y - other.y) < radius + other.radius + 18)) continue;
            objects.push(new Collectable(scene, x, y, kind));
            break;
        }
    }
    return objects;
}
