import type { Result } from './GameOver';
import { LAYOUTS } from '../state/Layouts';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';
import { drawShop, drawShopProduct } from '../art/drawShop';
import { Scene } from 'phaser';
import { LEVELS } from '../state/Levels';
import { emptyBonuses, isPermanentUpgrade, itemSoldOut, emptyUpgrades, purchaseUpgrade, upgradePrice, UPGRADE_INFO, UPGRADE_LIMIT, ShopItemKind, Upgrades, LevelBonuses } from '../state/Upgrades';

export class UpgradeShop extends Scene {
    constructor() { super('UpgradeShop'); }

    create(data: { lives: number; level: number; money: number; upgrades?: Upgrades; dynamite: number; bonuses?: LevelBonuses; levelSeed?: number; failed?: boolean; result?: Result }): void {
        let bonuses = { ...emptyBonuses(), ...data.bonuses };
        let money = data.money;
        let lives = data.lives;
        let dynamite = data.dynamite;
        let upgrades = { ...(data.upgrades ?? emptyUpgrades()) };
        let hovered: ShopItemKind | null = null;
        drawShop(this);
        addSoundButton(this, 32, 16);
        this.add.text(512, 80, data.failed ? `LEVEL ${data.level} FAILED — RESTOCK & RETRY` : data.result?.finalLevel ? 'ALL LEVELS CLEARED!' : `LEVEL ${data.level - 1} CLEARED!`, { fontFamily: 'Arial', fontSize: 30, fontStyle: 'bold', color: '#483126' }).setOrigin(0.5);
        this.add.text(512, 180, 'MINER’S SUPPLIES', { fontFamily: 'Arial', fontSize: 32, fontStyle: 'bold', color: '#ffe5ac' }).setOrigin(0.5);
        const balance = this.add.text(990, 33, '', { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#483126' }).setOrigin(1, 0);
        this.add.text(203, 642, 'OLD BILL', { fontFamily: 'Arial', fontSize: 20, fontStyle: 'bold', color: '#ffe5ac' }).setOrigin(0.5);
        this.add.rectangle(512, 757, 850, 123, 0xffedbb).setStrokeStyle(3, 0x8e603c);
        const descriptionTitle = this.add.text(115, 716, '', { fontFamily: 'Arial', fontSize: 24, fontStyle: 'bold', color: '#483126' });
        const description = this.add.text(115, 753, '', { fontFamily: 'Arial', fontSize: 20, color: '#70452a', wordWrap: { width: 790 } });
        const showDescription = () => {
            if (!hovered) {
                descriptionTitle.setText('“Welcome, miner! Take a look at my wares.”');
                description.setText('Click to buy. Stock up on round items: one charge is used per round. Extra purchases cover future rounds.');
                return;
            }
            const info = UPGRADE_INFO[hovered];
            const maxed = itemSoldOut(hovered, upgrades, lives);
            const price = upgradePrice(hovered, upgrades);
            descriptionTitle.setText(info.name);
            description.setText(`${info.description}. ${maxed ? (isPermanentUpgrade(hovered) ? 'Fully upgraded!' : 'Lives full (5 / 5)!') : `${isPermanentUpgrade(hovered) ? 'Next tier' : 'Price'}: $${price}.${money < price ? ' You need more money.' : ' Click the product to buy.'}`}`);
        };
        const stock = this.add.text(512, 115, '', { fontFamily: 'Arial', fontSize: 15, color: '#483126' }).setOrigin(0.5);
        const refreshers: (() => void)[] = [];
        const refresh = () => {
            stock.setText(`Lives: ${lives}/5  •  Streak x2: ${bonuses.streakVial}  •  Lens: ${bonuses.prospectorsLens}  •  Dynamite: ${dynamite}  •  Luck: ${bonuses.luck}  •  Extra time: ${bonuses.extraTime}  •  Lightweight Grip: ${bonuses.lightweightGrip}`);
            balance.setText(`MONEY  $${money}`);
            next.setText(data.result?.won && data.result.finalLevel ? 'VIEW RESULTS'
                : lives === 0 ? 'END RUN' : `${data.failed ? 'RETRY' : 'START'} LEVEL ${data.level}`);
            refreshers.forEach(update => update());
            showDescription();
        };
        (Object.keys(UPGRADE_INFO) as ShopItemKind[]).forEach((kind, index) => {
            const x = 418 + (index % 3) * 216;
            const y = 360 + Math.floor(index / 3) * 130;
            const card = this.add.rectangle(x, y, 206, 122, 0xf4dcaa).setStrokeStyle(3, 0xc29659).setInteractive({ useHandCursor: true });
            drawShopProduct(this, x, y - 6, kind, 0.34);
            this.add.text(x, y - 54, UPGRADE_INFO[kind].name, { fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#483126', align: 'center', wordWrap: { width: 198 } }).setOrigin(0.5, 0);
            const tier = this.add.text(x, y + 21, '', { fontFamily: 'Arial', fontSize: 18, color: '#70452a' }).setOrigin(0.5);
            const priceTag = this.add.text(x, y + 46, '', { fontFamily: 'Arial', fontSize: 18, fontStyle: 'bold', color: '#ffffff', padding: { x: 14, y: 4 } }).setOrigin(0.5);
            refreshers.push(() => {
                const maxed = itemSoldOut(kind, upgrades, lives);
                const price = upgradePrice(kind, upgrades);
                tier.setText(isPermanentUpgrade(kind) ? `TIER ${upgrades[kind]} / ${UPGRADE_LIMIT}`
                    : kind === 'lifeVial' ? `LIVES: ${lives} / 5` : kind === 'dynamite' ? `OWNED: ${dynamite}` : `ROUNDS: ${bonuses[kind]}`);
                priceTag.setText(maxed ? (isPermanentUpgrade(kind) ? 'MAXED' : 'FULL') : `BUY $${price}`);
                priceTag.setBackgroundColor(maxed || money < price ? '#827968' : '#547f3b');
            });
            card.on('pointerover', () => {
                hovered = kind;
                card.setStrokeStyle(4, 0xfff3cc);
                showDescription();
            });
            card.on('pointerout', () => {
                hovered = null;
                card.setStrokeStyle(3, 0xc29659);
                showDescription();
            });
            card.on('pointerdown', () => {
                hovered = kind;
                const purchase = purchaseUpgrade(kind, money, upgrades, dynamite, bonuses, lives);
                if (purchase) {
                    soundEffects.unlock();
                    soundEffects.play('buy');
                    lives = purchase.lives;
                    bonuses = purchase.bonuses;
                    dynamite = purchase.dynamite;
                    money = purchase.money;
                    upgrades = purchase.upgrades;
                }
                refresh();
            });
        });
        const next = this.add.text(512, 867, `START LEVEL ${data.level}`, { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#ffffff', backgroundColor: '#547f3b', padding: { x: 28, y: 16 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        next.once('pointerdown', () => {
            if (data.result && (lives === 0 || (data.result.won && data.result.finalLevel))) {
                this.scene.start('GameOver', { ...data.result, lives, money, upgrades, dynamite });
                return;
            }
            this.scene.start('LevelBriefing', {
                lives, level: data.level, money, upgrades, dynamite, bonuses, levelSeed: data.levelSeed
            });
        });
        this.add.text(512, 926, `${LAYOUTS[LEVELS[data.level - 1].layout].name}  •  Target: $${LEVELS[data.level - 1].target}  •  Buying is optional`, { fontFamily: 'Arial', fontSize: 19, color: '#483126' }).setOrigin(0.5);
        refresh();
    }
}
