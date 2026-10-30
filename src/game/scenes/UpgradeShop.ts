import { LAYOUTS } from '../state/Layouts';
import { addSoundButton, soundEffects } from '../audio/SoundEffects';
import { drawShop, drawShopProduct } from '../art/drawShop';
import { Scene } from 'phaser';
import { LEVELS } from '../state/Levels';
import { emptyUpgrades, purchaseUpgrade, upgradePrice, UPGRADE_INFO, UPGRADE_LIMIT, ShopItemKind, Upgrades } from '../state/Upgrades';

export class UpgradeShop extends Scene {
    constructor() { super('UpgradeShop'); }

    create(data: { level: number; money: number; upgrades?: Upgrades; dynamite: number }): void {
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
                description.setText('Hover over a product to learn more. Click to buy. Upgrades last for this run.');
                return;
            }
            const info = UPGRADE_INFO[hovered];
            const maxed = hovered !== 'dynamite' && upgrades[hovered] >= UPGRADE_LIMIT;
            const price = upgradePrice(hovered, upgrades);
            descriptionTitle.setText(info.name);
            description.setText(`${info.description}. ${maxed ? 'Fully upgraded!' : `${hovered === 'dynamite' ? 'One stick' : 'Next tier'}: $${price}.${money < price ? ' You need more money.' : ' Click the product to buy.'}`}`);
        };
        const stock = this.add.text(512, 115, '', { fontFamily: 'Arial', fontSize: 20, color: '#483126' }).setOrigin(0.5);
        const refreshers: (() => void)[] = [];
        const refresh = () => {
            stock.setText(`Dynamite in your bag: ${dynamite}`);
            balance.setText(`MONEY  $${money}`);
            refreshers.forEach(update => update());
            showDescription();
        };
        (Object.keys(UPGRADE_INFO) as ShopItemKind[]).forEach((kind, index) => {
            const x = 422 + index * 201;
            const card = this.add.rectangle(x, 456, 185, 266, 0xf4dcaa).setStrokeStyle(3, 0xc29659).setInteractive({ useHandCursor: true });
            drawShopProduct(this, x, 443, kind);
            this.add.text(x, 350, UPGRADE_INFO[kind].name, { fontFamily: 'Arial', fontSize: 21, fontStyle: 'bold', color: '#483126', align: 'center', wordWrap: { width: 170 } }).setOrigin(0.5, 0);
            const tier = this.add.text(x, 513, '', { fontFamily: 'Arial', fontSize: 18, color: '#70452a' }).setOrigin(0.5);
            const priceTag = this.add.text(x, 552, '', { fontFamily: 'Arial', fontSize: 21, fontStyle: 'bold', color: '#ffffff', padding: { x: 14, y: 7 } }).setOrigin(0.5);
            refreshers.push(() => {
                const maxed = kind !== 'dynamite' && upgrades[kind] >= UPGRADE_LIMIT;
                const price = upgradePrice(kind, upgrades);
                tier.setText(kind === 'dynamite' ? `OWNED: ${dynamite}` : `TIER ${upgrades[kind]} / ${UPGRADE_LIMIT}`);
                priceTag.setText(maxed ? 'MAXED' : `BUY $${price}`);
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
                const purchase = purchaseUpgrade(kind, money, upgrades, dynamite);
                if (purchase) {
                    soundEffects.unlock();
                    soundEffects.play('buy');
                    dynamite = purchase.dynamite;
                    money = purchase.money;
                    upgrades = purchase.upgrades;
                }
                refresh();
            });
        });
        const next = this.add.text(512, 867, `START LEVEL ${data.level}`, { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#ffffff', backgroundColor: '#547f3b', padding: { x: 28, y: 16 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        next.once('pointerdown', () => this.scene.start('Game', { level: data.level, money, upgrades, dynamite }));
        this.add.text(512, 926, `${LAYOUTS[LEVELS[data.level - 1].layout].name}  •  Target: $${LEVELS[data.level - 1].target}  •  Buying is optional`, { fontFamily: 'Arial', fontSize: 19, color: '#483126' }).setOrigin(0.5);
        refresh();
    }
}
