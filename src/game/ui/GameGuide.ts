import type { Scene } from 'phaser';
import { UPGRADE_INFO, emptyUpgrades, isPermanentUpgrade, upgradeLimit, upgradePrice } from '../state/Upgrades';
import type { ShopItemKind } from '../state/Upgrades';

const sections = [
    ['Getting started', `Aim the swinging claw and collect enough treasure to reach the level target before time runs out. Each mode has 30 levels. Start a run with 3 lives and 3 dynamite sticks; lives can increase to 5. Progress lasts for this run only.

Treasure Hollow and Gem Hollow start with 60 seconds. Gold Basin starts with 90 seconds. Every level needs fresh earnings: money saved from earlier levels does not count toward its target.

Heavy objects reel in more slowly. Perfect catches and Strength speed up hauling. Long corner shots receive return-speed compensation beyond a full straight-down return, making distant treasure worth considering.`],
    ['Controls', `↓ or click the mine — launch the claw while it is idle.
↑ — spend one dynamite stick to destroy the caught object.
← or click Blast Powder — toggle its area blast when owned, including during hauling.
→ or click Safety Grip — toggle safe TNT collection when owned, only while the claw is idle.
P / Esc — pause or resume. The game also pauses when it loses focus.
Sound ON/OFF — toggle sound effects.

Finish Level ends the attempt immediately. Below the target, this costs a life. Auto Finish Level starts OFF; enabling it ends the level once the target is reached. Leave it OFF to keep mining for money and milestone rewards.`],
    ['Modes & levels', `Treasure Hollow • Standard mode
A varied mix of gold, gems, bags, chests and special rocks. Build streaks across different treasures. Special treasure becomes more common as you progress.

Gold Basin • Heavy gold
More large and giant nuggets, fewer ordinary rocks, a 90-second timer, and plentiful Strength, Gold Rush and time vials. Plan long hauls and collect extra time. Mystery bags, chests and loose rubies do not appear.

Gem Hollow • Precision gems
No gold nuggets or mine Gold Rush vials. Diamonds and rubies are scattered among more rock obstacles; deposits release gems. Use aiming gaps, perfect catches and Gem Polish. TNT is capped at three barrels.

Your mode stays fixed for the run. Gold Pocket, Rat Tunnels, Explosive Cavern and Deep Mine provide different level layouts. Targets rise and rats get faster in later levels. The briefing shows your next target and prepared supplies.`],
    ['Treasure & obstacles', `Gold nuggets — small $50, medium $100, large $200, giant $350 before bonuses. Larger nuggets are heavier.
Diamonds — $450. Rubies — $650. Both have the same light hauling weight. Gem Polish increases their value.
Ordinary rocks — $12 / $16 / $18 / $20 by size. Low value, heavy, and break streaks.
Cash bags — $150–$400; Luck adds $200 to each.
Mystery bags — heavy purple bags containing $10–$640, one dynamite stick, or Strength for two catches (plus Vial Belt). Their seeded rewards stay the same on retries.
Treasure chests — the first hit opens the chest; a second catch collects its revealed reward. Contents include $320–$720, dynamite, Luck, Lightweight Grip or a life vial. They haul like mystery bags.
Rats — moving targets worth $1. Gem-carrying rats pay the gem value plus $1. Empty rats break streaks.
TNT barrels and TNT rats — explode on contact unless Safety Grip is ON. Blasts destroy nearby objects and can chain into other TNT; destroyed treasure pays nothing.`],
    ['Special rocks & explosions', `Gem-studded rocks contain hidden treasure. Hauling can crumble away their contents, and delivering the rock gives little money. Catch and dynamite them to scatter the remaining valuables into the mine, then catch those valuables separately.

Rocks with a visible diamond or ruby offer a precision shot: catch just the gem, or grab the heavy host rock with it. A combined rock has both crystal studs and a visible gem. Blasting it releases the remaining hidden treasure and guarantees its visible gem, unless you already extracted that gem.

Up Arrow destroys your caught object and spends one dynamite stick. You lose that object's delivery payout and perfect/streak cash bonus. Without Blast Powder, only the held object is destroyed; caught TNT still explodes. Blasted deposits release loot after the explosion so their newly released treasure survives.

Free TNT and chain reactions always use their normal blast radius. Place explosions carefully: they can open a deposit but also destroy nearby valuables.`],
    ['Perfect catches & streaks', `Perfect catches
Aim through an object's centre for 35% faster reeling throughout the haul. Cash treasure also earns a 35% perfect bonus, rounded up to the next $10, on delivery. Vials and non-cash rewards receive the reel boost without a perfect cash bonus. Rocks, empty rats, TNT and chest-opening hits do not qualify. Dynamiting the catch forfeits the delivery bonus.

Catch streaks
Gold, gems, gem rats, bags and collectible chests advance the streak immediately on latch. Each streak step uses the selected mine's earnings target: 0.75% in Gold Basin, 1.5% in Treasure Hollow, or 3% in Gem Hollow, rounded to the nearest $5. Catch 3 pays one step, catch 4 pays two, catch 5 pays three, and each further qualifying catch adds another step. Delivery pays the bonus; it counts toward the target.

Empty shots, empty rats and ordinary rocks reset the streak. Whole rocks with an embedded gem advance it; gem-studded deposits without a visible gem are neutral. Once you extract a visible gem, its ordinary host rock breaks the streak. Vials, opening chests and TNT are neutral. Dynamiting a qualifying catch preserves its streak progress but loses its payout. Each level and retry starts at zero.`],
    ['Vials & temporary effects', `Strength — x2 retrieval speed for two catches, plus Vial Belt. Mine vials add catches; they do not increase the multiplier. Catching Strength, Gold Rush, time or Streak vials does not consume a Strength charge.
Gold Rush — +50% gold nugget value for two gold catches, plus Vial Belt. Mine vials add catches. Stacks with Gold Polish.
Time — adds 15 seconds when delivered. The shop version adds 15 seconds at the start of the round.
Streak — mine vials give x1.5 streak bonuses for 30 seconds. A shop vial gives x1.5 for the whole round; a mine vial then boosts it to x2 for 15 seconds. Vial Belt adds 5 seconds per tier to mine effects. The bonus locks in on latch.
Momentum — shop-only. Perfect catches immediately add 2 seconds, up to 10 seconds per round, even if you dynamite the catch afterward.
Luck — shop-only. Cash bags pay an extra $200 each for one round.

Active effects appear beside the clock. Temporary timers stop while paused. Shop supplies use one stocked charge per round; extra purchases cover future rounds rather than stacking that round's multiplier.`],
    ['Safety Grip & Blast Powder', `Safety Grip • $1,500, one unlock for the run
Starts ON and remembers your choice between levels and retries. Choose before launching: it cannot toggle until the claw returns to idle.

Catching a TNT barrel or TNT rat holds the claw still for 3.5 seconds while disarming. A countdown shows progress; the level timer keeps running. Afterward, haul it to the surface for +1 dynamite, no money. TNT remains neutral to streaks. You can sacrifice the held TNT with dynamite instead, but receive no recovered stick. Free TNT can still explode in nearby blasts.

Blast Powder • three tiers
Starts ON when purchased and remembers your choice. It affects thrown dynamite, with the setting and tier locked in at throw time. Tier 1 creates a blast 2.5 times the held object's radius; caught TNT gets a 187.5-pixel blast. Tiers 2 and 3 increase these radii by 20% and 40% over tier 1. Contact TNT and chain reactions retain their normal 125-pixel radius.

Both tools can be ON together. Safety Grip lets you catch TNT; then choose between delivering it for a stick and spending dynamite to create a larger Blast Powder explosion.`],
    ['Results, retries & rewards', `The final haul counts
If time runs out while an object is hooked, its haul and rewards finish before the result is decided, including TNT disarming. You cannot launch a new shot at zero time. A delivered time vial adds 15 seconds and resumes play.

Milestones
150% of target: bonus cash equal to 10% of the target. 175%: bonus cash equal to 20% of the target. Cash rewards round to the nearest $5. 200%: +1 dynamite on levels 1–15, +2 on levels 16–30, or +3 whenever the target is at least $7,000. Each reward is available once per level. Bonus cash is spendable but does not count toward the target or trigger more milestones.

Passing and failing
Every attempt opens the shop unless you fail on your last life. Passing advances to the next level. Failing costs one life; you keep the starting balance plus 50% of that attempt's new earnings, including bonus cash. A retry restores the original layout, rewards, rat movement settings and starting supplies. Shop purchases can help with the retry.

Losing your last life ends the run immediately and shows Game Over, without a shop visit. Buy extra lives before your final failure. Life vials restore one life, up to five. Clearing level 30 opens the shop before the final results. Forfeit Run in the shop or End Run in the pause menu asks for confirmation before ending your run.`]
];

/** Native modal keeps long instructions scrollable and keyboard accessible at any viewport size. */
export function showGameGuide(scene: Scene, onClose?: () => void): void {
    if (document.querySelector('.miner-guide')) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const keyboard = scene.input.keyboard;
    const keyboardEnabled = keyboard?.enabled;
    if (keyboard) keyboard.enabled = false;
    const dialog = document.createElement('dialog');
    dialog.className = 'miner-guide';
    dialog.setAttribute('aria-labelledby', 'miner-guide-title');
    const style = document.createElement('style');
    style.textContent = `
        .miner-guide { box-sizing:border-box; width:min(1060px,94vw); max-height:90dvh; padding:0; border:3px solid #c29659; border-radius:16px; background:#25221e; color:#fff3cc; font-family:Arial,sans-serif; box-shadow:0 20px 80px #0009; }
        .miner-guide::backdrop { background:#11151ae8; }
        .miner-guide * { box-sizing:border-box; }
        .miner-guide header { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:20px 24px; border-bottom:1px solid #81633e; }
        .miner-guide h1 { margin:0; color:#ffda69; font-size:28px; }
        .miner-guide button { color:#fff3cc; background:#547f3b; border:1px solid #8caa64; border-radius:8px; padding:10px 16px; font:700 16px Arial; cursor:pointer; }
        .miner-guide button:hover { background:#659b47; }
        .miner-guide button:focus-visible { outline:3px solid #ffda69; outline-offset:2px; }
        .miner-guide-body { display:grid; grid-template-columns:220px minmax(0,1fr); height:min(650px,70dvh); }
        .miner-guide nav { overflow:auto; padding:16px; border-right:1px solid #81633e; display:flex; flex-direction:column; gap:8px; }
        .miner-guide nav button { text-align:left; background:#39332b; border-color:#66513a; }
        .miner-guide nav button[aria-pressed=true] { background:#547f3b; border-color:#ffda69; color:#ffda69; }
        .miner-guide article { overflow:auto; padding:24px 28px; overscroll-behavior:contain; }
        .miner-guide h2 { margin:0 0 20px; color:#ffda69; font-size:26px; }
        .miner-guide p { white-space:pre-line; font-size:18px; line-height:1.6; margin:0 0 22px; }
        .miner-guide h3 { color:#ffda69; font-size:20px; margin:24px 0 8px; }
        @media(max-width:650px) { .miner-guide-body { grid-template-columns:1fr; grid-template-rows:auto minmax(0,1fr); } .miner-guide nav { flex-direction:row; border-right:0; border-bottom:1px solid #81633e; } .miner-guide nav button { flex-shrink:0; } .miner-guide article { padding:20px; } .miner-guide header { padding:16px; } }
    `;
    dialog.append(style);
    const header = document.createElement('header');
    const title = document.createElement('h1');
    title.id = 'miner-guide-title';
    title.textContent = 'Game Guide';
    const close = document.createElement('button');
    close.textContent = 'Close ✕';
    close.onclick = () => dialog.close();
    header.append(title, close);
    const body = document.createElement('div');
    body.className = 'miner-guide-body';
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Guide topics');
    const article = document.createElement('article');
    article.tabIndex = 0;
    const topics = [...sections, ['Shop & upgrades', '']];
    const buttons: HTMLButtonElement[] = [];
    topics.forEach(([heading, content], index) => {
        const button = document.createElement('button');
        button.textContent = heading;
        button.onclick = () => {
            buttons.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
            article.replaceChildren();
            const h2 = document.createElement('h2');
            h2.textContent = heading;
            article.append(h2);
            const paragraph = (text: string) => {
                const p = document.createElement('p');
                p.textContent = text;
                article.append(p);
            };
            if (index < sections.length) content.split('\n\n').forEach(paragraph);
            else {
                paragraph('Spend money between attempts. Upgrades last for the current run; supplies activate one stocked charge per round. Money and unused dynamite carry forward. Life vials apply immediately. Buying is optional.');
                (Object.keys(UPGRADE_INFO) as ShopItemKind[]).forEach(kind => {
                    const info = UPGRADE_INFO[kind];
                    const tiers = isPermanentUpgrade(kind) ? upgradeLimit(kind) : 1;
                    const prices = Array.from({ length: tiers }, (_, tier) => upgradePrice(kind, { ...emptyUpgrades(), [kind]: tier }));
                    const h3 = document.createElement('h3');
                    h3.textContent = `${info.name} — ${prices.map(price => `$${price.toLocaleString('en-US')}`).join(' / ')}`;
                    article.append(h3);
                    paragraph(info.description);
                });
            }
            article.scrollTop = 0;
        };
        buttons.push(button);
        nav.append(button);
    });
    body.append(nav, article);
    dialog.append(header, body);
    let cleaned = false;
    const cleanup = (resume = true) => {
        if (cleaned) return;
        cleaned = true;
        dialog.remove();
        if (keyboard) keyboard.enabled = keyboardEnabled ?? true;
        scene.events.off('shutdown', onShutdown);
        previousFocus?.focus();
        if (resume) onClose?.();
    };
    const onShutdown = () => cleanup(false);
    dialog.addEventListener('close', () => cleanup(), { once: true });
    dialog.addEventListener('keydown', event => event.stopPropagation());
    scene.events.once('shutdown', onShutdown);
    document.body.append(dialog);
    buttons[0].click();
    dialog.showModal();
    close.focus();
}
