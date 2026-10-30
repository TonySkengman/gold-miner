import { Scene } from 'phaser';
import { LEVELS } from '../state/Levels';
import { emptyUpgrades, purchaseUpgrade, upgradePrice, UPGRADE_INFO, UPGRADE_LIMIT, UpgradeKind, Upgrades } from '../state/Upgrades';

export class UpgradeShop extends Scene {
    constructor() { super('UpgradeShop'); }

    create(data: { level: number; money: number; upgrades?: Upgrades }): void {
        let money = data.money;
        let upgrades = { ...(data.upgrades ?? emptyUpgrades()) };
        this.cameras.main.setBackgroundColor(0x483126);
        this.add.rectangle(512, 384, 900, 690, 0xffedbb).setStrokeStyle(6, 0xc58b47);
        this.add.text(512, 80, 'MINER’S SHOP', { fontFamily: 'Arial', fontSize: 42, fontStyle: 'bold', color: '#70452a' }).setOrigin(0.5);
        const balance = this.add.text(512, 133, '', { fontFamily: 'Arial', fontSize: 26, color: '#483126' }).setOrigin(0.5);
        const refreshers: (() => void)[] = [];
        const refresh = () => {
            balance.setText(`Money: $${money}  •  Next: Level ${data.level}`);
            refreshers.forEach(update => update());
        };
        (Object.keys(UPGRADE_INFO) as UpgradeKind[]).forEach((kind, index) => {
            const y = 210 + index * 125;
            const info = UPGRADE_INFO[kind];
            this.add.rectangle(512, y + 28, 810, 106, 0xe8d39e).setStrokeStyle(2, 0xc5a26b);
            const title = this.add.text(132, y, '', { fontFamily: 'Arial', fontSize: 25, fontStyle: 'bold', color: '#483126' });
            this.add.text(132, y + 35, info.description, { fontFamily: 'Arial', fontSize: 19, color: '#70452a' });
            const buy = this.add.text(872, y + 25, '', { fontFamily: 'Arial', fontSize: 22, fontStyle: 'bold', color: '#ffffff', padding: { x: 16, y: 12 } }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
            refreshers.push(() => {
                const maxed = upgrades[kind] >= UPGRADE_LIMIT;
                const price = upgradePrice(kind, upgrades);
                title.setText(`${info.name}  ${upgrades[kind]} / ${UPGRADE_LIMIT}`);
                buy.setText(maxed ? 'MAXED' : `BUY $${price}`);
                buy.setBackgroundColor(maxed || money < price ? '#827968' : '#547f3b');
                buy.setAlpha(maxed || money < price ? 0.65 : 1);
            });
            buy.on('pointerdown', () => {
                const purchase = purchaseUpgrade(kind, money, upgrades);
                if (!purchase) return;
                money = purchase.money;
                upgrades = purchase.upgrades;
                refresh();
            });
        });
        this.add.text(512, 577, 'Upgrades last for this run. Purchases do not affect level targets.', { fontFamily: 'Arial', fontSize: 18, color: '#70452a' }).setOrigin(0.5);
        const next = this.add.text(512, 636, `START LEVEL ${data.level}`, { fontFamily: 'Arial', fontSize: 26, fontStyle: 'bold', color: '#ffffff', backgroundColor: '#547f3b', padding: { x: 28, y: 16 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        next.once('pointerdown', () => this.scene.start('Game', { level: data.level, money, upgrades }));
        this.add.text(512, 689, `Next target: $${LEVELS[data.level - 1].target}  •  Buying is optional`, { fontFamily: 'Arial', fontSize: 19, color: '#70452a' }).setOrigin(0.5);
        refresh();
    }
}
