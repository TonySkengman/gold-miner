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

Reach each level’s earnings target before the 60-second timer runs out. Heavier objects take longer to retrieve, and the most valuable treasure is deeper underground. Rocks leave aiming gaps, so careful shots can reach treasure without clearing every obstacle.

**Finish Level** lets you leave early once you reach the target. Finishing below the target counts as a loss. Clearing a level takes you straight to the shop.

Money and unused dynamite carry over between levels, but each level requires fresh earnings toward its target. Start with three dynamite sticks; buy replacements in the shop. Retrying a failed level restores its original layout, object values, rat starting positions and movement settings, as well as the money, dynamite, and purchased bonuses you had at its start. Mystery bag rewards also stay the same on retries. New games generate fresh layouts.

## Bonus milestones

Keep mining after reaching the target to earn extra rewards:

| Retrieved earnings | Bonus |
| --- | --- |
| 125% of the target | $150 |
| 150% of the target | One dynamite stick |
| 200% of the target | $400 |

Each reward can be earned once per level. The HUD shows progress toward the next bonus. Bonus cash adds to your balance but does not count toward the target or other milestones. You can still use **Finish Level** whenever you want.

## Features

- 20 levels with increasing targets and four cave layouts: Gold Pocket, Rat Tunnels, Explosive Cavern, and Deep Mine.
- Different sizes of gold nuggets and rocks, diamonds, and mystery money bags.
- Heavy purple mystery bags marked **?** that reveal $10–$800, one dynamite stick, or a 15-second strength boost when retrieved.
- Moving rats worth $2 and diamond-carrying rats worth $2 plus the diamond’s value.
- TNT barrels that destroy nearby objects and trigger chain reactions without awarding money.
- Catchable strength potions that double retrieval speed for 15 seconds and stack with winch upgrades.
- A shopkeeper and illustrated products with descriptions shown on hover.
- Cave scenery, miner hauling and collection reactions, money popups, and sound effects.
- Main menu, pause menu, and automatic pausing when the game loses focus.

## Shop

| Item | Effect | Price |
| --- | --- | --- |
| Stronger winch | +10% retrieval speed per tier | $1,000 / $2,000 / $3,000 |
| Diamond polish | +15% diamond value per tier | $1,250 / $2,500 / $3,750 |
| Dynamite | One additional stick | $750 |
| Luck potion | Money bags pay at least $250 in the next level | $500 |
| Extra time | Adds 15 seconds to the next level | $600 |

Winch and diamond upgrades last for the run, with three tiers each. Luck and extra time can each be purchased once per shop visit and apply only to the next level. Buying is optional.

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
