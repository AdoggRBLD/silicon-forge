# Silicon Forge V2 — Master Plan

> "Make players feel like engineers. Not students."

---

## Table of Contents

1. [Honest Project Audit](#honest-project-audit)
2. [Four Key Decisions](#four-key-decisions)
3. [New Mini-Game Types](#new-mini-game-types)
4. [Progression Map (Updated)](#progression-map-updated)
5. [V2 Build Phases](#v2-build-phases)
6. [Puzzle Pool Expansion](#puzzle-pool-expansion)
7. [Monetization Revised](#monetization-revised)
8. [Crowd Supply Pre-Launch Checklist](#crowd-supply-pre-launch-checklist)
9. [What to Build First](#what-to-build-first)

---

## Honest Project Audit

### What's on track

| Area | Status | Notes |
|---|---|---|
| Core trade loop | ✅ Solid | Buy/sell, 8 cities, 14 items, debt pressure |
| Op1–Op4 progression | ✅ Complete | All 4 ops implemented and playable |
| Random events | ✅ Good | 23+ events, op/city/inventory weighted |
| PWA + offline | ✅ Done | manifest.json, sw.js, Add to Home Screen |
| Global leaderboard | ✅ Live | Cloudflare Worker + KV, top 100 all-time |
| Circuit Repair mini-game | ✅ Solid | 1/2/3-slot drag-drop variants |
| Fault Diagnosis mini-game | ✅ Solid | Multiple-choice waveform/protocol puzzles |
| FPGA Arena v1 | ✅ Done | FSM slot puzzle, bot counter-programming |
| Silicon Foundry Sim v1 | ✅ Done | 3 sliders, real-time margin preview |
| Game aesthetic | ✅ Strong | CRT terminal look, chiptune music, scanlines |
| Platform choice (vanilla JS) | ✅ Right call | Proved concept faster than Flutter would have |

### What's behind or absent

| Area | Gap | Priority |
|---|---|---|
| Digital logic (gates, Boolean) | **Not built at all** — no NAND/NOR/AND/OR/NOT | Critical — this is the stated goal |
| Day 1 tutorial / circuit primer | Not built | High — new players have no onboarding |
| Thermal management teaching | Not built | High — core design discipline |
| PCB routing / signal integrity | Not built | Medium — Op3+ content |
| Timing / propagation delay | Not built | Medium — Timing Tetris planned but zero code |
| Puzzle variety (every game different) | 18 static puzzles — players see repeats | High — kills replayability |
| Op5 (Foundry Founder) | Not built | Medium — not needed for launch |
| Monetization | Zero code written | High — needed to fund V2 work |
| Engineer Score | Not built | Medium — Phase C in current plan |
| Community / marketing | Zero Discord, zero Hackaday writeup | High — hardware crowdfunding requires this |
| Hardware prototype | Zero of 8 Crowd Supply checklist items | Medium — parallel track, don't block software |

### Strategy doc accuracy

- **Research docs (pricing, competitors, hardware):** Still accurate and well-researched.
- **GOMARKET.md:** Right strategy, wrong platform assumption ("Flutter from week 1"). Vanilla JS was the correct call — ignore that section.
- **CLAUDE.md:** Accurate on current status. Roadmap needs the V2 additions below.

---

## Four Key Decisions

### 1. Where do gates slot into the progression?

**Decision: Op1 from the start, as Logic Lab — the foundational layer before everything else.**

Currently Op1 teaches pull-ups, bypass caps, ESD protection — *component-level* electronics. But gate-level digital logic is the conceptual prerequisite for FSMs, HDL, and everything above Op2. Players hitting FPGA Arena at Op4 with no gate background is like hitting calculus without algebra.

**Slot map:**
- **Op1, Day 1:** Logic Lab L1 — single gate truth tables (AND, OR, NOT, NAND, NOR). First-run tutorial gated.
- **Op1:** Logic Lab L2 — 2-gate combinations. NAND as universal gate.
- **Op2:** Logic Lab L3 — 4-gate circuits, MUX, decoder.
- **Op3:** Logic Lab L4 — sequential logic: flip-flop from NAND gates, counter, register.
- **Op4:** Logic Lab L5 — FSM substrate + HDL syntax alongside gate diagram (bridge to FPGA Arena).

Circuit Repair continues in parallel teaching the analog/power/components side. Logic Lab teaches the digital side. Both feeds into the same job board.

### 2. JS vs. Flutter?

**Decision: Stay vanilla JS + Capacitor. No Flutter until revenue proves it.**

Vanilla JS shipped 4 complete ops in the time it would have taken to scaffold a Flutter project. The game is proven. The Capacitor wrap (`npx cap init`) gets this exact HTML/JS into Google Play and the App Store with zero code changes — that's Month 2, not a rewrite.

Flutter is Year 2, gated on: (a) proven subscription revenue, and (b) needing Verilator WASM performance that a WebView can't deliver. Until then, every hour spent on Flutter rewrite is an hour not spent on game content.

### 3. What does "every game different" mean technically?

Two layers are required. The first is already done (random events). The second is the gap.

**Layer 1 — Random events:** ✅ Already working. Market prices, event engine, city variation.

**Layer 2 — Procedural puzzle generation:** ❌ Not implemented. This is the fix.

V2 approach: add a `generate()` method to puzzle template objects. Each job instantiation calls `generate()` and returns a fresh puzzle with randomized parameters (gate inputs, baud rates, voltage levels, component positions). The puzzle *type* repeats but the *instance* is unique every time.

```javascript
// Example template pattern (to implement in game.js)
{
  id: 'logic-nand-universal',
  type: 'logic',
  opMin: 1,
  rewardBase: 800,
  template: true,
  generate() {
    const A = Math.random() > 0.5;
    const B = Math.random() > 0.5;
    return { ...this, inputs: [A, B], targetOutput: !(A && B) };
  }
}
```

Combined with a larger static pool (target 60+ puzzles), this makes repeats within a 20-day run practically impossible.

### 4. Which monetization is buildable right now?

**Decision: Web Stripe paywall first (this week), AdMob second (requires Capacitor, Month 2), RevenueCat IAP third (requires app store submission).**

The game is free and ad-free today. The revenue roadmap:

| Phase | What | When | Complexity |
|---|---|---|---|
| Now | Stripe Checkout redirect for Engineer tier gate | This sprint | Low — just a paywall check + localStorage flag |
| Month 2 | Capacitor wrap + AdMob interstitial between days | After Capacitor | Medium — plugin install + ad unit setup |
| Month 2 | RevenueCat IAP for Play Store + App Store | Same as Capacitor | Medium — replace Stripe for mobile |
| Month 3 | Founder tier + AI critique (Claude API) | After Engineer is live | High — new Cloudflare Worker route |

Don't build AdMob before Capacitor. Don't build RevenueCat before Play Store submission. Build the Stripe web gate now so there's a path to revenue while the app wrapper is being set up.

---

## New Mini-Game Types

### Logic Lab (Op1+) — The Core Educational Gap

**Fills:** digital logic, Boolean algebra, gate behavior, NAND as universal gate, truth tables.

**Format:** Wire gates together (drag wire from output pin to input pin) to produce a target output vector. Start with single-gate "what does this produce?" puzzles, progress to multi-gate circuits.

**Level progression:**
- **L1 (Op1):** Single gate. What does AND(1,0) produce? Truth table verification. 8 puzzles.
- **L2 (Op1):** 2-gate combinations. Build NOT from NAND. Build OR from NOR. 8 puzzles.
- **L3 (Op2):** 4-gate circuits. MUX, decoder, half adder. 10 puzzles.
- **L4 (Op3):** 8-gate circuits. Full adder. SR latch from NAND gates. D flip-flop. 10 puzzles.
- **L5 (Op4):** 12-gate circuits. FSM implementation. Introduce Verilog `assign` alongside gate diagram. 8 puzzles.

**Implementation:** SVG gate symbols (standard logic shapes), drag-wire interaction between pins, truth table evaluator in JS. Same `openMiniGame()` dispatch pattern, new `type: 'logic'` branch. No physics, no canvas — SVG + CSS transitions.

**What players absorb:** NAND/NOR/AND/OR/NOT behavior, De Morgan's laws, combinational vs. sequential logic, the gate-to-HDL connection.

---

### Thermal Sim (Op2+) — Heat Management

**Fills:** thermal resistance, junction temperature, heat spreading, thermal vias, derating.

**Format:** Place components on a PCB grid. Each component emits watts (shown as a heat number). Add copper pour and thermal vias to route heat to the board edge / ground plane. Run simulation — each cell averages neighbors, heat sources add fixed delta. Win by keeping all Tj (junction temp) values below spec within a placement budget.

**Teaches:**
- Θ_JA and Θ_JC (thermal resistance)
- Thermal via arrays under power components
- Component placement for heat spreading
- Copper pour as passive heatsink
- Derating vs. ambient temperature (hotter fab city → tighter margin)

**Implementation:** Grid-based. Each cell has a temperature value. Per-tick: each cell = weighted average of neighbors + source term. Runs for N ticks, then displays result. No physics engine — simplified thermal diffusion in ~50 lines of JS.

**Tie-in to game world:** ESD events and "thermal runaway" random events become teachable moments instead of pure penalties.

---

### PCB Roulette (Op3+) — Routing, EMI, Signal Integrity

**Fills:** trace routing, DRC, impedance, EMI coupling, differential pairs, layer stackup.

**Format:** Connect component pads on a 2-layer grid. DRC runs in real-time: minimum width violation, clearance violation, right-angle violation. EMI coupling flags when high-speed traces run parallel to analog signals for more than N grid cells. Win when all pads are connected, DRC is clean, and no signal integrity violations.

**Teaches:**
- Trace width → characteristic impedance
- 45° rule (right-angle avoidance)
- Ground plane importance
- Differential pair routing (route together, equal length)
- High-speed/analog separation
- Via stubs and their effect on signal integrity

**Implementation:** Grid routing. This is the most complex V2 mini-game — build it last (V2.2). The core algorithm is a constrained pathfinding problem on a 2D grid, which is tractable in JS.

---

### Waveform Detective Pro (Op2+) — Upgraded Fault Diagnosis

**Fills:** extends existing Fault Diagnosis with ASCII oscilloscope traces.

**Format:** Same multiple-choice structure, but the problem description includes an ASCII waveform. Player identifies protocol type, baud rate, fault, or timing violation from the trace pattern.

**This is a low-lift upgrade** — expand the existing Fault Diagnosis puzzle pool with trace-style problems. No new UI infrastructure needed. Target: current 6 diagnosis puzzles → 25+ with trace variants.

**Sample trace puzzles:**
- UART with one start bit missing → "framing error"
- I2C with SCL stretched too long → "clock stretch timeout"  
- SPI with wrong CPOL/CPHA → "mode mismatch"
- Ringing on rising edge → "termination missing"

---

### Timing Tetris (Op3+) — Critical Paths, Pipelining

**Fills:** propagation delay, setup/hold time, critical path, pipelining, clock domains.

**Format:** Arrange logic blocks in a row. Each block has a propagation delay label. A clock period constraint is shown (e.g., "10ns"). The total delay through the path must fit within the clock period. Win by meeting timing. Penalty for adding unnecessary pipeline registers (latency increases BOM cost).

**Teaches:**
- Setup time and hold time
- Critical path analysis
- Pipelining to increase clock frequency
- Retiming (moving registers earlier/later)
- Clock domain crossing hazards

**Implementation:** Horizontal block arrangement UI. Each block is a draggable tile with a delay value. Sum delay across path, compare to clock period, show margin. 15–20 puzzles at Op3, parameterized (delay values randomized within ranges).

---

## Progression Map (Updated)

```
Op1 — GARAGE HACKER  (start)
  ┌─ Circuit Repair (1-slot): pull-ups, bypass caps, ESD protection
  ├─ Logic Lab L1: AND, OR, NOT, NAND, NOR — truth tables
  └─ Logic Lab L2: NAND as universal gate, 2-gate combinations
  Day 1: mandatory tutorial circuit primer (first run only)

Op2 — FPGA APPRENTICE  (positive net worth)
  ┌─ Circuit Repair (2-slot)
  ├─ Fault Diagnosis / Waveform Detective Pro
  ├─ Logic Lab L3: MUX, decoder, half adder
  └─ Thermal Sim: component placement, heat spreading

Op3 — ASIC DESIGNER  (₿15k net worth)
  ┌─ Circuit Repair (3-slot)
  ├─ Logic Lab L4: full adder, SR latch, D flip-flop
  ├─ Timing Tetris: propagation delay, pipelining
  └─ PCB Roulette: trace routing, DRC, impedance

Op4 — TAPEOUT & BRINGUP  (₿50k net worth)
  ┌─ FPGA Arena: FSM slot puzzle, bot counter-programming
  ├─ Silicon Foundry Sim: yield economics, fab tradeoffs
  └─ Logic Lab L5: FSM substrate, Verilog assign preview

Op5 — FOUNDRY FOUNDER  (₿150k net worth) [V2.2]
  ┌─ All mini-game types, advanced variants
  └─ 4 branching endings:
       Open Source Hero / Defense Contractor /
       Consumer Electronics / AI Chip Startup
```

---

## V2 Build Phases

### V2.0 — Content Depth (4–6 weeks)

Goal: make the game worth replaying for someone who wants to learn chip design. No monetization yet — just content.

- [ ] **Logic Lab L1**: 8 single-gate puzzles, truth table verification UI, `type: 'logic'` dispatch in `openMiniGame()`
- [ ] **Logic Lab L2**: 8 two-gate combination puzzles (NAND-only implementations, De Morgan's)
- [ ] **Day 1 tutorial**: mandatory first-run puzzle before the Op1 trade loop begins — 1 circuit primer showing AND gate + pull-up + bypass cap with labeled teaching callouts
- [ ] **Fault Diagnosis expansion**: 6 current → 25+ puzzles, add ASCII trace variants
- [ ] **Circuit Repair pool expansion**: 10 current → 40+ puzzles (rotate component positions, add new 1-slot and 2-slot variants)
- [ ] **Parameterized puzzle templates**: add `generate()` method to 10 core puzzles (baud rate, voltage, gate inputs randomized per instantiation)
- [ ] **lastJobId → lastThreeJobIds**: prevent same puzzle appearing within 3 consecutive jobs (array instead of single value)
- [ ] **Op5 skeleton**: unlock at ₿150k net worth, 2 new cities (Pentagon Black Budget, AI Chip Exchange), no mini-games yet — just the city/item/event shell

**Measure of done:** a player can complete a full Op1–Op4 run (20 days, all jobs taken) without seeing the same puzzle twice.

---

### V2.1 — Monetize (2–3 weeks, requires Capacitor)

Goal: first dollar of revenue. This is the prerequisite for everything else.

- [ ] **Capacitor wrap**: `npx cap init` in `game/`, Android build, Google Play internal testing track submission
- [ ] **AdMob Capacitor plugin**: interstitial ad between days on free tier. 3-second skip countdown. Fire-and-forget — don't block gameplay if ad fails to load.
- [ ] **Engineer tier gate ($4.99/mo)**: Stripe Checkout redirect on web. `G.engineerTier` localStorage flag. Lock Op3–Op4 cities behind flag (Op1–Op2 always free).
- [ ] **RevenueCat IAP**: replace Stripe with RevenueCat for in-app purchase on Android (Play Store billing) and iOS (App Store billing). Web Stripe stays as fallback.
- [ ] **Content gate enforcement**: free = Op1–Op2, Engineer = Op1–Op4, Founder = all (when built)
- [ ] **App store assets**: replace placeholder icons, add screenshots, write store description

**Measure of done:** a user on Google Play can download for free, see ads between days, and pay $4.99/mo to unlock all content and remove ads.

---

### V2.2 — Hardware-Ready (3–4 weeks)

Goal: have a demo-able product for a hackerspace talk or Crowd Supply pre-launch page.

- [ ] **Thermal Sim mini-game**: grid placement, per-tick thermal diffusion, win by keeping Tj < spec. Op2+ contract type.
- [ ] **Timing Tetris mini-game**: pipeline block arrangement, delay constraint, Op3+ contract type.
- [ ] **Logic Lab L3–L4**: combinational + sequential logic levels
- [ ] **Engineer Score system**: track solve time, retry count, concept breadth per run. Display on game-over screen.
- [ ] **Engineer Score → leaderboard**: add `engineerScore` column to Cloudflare KV, display in global scoreboard
- [ ] **Field Manual expansion**: Logic Lab completions auto-populate gate entries (NAND, NOR, truth table, De Morgan's)
- [ ] **Op5 content**: 5 Op5 events, 2 Op5 items (custom mask sets, AI accelerator chips), first branching ending skeleton
- [ ] **Demo video**: 2–3 minute screen recording showing Op1 Logic Lab → Circuit Repair → job completion → Op2 unlock. This is the Crowd Supply pre-launch asset.

**Measure of done:** a 5-minute conference demo shows someone learning NAND gates → building a circuit → advancing to thermal sim. Can be filmed and posted to Hackaday.

---

### V2.3 — AI Tier (Month 3–4)

Goal: build the Founder-tier AI differentiator that justifies $14.99/mo.

- [ ] **Founder tier gate ($14.99/mo)**: RevenueCat + `G.founderTier` flag
- [ ] **AI circuit critique**: POST completed circuit to Cloudflare Worker → Claude API (claude-sonnet-4-6) → display inline critique ("Your timing path is 14ns over budget — add a pipeline register after the adder stage")
- [ ] **In-game Verilog editor**: FPGA Arena exports real synthesizable Verilog for solved FSM puzzles. Founder tier only.
- [ ] **PCB Roulette mini-game**: Op3+ contract type. This is V2.3 not V2.2 due to implementation complexity.
- [ ] **Logic Lab L5**: HDL preview alongside gate diagram. `assign Q = A & B;` shown next to AND gate.
- [ ] **FPGA Arena async bot battles**: submit FSM sequence to Cloudflare KV, match against other players' submissions daily

**Measure of done:** a Founder subscriber gets real feedback on suboptimal circuit solutions and can export working Verilog from the game.

---

## Puzzle Pool Expansion

Current state: 18 puzzles total (5 circuit repair, 6 fault diagnosis, 4 arena, 3 foundry).
A 20-day run with 3 jobs/day = 60 job attempts. With 18 puzzles, duplicates are guaranteed.

Target: 80+ puzzles + parameterized generation.

| Type | Current | V2.0 Target | V2.2 Target |
|---|---|---|---|
| Circuit Repair | 10 | 40 | 50 |
| Fault Diagnosis / Waveform | 6 | 25 | 30 |
| Logic Lab | 0 | 16 | 44 |
| FPGA Arena | 4 | 6 | 10 |
| Silicon Foundry Sim | 3 | 5 | 8 |
| Thermal Sim | 0 | 0 | 12 |
| Timing Tetris | 0 | 0 | 15 |
| PCB Roulette | 0 | 0 | 0 (V2.3) |
| **Total** | **18** | **92** | **169** |

At 92 puzzles with parameterized generation, the probability of a duplicate in a 60-attempt run drops below 10%. At 169, it's negligible.

---

## What "Every Game Different" Requires (Technical Spec)

### Parameterized puzzle template pattern

Add `template: true` flag and `generate()` method to puzzle objects that have numeric parameters. `openMiniGame()` calls `p.template ? p.generate() : p` before rendering.

```javascript
// game.js — modify openMiniGame() call site:
function startJob(idx) {
  const job = G.availableJobs[idx];
  if (!job) return;
  G.lastJobIds = [job.puzzle.id, ...(G.lastJobIds||[])].slice(0,3);
  G.availableJobs.splice(idx, 1);
  const puzz = job.puzzle.template ? job.puzzle.generate() : job.puzzle;
  openMiniGame(puzz, job.reward);
}

// game.js — modify refreshJobs():
function refreshJobs() {
  const usedIds = G.availableJobs.map(j=>j.puzzle.id);
  const recentIds = G.lastJobIds || [];
  const pool = PUZZLES.filter(p =>
    !usedIds.includes(p.id) &&
    !recentIds.includes(p.id) &&
    (!p.opMin || p.opMin <= G.operation)
  );
  while (G.availableJobs.length < 2 && pool.length) {
    const puzzle = pool.splice(Math.floor(Math.random()*pool.length), 1)[0];
    const reward = G.hasScope ? Math.floor(puzzle.rewardBase*1.4) : puzzle.rewardBase;
    G.availableJobs.push({puzzle, reward});
  }
}
```

### Logic Lab UI (new mini-game type)

```javascript
// game.js — new dispatch branch in openMiniGame():
if (puzz.type === 'logic') { openLogicLab(puzz, reward); return; }

// New function openLogicLab():
// - Renders SVG gate symbols (AND, OR, NOT, NAND, NOR)
// - Input pins are labeled (A, B), wired to output Q
// - Player selects output value (0 or 1) or wires missing connection
// - Check: evaluate truth table for the gate combination, compare to puzz.targetOutput
// - Same checkCircuit() / result display pattern as circuit repair
```

Gate SVG symbols: 8–10 lines of inline SVG per gate type. No external files.

---

## Monetization Revised

| Tier | Price | Content | Revenue Path |
|---|---|---|---|
| Free | $0 | Op1–Op2, ads between days | AdMob (Capacitor) |
| Engineer | $4.99/mo | Op1–Op4, no ads, cloud leaderboard | RevenueCat IAP |
| Founder | $14.99/mo | + Op5, AI critique, Verilog export, bot battles | RevenueCat IAP |
| Hardware Kit | $149 one-time | Physical FPGA trainer board + Founder sub bundle | Crowd Supply → direct |

### Revenue projections at 50K MAU (month 6)

- 68% free, watching ads: 34,000 users × 2 ads/day × $0.004 CPM × 30 days = **~$8K/month**
- 28% Engineer ($4.99): 14,000 × $4.99 = **$70K/month**
- 3% Founder ($14.99): 1,500 × $14.99 = **$22K/month**
- Hardware: 100 units × $149 × 40% margin = **$6K/month**
- **Combined: ~$106K/month** at optimistic-but-plausible month 6

The 3% Founder conversion is load-bearing. It drops to 1% without the AI critique differentiator. Build V2.3 before the Founder tier goes live.

### Ad implementation notes

- AdMob interstitial: fire between `endDay()` and the new day render. Free tier only.
- 3-second countdown skip button (don't hard-block gameplay).
- Use `@capacitor-community/admob` plugin. AdMob app ID registered in `capacitor.config.ts`.
- Test mode during development — production IDs in env/build config, not hardcoded in JS.
- Don't show ads on the first 3 days of a run (onboarding grace period reduces churn).

---

## Crowd Supply Pre-Launch Checklist

Software can ship independently while hardware is being designed. These are parallel tracks.

| Item | Status | Owner |
|---|---|---|
| Working prototype board (functional) | ⬜ Not started | Hardware track |
| Working game + board demo loop | ⬜ Not started | Hardware + Software |
| 2–3 min demo video | ⬜ Not started | Marketing |
| GitHub repo (hardware files, KiCad, BOM) | ⬜ Not started | Hardware track |
| Discord server with 500+ members | ⬜ Not started | Marketing |
| Hackaday / Hackster writeup | ⬜ Not started | Marketing |
| Workshop or talk delivered | ⬜ Not started | Marketing |
| Open-source toolchain docs (Yosys/nextpnr) | ⬜ Not started | Software track |

**None of this blocks V2.0–V2.1.** Start on Discord and Hackaday writeup in parallel with code — they're zero-cost and compound over time. The demo video becomes possible once V2.2 Thermal Sim ships (that's the visual proof of teaching depth).

---

## What to Build First

Given that the game already works, the highest-impact next moves are ranked by educational gap × implementation speed:

**1. Logic Lab L1 (2–3 days)**
8 single-gate puzzles, SVG gate rendering, truth table evaluator, `type: 'logic'` dispatch. This fills the biggest educational gap (zero gate-level content) with minimal infrastructure change.

**2. Logic Lab L2 (1–2 days)**
8 two-gate combination puzzles. NAND as universal gate — the core insight that unlocks "wait, I can build anything from this?"

**3. Day 1 circuit primer (1 day)**
Mandatory first-run tutorial puzzle before Day 1 trade loop. Shows AND gate + pull-up + bypass cap with labeled teaching callouts. Sets the tone: you're here to learn, not just trade.

**4. Fault Diagnosis pool expansion (2 days)**
6 → 25+ puzzles with ASCII trace variants. No new UI. Just more puzzle objects in the PUZZLES array.

**5. Circuit Repair pool expansion (2–3 days)**
10 → 40+ puzzles. Rotate component positions, add more 1-slot and 2-slot variants.

**6. `lastJobIds` array upgrade (1 hour)**
`lastJobId` (single) → `lastJobIds` (array of 3). Prevents same puzzle appearing within 3 consecutive jobs.

**Total: ~10 days of focused work.** After this sprint, a player can complete a full run without seeing a duplicate and learns NAND/NOR/AND/OR/NOT from Op1. That's V2.0 done.

---

*"You're not playing a game about chips. You're becoming a chip designer."*
