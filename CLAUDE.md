# CLAUDE.md — Silicon Forge

> "Make players feel like engineers. Not students."

---

## Table of Contents

1. [Project Identity](#project-identity)
2. [The Vibe](#the-vibe)
3. [Core Gameplay Loop](#core-gameplay-loop)
4. [Engineering Mini-Games](#engineering-mini-games)
5. [Progression Tree](#progression-tree)
6. [Art Direction](#art-direction)
7. [Prototype Status (v0.3)](#prototype-status-v03)
8. [Technical Architecture](#technical-architecture)
9. [Monetization](#monetization)
10. [MVP Scope](#mvp-scope)
11. [What Success Looks Like](#what-success-looks-like)
12. [The Real Business Model](#the-real-business-model)
13. [Related Documents](#related-documents)

---

## Project Identity

**Silicon Forge** is a mobile-first Android game in the spirit of **Drug Wars / Dope Wars** — but instead of buying heroin in the Bronx and fleeing the cops, you're buying FPGA boards in Shenzhen and fleeing tariffs.

The core loop is the same:
- You have limited cash
- You move between markets (cities → fabs → clients)
- You buy low, sell high
- Random events wreck your plans (chip bans, yield crashes, ESD damage, customs seizures)
- You upgrade your gear, your rep, and your lab
- You die or retire rich

The learning is invisible. Players absorb IC design, FPGA concepts, PCB economics, and manufacturing reality *by playing*, not by studying.

---

## The Vibe

**Drug Wars** meets **Shenzhen I/O** meets **Factorio** meets **Kerbal Space Program**

- Lo-fi terminal aesthetic with glowing PCB traces
- Chunky pixel fonts. Green phosphor. CRT scanlines.
- Every menu looks like an embedded UART terminal
- Humor is dry and technical ("Your MOSFET blew. Classic.")
- The "street" is the global chip supply chain

---

## Core Gameplay Loop

```
START DAY
  → Check market prices (chip components, FPGAs, ICs)
  → Travel to new location (Shenzhen, Taiwan, Toronto, Detroit, Austin)
  → Buy/sell inventory (components, IP cores, fab slots, dev boards)
  → Random event fires (customs seizure / chip shortage / competitor poaches client)
  → Complete contract (design challenge mini-game)
  → Upgrade lab / unlock new tools
  → Loan shark is always watching (cash burn: rent, power, licenses)
END DAY → repeat
```

### Markets (the "cities")

| Location | Op | Specialty | Risk |
|---|---|---|---|
| Shenzhen Wet Market | 1 | Cheap components, clones, surprises | High counterfeit rate |
| Austin Chip District | 1 | TI, NXP surplus | Stable, boring |
| Toronto Maker Hub | 1 | FPGA trainers, OSS tools | Low margin, good rep |
| Tokyo Fab Row | 1 | Precision analog, sensors | Language barrier events |
| Pentagon Contracting | 2 | Mil-spec, huge margins | Export controls, paperwork |
| Singapore (GlobalFoundries) | 3 | ASIC shuttle hub | Strict IP laws |
| TSMC HQ (Hsinchu) | 4 | Bleeding-edge fab slots | NDA required, enormous margins |
| IHP Shuttle Hub (Frankfurt) | 4 | 130nm open-access fab | Academic pricing, community shuttle |

### Inventory (the "drugs")

| Item | Op | Equivalent | Notes |
|---|---|---|---|
| Bulk MLCCs | 1 | Heroin | Everyone needs them, margin is thin |
| Tang Nano FPGAs | 1 | Weed | Legal, cheap, volume play |
| Resistor Pack 1% | 1 | Amphetamines | Volume filler, steady margins |
| Artix-7 FPGA | 1 | Cocaine | Hot commodity, restricted |
| BGA Reballs | 1 | Crack | Dirty money, big risk |
| RF Module 2.4GHz | 1 | Pills | FCC/CE grey zone |
| Custom IP Cores | 1 | Pharmaceuticals | High value, hard to move |
| Mil-Spec IC | 2 | Arms | Huge margins, ITAR exposure |
| Tapeout Slot | 2 | Rare weapons | Reserved fab time, HUGE payday |
| Custom ASIC Die | 3 | Diamonds | Your silicon on the market |
| Wafer Lot (100mm) | 3 | Commodity futures | Bet on yield, lose on contamination |
| GDS-II Package | 4 | IP portfolio | Complete chip layout, mask-ready |
| Bringup Test Fixture | 4 | Lab equipment | First silicon debugging hardware |
| Bringup Board | 4 | Prototype PCB | First silicon host board |

### Random Events (the "cop / mugger")

**Op1–Op2:** Customs seizure, ESD event, chip shortage, counterfeit batch, client paid early, tariff hike, engineer quit, SoftBank term sheet, ITAR warning

**Op3:** Wafer contamination, IP acquisition offer, node capacity scarce, fab yield crash, SEC inquiry, mil-spec audit

**Op4:** Tapeout deadline missed (forfeit slot deposit), shuttle partner drops out, process node discontinued, yield surprise (bonus die windfall), NDA leak scandal

---

## Engineering Mini-Games

These replace the "fight the cop" mechanic. To complete contracts, you run mini-games:

### 1. Circuit Repair ✅ IMPLEMENTED
Drag-drop components into schematic slots to fix broken boards. 1-slot, 2-slot, and 3-slot variants.
**Teaches:** pull-ups, bypass caps, ESD protection, power sequencing, MOSFET gate drive, I2C/RS-485/SPI

### 2. Fault Diagnosis ✅ IMPLEMENTED
Multiple-choice oscilloscope/signal analysis. Read the scope capture, identify root cause.
**Teaches:** UART baud rate, thermal runaway, ground loops, SPI mode mismatch, capacitive crosstalk

### 3. FPGA Arena ✅ IMPLEMENTED (v1)
Program your bot's 3-state FSM sequence to counter the opponent bot.
**Teaches:** finite state machines, state transitions, counter-programming
*Future: drag-and-drop FSM editor, async multiplayer bot battles*

### 4. Silicon Foundry Sim ✅ IMPLEMENTED (v1)
Three live sliders (litho quality, test coverage, throughput) with real-time margin preview. Win by exceeding target margin.
**Teaches:** semiconductor yield economics, fab tradeoffs, cost-per-die optimization
*Future: full wafer map visualization, process variation simulation*

### 5. Timing Tetris ⬜ NOT YET BUILT
Arrange logic blocks to meet timing constraints before clock edge.
**Teaches:** propagation delay, pipelining, clock domains

### 6. Waveform Detective ⬜ NOT YET BUILT (planned Op2)
Read a corrupted oscilloscope trace. Diagnose the fault. Bill the client.
**Teaches:** serial protocols (UART, I2C, SPI), metastability, debugging

### 7. PCB Roulette ⬜ NOT YET BUILT (planned Op3)
Route traces under DRC pressure. Avoid crosstalk. Ship on time.
**Teaches:** signal integrity, layer stackup, EMC basics

---

## Progression Tree

```
Op1 — GARAGE HACKER  (start → ₿0 net worth)       ✅ IMPLEMENTED
  Cities: Shenzhen, Austin, Toronto, Tokyo
  Items: MLCCs, Tang Nano, resistors, Artix-7, BGA, RF modules, IP cores
  Equipment: soldering iron, ESD rack, multimeter
        ↓  (win: positive net worth)
Op2 — FPGA APPRENTICE  (₿15k net worth goal)       ✅ IMPLEMENTED
  + Cities: Pentagon (ITAR, mil-spec)
  + Items: Mil-Spec ICs, Tapeout Slots
  + Events: ITAR warning, tariff hike, engineer quit
        ↓  (win: ₿15k net worth)
Op3 — ASIC DESIGNER  (₿50k net worth goal)         ✅ IMPLEMENTED
  + Cities: Singapore (GlobalFoundries)
  + Items: Custom ASIC Die, Wafer Lot
  + Events: wafer contamination, IP acquisition, node scarcity
        ↓  (win: ₿50k net worth)
Op4 — TAPEOUT & BRINGUP  (₿150k net worth goal)   ✅ IMPLEMENTED
  + Cities: TSMC HQ (Hsinchu), IHP Shuttle Hub (Frankfurt)
  + Items: GDS-II Package, Bringup Test Fixture, Bringup Board
  + Mini-games: Silicon Foundry Sim, FPGA Arena v1, 3-slot circuit repair
  + Events: tapeout missed, shuttle dropout, process canceled, yield surprise, NDA leak
        ↓  (win: ₿150k net worth)
Op5 — FOUNDRY FOUNDER  (₿400k net worth goal)      ⬜ PLANNED
  + Cities: Pentagon Black Budget, Consumer Silicon Hub, AI Chip Exchange
  + Items: custom mask sets, volume wafer agreements, AI accelerator chips
  + 4 branching endings: Open Source Hero / Defense Contractor /
                         Consumer Electronics / AI Chip Startup
```

Each op unlocks via `localStorage` key (`sf_op2_unlocked`, etc.) and persists across runs.

---

## Art Direction

- **Color palette:** Black background, green phosphor primary, amber accent, red for warnings
- **Typography:** Monospace terminal font for UI, chunky bitmap for headers
- **Animations:** Scanline overlay, CRT flicker on alerts, oscilloscope waveform transitions
- **Sound design:** 8-bit SFX, oscilloscope beep tones, keyboard clatter
- **UI metaphor:** Everything looks like a piece of test equipment or a terminal

References:
- Shenzhen I/O (puzzle UI)
- Zachtronics aesthetic generally
- Drug Wars / Drugwars original DOS game
- PICO-8 color depth restraint
- Factorio production chains

---

## Prototype Status (v0.3)

A browser-based prototype lives at `game/` (pure HTML/CSS/JS — no build tools, no framework). Also a PWA: open `game/index.html`, works offline, "Add to Home Screen" on iOS/Android.

### What's Built and Playable

| Feature | Status | Notes |
|---|---|---|
| Buy/sell market loop | ✅ Done | Price variance, trends, counterfeit events |
| 8 cities | ✅ Done | Shenzhen, Austin, Toronto, Tokyo, Pentagon, Singapore, TSMC HQ, IHP Shuttle Hub |
| 14 inventory items | ✅ Done | MLCCs → GDS-II packages, fully op-gated |
| Random event engine | ✅ Done | 23+ events, weighted by op/city/inventory |
| Debt pressure | ✅ Done | Interest scales per op (₿100→₿1000/day) |
| Equipment shop | ✅ Done | Oscilloscope, ESD rack, rework station |
| Circuit repair mini-game | ✅ Done | 1-slot, 2-slot, 3-slot drag-drop variants |
| Fault diagnosis mini-game | ✅ Done | Multiple-choice waveform/protocol puzzles |
| FPGA Arena v1 | ✅ Done | 3-state FSM slot puzzle, bot counter-programming |
| Silicon Foundry Sim v1 | ✅ Done | 3 live sliders, real-time margin preview |
| Flight limit (2/day) | ✅ Done | UI warning + hard block + log counter |
| Jobs board | ✅ Done | 2 rotating jobs, refreshes each day |
| 3-job-per-day limit | ✅ Done | Day auto-advances after 3 completed jobs |
| Operation progression | ✅ Done | Op1→Op2 (₿15k)→Op3 (₿50k)→Op4 (₿150k) |
| Procedural chiptune music | ✅ Done | 4 tracks via Web Audio API, no external files |
| Travel costs: Bus vs Plane | ✅ Done | Bus = cheaper + day advances; Plane = expensive + no day lost |
| Inventory capacity bar | ✅ Done | `[████░░░░] qty/max` per item |
| Agent name prompt | ✅ Done | Stored in localStorage, shown on scoreboard |
| Scoreboard | ✅ Done | Top 10 runs by net worth, localStorage |
| Field Manual | ✅ Done | Grows as player encounters items/concepts |
| Settings modal | ✅ Done | Music on/off, volume, track select, SFX, scanlines |
| CRT scanlines | ✅ Done | CSS overlay, toggleable |
| PWA (Progressive Web App) | ✅ Done | manifest.json + sw.js, works offline, Add to Home Screen |

### Architecture Decisions Made

- **Single-file JS** — all game logic in `game.js` (~1,900 lines). No modules, no bundler. Loads instantly, edits instantly.
- **localStorage only** — scores, settings, op unlocks (`sf_op2_unlocked` … `sf_op4_unlocked`), agent name. No backend required.
- **Bitcoin (₿) as currency** — same numeric range, culturally on-brand, avoids real-money confusion.
- **Web Audio API for music** — 4 procedural chiptune tracks (OscillatorNode + GainNode, square/triangle/sawtooth/sine oscillators). Zero external audio files.
- **Autoplay gate** — music starts on "START TRADING" click to satisfy browser autoplay policy.
- **Op-gated content** — cities/items/events/puzzles gated by `opMin` field checked against `G.operation`. Same pattern for all 4 ops.
- **Mini-game routing** — `openMiniGame(puzz,reward)` dispatches on `puzz.type`: `undefined`→circuit repair, `'diagnosis'`→fault diagnosis, `'arena'`→circuit game (FSM slot variant), `'foundry'`→slider sim.
- **PWA** — `manifest.json` + `sw.js` cache-first service worker. No build step. Icons in `game/icons/`.
- **Distribution plan** — web now → PWA (done) → Capacitor wrap for app stores (Month 2) → Flutter rewrite post-PMF.

### Known Gaps

- Op5 (Foundry Founder) not yet built — planned ₿400k goal, 4 branching endings
- No real HDL simulation (Verilator/Yosys) — planned Year 1 cloud, Year 2 WASM
- No Engineer Score player profiling — planned Phase C
- No multiplayer / cloud leaderboard
- No export (Verilog, KiCad, BOM)
- No Timing Tetris, Waveform Detective, PCB Roulette mini-games
- No component pixel art sprites
- No tech tree / lab upgrade UI
- No tutorial / day-1 onboarding flow
- App store icons need real pixel art (currently placeholder solid-color PNGs)

For full roadmap see plan file: `~/.claude/plans/purring-dancing-boole.md`.

---

## Technical Architecture

### Browser Prototype / PWA (Current — v0.3)
```
game/
  index.html      — UI structure, all modals (~260 lines)
  style.css       — CRT aesthetic (~360 lines)
  game.js         — full game logic (~1,900 lines)
  manifest.json   — PWA manifest
  sw.js           — cache-first service worker
  icons/
    icon-192.png  — PWA home screen icon
    icon-512.png  — PWA splash icon
```

### Distribution Ladder
1. **Web** — open `game/index.html` or deploy to GitHub Pages (free, instant)
2. **PWA** ✅ Done — manifest + service worker, works offline, Add to Home Screen on iOS/Android
3. **Capacitor wrap** (Month 2) — `npx cap init` wraps existing HTML/JS in a WebView; submit to Google Play + App Store with zero code changes
4. **Flutter rewrite** (Year 2, post-PMF) — Flame engine, Riverpod, Hive, WASM simulators, real multiplayer

### Android App (Target — Post-PMF)
```
Flutter (Dart)
  └── Game engine: Flame (Flutter-native 2D)
  └── State management: Riverpod
  └── Local storage: Hive (offline-first)
  └── Backend: Rust (via FFI) for simulation logic

Embedded Simulators (WASM)
  └── Verilator (HDL simulation) — Year 2
  └── Yosys (synthesis) — Year 2
  └── ngspice (analog) — Year 2

Cloud (Year 1)
  └── Cloudflare Worker + Verilator VPS (cloud HDL compile, $4.99/mo tier)
  └── Leaderboards
  └── Engineer Score opt-in (score → Airtable, partner dashboard)
```

### Export Feature (Killer Differentiator)
Players can export real engineering artifacts from in-game work:
- Verilog source from FPGA Arena wins
- KiCad schematics from PCB Roulette
- BOM from market trades
- Timing reports from Timing Tetris

**The game is also a real engineering tool.**

---

## Monetization

| Tier | What You Get | Price |
|---|---|---|
| Free | Core game loop, first 3 locations, basic mini-games | $0 |
| Engineer | All locations, cloud HDL compilation, advanced puzzles | $4.99/mo |
| Founder | + multiplayer IP trading, tapeout simulator, export tools | $14.99/mo |
| Hardware Kit | Physical FPGA trainer board + app bundle | $149 one-time |

---

## MVP Scope

### Phase A — Ship Web (✅ Done)
- [x] Market screen (buy/sell components)
- [x] 8 cities, 14 inventory items
- [x] Random event engine (23+ events)
- [x] Cash / debt mechanic (scales per op)
- [x] PWA — manifest + service worker

### Phase B — Op4 Content (✅ Done)
- [x] Op4 threshold (₿150k), TSMC HQ + IHP Shuttle Hub cities
- [x] GDS-II Package, Bringup Test Fixture, Bringup Board items
- [x] 5 new Op4 events
- [x] Silicon Foundry Sim mini-game (sliders, real-time margin)
- [x] FPGA Arena v1 (FSM slot puzzle)
- [x] 3-slot LDO bringup circuit repair

### Phase C — Engineer Score + Sprites (⬜ Next)
- [ ] ES tracking object in game state (solve time, retry count, concept breadth)
- [ ] `computeEngineerScore()` function, game-over display
- [ ] Opt-in score → Cloudflare Worker → Airtable
- [ ] 16 SVG pixel art component sprites embedded in game.js
- [ ] Sprite thumbnails in market list + mini-game component bin

### Phase D — Cloud HDL + App Stores (⬜ Month 2)
- [ ] In-game Verilog editor for FPGA Arena exports
- [ ] Cloudflare Worker + Verilator VPS backend
- [ ] `npx cap init` Capacitor wrap
- [ ] Google Play submission
- [ ] App Store (TestFlight → App Store)

### Phase E — Op5 + Branching Endings (⬜ Month 3–4)
- [ ] Op5 threshold (₿400k), Pentagon Black Budget + AI Chip Exchange cities
- [ ] 4 branching endings (Open Source Hero / Defense Contractor / Consumer Electronics / AI Chip Startup)
- [ ] Waveform Detective Pro mini-game
- [ ] FPGA Arena bot battle system (async)

---

## What Success Looks Like

**Month 3:** 10,000 downloads, $2K MRR from subscriptions
**Month 6:** Hardware kit waitlist, $10K MRR
**Month 12:** Community publishing real Verilog from in-game projects; YouTube presence; partnerships with FPGA vendors (Tang, Xilinx education programs)

**Endgame:** Silicon Forge becomes the on-ramp to real IC design the way Kerbal Space Program became the on-ramp to aerospace engineering. Players graduate to actual tapeouts. You sell them the tools, the kits, and the fab access.

---

## The Real Business Model

The game funds:
1. **FPGA trainer board sales** — designed and assembled in your lab
2. **IC design consulting** — credibility from game community
3. **Educational kit licensing** — schools, makerspaces
4. **Tapeout brokering** — group buys via Tiny Tapeout / IHP / TSMC shuttle
5. **Robotics + manufacturing R&D** — funded by the above

The game is the top of funnel. The hardware is the margin.

---

## Related Documents

| Document | Purpose |
|---|---|
| `GOMARKET.md` | Full go-to-market strategy using Claude tooling |
| `docs/prototype-v02-status.md` | Detailed prototype implementation notes |
| `research/market-size.md` | TAM/SAM/SOM analysis ($680M TAM) |
| `research/hardware-validation.md` | Crowd Supply comps, $149 bundle validation |
| `research/competitor-analysis.md` | Shenzhen I/O, Turing Complete, KSP teardowns |
| `research/pricing-model.md` | Subscription + kit pricing justification |

---

*"You're not playing a game about chips. You're becoming a chip designer."*
