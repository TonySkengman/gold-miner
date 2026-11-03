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
| Left Arrow or click Blast Powder | Toggle Blast Powder ON/OFF when owned |
| Right Arrow or click Safety Grip | Toggle safe TNT collection ON/OFF when unlocked |
| P or Esc | Pause or resume |
| Finish Level | End the level immediately |
| Auto Finish Level | Toggle automatic finishing when the gold target is reached (starts OFF) |
| Sound ON/OFF | Toggle sound effects |

## How to play

Reach each level’s earnings target within 60 seconds in every mine. If an object is already hooked when time runs out, you can finish reeling it in; its value, streak bonus, and rewards count before the level result is decided. No new shots can be launched at zero time. A time vial delivered on the final haul adds 10/15/20 seconds based on Vial Belt and lets play resume. Targets are rounded to the nearest $50, ranging from $800 on level 1 to $7,200 on level 30 in Treasure Hollow (other modes apply their own target scaling). Start with three lives; failing a level costs one life, and losing your last life ends the run immediately without visiting the shop. Life vials restore one life, up to a maximum of five. Heavier objects take longer to retrieve, and the most valuable treasure is deeper underground. Rocks leave aiming gaps, so careful shots can reach treasure without clearing every obstacle.

**Finish Level** lets you leave early once you reach the target. Finishing below the target counts as a loss. Completed attempts take you to the shop unless you fail on your last life. Passing advances to the next level; failing costs a life and lets you restock before retrying the same layout with your starting balance plus 50% of the failed level’s earnings and restored starting supplies. At zero lives, the run ends immediately; buy life vials before you lose your last life. Clearing the final level also opens the shop before the final results.

Money and unused dynamite carry over between levels, but each level requires fresh earnings toward its target. Start with three dynamite sticks; buy replacements in the shop. Retrying a failed level restores its original layout, object values, rat starting positions and movement settings, as well as the dynamite and purchased bonuses you had at its start. You keep your starting balance plus 50% of the failed level’s new earnings, including bonus cash. Mystery bag rewards also stay the same on retries. New games generate fresh layouts.

Open **Game Guide** from the main menu, the level HUD or the pause menu for a scrollable in-game guide to controls, modes, treasure, special rocks, perfect catches, streaks, vials, tools, retries, milestones and every shop item. Shop descriptions and prices come directly from the game’s item definitions. Opening the guide from the level HUD pauses gameplay without opening the pause menu; closing it resumes the level. Opening it from the pause menu keeps the game paused when you close it.

## Bonus milestones

Keep mining after reaching the target to earn extra rewards:

| Retrieved earnings | Bonus |
| --- | --- |
| 150% of the target | 10% of the target in cash, rounded to the nearest $5 |
| 175% of the target | 20% of the target in cash, rounded to the nearest $5 |
| 200% of the target | 1 dynamite on levels 1–15; 2 on levels 16–30; 3 whenever the target is at least $7,000 |

Each reward can be earned once per level. The HUD shows progress toward the next bonus. Bonus cash adds to your balance but does not count toward the target or other milestones. You can still use **Finish Level** whenever you want.

## Features

- 30 levels per mode with increasing targets and four cave layouts: Gold Pocket, Rat Tunnels, Explosive Cavern, and Deep Mine.
- Four gold-nugget sizes worth $50, $100, $200, and $350; diamonds worth $450 and rubies worth $650 before upgrades.
- Four rock sizes worth $12, $16, $18, and $20.
- Cash bags worth $150–$400, rolling $300–$400 when Luck is active.
- Purple mystery bags marked **?** weigh 1.5 (the same as medium gold). Rewards are 50% cash ($250–$650) and 50% a random vial, split equally between Strength, Gold Rush, Streak, Time, Life, Luck and Momentum. All vial rewards apply immediately; Luck starts its timed effect and Momentum adds five charges. Cash rolls uniformly in $10 steps; active Luck narrows the cash range to $500–$650.
- Moving rats worth $1, including rats carrying diamonds or rubies worth the gem’s value plus $1.
- Treasure chests have weight 4.8, the same as giant gold. The first hit opens the chest and reveals its reward; catch it again to collect. Without Luck, rewards are equally likely to be $600–$1,200 in $50 steps, 2–3 dynamite (equally likely), or one tier of an eligible permanent upgrade. Upgrade tiers apply next round, including retries, and last for the run. Maxed upgrades are excluded, with tiers reserved across all chests to prevent exceeding the cap. Luck changes chest odds to 50% permanent upgrade, 25% cash and 25% dynamite while upgrade tiers remain. When all upgrades are maxed or reserved, cash and dynamite each have a 50% chance.
- Gem-studded rocks contain hidden treasure that can crumble away during hauling. Blast them to release the remaining contents.
- Rocks with an embedded diamond or ruby reward precision: catch just the gem or haul the heavy rock with it. These appear on medium or larger rocks deep underground.
- A combined rock has both crystal studs and an embedded gem; Treasure Hollow uses the progression table below for its minimum and bonus spawns. Blasting guarantees the visible gem plus remaining hidden gold; extracting the gem first prevents it from dropping twice.
- TNT barrels that destroy nearby objects and trigger chain reactions without awarding money.
- Catchable strength vials that double retrieval speed for two catches and stack with winch upgrades; Gold Rush boosts the next two gold catches by 50%, and time vials add 10/15/20 seconds based on Vial Belt.
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
| Safety Grip | Safe TNT barrel/rat collection; −25% / −20% / −15% launch speed while ON; disarm in 3.5 / 3 / 2.5 seconds by tier; +1 dynamite per delivery; starts ON and remembers your choice, lasts for the run | $1,500 / $3,000 / $4,500 |
| Blast Powder | Tier 1 unlocks size-based thrown-dynamite blasts and +50% radius when dynamiting caught TNT; tiers 2/3 add +20%/+40% radius over tier 1; lasts for the run | $1,500 / $3,000 / $4,500 |
| Strength vial | Start the next round with x2 retrieval speed for 2 catches, plus Vial Belt | $1,000 |
| Gold Rush vial | Start the next round with +50% gold value for 2 gold catches, plus Vial Belt | $1,000 |
| Dynamite | One additional stick | $750 |
| Momentum vial | Five starting charges; caught vials add five more; each perfect catch instantly adds 3/4/5 seconds at Vial Belt tiers 1/2/3 (3 without the belt) | $1,250 |
| Luck vial | Active for 20/25/30 seconds by Vial Belt tier (20 without the belt); cash bags roll $300–$400 and mystery cash rolls $500–$650; chest odds: 50% upgrade / 25% cash / 25% dynamite | $1,000 |
| Time vial | Adds 10/15/20 seconds at Vial Belt tiers 1/2/3 (10 without the belt) at round start | $1,000 |
| Lightweight Grip | Rock hauling weight reduced by 40% for one round | $250 |
| Prospector’s Lens | Reveals cash-bag values, mystery-bag contents, and treasure-chest rewards for one round | $1,500 |
| Vial Belt | +1 Strength/Gold Rush catch per tier; initial Streak effects last 15/20/25 seconds and Time vials add 10/15/20 seconds at belt tiers 1/2/3; Luck lasts 20/25/30 seconds; Momentum adds 3/4/5 seconds per perfect catch with five charges per vial; lasts for the run | $2,000 / $3,500 / $5,000 |
| Streak vial | Starts the round at x1.5 for 15 seconds (20/25 at belt tiers 2/3); catching another while active adds 5 seconds and increases the multiplier by +0.25x, up to x2 | $1,000 |
| Life vial | Immediately restores one life, up to five | $5,000 |

Winch, Gem Polish, Gold Polish, Blast Powder, and Vial Belt upgrades last for the run, with three tiers each. Safety Grip also lasts for the run, with three tiers. Vial Belt increases Strength and Gold Rush from 2 catches to 3/4/5, including Strength from mystery bags. Initial shop and caught Streak effects last 15 seconds without Vial Belt or at tier 1, 20 seconds at tier 2, and 25 seconds at tier 3. Additional Streak vials caught while active add only 5 seconds, regardless of Vial Belt, and increase the multiplier by +0.25x up to x2. Shop and caught Time vials, including mystery rewards, add 10 seconds without Vial Belt or at tier 1, 15 at tier 2, and 20 at tier 3. Luck, extra time, Lightweight Grip, Streak vial, Momentum, and Prospector’s Lens use one stocked supply per round. Luck activates for the first 20/25/30 seconds at Vial Belt tiers 1/2/3 (20 without the belt); caught Luck vials refresh that duration. Lightweight Grip affects all four rock sizes, including gem-bearing rocks; attached gems retain their normal weight. It does not increase rock values or stack within a round. Buy multiple charges to cover future rounds; extra time does not stack within a single round. Lens labels appear just below each object and update with Luck activation or expiry. Bag rewards lock on latch and chest rewards lock when opened, preserving them through expiry. Life vials cannot be purchased at full lives. Buying is optional. From level 2 onward, the pre-level briefing includes **Back to Shop** to restock before mining; returning preserves your money, supplies, upgrades and retry layout.

### Safety Grip

Safety Grip has **three permanent tiers for the current run**, costing **$1,500 / $3,000 / $4,500**. Press **Right Arrow** or click its shield in the dynamite HUD to toggle it. It starts **ON** when purchased and remembers your choice between levels and retries. Choose before launching: the toggle is available only while the claw is idle, for both Right Arrow and clicks. It stays fixed during launch, hauling, empty returns and dynamite throws. Each blocked press or click shows a floating message asking you to wait for the claw to return. While ON, claw launch speed is reduced by **25% / 20% / 15% at tiers 1 / 2 / 3**; hauling speed is unchanged. Switching OFF restores normal launch speed, but TNT detonates on contact. Aftershock doubles the resulting launch speed, so Safety Grip’s penalty still applies during that buff. When ON, claw contact starts a **3.5 / 3 / 2.5-second disarming countdown at tiers 1 / 2 / 3** for TNT barrels and TNT rats instead of detonating them. The claw stays still during disarming, while the level timer continues to run, then starts hauling. Each safely delivered barrel or rat awards **one dynamite stick**, no money, and neither advances nor breaks the catch streak. The final haul still pays its reward after the timer reaches zero.

A shield to the right of the miner indicates Safety Grip is ON; a visible countdown shows disarming progress, followed by a confirmation message. Free TNT still detonates in nearby explosions. Safety Grip and Blast Powder work independently: with both ON, safely catch TNT and either deliver it for a stick or sacrifice it using Up Arrow for a Blast Powder explosion. Destroying a held TNT object awards no dynamite. Toggling Safety Grip costs no sticks; the unlock survives failed attempts and resets for a new run. Safety Grip replaces Dynamite Overdrive; Right Arrow no longer boosts hauling speed.

### Blast Powder and Gold Polish

Blast Powder is a permanent upgrade for the current run, with three tiers. It stays unlocked through cleared levels and failed attempts, and starts ON when purchased and remembers its toggle between levels and retries. Press **Left Arrow** or click its toggle in the combined dynamite/Blast Powder HUD to switch it ON or OFF. Active buffs occupy a separate column beside this panel. The HUD shows the owned tier and ON/OFF state; a Blast Powder icon to the left of the miner appears while ON. Unlike Safety Grip, Blast Powder can be toggled during launch, hauling and empty returns, including the final haul at zero seconds. Each thrown dynamite stick snapshots the Blast Powder setting and tier at throw time, so changing the toggle during its flight affects future explosions, not the stick already thrown. No round charge is consumed; new runs reset the upgrade.

Caught vials always trigger their special shatter effect; Blast Powder adds no destructive blast and does not increase the effect’s radius, strength or duration. For other caught objects, Blast Powder ON makes thrown dynamite destroy the caught item and blast nearby free objects. At tier 1, the blast radius is **2.5 times the caught item’s radius**: small gold produces a 37.5-pixel blast, medium gold 80 pixels, large gold 120 pixels, and giant gold 180 pixels. TNT contact detonations and secondary chain reactions always use the normal 135-pixel radius, regardless of Blast Powder. Throwing dynamite at a caught TNT barrel or TNT rat with Blast Powder ON creates a larger 202.5-pixel blast at tier 1. Tiers 2 and 3 multiply thrown-dynamite radii by 1.2 and 1.4 relative to tier 1 (giant-gold blasts: 180/216/252 pixels; directly dynamited TNT: 202.5/243/283.5 pixels). This enhanced TNT blast requires catching it safely with Safety Grip first. Explosion visuals match their damage radius. Destroyed objects award no money; blasted gem deposits release their remaining treasure after the explosions so the released loot survives. With Blast Powder OFF or unowned, thrown dynamite destroys only the caught item, and TNT uses its normal radius.

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

Aim through the centre of valuable objects for a **Perfect catch**: a gold flash, crisp chime, and 35% faster reeling for the entire haul. The centre window is 30% of the object's radius, capped at 10 pixels. Perfect catches pay an extra 35% of the object's boosted cash value, rounded up to the nearest $10, on delivery, separately from streak bonuses. Mystery bags and non-cash chest rewards receive the reel boost only. Rocks, empty rats and opening a chest do not qualify. Utility vials qualify for faster perfect hauling without a cash bonus. Dynamiting the object forfeits its perfect bonus.

### Catch streaks

All gold nuggets (including small and medium), diamonds, rubies, diamond- and ruby-carrying rats, cash bags, mystery bags, and treasure chests advance the catch streak immediately when the claw latches onto them. Mystery bags and treasure chests count regardless of their contents. A chest advances the streak on the second hit when the claw latches onto it, not on the first hit that opens it. Each streak step uses the selected mine’s earnings target: 0.5% in Gold Basin, 1.5% in Treasure Hollow, or 3% in Gem Hollow, rounded to the nearest $5. Catch 3 awards one step, catch 4 awards two steps, catch 5 awards three steps, and each further qualifying catch adds another step to its bonus, without a cap or automatic reset. For a $2,000 target in Treasure Hollow, the step is $30: catches 3, 4 and 5 award $30, $60 and $90 respectively. From streak 3 onward, each qualifying latch triggers a bouncing streak-number popup and golden burst at the object, showing the bonus due on delivery. Streak bonuses are paid when the object reaches the surface and count toward level gold and spendable money. Dynamiting a qualifying catch preserves its streak progress but forfeits its payout.

Catching an empty rat or an ordinary stone without a gem immediately breaks the streak, even if you dynamite it afterward. Catching a whole rock containing an embedded diamond or ruby advances the streak and earns the normal streak bonus, including combined gem-studded rocks. Gem-studded deposits without an embedded gem stay neutral: they preserve the streak without advancing it. Once an embedded gem is caught separately, its ordinary host rock breaks the streak if caught. An empty shot also resets it. Catching a gem separately from its rock advances the streak normally. Utility items stay neutral: they neither advance nor break the streak. Opening a chest and hitting TNT also preserve it. Every level and retry starts at zero.

Catchable orange Streak vials appear in all three mines, with 25% odds of none, 50% of one, 20% of two and 5% of three. Collecting it multiplies the target-scaled streak bonuses by 1.5 for 15 seconds (20/25 at Vial Belt tiers 2/3). For a $2,000 target in Treasure Hollow, catches 3, 4 and 5 pay $45, $90 and $135 respectively. It does not multiply object values or change streak rules. It is neutral to the streak. Its countdown pauses with the game and resets on the next level or retry. The bonus is locked in when the claw latches, even if the effect expires before delivery.

The shop Streak vial activates the same timed x1.5 effect at round start. Catching another Streak vial while active adds 5 seconds to the remaining time and increases the multiplier by +0.25x (x1.5 → x1.75 → x2 maximum). Once the timer expires, streak bonuses return to normal. Extra shop charges cover future levels; they do not stack multipliers.

### Starting vials and run modes

Strength vials ($1,000) and Gold Rush vials ($1,000) can be stocked in the shop. One of each purchased supply activates per round: Strength doubles retrieval speed for 2 catches; Gold Rush adds 50% value for 2 gold catches. Vial Belt adds one catch per tier. Mine vials add their full catches to the remaining effect without increasing its multiplier, including Strength from mystery bags. Active catches expire after the round; unused shop stock covers future rounds. Failed attempts restore starting supplies.

Before starting a run, choose a game mode. It stays fixed for every level and retry in that run:

| Mode | Entry fee | Treasure added | Target |
|---|---:|---|---|
| Treasure Hollow | Free | Mixed treasure; guaranteed minimums and bonus rolls follow the progression table below | Standard |
| Gold Basin | Free | 7 giant and 2 large gold; fewer rocks and medium nuggets | Previous route target +35%, then reduced 10%; rounded to $50 |
| Gem Hollow | Free | 4 diamonds and 3 rubies | Previous route target +35%, rounded to $50 |

All three mines are free to enter. Choose between mixed treasure, heavy gold and precision gems. Treasure Hollow valuables use one progression pool, replacing generic base, width and density spawns. Gold nugget counts and values keep their existing rules. Treasure Hollow bonus chances now grow by **two percentage points per level**, capped at 85%; through level 30 they remain below that cap. Starting at 20%, 15% and 10%, they finish at **78%, 73% and 68%**. Triggered bonuses give **+1 at 60%, +2 at 30%, +3 at 10%**. These amount weights stay fixed throughout the run. Rolls happen once before placement retries; retrying a level preserves its seeded rolls.

| Special item | Starting minimum | Add one guaranteed at levels | Starting bonus rating |
| --- | --- | --- | --- |
| Money bags | 1 | 10, 22 | 20% |
| Diamonds | 2 | 13, 25 | 15% |
| Rubies | 1 | 10, 22 | 10% |
| Mystery bags | 1 | 16 | 15% |
| Treasure chests | 0 | 13 | 10% |
| Gem-studded rocks | 0 | 7 | 20% |
| Gems stuck on rocks | 0 | 16 | 15% |
| Combined rocks | 0 | 25 | 10% |

Treasure Hollow adds one ordinary rock and one rat at each of levels 7, 16 and 25, and one TNT barrel at levels 10 and 22 (barrels stay capped at six in Rat Tunnels and seven elsewhere). Gem-carrying rats are capped at one through level 15 and two thereafter; extra carriers become ordinary rats. Crowded layouts preserve at least two ordinary rocks plus these rock additions beyond the rolled hidden-deposit count, and slim density rocks into ordinary stones rather than adding more gold. Ordinary rats can still become TNT rats under the existing 25% rule and two-per-level cap.

Special rocks have their own visible gems in addition to the loose gem pool. Gem-studded rocks contain hidden deposits; combined rocks also have a catchable visible gem. Gem-carrying rats and rewards inside deposits keep their separate rules. Targets and other modes are unchanged.

The selected mode persists through the shop, every cleared level and every retry. Failed attempts retain the starting balance plus 50% of new earnings, restore starting supplies, and keep the same seeded layout and mystery rewards. Collected permanent chest upgrades carry into retries; chest upgrade rolls exclude currently maxed upgrades. Clearing a level generates a fresh layout in the same mode for the next level. New runs open game-mode selection before level 1, including after losing or completing a run.

Mine routes also have distinct scenery: Treasure Hollow uses earthy stone, Gold Basin has amber strata, gold seams and timber supports, and Gem Hollow has blue-violet stone, cool lanterns and wall crystals. Gold Basin retains its extra heavy gold, while Gem Hollow replaces extra-density large and giant gold with diamonds and rubies; entrance previews match each environment.

Gold Basin keeps only a medium rock and a small rock, removes ordinary large/heavy rocks (apart from the rare large gem host), scales TNT with progression, and uses a dedicated density pool favoring giant/large gold and supplies, with no extra medium nuggets or rocks. Only two base medium nuggets remain. Its giant nuggets spread across the middle and bottom to keep crowded layouts playable.

Gold Basin specializes in gold: at most one loose diamond and one cash bag, no loose rubies, gem-carrying rats, mystery bags or treasure chests. Each of Strength, Gold Rush, Time, Streak and Momentum independently rolls 25% for none, 50% for one, 20% for two or 5% for three, matching the other mines. Luck vials are excluded from Gold Basin’s loose spawn pool. These fixed vial odds replace its previous progression counts and bonus rolls. TNT still starts at 3 barrels on levels 1–6, 4 on 7–12 and 5 on 13–30, with a 40% chance of one extra. Rolls are fixed per seeded layout and retries preserve them. Each caught Time vial adds 10/15/20 seconds based on Vial Belt. Gem Hollow spreads gems from the middle to the bottom, with at least 130 pixels between gem centres and distinct aiming angles; gems no longer cluster around TNT. Mounted gems respect the same spacing.

Gold Basin and Gem Hollow retain their increased targets: their previous rounded targets are raised by 35%, rounded again to the nearest $50. Treasure Hollow targets stay unchanged. Gem Hollow contains no gold nuggets of any size and no catchable Gold Rush vials, including in crowded-layout fallbacks. Its rock deposits also contain gems rather than gold; its existing scattered gem population remains the focus. Catchable Strength vials are available to help haul rocks and chests.

Gem Hollow adds two large rocks, two medium rocks and two small rocks as precision obstacles. Placement rejects rocks that block the last usable aiming gap to a gem, so clearing rocks is optional. TNT is capped at three barrels to leave room for the extra rocks. Existing gem spacing and gold-free generation still apply.

Gem Hollow cash bags use two independent 75% rolls per seeded layout, capped at two bags: 6.25% chance of none, 37.5% of one, and 56.25% of two. These replace all base-level, width and density cash-bag additions. Retries keep the same rolls; mystery bags and treasure chests are separate.

The game-mode selection screen explains each playstyle: Treasure Hollow rewards varied catches and sustained streaks; Gold Basin rewards heavy-haul planning, vial use, time-vial collection and avoiding TNT; Gem Hollow rewards accurate shots through rock gaps, perfect catches and Gem Polish.

Treasure Hollow normally scatters diamonds, rubies, bags and chests at least 90 pixels apart; crowded layouts may use 45 pixels and the full buried depth range to preserve rolled treasure counts. Rich late-game layouts can place treasure behind rocks that must be cleared first; gems remain precisely catchable from their own host once intervening rocks are cleared. Placement favors the middle band (y=390–700), with some treasure deeper (y=600–860); crowded layouts can use the full y=390–860 range. Treasure Hollow diamonds do not cluster around TNT and its cash bags are not forced deeper by the Deep Mine layout. Mounted gems also preserve the treasure spacing. Values and targets are unchanged. Crowded Treasure Hollow layouts can use slimmer rocks while keeping all treasure.

Gold Basin has a seeded 50% chance of a deep large gem-bearing rock. Only large rocks can host embedded gems or hidden deposits in Gold Basin; its existing diamond can be mounted on the large host. Medium and small rocks remain ordinary.

Crowded Gold Basin layouts may drop up to four small and two medium gold nuggets, preserving giant/large gold, gem-bearing large rocks and all rolled supply minimums/extras.

Game-mode cards focus on the illustrated entrance, playstyle, a short description of what makes each mode different, and quieter subtext explaining its rewards and tradeoffs. Exact spawn counts are omitted from these cards; level targets remain on the level briefing.

Strength charges are not consumed by catching any mine vial, including Luck and Momentum. Other catches still use a charge. Gold Basin starts with 60 seconds (70/75/80 with the shop Time vial, based on Vial Belt) and its previous targets are reduced by 10%, rounded to the nearest $50. Catchable Time vials add 10/15/20 seconds each, based on Vial Belt. Treasure Hollow and Gem Hollow retain their current targets and 60-second base timer. The level briefing and gameplay use the same mode duration.

The shop includes a Forfeit Run button after any attempt. Confirming ends the run and returns to the main menu; Keep Playing or Escape closes the confirmation without changing purchases, money or supplies. Shop purchases and level progression are blocked while the confirmation is open.

Treasure Hollow trades two small and two medium nuggets for two giant nuggets, and one large nugget; loose gems follow the progression table above. Its density allowance is raised by 8 percentage points (with at least six density additions), and wider windows favor large gold, cash bags and gems over small/medium filler. Giant nuggets can occupy the deeper middle as well as the bottom. Chest and mystery-bag chances, treasure spacing, targets and timers are unchanged.

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

All six mine vial types qualify for perfect catches using the same precise-hit threshold as treasure. A perfect vial catch reels in 35% faster for the full haul and shows the perfect-catch feedback; vials award no perfect-catch cash bonus.

Loose rubies and diamonds share weight 0.4 and reel in at the same speed with equivalent boosts.

The shop Time vial uses the same blue vial artwork as mine Time vials and adds the same 10/15/20 seconds based on Vial Belt, applied at the start of the next round (10 seconds without the belt or at tier 1, 15 at tier 2, 20 at tier 3). Luck is active for 20/25/30 seconds at Vial Belt tiers 1/2/3 (20 without the belt), starting at round start for shop stock or on delivery for mine and mystery vials. Another vial refreshes the timer. While active, Luck narrows cash-bag payouts to $300–$400 and mystery-bag cash payouts to $500–$650; Prospector’s Lens previews show these actual payouts. Luck also raises eligible chest upgrade odds to 50%, with 25% each for cash and dynamite. If no upgrade tiers remain, cash and dynamite each have a 50% chance.

All six shop and mine vial types share matching artwork. Momentum uses teal liquid and double forward arrows; Time uses a blue vial with a clock. Streak uses orange liquid and three rising bars, distinct from Luck’s purple vial and clover. Strength and Gold Rush retain their shared catch-based effects; shop and caught Streak vials share the same timed effect.

Momentum is available in the shop immediately to the right of Luck, from loose mine vials, and from mystery bags. Mine and mystery vials immediately add five charges on delivery. One stocked charge activates for the next round; extra purchases cover future rounds. Latching a perfect catch, including a vial or a non-cash chest, immediately earns 3/4/5 seconds at Vial Belt tiers 1/2/3 (3 without the belt) and spends one charge. Each vial grants five charges, worth up to 15/20/25 seconds; collecting more adds another five charges. Dynamiting the catch afterward keeps the earned time. Delivery awards no additional Momentum time. Ordinary catches, chest-opening shots and TNT detonations earn none. Charges reset each round or retry; remaining stock carries forward. The buff HUD shows the remaining charges.

### Vial shatter effects and mine supplies

#### Shattering caught vials

Spend one dynamite on a caught vial to replace its normal reward with the effect below. Blast Powder does not add a destructive blast or increase its radius, strength or duration. Vial Belt does not scale shatter effects. Shattering awards no delivery or perfect-catch cash; free vials destroyed by other explosions do not activate.

| Vial | Shatter effect |
|---|---|
| Strength | **Rock Breaker:** clears ordinary rocks within 200px, preserving deposits and gem-bearing rocks. |
| Gold Rush | **Golden Touch:** nuggets within 300px gain +50% value for the rest of the level, marked with a gold ring. Repeated bursts do not stack. |
| Streak | **Streak Spark:** immediately adds two catch-streak steps. |
| Luck | **Lucky Find:** reveals one diamond or ruby near the vial, with equal odds. Catch it to earn its value. |
| Momentum | **Aftershock:** doubles launch and retract speed for six seconds. Repeated bursts refresh the duration; pausing freezes it. |
| Time | **Second Chance:** Each shattered Time vial adds three recall charges for the current level. Press Down or click again during launch to spend one charge and recall the empty claw without breaking your streak. |

#### Mine vial spawns

All three mines use one independent count roll per eligible vial type: 25% for zero, 50% for one, 20% for two and 5% for three. This replaces previous vial counts and bonus rolls. Momentum is included in every mine. Gem Hollow excludes Gold Rush because it has no gold; Gold Basin excludes Luck. Catching Luck activates it immediately for 20/25/30 seconds at Vial Belt tiers 1/2/3 (20 without the belt), refreshing its duration if already active. Catching Momentum immediately adds five charges. Mystery-bag vials behave the same way. Life vials never spawn loose in the mine. All mine vials preserve Strength charges and qualify for perfect-haul speed. Placement favors 15% surface, 70% middle and 15% deep. Retries preserve the seeded layout.
