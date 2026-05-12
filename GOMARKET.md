# GOMARKET.md — Silicon Forge × Claude Tool Suite

> How to use every Claude capability to take this from concept to cash flow

---

## Table of Contents

1. [The Strategy in One Sentence](#the-strategy-in-one-sentence)
2. [Phase 0 — Pre-Build](#phase-0--pre-build-now-week-0)
3. [Phase 1 — Build MVP](#phase-1--build-mvp-weeks-18)
4. [Phase 2 — Content & Education Layer](#phase-2--content--education-layer-months-23)
5. [Phase 3 — Go To Market](#phase-3--go-to-market-month-3)
6. [Phase 4 — Hardware Products](#phase-4--hardware-products-month-46)
7. [Phase 5 — Scale](#phase-5--scale-month-612)
8. [The Full Claude Tooling Stack](#the-full-claude-tooling-stack)
9. [Critical Path to First Dollar](#critical-path-to-first-dollar)
10. [Revenue Targets](#revenue-targets)
11. [The Meta-Play](#the-meta-play)
12. [First Session Prompt for Claude](#first-session-prompt-for-claude)

---

## The Strategy in One Sentence

Use Claude as a **founding team of one** — design, code, write, research, and ship faster than a 5-person startup — then let the game revenue fund your real hardware business.

---

## Phase 0 — Pre-Build (Now, Week 0)

### What to do with Claude right now:

#### 1. Market Research (Web Search)
Prompt Claude to search:
- Current Android game revenue benchmarks for indie educational games
- Competitor analysis: Shenzhen I/O, Turing Complete, SpaceChem player counts
- FPGA education market size and trends
- Zachtronics games monetization (they're your closest comp)
- App Store pricing research for engineering/puzzle games

**Output:** A 2-page market brief that either validates or kills the concept before you write a line of code.

#### 2. Competitor Teardown (Web Fetch)
Use Claude to fetch and analyze:
- Play Store reviews for Shenzhen I/O (what players love/hate)
- Reddit r/FPGA, r/ECE, r/embedded — what do people wish existed?
- Turing Complete Steam reviews — pain points to solve

**Output:** A feature list ranked by player demand, not your assumptions.

#### 3. Legal / IP Skeleton (Document Generation)
Claude can draft:
- Terms of Service for the app
- Privacy Policy (GDPR/COPPA compliant — you'll have young users)
- Open-source license strategy for exported Verilog
- Contractor NDA template if you hire help

---

## Phase 1 — Build MVP (Weeks 1–8)

### Claude as Lead Developer

#### Flutter / Dart Code Generation
Claude writes:
- The full market screen UI (buy/sell/inventory)
- Random event engine with weighted probability tables
- Save/load state system using Hive
- The contract/mini-game routing system

**Workflow:** You describe the mechanic in plain English → Claude writes the Dart → you test on device → iterate. Expect 60–80% of boilerplate written by Claude.

#### Mini-Game Logic
Each mini-game is a self-contained puzzle engine. Claude can build:

| Mini-Game | Claude Builds |
|---|---|
| Timing Tetris | Grid collision system, constraint validator, scoring |
| Waveform Detective | Signal pattern generator, fault injection, answer checker |
| FPGA Arena | FSM block drag-drop UI, simulation runner, matchmaking |
| Silicon Foundry | Yield calculation engine, economic model, event triggers |

**Approach:** Build each as an isolated Flutter widget first. Integrate later. Claude can prototype a playable mini-game in a single session.

#### Game Balance & Economy Tuning
Claude can run economic simulations:
- Model the cash flow curve across 30 in-game days
- Balance buy/sell margins so the game is neither trivial nor frustrating
- Generate the random event probability tables
- Tune XP curves for progression feel

Feed Claude your spreadsheet → get back a tuned economy model.

---

## Phase 2 — Content & Education Layer (Months 2–3)

### Claude as Curriculum Designer

#### Lesson Writing
Claude writes all in-game educational overlays:
- "Why did my UART fail?" pop-up explanations
- Tool tips that teach without lecturing
- Contract briefings that frame each puzzle as a real engineering problem
- The "Silicon Codex" — in-game encyclopedia of concepts

**Principle:** Every explanation goes through Claude with the prompt: *"Explain this to someone who has never heard of it, using only what just happened in the game as context."*

#### Puzzle Generation
Claude can generate hundreds of puzzle variants:
- Timing Tetris: generate new constraint sets programmatically
- Waveform Detective: generate new fault signatures
- Random event flavor text: 500 unique event descriptions

This gives the game massive replay value without manual content creation.

---

## Phase 3 — Go To Market (Month 3)

### Claude as Marketing Department

#### App Store Optimization (ASO)
Claude writes:
- Play Store listing copy (title, short description, long description)
- A/B test variants for different audiences (gamers vs. engineers vs. students)
- Keyword research and metadata strategy
- Screenshot caption copy

#### Press & Community
Claude drafts:
- Cold pitch emails to YouTubers (EEVblog, Andreas Spiess, Great Scott)
- Reddit posts for r/FPGA, r/androidgaming, r/gamedev launches
- Hacker News "Show HN" post (this game WILL trend there)
- Product Hunt launch copy

**The pitch angle:** "I built a Drug Wars clone that accidentally teaches you IC design." That headline writes itself and will go viral in engineering communities.

#### Content Marketing
Claude generates a 3-month content calendar:
- Weekly devlog posts (your story is compelling — garage → IC design)
- Technical breakdowns of mini-game design for r/gamedev
- "How Silicon Forge teaches FPGA design" for Hackster, Hackaday, Adafruit blog

---

## Phase 4 — Hardware Products (Month 4–6)

### Claude as Product Designer

#### FPGA Trainer Board Spec
Claude can help design:
- BOM (bill of materials) for a companion FPGA trainer board
- Comparison of Tang Nano vs. iCE40 vs. Artix-7 for beginner suitability
- Pricing model for the $149 hardware kit
- Crowdfunding campaign copy (Crowd Supply is the right platform for this)

#### KiCad Assistance
Claude can:
- Generate KiCad netlist skeletons from verbal descriptions
- Review schematic descriptions for common mistakes
- Write the design documentation for open-source hardware release
- Draft the Crowd Supply campaign page

#### Kit Fulfillment Planning
Claude helps model:
- Unit economics at 100 / 500 / 1000 unit runs
- COGS breakdown (PCB, components, packaging, shipping)
- Break-even analysis
- Which contract manufacturer to approach first

---

## Phase 5 — Scale (Month 6–12)

### Claude as Business Analyst

#### Investor Materials (If Needed)
Claude drafts:
- One-pager for angel investors
- Financial model (3-year projection)
- Pitch deck narrative
- Cap table strategy

#### Partnership Outreach
Claude writes outreach to:
- Tiny Tapeout (tapeout integration partnership)
- FPGA vendors (Tang / Gowin, Lattice education programs)
- Universities (curriculum licensing)
- Hackerspaces (bulk kit deals)

#### Community Building
Claude manages:
- Discord server structure and rules
- Community challenge prompts ("This week: design the most efficient UART")
- Newsletter copy
- GitHub repo documentation for exported Verilog projects

---

## The Full Claude Tooling Stack

| Task | Claude Capability | Time Saved |
|---|---|---|
| Market research | Web Search | 2 weeks → 2 hours |
| Competitor analysis | Web Fetch | 1 week → 1 hour |
| Flutter code generation | Code artifacts | 60–80% of boilerplate |
| Game economy modeling | Code + analysis | 3 days → 3 hours |
| Educational content | Long-form writing | Weeks → days |
| ASO copy | Writing | 2 days → 30 min |
| Press outreach | Message composer | 1 day → 1 hour |
| Legal docs | Document generation | $2K lawyer bill → free |
| Hardware BOM analysis | Research + math | Hours → minutes |
| Investor materials | Writing + analysis | 2 weeks → 2 days |

**Honest estimate:** Claude compresses a 12-person founding team's output into a 1-person operation running at 3–4x normal speed.

---

## Critical Path to First Dollar

```
Week 1-2:   Core game loop playable on device
Week 3-4:   Two mini-games working
Week 5-6:   Play Store alpha (closed test, 20 testers)
Week 7-8:   Polish + open beta
Week 9:     PUBLIC LAUNCH
            → "Show HN" post
            → r/FPGA post
            → EEVblog forum post
            → Product Hunt
Week 10:    First subscription revenue
Week 12:    Hardware kit pre-orders open (Crowd Supply)
Month 4:    First kit ships
Month 6:    IC manufacturing R&D funded by game + kit revenue
```

---

## Revenue Targets

| Month | Source | Target |
|---|---|---|
| 3 | App subscriptions | $2,000 MRR |
| 6 | App + kit pre-orders | $10,000 MRR |
| 9 | App + kits + consulting | $20,000 MRR |
| 12 | All streams | $40,000 MRR |

**At $40K MRR you have real R&D budget for IC manufacturing and robotics work.**

---

## The Meta-Play

You're not just building a game. You're building:

1. **A community** of engineers who trust you
2. **A brand** in the IC education space
3. **A distribution channel** for hardware products
4. **A proof of concept** for your own engineering capabilities

The game *is* the business card. When you show up to a fab with "I built the Duolingo of chip design and have 50,000 users," doors open.

---

## First Session Prompt for Claude

When you're ready to start building, open Claude and paste this:

> "I'm building Silicon Forge, a Drug Wars-style Android game that teaches IC design and FPGA development. The game loop involves buying/selling electronic components across global markets, completing engineering mini-games for contracts, and managing random events like chip shortages and customs seizures. I need you to help me build this in Flutter using the Flame game engine. Let's start with the core market screen — a terminal-aesthetic UI where the player can see current component prices across 3 locations (Shenzhen, Austin, Toronto), their inventory, their cash balance, and a buy/sell interface. Use a green-on-black phosphor CRT aesthetic."

That's your kickoff. The rest follows from there.

---

*The game funds the lab. The lab builds the future.*
