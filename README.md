# Gold Miner

A 2D browser game inspired by the classic Gold Miner, built with Phaser, TypeScript, and Vite. Aim the swinging claw, collect treasure, and spend your earnings on upgrades between levels.

## Run locally

You need Node.js and npm installed.

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080), or the address shown in your terminal, and click **Start New Game**. Start New Game, Treasure Hollow’s Start Run, and the briefing’s Start Mining share the same screen position, so you can click through the standard-mode setup without moving the cursor.

## Controls

| Control | Action |
| --- | --- |
| Down Arrow or click the playfield | Launch the claw |
| Up Arrow | Throw dynamite at a caught object |
| Left Arrow or click Blast Powder | Toggle Blast Powder ON/OFF when owned |
| Right Arrow or click Safety Grip | Toggle safe TNT collection ON/OFF when unlocked |
| P or Esc | Pause or resume |
| Finish Level | End the level immediately |
| Auto Finish Level | Toggle automatic finishing when the gold target is reached (starts OFF) |
| Sound ON/OFF | Toggle sound effects |

## How to play

Open **Game Guide** from the main menu, the level HUD or the pause menu for a scrollable in-game guide to controls, modes, treasure, special rocks, perfect catches, streaks, vials, tools, retries, milestones and every shop item. Shop descriptions and prices come directly from the game’s item definitions. Opening the guide from the level HUD pauses gameplay without opening the pause menu; closing it resumes the level. Opening it from the pause menu keeps the game paused when you close it.

Reach each level’s earnings target within 60 seconds, or 90 seconds in Gold Basin. If an object is already hooked when time runs out, you can finish reeling it in; its value, streak bonus, and rewards count before the level result is decided. No new shots can be launched at zero time. A time vial delivered on the final haul adds 15 seconds and lets play resume. Targets are rounded to the nearest $50, ranging from $800 on level 1 to $7,200 on level 30 in Treasure Hollow (other modes apply their own target scaling). Start with three lives; failing a level costs one life, and losing all lives ends the run unless you buy a life vial in the post-level shop. Life vials restore one life, up to a maximum of five. Heavier objects take longer to retrieve, and the most valuable treasure is deeper underground. Rocks leave aiming gaps, so careful shots can reach treasure without clearing every obstacle.

**Finish Level** lets you leave early once you reach the target. Finishing below the target counts as a loss. Every completed attempt takes you to the shop, whether you pass or fail. Passing advances to the next level; failing costs a life and lets you restock before retrying the same layout with your starting balance plus 50% of the failed level’s earnings and restored starting supplies. At zero lives, buy a life vial to retry or end the run. Clearing the final level also opens the shop before the final results.

Money and unused dynamite carry over between levels, but each level requires fresh earnings toward its target. Start with three dynamite sticks; buy replacements in the shop. Retrying a failed level restores its original layout, object values, rat starting positions and movement settings, as well as the dynamite and purchased bonuses you had at its start. You keep your starting balance plus 50% of the failed level’s new earnings, including bonus cash. Mystery bag rewards also stay the same on retries. New games generate fresh layouts.

## Bonus milestones

Keep mining after reaching the target to earn extra rewards:

| Retrieved earnings | Bonus |
| --- | --- |
| 150% of the target | $150 |
| 175% of the target | $400 |
| 200% of the target | One dynamite stick |

Each reward can be earned once per level. The HUD shows progress toward the next bonus. Bonus cash adds to your balance but does not count toward the target or other milestones. You can still use **Finish Level** whenever you want.

## Features

- 30 levels per mode with increasing targets and four cave layouts: Gold Pocket, Rat Tunnels, Explosive Cavern, and Deep Mine.
- Four gold-nugget sizes worth $50, $100, $200, and $350; diamonds worth $450 and rubies worth $650 before upgrades.
- Four rock sizes worth $12, $16, $18, and $20.
- Cash bags worth $150–$400, with a flat +$200 when Luck is active ($350–$600 total).
- Heavy purple mystery bags marked **?** containing $10–$640, one dynamite stick, or a strength boost for two catches. Cash rewards favor the higher end.
- Moving rats worth $1, including rats carrying diamonds or rubies worth the gem’s value plus $1.
- Treasure chests reel in at the same speed as mystery bags (weight 3). The first hit opens the chest and reveals its reward; catch it again to collect. Rewards include $320–$720, dynamite, Luck vials, Lightweight Grip, or a life vial.
- Gem-studded rocks contain hidden treasure that can crumble away during hauling. Blast them to release the remaining contents.
- Rocks with an embedded diamond or ruby reward precision: catch just the gem or haul the heavy rock with it. These appear on medium or larger rocks deep underground.
- A separate rare combined type has both crystal studs and an embedded gem, with a 50% chance per level to attempt one. Blasting guarantees the visible gem plus remaining hidden gold; extracting the gem first prevents it from dropping twice.
- TNT barrels that destroy nearby objects and trigger chain reactions without awarding money.
- Catchable strength vials that double retrieval speed for two catches and stack with winch upgrades; Gold Rush boosts the next two gold catches by 50%, and time vials add 15 seconds.
- A shopkeeper and illustrated products with descriptions shown on hover.
- Denser collectible mix adds large and giant gold, diamonds, rubies, bags, and rocks alongside smaller catches; additions scale with screen width.
- Window-filling mine with responsive width, extended claw reach, and collectible counts that scale with the available space. Resizing preserves the current round and shop purchases.
- Cave scenery, miner hauling and collection reactions, money popups, and sound effects.
- Main menu, pause menu, and automatic pausing when the game loses focus.

## Shop

| Item | Effect | Price |
| --- | --- | --- |
| Stronger winch | +10% retrieval speed per tier | $1,000 / $2,000 / $3,000 |
| Gem polish | +15% diamond and ruby value per tier | $1,250 / $2,500 / $3,750 |
| Gold polish | +15% gold nugget value per tier; stacks with Gold Rush | $1,250 / $2,500 / $3,750 |
| Safety Grip | Unlock safe TNT barrel/rat collection with a 5-second disarming delay before hauling; +1 dynamite per delivery; starts ON and remembers your choice, lasts for the run | $1,500 |
| Blast Powder | Tier 1 unlocks size-based thrown-dynamite blasts and +50% radius when dynamiting caught TNT; tiers 2/3 add +20%/+40% radius over tier 1; lasts for the run | $1,500 / $3,000 / $4,500 |
| Strength vial | Start the next round with x2 retrieval speed for 2 catches, plus Vial Belt | $1,000 |
| Gold Rush vial | Start the next round with +50% gold value for 2 gold catches, plus Vial Belt | $1,000 |
| Dynamite | One additional stick | $750 |
| Momentum vial | Perfect catches instantly add 2 seconds, capped at 10 seconds per level | $1,250 |
| Luck vial | Cash bags pay an extra $200 each in the next level | $1,000 |
| Time vial | Adds 15 seconds to the next level | $1,000 |
| Lightweight Grip | Rock hauling weight reduced by 40% for one round | $250 |
| Prospector’s Lens | Reveals cash-bag values, mystery-bag contents, and treasure-chest rewards for one round | $1,500 |
| Vial Belt | +1 Strength/Gold Rush catch and +5 seconds to caught Streak vials per tier; lasts for the run | $2,000 / $3,500 / $5,000 |
| Streak vial | Multiplies streak bonuses by 1.5 for the full next level; mine vials boost to x2 for 15 seconds | $1,000 |
| Life vial | Immediately restores one life, up to five | $3,000 |

Winch, Gem Polish, Gold Polish, Blast Powder, and Vial Belt upgrades last for the run, with three tiers each. Safety Grip also lasts for the run, with a single unlock. Vial Belt increases Strength and Gold Rush from 2 catches to 3/4/5, including Strength from mystery bags. Caught Streak vials last 35/40/45 seconds, or 20/25/30 seconds for the x2 boost when the shop Streak vial is active. Time vials still add 15 seconds. Luck, extra time, Lightweight Grip, Streak vial, Momentum, and Prospector’s Lens use one charge per round. Lightweight Grip affects all four rock sizes, including gem-bearing rocks; attached gems retain their normal weight. It does not increase rock values or stack within a round. Buy multiple charges to cover future rounds; extra time does not stack within a single round. Lens labels appear just below each object and show cash-bag values including any active Luck bonus. Life vials cannot be purchased at full lives. Buying is optional.

### Safety Grip

Safety Grip is a **$1,500 permanent unlock for the current run**, with one tier. Press **Right Arrow** or click its shield in the dynamite HUD to toggle it. It starts **ON** when purchased and remembers your choice between levels and retries. Choose before launching: the toggle is available only while the claw is idle, for both Right Arrow and clicks. It stays fixed during launch, hauling, empty returns and dynamite throws. Each blocked press or click shows a floating message asking you to wait for the claw to return. When ON, claw contact starts a **5-second disarming countdown** for TNT barrels and TNT rats instead of detonating them. The claw stays still during disarming, while the level timer continues to run, then starts hauling. Each safely delivered barrel or rat awards **one dynamite stick**, no money, and neither advances nor breaks the catch streak. The final haul still pays its reward after the timer reaches zero.

A shield to the right of the miner indicates Safety Grip is ON; a visible countdown shows disarming progress, followed by a confirmation message. Free TNT still detonates in nearby explosions. Safety Grip and Blast Powder work independently: with both ON, safely catch TNT and either deliver it for a stick or sacrifice it using Up Arrow for a Blast Powder explosion. Destroying a held TNT object awards no dynamite. Toggling Safety Grip costs no sticks; the unlock survives failed attempts and resets for a new run. Safety Grip replaces Dynamite Overdrive; Right Arrow no longer boosts hauling speed.

### Blast Powder and Gold Polish

Blast Powder is a permanent upgrade for the current run, with three tiers. It stays unlocked through cleared levels and failed attempts, and starts ON each round when owned. Press **Left Arrow** or click its toggle in the combined dynamite/Blast Powder HUD to switch it ON or OFF. Active buffs occupy a separate column beside this panel. The HUD shows the owned tier and ON/OFF state; a Blast Powder icon to the left of the miner appears while ON. Unlike Safety Grip, Blast Powder can be toggled during launch, hauling and empty returns, including the final haul at zero seconds. Each thrown dynamite stick snapshots the Blast Powder setting and tier at throw time, so changing the toggle during its flight affects future explosions, not the stick already thrown. No round charge is consumed; new runs reset the upgrade.

With Blast Powder ON, thrown dynamite destroys the caught item and blasts nearby free objects. At tier 1, the blast radius is **2.5 times the caught item’s radius**: small gold produces a 37.5-pixel blast, medium gold 80 pixels, large gold 120 pixels, and giant gold 180 pixels. TNT contact detonations and secondary chain reactions always use the normal 125-pixel radius, regardless of Blast Powder. Throwing dynamite at a caught TNT barrel or TNT rat with Blast Powder ON creates a larger 187.5-pixel blast at tier 1. Tiers 2 and 3 multiply thrown-dynamite radii by 1.2 and 1.4 relative to tier 1 (giant-gold blasts: 180/216/252 pixels; directly dynamited TNT: 187.5/225/262.5 pixels). This enhanced TNT blast requires catching it safely with Safety Grip first. Explosion visuals match their damage radius. Destroyed objects award no money; blasted gem deposits release their remaining treasure after the explosions so the released loot survives. With Blast Powder OFF or unowned, thrown dynamite destroys only the caught item, and TNT uses its normal radius.

Gold Polish lasts for the run and adds 15% gold nugget value per tier, up to 45%. It applies to all four nugget sizes, including nuggets released from deposits, and multiplies with Gold Rush. At tier 3, a $200 large nugget pays $290 normally or $435 with Gold Rush, before perfect-catch and streak bonuses. Perfect-catch cash bonuses use the boosted nugget value; Gold Polish does not increase gems, bags, chests, or streak bonuses.

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

### Perfect catches

Aim through the centre of valuable objects for a **Perfect catch**: a gold flash, crisp chime, and 35% faster reeling for the entire haul. The centre window is 30% of the object's radius, capped at 10 pixels. Perfect catches pay an extra 35% of the object's boosted cash value, rounded up to the nearest $10, on delivery, separately from streak bonuses. Mystery bags and non-cash chest rewards receive the reel boost only. Rocks, empty rats, utility vials, and opening a chest do not qualify. Dynamiting the object forfeits its perfect bonus.

### Catch streaks

All gold nuggets (including small and medium), diamonds, rubies, diamond- and ruby-carrying rats, cash bags, mystery bags, and treasure chests advance the catch streak immediately when the claw latches onto them. Mystery bags and treasure chests count regardless of their contents. A chest advances the streak on the second hit when the claw latches onto it, not on the first hit that opens it. Catch 3 awards an extra $20, catch 4 awards $40, catch 5 awards $60, and each further qualifying catch adds another $20 to its bonus, without a cap or automatic reset. From streak 3 onward, each qualifying latch triggers a bouncing streak-number popup and golden burst at the object, showing the bonus due on delivery. Streak bonuses are paid when the object reaches the surface and count toward level gold and spendable money. Dynamiting a qualifying catch preserves its streak progress but forfeits its payout.

Catching an empty rat or an ordinary stone without a gem immediately breaks the streak, even if you dynamite it afterward. Catching a whole rock containing an embedded diamond or ruby advances the streak and earns the normal streak bonus, including combined gem-studded rocks. Gem-studded deposits without an embedded gem stay neutral: they preserve the streak without advancing it. Once an embedded gem is caught separately, its ordinary host rock breaks the streak if caught. An empty shot also resets it. Catching a gem separately from its rock advances the streak normally. Utility items stay neutral: they neither advance nor break the streak. Opening a chest and hitting TNT also preserve it. Every level and retry starts at zero.

A catchable purple Streak vial appears in each mine. Collecting it multiplies streak bonuses by 1.5 for 30 seconds: catch 3 pays $30, catch 4 pays $60, catch 5 pays $90, and so on. It does not multiply object values or change streak rules. It is neutral to the streak. Its countdown pauses with the game and resets on the next level or retry. The bonus is locked in when the claw latches, even if the effect expires before delivery.

The shop Streak vial grants x1.5 streak bonuses for the entire next level. With that shop buff active, collecting a mine Streak vial grants x2 for 15 seconds before returning to x1.5. Without the shop buff, the mine vial still grants x1.5 for 30 seconds. Extra shop charges cover future levels; they do not stack multipliers.

### Starting vials and run modes

Strength vials ($1,000) and Gold Rush vials ($1,000) can be stocked in the shop. One of each purchased supply activates per round: Strength doubles retrieval speed for 2 catches; Gold Rush adds 50% value for 2 gold catches. Vial Belt adds one catch per tier. Mine vials add their full catches to the remaining effect without increasing its multiplier, including Strength from mystery bags. Active catches expire after the round; unused shop stock covers future rounds. Failed attempts restore starting supplies.

Before starting a run, choose a game mode. It stays fixed for every level and retry in that run:

| Mode | Entry fee | Treasure added | Target |
|---|---:|---|---|
| Treasure Hollow | Free | Mixed treasure; 1–2 chests, 2–4 mystery bags and 2 extra cash bags | Standard |
| Gold Basin | Free | 7 giant and 2 large gold; fewer rocks and medium nuggets | Previous route target +35%, then reduced 10%; rounded to $50 |
| Gem Hollow | Free | 4 diamonds and 3 rubies | Previous route target +35%, rounded to $50 |

All three mines are free to enter, including with zero money. Choose between mixed treasure, heavy gold and precision gems. Treasure Hollow valuables use one progression pool, replacing generic base, width and density spawns. Gold nugget counts and values keep their existing rules. Treasure Hollow bonus chances now grow by **two percentage points per level**, capped at 85%; through level 30 they remain below that cap. Starting at 20%, 15% and 10%, they finish at **78%, 73% and 68%**. Triggered bonuses give **+1 at 60%, +2 at 30%, +3 at 10%**. These amount weights stay fixed throughout the run. Rolls happen once before placement retries; retrying a level preserves its seeded rolls.

| Special item | Starting minimum | Add one guaranteed at levels | Starting bonus rating |
| --- | --- | --- | --- |
| Money bags | 1 | 10, 22 | 20% |
| Diamonds | 1 | 13, 25 | 15% |
| Rubies | 0 | 10, 22 | 10% |
| Mystery bags | 1 | 16 | 15% |
| Treasure chests | 0 | 13 | 10% |
| Gem-studded rocks | 0 | 7 | 20% |
| Gems stuck on rocks | 0 | 16 | 15% |
| Combined rocks | 0 | 25 | 10% |

Treasure Hollow adds one ordinary rock and one rat at each of levels 7, 16 and 25, and one TNT barrel at levels 10 and 22 (barrels stay capped at six in Rat Tunnels and seven elsewhere). Gem-carrying rats are capped at one through level 15 and two thereafter; extra carriers become ordinary rats. Crowded layouts preserve at least two ordinary rocks plus these rock additions beyond the rolled hidden-deposit count, and slim density rocks into ordinary stones rather than adding more gold. Ordinary rats can still become TNT rats under the existing 25% rule and two-per-level cap.

Special rocks have their own visible gems in addition to the loose gem pool. Gem-studded rocks contain hidden deposits; combined rocks also have a catchable visible gem. Gem-carrying rats and rewards inside deposits keep their separate rules. Targets and other modes are unchanged.

The selected mode persists through the shop, every cleared level and every retry. Failed attempts retain the starting balance plus 50% of new earnings, restore starting supplies, and keep the same seeded layout and rewards. Clearing a level generates a fresh layout in the same mode for the next level. New runs open game-mode selection before level 1, including after losing or completing a run.

Mine routes also have distinct scenery: Treasure Hollow uses earthy stone, Gold Basin has amber strata, gold seams and timber supports, and Gem Hollow has blue-violet stone, cool lanterns and wall crystals. Gold Basin retains its extra heavy gold, while Gem Hollow replaces extra-density large and giant gold with diamonds and rubies; entrance previews match each environment.

Gold Basin keeps only a medium rock and a small rock, removes ordinary large/heavy rocks (apart from the rare large gem host), scales TNT and time vials with progression, and uses a dedicated density pool favoring giant/large gold and supplies, with no extra medium nuggets or rocks. Only two base medium nuggets remain. Its giant nuggets spread across the middle and bottom to keep crowded layouts playable.

Gold Basin specializes in gold: at most one loose diamond and one cash bag, no loose rubies, gem-carrying rats, mystery bags or treasure chests, and one Streak vial. Strength and Gold Rush vials each have minimums of 2 on levels 1–6, 3 on levels 7–12 and 4 on levels 13–30, plus an independent 40% chance of one extra. Minimum supplies per round: levels 1–6 have 2 time vials and 3 TNT barrels, levels 7–12 have 3 time vials and 4 TNT barrels, and levels 13–30 have 4 time vials and 5 TNT barrels. Gold Basin also rolls a 40% chance of one extra TNT barrel, plus independent 50% and 20% chances of one extra time vial each. Bonus rolls are fixed per seeded layout and retries keep the same supplies. Each time vial adds 15 seconds when collected; extra time must be earned by catching the vials. Its density pool adds gold rather than gems and bags. Treasure Hollow retains its mixed treasure. Gem Hollow spreads gems from the middle to the bottom, with at least 130 pixels between gem centres and distinct aiming angles; gems no longer cluster around TNT. Mounted gems respect the same spacing.

Gold Basin and Gem Hollow retain their increased targets: their previous rounded targets are raised by 35%, rounded again to the nearest $50. Treasure Hollow targets stay unchanged. Gem Hollow contains no gold nuggets of any size and no catchable Gold Rush vials, including in crowded-layout fallbacks. Its rock deposits also contain gems rather than gold; its existing scattered gem population remains the focus. Catchable Strength vials are available to help haul rocks and chests.

Gem Hollow adds two large rocks, two medium rocks and two small rocks as precision obstacles. Placement rejects rocks that block the last usable aiming gap to a gem, so clearing rocks is optional. TNT is capped at three barrels to leave room for the extra rocks. Existing gem spacing and gold-free generation still apply.

The game-mode selection screen explains each playstyle: Treasure Hollow rewards varied catches and sustained streaks; Gold Basin rewards heavy-haul planning, vial use, time-vial collection and avoiding TNT; Gem Hollow rewards accurate shots through rock gaps, perfect catches and Gem Polish.

Treasure Hollow normally scatters diamonds, rubies, bags and chests at least 90 pixels apart; crowded layouts may use 45 pixels and the full buried depth range to preserve rolled treasure counts. Rich late-game layouts can place treasure behind rocks that must be cleared first; gems remain precisely catchable from their own host once intervening rocks are cleared. Placement favors the middle band (y=390–700), with some treasure deeper (y=600–860); crowded layouts can use the full y=390–860 range. Treasure Hollow diamonds do not cluster around TNT and its cash bags are not forced deeper by the Deep Mine layout. Mounted gems also preserve the treasure spacing. Values and targets are unchanged. Crowded Treasure Hollow layouts can use slimmer rocks while keeping all treasure.

Gold Basin has a seeded 50% chance of a deep large gem-bearing rock. Only large rocks can host embedded gems or hidden deposits in Gold Basin; its existing diamond can be mounted on the large host. Medium and small rocks remain ordinary.

Crowded Gold Basin layouts may drop up to four small and two medium gold nuggets, preserving giant/large gold, gem-bearing large rocks and all rolled supply minimums/extras.

Game-mode cards focus on the illustrated entrance, playstyle, a short description of what makes each mode different, and quieter subtext explaining its rewards and tradeoffs. Exact spawn counts are omitted from these cards; level targets remain on the level briefing.

Strength charges are not consumed by catching Strength, Gold Rush, time or Streak vials. Other catches still use a charge. Gold Basin starts with 90 seconds (105 with the shop Time vial) and its previous targets are reduced by 10%, rounded to the nearest $50. Catchable time vials still add 15 seconds each. Treasure Hollow and Gem Hollow retain their current targets and 60-second base timer. The level briefing and gameplay use the same mode duration.

The shop includes a Forfeit Run button after any attempt. Confirming ends the run and returns to the main menu; Keep Playing or Escape closes the confirmation without changing purchases, money or supplies. Shop purchases and level progression are blocked while the confirmation is open.

Treasure Hollow trades two small and two medium nuggets for two giant nuggets, one large nugget and one diamond. Its density allowance is raised by 8 percentage points (with at least six density additions), and wider windows favor large gold, cash bags and gems over small/medium filler. Giant nuggets can occupy the deeper middle as well as the bottom. Chest and mystery-bag chances, treasure spacing, targets and timers are unchanged.

Treasure Hollow rolls each special rock type from its level progression table. Placement reserves deep hosts and exposed gem positions before filling the remaining space, keeping their aiming paths open. Crowded-layout fallbacks preserve rolled special rocks and treasure; gold nugget counts and values retain their original rules, with wider placement depth ranges available when the usual bands are crowded.

A brass analog countdown clock beside the miner replaces the HUD timer. A Time Left label underneath shows the exact seconds remaining, alongside the clock’s remaining-time ring and moving hand. It turns red for the final 10 seconds, reflects collected time vials and stops with the game when paused.

### Levels 21–30

Each game mode now has 30 levels. Levels 1–20 retain their existing configurations. Every added level raises the target, increases rat speed and pushes the general minimum spawn depth down by two pixels (402–420). Rat speed grows from 1.64x on level 21 to 2x on level 30, with a larger share of rats carrying gems in the late levels. Overall populations stay bounded rather than filling every opening with extra objects. Static rock counts and TNT populations stay capped to preserve aiming gaps and keep narrow-window layouts placeable. Endgame Rat Tunnels cap barrels at five and reserve the physical rat clearance (28 pixels on either side of the lane) rather than an oversized empty strip. Each mode retains its treasure mix, timer and supply rules. The final victory screen now follows level 30.

| Level | Treasure Hollow target | Gold Basin target | Gem Hollow target |
|---|---:|---:|---:|
| 21 | $5,300 | $7,450 | $8,550 |
| 25 | $6,150 | $8,550 | $10,000 |
| 30 | $7,200 | $10,100 | $11,700 |

Ordinary rats have a 25% chance to carry a visible red TNT bundle, capped at two TNT rats per level in every mode. They move like other rats and detonate on claw contact (unless Safety Grip is ON) or in a nearby TNT blast, using the same blast radius and chain reactions as barrels. They award no money; gem-carrying rats are unchanged.

Strength, Gold Rush, time and Streak vials qualify for perfect catches using the same precise-hit threshold as treasure. A perfect vial catch reels in 35% faster for the full haul and shows the perfect-catch feedback; vials award no perfect-catch cash bonus.

Loose rubies and diamonds share weight 0.4 and reel in at the same speed with equivalent boosts.

The shop Time vial uses the same blue vial artwork as mine Time vials and adds the same 15 seconds, applied at the start of the next round. Luck adds $200 per cash bag; its flat bonus and the Prospector’s Lens cash-bag preview use the same calculation.

Shop Strength, Gold Rush and Streak vials use the same artwork as their mine counterparts. Strength and Gold Rush retain their shared catch-based effects; the shop Streak vial still lasts the full next round, while caught Streak vials retain their timed effects.

Momentum is a shop-only vial immediately to the right of Luck. One stocked charge activates for the next round; extra purchases cover future rounds. Latching a perfect catch, including a vial or a non-cash chest, immediately earns two seconds, up to ten total. Dynamiting the catch afterward keeps the earned time. Delivery awards no additional Momentum time. Ordinary catches, chest-opening shots and TNT detonations earn none. The earned-time cap resets each round or retry; remaining stock carries forward. The buff HUD shows the remaining earnable seconds.
