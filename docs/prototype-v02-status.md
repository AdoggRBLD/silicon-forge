# Silicon Forge — Prototype v0.2 Status

> Browser-based proof-of-concept: `game/index.html`
> Last updated: 2026-05-09

---

## Table of Contents

1. [How to Run](#how-to-run)
2. [File Structure](#file-structure)
3. [Game State Object](#game-state-object)
4. [Items Catalog](#items-catalog)
5. [Cities](#cities)
6. [Travel System](#travel-system)
7. [Equipment](#equipment)
8. [Random Events](#random-events)
9. [Mini-Games](#mini-games)
10. [Jobs Board & Daily Limit](#jobs-board--daily-limit)
11. [Operation Progression](#operation-progression)
12. [Music Engine](#music-engine)
13. [Settings & Persistence](#settings--persistence)
14. [Scoreboard & Agent Name](#scoreboard--agent-name)
15. [Field Manual](#field-manual)
16. [UI Layout](#ui-layout)
17. [CSS Variables & Design Tokens](#css-variables--design-tokens)
18. [Known Issues](#known-issues)
19. [Next Steps for Flutter Port](#next-steps-for-flutter-port)

---

## How to Run

No build step. No server required.

```
open game/index.html
```

Or drag `game/index.html` into any browser. Works in Chrome, Firefox, Safari, Edge.

---

## File Structure

```
game/
  index.html   ~245 lines   All HTML: layout, modals, statusbar
  style.css    ~460 lines   CRT terminal aesthetic, responsive layout
  game.js      ~1,650 lines Full game logic — no dependencies
```

All persistence is `localStorage`. All audio is Web Audio API (zero external files).

---

## Game State Object

`G` is the single mutable game state. Key fields:

| Field | Type | Description |
|---|---|---|
| `day` | int | Current day (1–20) |
| `cash` | int | Player cash balance in ₿ |
| `debt` | int | Outstanding debt (starts ₿2,000) |
| `debtRate` | int | Interest per day (₿100) |
| `city` | string | Current city ID |
| `inventory` | object | `{ itemId: qty }` |
| `inventoryMeta` | object | `{ itemId: { pricePaid, qty } }` — weighted avg cost |
| `reputation` | int | Rep score, earned from jobs |
| `operation` | int | Current op (1, 2, or 3) |
| `gameOver` | bool | Set true when day > 20 or cash goes negative with no inventory |
| `totalEarned` | int | Cumulative job income this run |
| `todayIncome` | int | Resets each day |
| `jobsDoneToday` | int | Resets each day; day advances at 3 |
| `travelPrices` | object | `{ fromCity: { toCity: { bus, plane } } }` |
| `marketMod` | object | Temporary price multipliers from events |
| `marketModExp` | object | Day when each marketMod expires |
| `availableJobs` | array | Up to 2 job objects, refreshed daily |
| `hasScope` | bool | USB oscilloscope owned |
| `carryMultiplier` | int | Inventory carry multiplier (ESD rack = 2×) |
| `reworkStation` | bool | Hot air rework station owned |
| `concepts` | object | Encyclopedia entries unlocked this run |
| `log` | array | Recent events for Signal Log panel |

---

## Items Catalog

| ID | Name | Price Range | Max Carry | Op Gate | Notes |
|---|---|---|---|---|---|
| `mlcc` | Bulk MLCCs | ₿5–38 | 20 | — | High volume, thin margin |
| `artix7` | Artix-7 FPGA | ₿90–450 | 8 | — | Hot commodity |
| `tangnano` | Tang Nano 9K | ₿14–65 | 15 | — | Cheap, OSS tools |
| `resistors` | Resistor Pack 1% | ₿2–16 | 30 | — | Bulk play |
| `ipcores` | Custom IP Cores | ₿200–1,800 | 5 | — | High value, hard to move |
| `bga` | BGA Reballs | ₿10–90 | 25 | — | Risk item, counterfeit-adjacent |
| `rfmodule` | RF Module 2.4GHz | ₿45–280 | 12 | — | FCC/CE story hooks |
| `milspec_ic` | Mil-Spec IC | ₿300–2,500 | 10 | Op 2 | Pentagon play |
| `tapeout` | Tapeout Slot | ₿800–5,000 | 3 | Op 2 | Rare, high margin |
| `custom_asic` | Custom ASIC Die | ₿2,000–15,000 | 5 | Op 3 | Singapore/ASIC play |
| `wafer_lot` | Wafer Lot 100mm | ₿5,000–28,000 | 2 | Op 3 | Highest risk/reward |

**Carry capacity** is multiplied by `G.carryMultiplier` (default 1, becomes 2 with ESD Storage Rack).

**Price generation:** Base price randomized within `[minPrice, maxPrice]`, then multiplied by city's `priceMultiplier`, then by any active `marketMod`, then ±`variance` per day. Weighted average cost basis tracked in `inventoryMeta` so P&L displays correctly.

---

## Cities

| ID | Name | Code | Price Mult | Variance | Notes |
|---|---|---|---|---|---|
| `shenzhen` | Shenzhen | SZX | 0.70× | 34% | 18% counterfeit risk; cheapest source |
| `austin` | Austin | AUS | 1.00× | 12% | TI/NXP surplus; stable reference market |
| `toronto` | Toronto | YYZ | 1.08× | 20% | FPGA/OSS premium; rep bonus on sales |
| `tokyo` | Tokyo | TYO | 1.14× | 16% | RF/precision bias; language barrier events |
| `pentagon` | Pentagon | DCA | 1.40× | 8% | Mil-spec premium; ITAR events; Op 2 gate |
| `singapore` | Singapore | SIN | 1.55× | 10% | ASIC/wafer hub; zero counterfeits; Op 3 gate |

**Special biases** (`specialBias`): Toronto boosts Tang Nano (1.4×) and IP Cores (1.3×). Tokyo boosts RF modules (1.7×). Pentagon boosts mil-spec (2×) and tapeout (2.5×). Singapore boosts custom ASIC (2.2×) and wafer lots (2×).

---

## Travel System

### Route Base Costs (₿, bus one-way)

|  | SZX | AUS | YYZ | TYO | DCA | SIN |
|---|---|---|---|---|---|---|
| **SZX** | — | 70 | 75 | 30 | 90 | 25 |
| **AUS** | 70 | — | 25 | 80 | 20 | 85 |
| **YYZ** | 75 | 25 | — | 80 | 25 | 90 |
| **TYO** | 30 | 80 | 80 | — | 90 | 20 |
| **DCA** | 90 | 20 | 25 | 90 | — | 95 |
| **SIN** | 25 | 85 | 90 | 20 | 95 | — |

**Daily variance:** bus cost = `base × rand(0.8–1.2)`, plane = `base × 3.2 × rand(0.7–1.3)`. Regenerated each day on `genTravelPrices()`.

### Bus vs Plane

| Mode | Cost | Day Used | Events Fire |
|---|---|---|---|
| Bus | base × ~1.0 | Yes (+1 day) | Yes |
| Plane | base × ~3.2 | No | No |

**Strategic use:** fly when you have 1–2 days left and can't afford to lose a day; bus when prices at destination should drift favorably overnight.

---

## Equipment

| ID | Name | Cost | Effect | Where to Buy |
|---|---|---|---|---|
| `storage_rack` | ESD Storage Rack | ₿300 | Carry capacity ×2 | Shenzhen, Austin |
| `usb_scope` | USB Oscilloscope | ₿200 | +40% job payout (scope hint unlocked) | Toronto, Tokyo |
| `rework_station` | Hot Air Rework Station | ₿450 | BGA carry +10, sell value +25% | Austin, Tokyo |

Equipment persists for the run, shown as badges in the Portfolio panel.

---

## Random Events

18+ weighted events split across bad/good/neutral. Fire rate: one event per day, ~70% chance. Events are filtered by:
- `opMin` — only fire at certain operation levels
- Inventory requirements — some events need specific items in inventory
- City — some events are city-scoped

### Event Categories

**Bad events (losses):**
- Customs seizure — lose 30–40% of inventory
- ESD event — one random item destroyed
- TSMC allocation cut — price spike 3× for affected items
- Competitor OSS release — IP core value −60%
- Tariff hike — Shenzhen goods +25% (3-day duration)
- ITAR violation warning — Pentagon contract suspended
- Language barrier error — lose ₿ on Tokyo purchase
- Market correction — random item −40%
- Yield crash — tapeout/ASIC price spike
- Wafer contamination — wafer lot destroyed (Op 3)

**Good events (gains):**
- Client paid early — unexpected cash windfall
- Bulk order discount — buy at −20%
- Conference buzz — random item price +50%
- Open-source board release — Tang Nano demand spike
- Government grant — rep converts to cash
- RF certification — RF module value spike
- IP acquisition offer — cash bonus for ASIC holdings (Op 3)

**Neutral/choice events:**
- VC term sheet — equity dilution vs cash
- Lead engineer quit — productivity penalty
- 180nm capacity booked — scarcity spike (Op 3)

---

## Mini-Games

Two mini-game types share the `#mg-modal`. Type is determined by `puzzle.type`.

### Circuit Repair (`type: 'circuit'`)

**Mechanic:** ASCII schematic shown on left. Component bin on right. Player taps a component to select it, then taps a slot to place it. Slots have a required `accepts` type (capacitor, resistor, oscillator, etc.). All slots must be correctly filled to pass.

**Puzzles include:**
- Power supply ripple filter
- UART clock domain crossing fix
- MOSFET gate driver
- I2C pull-up network
- Crystal oscillator load
- Buck converter

**Scope bonus:** If player owns USB oscilloscope, reward multiplied by 1.4×.

### Fault Diagnosis (`type: 'diagnosis'`)

**Mechanic:** Situation report + scope reading shown. 3–4 multiple choice options. Player selects, submits. Correct answer shows explanation + engineering note; wrong answer shows why it failed.

**Puzzles include:**
- I2C clock stretch timeout
- SPI MISO floating line
- UART baud mismatch
- Metastability in async domain crossing
- Insufficient decoupling near ADC
- Ground plane split causing EMI

---

## Jobs Board & Daily Limit

- 2 job slots always available in the Contracts panel
- Refreshed each `advanceDay()` and on mini-game close
- Each job randomly drawn from the puzzle pool (filtered by op level)
- Reward = `puzzle.rewardBase` × 1.4 if player has oscilloscope

### 3-Job Daily Limit

After completing 3 jobs in a single day:
- Win screen shows amber warning: "⚠ 3 JOBS DONE — day will advance when you collect."
- `closeMiniGame()` calls `advanceDay()` instead of just refreshing
- Counter (`G.jobsDoneToday`) resets to 0 at the start of each day
- Skipping a job does NOT count toward the limit

---

## Operation Progression

| Op | Unlock Condition | New Content |
|---|---|---|
| Op 1 | Start of game | Shenzhen, Austin, Toronto, Tokyo. 8 items. |
| Op 2 | Net worth ≥ ₿15,000 | Pentagon, mil-spec IC, tapeout slots. |
| Op 3 | Net worth ≥ ₿50,000 | Singapore, custom ASIC, wafer lots. |

**Unlock flow:**
- Op unlock persisted to `localStorage` (`sf_op2_unlocked`, `sf_op3_unlocked`)
- On Op N win, game-over screen shows "START OPERATION N+1" button
- New ops start with fresh cash/debt but higher starting cash (Op2: ₿5,000, Op3: ₿10,000)

---

## Music Engine

4 procedural chiptune tracks. All audio generated via Web Audio API — no external files.

| Track | BPM | Key | Oscillators | Mood |
|---|---|---|---|---|
| GRID RUNNER | 132 | C minor pentatonic | Square + Triangle | Driving, classic |
| SILICON DRIFT | 112 | E Dorian | Sawtooth + Triangle | Smooth, technical |
| TARIFF SPIKE | 158 | G minor | Square + Sawtooth | Aggressive, urgent |
| DEEP TRACE | 96 | D minor | Triangle + Sine | Ambient, focused |

**Architecture:** Look-ahead scheduler (50ms tick, 150ms buffer). Each note = OscillatorNode + GainNode with 10ms attack and 50ms release envelope. Master gain node controls volume.

**Autoplay gate:** `MUSIC.start()` is called inside `startGame()` (the "START TRADING" button click), satisfying browser autoplay policy. Music does NOT start on page load.

**Track persistence:** `SETTINGS.trackIndex` saved to `localStorage`, restored on next load.

---

## Settings & Persistence

### SETTINGS Object

```javascript
{
  music:      bool    // music on/off
  volume:     float   // 0.0–1.0 (default 0.18)
  sfx:        bool    // SFX on/off (reserved)
  scanlines:  bool    // CRT scanline overlay
  trackIndex: int     // 0–3
}
```

Saved to `localStorage` key `sf_settings` as JSON. Loaded and applied on `DOMContentLoaded`.

### Other localStorage Keys

| Key | Value | Description |
|---|---|---|
| `sf_settings` | JSON | Settings object |
| `sf_scores` | JSON array | Top 10 run scores |
| `sf_agent_name` | string | Last used agent name |
| `sf_op2_unlocked` | `'1'` | Op 2 permanently unlocked |
| `sf_op3_unlocked` | `'1'` | Op 3 permanently unlocked |

---

## Scoreboard & Agent Name

- Agent name entered on intro screen, max 20 chars, uppercased, falls back to "ANONYMOUS"
- Saved to `sf_agent_name` on game start
- Each completed run saves a score entry:
  ```javascript
  { name, op, opLabel, nw, earned, days, rep, won, date }
  ```
- Top 10 by net worth kept in `sf_scores`
- Scoreboard modal (`SCORES` button) shows rank, name, op label, net worth, run income, days, date

---

## Field Manual

- Populated as player encounters items (tap item name in market = learn entry added)
- Populated when player completes mini-games (concept entry added)
- Persists within a run via `G.concepts` object
- Accessible via `MANUAL` button in statusbar
- Resets between runs

---

## UI Layout

```
┌──────────────────────────────────────────────────────┐
│ STATUSBAR: logo · day · city · cash · debt · rep     │
│           [HW] [SCORES] [MANUAL] [SETTINGS]          │
├──────────────────────────┬───────────────────────────┤
│ MARKET PANEL             │ RIGHT COLUMN              │
│  city name + description │  Portfolio (stats)        │
│  item list (buy/sell)    │  Inventory (capacity bars)│
│  equipment shop          │  Jobs & Contracts         │
├──────────────────────────┴───────────────────────────┤
│ ACTION BAR: TRAVEL: [city buttons w/ price]  END DAY │
├──────────────────────────────────────────────────────┤
│ SIGNAL LOG (last 16 events, scrollable)              │
└──────────────────────────────────────────────────────┘
```

**Modals (overlay):** Intro, Trade, Event, Mini-Game, Travel, Settings, Hardware, Scores, Manual, Game Over

---

## CSS Variables & Design Tokens

```css
--green:      #39ff14   /* primary phosphor */
--green-dim:  #1c7a0c   /* secondary/muted text */
--green-dark: #071a03   /* active panel background */
--amber:      #ffaa00   /* warnings, plane ticket, highlights */
--red:        #ff4040   /* danger, losses */
--blue:       #00ccff   /* info, learn boxes */
--bg:         #080808   /* page background */
--panel:      #0c0c0c   /* panel background */
--border:     #1c3a1c   /* panel/row borders */
```

---

## Known Issues

- **No SFX yet** — `SETTINGS.sfx` toggle is plumbed but no sounds fire on buy/sell/events
- **Language barrier events** — Tokyo `languageBarrier` flag exists but no dedicated event fires yet
- **Singapore shop** — `shopItems: []`, no equipment sold there
- **Rep system** — reputation accrues but only partially affects game (rep → cash event only)
- **Pentagon ITAR** — ITAR flag exists, fires one warning event, but no multi-turn suspension mechanic
- **Counterfeit reveal** — Shenzhen counterfeit probability set but reveal mechanic not fully implemented

---

## Next Steps for Flutter Port

Priority order for first Flutter sprint:

1. **Core state machine** — port `G` object and all mutation functions to Dart/Riverpod
2. **Market screen** — ListView of items with buy/sell buttons, CRT aesthetic
3. **Travel screen** — city grid with bus/plane modal
4. **Random event overlay** — full-screen modal with choices
5. **Circuit repair mini-game** — drag-drop in Flutter (GestureDetector + Stack)
6. **Fault diagnosis mini-game** — straightforward RadioListTile
7. **Timing Tetris** — new mini-game, Flame engine
8. **Sound** — flame_audio, convert procedural tracks to .ogg
9. **Google Play alpha** — internal test track, 20 testers
