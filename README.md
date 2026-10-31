# Gold Miner

A 2D browser game inspired by the classic Gold Miner, built with Phaser, TypeScript, and Vite. Aim the swinging claw, collect treasure, and spend your earnings on upgrades between levels.

## Run locally

You need Node.js and npm installed.

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080), or the address shown in your terminal, and click **Start New Game**.

## Controls

| Control | Action |
| --- | --- |
| Down Arrow or click the playfield | Launch the claw |
| Up Arrow | Throw dynamite at a caught object |
| P or Esc | Pause or resume |
| Finish Level | End the level immediately |
| Sound ON/OFF | Toggle sound effects |

## How to play

Reach each level’s earnings target before the 60-second timer runs out. Targets are rounded to the nearest $50, ranging from $650 on level 1 to $3,650 on level 20. Start with three lives; failing a level costs one life, and losing all lives ends the run unless you buy a life vial in the post-level shop. Life vials restore one life, up to a maximum of five. Heavier objects take longer to retrieve, and the most valuable treasure is deeper underground. Rocks leave aiming gaps, so careful shots can reach treasure without clearing every obstacle.

**Finish Level** lets you leave early once you reach the target. Finishing below the target counts as a loss. Every completed attempt takes you to the shop, whether you pass or fail. Passing advances to the next level; failing costs a life and lets you restock before retrying the same layout with your restored starting money and supplies. At zero lives, buy a life vial to retry or end the run. Clearing the final level also opens the shop before the final results.

Money and unused dynamite carry over between levels, but each level requires fresh earnings toward its target. Start with three dynamite sticks; buy replacements in the shop. Retrying a failed level restores its original layout, object values, rat starting positions and movement settings, as well as the money, dynamite, and purchased bonuses you had at its start. Mystery bag rewards also stay the same on retries. New games generate fresh layouts.

## Bonus milestones

Keep mining after reaching the target to earn extra rewards:

| Retrieved earnings | Bonus |
| --- | --- |
| 125% of the target | $150 |
| 150% of the target | $400 |
| 175% of the target | One dynamite stick |

Each reward can be earned once per level. The HUD shows progress toward the next bonus. Bonus cash adds to your balance but does not count toward the target or other milestones. You can still use **Finish Level** whenever you want.

## Features

- 20 levels with increasing targets and four cave layouts: Gold Pocket, Rat Tunnels, Explosive Cavern, and Deep Mine.
- Four gold-nugget sizes worth $70, $140, $250, and $400; diamonds worth $500 and rubies worth $700 before upgrades.
- Four rock sizes worth $12, $16, $18, and $20 before rock polish.
- Cash bags worth $40–$320, with a $250 minimum when Luck is active.
- Heavy purple mystery bags marked **?** containing $10–$640, one dynamite stick, or a strength boost for three catches. Cash rewards favor the higher end.
- Moving rats worth $1, including rats carrying diamonds or rubies worth the gem’s value plus $1.
- Treasure chests: the first hit opens the chest and reveals its reward; catch it again to collect. Rewards include $320–$720, dynamite, Luck potions, rock polish, or a life vial.
- Gem-studded rocks contain hidden treasure that can crumble away during hauling. Blast them to release the remaining contents.
- Rocks with an embedded diamond or ruby reward precision: catch just the gem or haul the heavy rock with it. These appear on medium or larger rocks deep underground.
- A separate rare combined type has both crystal studs and an embedded gem, with a 50% chance per level to attempt one. Blasting guarantees the visible gem plus remaining hidden gold; extracting the gem first prevents it from dropping twice.
- TNT barrels that destroy nearby objects and trigger chain reactions without awarding money.
- Catchable strength potions that double retrieval speed for three catches and stack with winch upgrades; Gold Rush boosts the next three gold catches by 50%, and time vials add 15 seconds.
- A shopkeeper and illustrated products with descriptions shown on hover.
- Cave scenery, miner hauling and collection reactions, money popups, and sound effects.
- Main menu, pause menu, and automatic pausing when the game loses focus.

## Shop

| Item | Effect | Price |
| --- | --- | --- |
| Stronger winch | +10% retrieval speed per tier | $1,000 / $2,000 / $3,000 |
| Gem polish | +15% diamond and ruby value per tier | $1,250 / $2,500 / $3,750 |
| Dynamite | One additional stick | $750 |
| Luck potion | Money bags pay at least $250 in the next level | $500 |
| Extra time | Adds 15 seconds to the next level | $600 |
| Rock polish | Rocks pay $50 / $100 / $125 / $150 by size for one round | $250 |
| Prospector’s Lens | Reveals cash-bag values, mystery-bag contents, and treasure-chest rewards for one round | $1,500 |
| Streak vial | Doubles streak bonuses for the full next level; mine vials boost to x3 for 15 seconds | $1,000 |
| Life vial | Immediately restores one life, up to five | $3,000 |

Winch and gem-polish upgrades last for the run, with three tiers each. Luck, extra time, rock polish, Streak vial, and Prospector’s Lens use one charge per round. Buy multiple charges to cover future rounds; extra time does not stack within a single round. Lens labels appear just below each object and show cash-bag values including any active Luck bonus. Life vials cannot be purchased at full lives. Buying is optional.

## Development

```bash
npx tsc --noEmit   # Check TypeScript
npm run build     # Build for production in dist/
```

The project uses the existing Phaser Vite TypeScript template. `npm run dev-nolog` and `npm run build-nolog` run without the template’s anonymous usage logging.

Source code is organized under `src/game/`:

- `scenes/` — menus, gameplay, shop, and results.
- `objects/` — claw, collectables, aiming checks, and explosions.
- `state/` — level settings, round state, upgrades, and world limits.
- `art/` — shape-drawn scenery, products, and miner animations.
- `audio/` — generated sound effects.
- `ui/` — shared menu controls.

Progress lasts for the current run only. There is no backend or persistent save system.

### Catch streaks

All gold nuggets (including small and medium), diamonds, rubies, cash bags, mystery bags, and treasure chests advance the catch streak immediately when the claw latches onto them. Mystery bags and treasure chests count regardless of their contents. A chest advances the streak on the second hit when the claw latches onto it, not on the first hit that opens it. Catch 3 awards an extra $25, catch 4 awards $50, catch 5 awards $75, and each further qualifying catch adds another $25 to its bonus, without a cap or automatic reset. From streak 3 onward, each qualifying latch triggers a bouncing streak-number popup and golden burst at the object, showing the bonus due on delivery. Streak bonuses are paid when the object reaches the surface and count toward level gold and spendable money. Dynamiting a qualifying catch preserves its streak progress but forfeits its payout.

Catching an empty rat or an ordinary stone immediately breaks the streak, including ordinary stones carrying gems, even if you dynamite it afterward. Gem-studded rocks (including the combined type with an embedded gem) are neutral: they preserve the streak without advancing it. An empty shot also resets it. Catching a gem separately from its rock advances the streak normally. Diamond/ruby-carrying rats and utility items stay neutral: they neither advance nor break the streak. Opening a chest and hitting TNT also preserve it. Every level and retry starts at zero.

A catchable purple Streak vial appears in each mine. Collecting it doubles streak bonuses for 30 seconds: catch 3 pays $50, catch 4 pays $100, catch 5 pays $150, and so on. It does not multiply object values or change streak rules. It is neutral to the streak. Its countdown pauses with the game and resets on the next level or retry. The bonus is locked in when the claw latches, even if the effect expires before delivery.

The shop Streak vial grants x2 streak bonuses for the entire next level. With that shop buff active, collecting a mine Streak vial grants x3 for 15 seconds before returning to x2. Without the shop buff, the mine vial still grants x2 for 30 seconds. Extra shop charges cover future levels; they do not stack multipliers.
