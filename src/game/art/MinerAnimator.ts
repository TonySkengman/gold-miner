import { soundEffects } from '../audio/SoundEffects';
import { WORLD } from '../state/World';
import type { OreKind } from '../objects/Collectable';
import { GameObjects, Scene } from 'phaser';

/** A simple jointed miner, driven by the actual winch retrieval speed. */
export class MinerAnimator {
    private readonly body: GameObjects.Container;
    private readonly mechanism: GameObjects.Graphics;
    private phase = 0;
    private enginePhase = 0;
    private feedRemaining = 0;
    private ignitionPending = false;
    private effort = 0;
    private reaction: 'celebrate' | 'disappointed' | null = null;
    private reactionRemaining = 0;

    constructor(private readonly scene: Scene) {
        // Boots stay planted while the upper body leans around the hips.
        scene.add.graphics().setPosition(WORLD.centerX - 512, 0).setData('responsiveAnchor', 'center').setDepth(6).fillStyle(0x49372d)
            .fillRoundedRect(484, 195, 26, 10, 3).fillRoundedRect(516, 195, 26, 10, 3);
        const g = scene.add.graphics().setPosition(-512, -195);
        this.body = scene.add.container(WORLD.centerX, 195, [g]).setData('responsiveAnchor', 'center').setDepth(6);
        g.fillStyle(0x355e83).fillRoundedRect(491, 171, 42, 25, 5);
        g.fillStyle(0xb94d39).fillRoundedRect(489, 161, 46, 21, 7);
        g.fillStyle(0x477ca1).fillRect(500, 164, 6, 23).fillRect(520, 164, 6, 23).fillRect(499, 178, 28, 16);
        g.fillStyle(0xe8be57).fillCircle(503, 181, 2).fillCircle(523, 181, 2);


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

        this.mechanism = scene.add.graphics().setPosition(WORLD.centerX - 512, 0).setData('responsiveAnchor', 'center').setDepth(7);
        this.update(0, 0, false);
    }

    activateOverdrive(): void {
        this.feedRemaining = 0.6;
        this.ignitionPending = true;
        soundEffects.play('throw');
        const label = this.scene.add.text(WORLD.centerX + 80, 105, 'DYNAMITE OVERDRIVE! x2', {
            fontFamily: 'Arial', fontSize: 16, fontStyle: 'bold', color: '#ffe06a',
            backgroundColor: '#483126', padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(17).setData('responsiveAnchor', 'center');
        this.scene.tweens.add({ targets: label, alpha: 0, delay: 650, duration: 300,
            onComplete: () => label.destroy() });
    }

    reactTo(kind: OreKind): void {
        this.reaction = kind === 'diamond' || kind === 'ruby' || kind === 'diamondRat' || kind === 'rubyRat' || kind === 'treasureChest' ? 'celebrate'
            : kind === 'rat' ? 'disappointed' : null;
        this.reactionRemaining = this.reaction ? 1.3 : 0;
    }

    update(seconds: number, retrievalSpeed: number, loaded: boolean, weight = 0, overdrive = false): void {
        this.feedRemaining = Math.max(0, this.feedRemaining - seconds);
        if (this.ignitionPending && this.feedRemaining <= 0.3) {
            this.ignitionPending = false;
            soundEffects.play('explosion');
        }
        this.enginePhase += seconds * (overdrive ? 18 : 2);
        this.reactionRemaining = Math.max(0, this.reactionRemaining - seconds);
        if (this.reactionRemaining === 0 || loaded) this.reaction = null;
        const celebrating = this.reaction === 'celebrate';
        const disappointed = this.reaction === 'disappointed';
        const targetEffort = loaded ? Math.max(0, Math.min(1, (weight - 0.6) / 4.2)) : 0;
        this.effort += (targetEffort - this.effort) * (1 - Math.exp(-seconds * 10));
        this.phase = (this.phase + seconds * Math.min(overdrive ? 12 : 5, retrievalSpeed / 35)) % (Math.PI * 2);
        // Heavy loads have a slow sticking point followed by a forceful pull.
        const crankAngle = this.phase + this.effort * 0.7 * Math.sin(this.phase);
        const stroke = (1 + Math.sin(crankAngle)) / 2;
        const lean = this.effort * (0.08 + stroke * 0.15)
            + (disappointed ? Math.sin(this.reactionRemaining * 10) * 0.07 : 0);
        const crouch = this.effort * (2 + stroke * 3)
            + (celebrating ? -Math.abs(Math.sin(this.reactionRemaining * 7)) * 6 : disappointed ? 4 : 0);
        this.body.setPosition(WORLD.centerX, 195 + crouch).setRotation(lean);
        const bodyPoint = (x: number, y: number) => ({
            x: 512 + (x - 512) * Math.cos(lean) - (y - 195) * Math.sin(lean),
            y: 195 + crouch + (x - 512) * Math.sin(lean) + (y - 195) * Math.cos(lean)
        });
        const g = this.mechanism.clear();
        // Belt-driven engine sits beside the winch; only the engine shakes.
        const shake = overdrive ? Math.sin(this.enginePhase * 3) * 1.5 : 0;
        g.lineStyle(4, 0x44382b).lineBetween(529, 202, 573, 199).lineBetween(529, 215, 573, 213);
        g.fillStyle(0x49372d).fillRoundedRect(560, 222, 65, 8, 3);
        g.fillStyle(overdrive ? 0x8c5837 : 0x536269).lineStyle(2, 0x263238)
            .fillRoundedRect(566 + shake, 177, 54, 45, 6).strokeRoundedRect(566 + shake, 177, 54, 45, 6);
        g.fillStyle(0x252d30).fillRect(578 + shake, 164, 25, 15);
        g.fillStyle(0x11191c).fillEllipse(590 + shake, 164, 27, 9);
        g.fillStyle(0x333d42).fillRect(612 + shake, 163, 8, 23);
        g.fillStyle(overdrive ? 0xffcf65 : 0xb7c2c5).fillCircle(591 + shake, 191, 7);
        g.lineStyle(2, 0x453126).lineBetween(591 + shake, 191,
            591 + shake + Math.cos(this.enginePhase) * 5, 191 + Math.sin(this.enginePhase) * 5);
        g.lineStyle(2, 0x30383b);
        for (let i = 0; i < 3; i++) g.lineBetween(602 + shake, 200 + i * 5, 614 + shake, 200 + i * 5);
        g.fillStyle(0x829298).fillCircle(573, 207, 11);
        g.lineStyle(3, overdrive ? 0xffcf65 : 0x39464d).lineBetween(573, 207,
            573 + Math.cos(this.enginePhase) * 9, 207 + Math.sin(this.enginePhase) * 9);
        if (overdrive || this.feedRemaining > 0 && this.feedRemaining <= 0.3) {
            for (let i = 0; i < 4; i++) {
                const travel = (this.enginePhase * 0.22 + i / 4) % 1;
                g.fillStyle(0xb7b2a5, (1 - travel) * 0.55)
                    .fillCircle(616 + Math.sin(i + travel * 4) * 6, 161 - travel * 40, 3 + travel * 8);
                const a = this.enginePhase + i * Math.PI / 2;
                g.lineStyle(2, 0xffcf65, 0.8).lineBetween(573 + Math.cos(a) * 14, 207 + Math.sin(a) * 14,
                    573 + Math.cos(a) * 21, 207 + Math.sin(a) * 21);
            }
        }
        if (this.feedRemaining > 0.3) {
            const t = (0.6 - this.feedRemaining) / 0.3;
            const stickX = 545 + t * 45;
            const stickY = 164 - Math.sin(t * Math.PI) * 22;
            g.fillStyle(0xc43c2f).fillRoundedRect(stickX - 3, stickY - 8, 6, 16, 2);
            g.lineStyle(2, 0xe9c477).lineBetween(stickX, stickY - 8, stickX + 2, stickY - 12);
        }
        // Rotating spool spokes remain aligned with the rope pivot.
        g.fillStyle(0x414b50).fillCircle(512, 207, 17);
        g.fillStyle(0xc2945f).fillCircle(512, 207, 13);
        g.lineStyle(2, 0x775031).strokeCircle(512, 207, 9);
        for (let i = 0; i < 3; i++) {
            const angle = crankAngle + i * Math.PI * 2 / 3;
            g.lineBetween(512, 207, 512 + Math.cos(angle) * 12, 207 + Math.sin(angle) * 12);
        }
        const handX = 541 + Math.sin(crankAngle) * 17;
        const handY = 207 - Math.cos(crankAngle) * 17;
        g.lineStyle(4, 0x414b50).lineBetween(529, 207, 541, 207).lineBetween(541, 207, handX, handY);
        g.fillStyle(0x61422c).fillRoundedRect(handX - 6, handY - 4, 12, 8, 3);
        if (this.feedRemaining > 0.3) {
            const shoulder = bodyPoint(532, 174);
            g.lineStyle(10, 0xb94d39).lineBetween(shoulder.x, shoulder.y, 539, 178);
            g.lineStyle(7, 0xf1c08e).lineBetween(539, 178, 547, 164);
            g.fillStyle(0xf1c08e).fillCircle(547, 164, 5);
            const left = bodyPoint(491, 173);
            g.lineStyle(10, 0xb94d39).lineBetween(left.x, left.y, left.x - 8, left.y + 17);
            g.fillStyle(0xf1c08e).fillCircle(left.x - 8, left.y + 17, 5);
        } else if (celebrating || disappointed) {
            for (const side of [-1, 1]) {
                const shoulder = bodyPoint(512 + side * 21, 174);
                const hand = bodyPoint(512 + side * (celebrating ? 38 : 25), celebrating ? 132 : 198);
                const elbow = bodyPoint(512 + side * 35, celebrating ? 156 : 187);
                g.lineStyle(10, 0xb94d39).lineBetween(shoulder.x, shoulder.y, elbow.x, elbow.y);
                g.lineStyle(7, 0xf1c08e).lineBetween(elbow.x, elbow.y, hand.x, hand.y);
                g.fillStyle(0xf1c08e).fillCircle(hand.x, hand.y, 5);
            }
            const mouth = bodyPoint(513, 170);
            g.fillStyle(0x68402e).fillEllipse(mouth.x, mouth.y, celebrating ? 12 : 9, celebrating ? 7 : 3);
            if (celebrating) {
                g.fillStyle(0xfff3cc).fillRect(mouth.x - 4, mouth.y - 2, 8, 2);
                g.lineStyle(2, 0xffdc69);
                for (const side of [-1, 1]) {
                    const sparkle = bodyPoint(512 + side * 47, 123);
                    g.lineBetween(sparkle.x - 4, sparkle.y, sparkle.x + 4, sparkle.y)
                        .lineBetween(sparkle.x, sparkle.y - 4, sparkle.x, sparkle.y + 4);
                }
            } else {
                const left = bodyPoint(500, 143);
                const middle = bodyPoint(507, 140);
                const right = bodyPoint(526, 143);
                const inner = bodyPoint(519, 140);
                g.lineStyle(2, 0x755239).lineBetween(left.x, left.y, middle.x, middle.y)
                    .lineBetween(right.x, right.y, inner.x, inner.y);
            }
        } else {
            const rightShoulder = bodyPoint(532, 174);
            const elbowX = (rightShoulder.x + handX) / 2 + 10 - this.effort * 4;
            const elbowY = (rightShoulder.y + handY) / 2 - 2;
            g.lineStyle(10, 0xb94d39).lineBetween(rightShoulder.x, rightShoulder.y, elbowX, elbowY);
            g.lineStyle(7, 0xf1c08e).lineBetween(elbowX, elbowY, handX, handY);
            g.fillStyle(0xf1c08e).fillCircle(handX, handY, 5);
            const leftShoulder = bodyPoint(491, 173);
            if (this.effort > 0.25) {
                // Both hands on the crank, with a bent arm and a braced stance.
                const leftHandX = handX - 7;
                const leftHandY = handY - 2;
                const leftElbowX = leftShoulder.x - 10;
                const leftElbowY = leftShoulder.y + 20;
                g.lineStyle(10, 0xb94d39).lineBetween(leftShoulder.x, leftShoulder.y, leftElbowX, leftElbowY);
                g.lineStyle(7, 0xf1c08e).lineBetween(leftElbowX, leftElbowY, leftHandX, leftHandY);
                g.fillStyle(0xf1c08e).fillCircle(leftHandX, leftHandY, 5);
                const browA = bodyPoint(500, 141);
                const browB = bodyPoint(508, 145);
                const browC = bodyPoint(518, 145);
                const browD = bodyPoint(526, 141);
                g.lineStyle(3, 0x755239).lineBetween(browA.x, browA.y, browB.x, browB.y)
                    .lineBetween(browC.x, browC.y, browD.x, browD.y);
                if (this.effort > 0.65 && loaded) {
                    const sweat = bodyPoint(538, 145 + stroke * 8);
                    g.fillStyle(0xa8dce5).fillEllipse(sweat.x, sweat.y, 3, 6);
                }
            } else {
                const restingHand = bodyPoint(479, 189);
                g.lineStyle(10, 0xb94d39).lineBetween(leftShoulder.x, leftShoulder.y, restingHand.x, restingHand.y - 1);
                g.fillStyle(0xf1c08e).fillCircle(restingHand.x, restingHand.y, 6);
            }
        }
        g.fillStyle(0xa5b0b0).fillCircle(512, 207, 3);
    }
}
