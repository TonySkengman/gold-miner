import { LAYOUTS } from '../state/Layouts';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';
import { drawShop, drawShopProduct } from '../art/drawShop';
import { Scene } from 'phaser';
import { LEVELS } from '../state/Levels';
import { emptyBonuses, isPermanentUpgrade, itemSoldOut, emptyUpgrades, purchaseUpgrade, upgradePrice, UPGRADE_INFO, UPGRADE_LIMIT, ShopItemKind, Upgrades, LevelBonuses } from '../state/Upgrades';

export class UpgradeShop extends Scene {
    constructor() { super('UpgradeShop'); }

    create(data: { lives: number; level: number; money: number; upgrades?: Upgrades; dynamite: number; bonuses?: LevelBonuses }): void {
        let bonuses = { ...emptyBonuses(), ...data.bonuses };
        let money = data.money;
        let dynamite = data.dynamite;
        let upgrades = { ...(data.upgrades ?? emptyUpgrades()) };
        let hovered: ShopItemKind | null = null;
        drawShop(this);
        addSoundButton(this, 32, 16);
        this.add.text(512, 80, `LEVEL ${data.level - 1} CLEARED!`, { fontFamily: 'Arial', fontSize: 30, fontStyle: 'bold', color: '#483126' }).setOrigin(0.5);
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
            const maxed = itemSoldOut(hovered, upgrades);
            const price = upgradePrice(hovered, upgrades);
            descriptionTitle.setText(info.name);
            description.setText(`${info.description}. ${maxed ? (isPermanentUpgrade(hovered) ? 'Fully upgraded!' : 'Ready for the next level!') : `${isPermanentUpgrade(hovered) ? 'Next tier' : 'Price'}: $${price}.${money < price ? ' You need more money.' : ' Click the product to buy.'}`}`);
        };
        const stock = this.add.text(512, 115, '', { fontFamily: 'Arial', fontSize: 20, color: '#483126' }).setOrigin(0.5);
        const refreshers: (() => void)[] = [];
        const refresh = () => {
            stock.setText(`Dynamite: ${dynamite}  •  Luck: ${bonuses.luck}  •  Extra time: ${bonuses.extraTime}  •  Rock polish: ${bonuses.rockPolish}`);
            balance.setText(`MONEY  $${money}`);
            refreshers.forEach(update => update());
            showDescription();
        };
        (Object.keys(UPGRADE_INFO) as ShopItemKind[]).forEach((kind, index) => {
            const x = 422 + (index % 3) * 201;
            const y = index < 3 ? 412 : 603;
            const card = this.add.rectangle(x, y, 185, 180, 0xf4dcaa).setStrokeStyle(3, 0xc29659).setInteractive({ useHandCursor: true });
            drawShopProduct(this, x, y - 8, kind, 0.6);
            this.add.text(x, y - 78, UPGRADE_INFO[kind].name, { fontFamily: 'Arial', fontSize: 20, fontStyle: 'bold', color: '#483126', align: 'center', wordWrap: { width: 170 } }).setOrigin(0.5, 0);
            const tier = this.add.text(x, y + 37, '', { fontFamily: 'Arial', fontSize: 18, color: '#70452a' }).setOrigin(0.5);
            const priceTag = this.add.text(x, y + 70, '', { fontFamily: 'Arial', fontSize: 20, fontStyle: 'bold', color: '#ffffff', padding: { x: 14, y: 7 } }).setOrigin(0.5);
            refreshers.push(() => {
                const maxed = itemSoldOut(kind, upgrades);
                const price = upgradePrice(kind, upgrades);
                tier.setText(isPermanentUpgrade(kind) ? `TIER ${upgrades[kind]} / ${UPGRADE_LIMIT}`
                    : kind === 'dynamite' ? `OWNED: ${dynamite}` : `ROUNDS: ${bonuses[kind]}`);
                priceTag.setText(maxed ? (isPermanentUpgrade(kind) ? 'MAXED' : 'BOUGHT') : `BUY $${price}`);
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
                const purchase = purchaseUpgrade(kind, money, upgrades, dynamite, bonuses);
                if (purchase) {
                    soundEffects.unlock();
                    soundEffects.play('buy');
                    bonuses = purchase.bonuses;
                    dynamite = purchase.dynamite;
                    money = purchase.money;
                    upgrades = purchase.upgrades;
                }
                refresh();
            });
        });
        const next = this.add.text(512, 867, `START LEVEL ${data.level}`, { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#ffffff', backgroundColor: '#547f3b', padding: { x: 28, y: 16 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        next.once('pointerdown', () => this.scene.start('LevelBriefing', { lives: data.lives, level: data.level, money, upgrades, dynamite, bonuses }));
        this.add.text(512, 926, `${LAYOUTS[LEVELS[data.level - 1].layout].name}  •  Target: $${LEVELS[data.level - 1].target}  •  Buying is optional`, { fontFamily: 'Arial', fontSize: 19, color: '#483126' }).setOrigin(0.5);
        refresh();
    }
}
