# Pricing & Monetization Model — Silicon Forge

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What the Steam Comps Tell You](#what-the-steam-comps-tell-you)
3. [The Duolingo Conversion Formula](#the-duolingo-conversion-formula)
4. [Subscription Benchmarks](#subscription-benchmarks)
5. [Recommended Pricing Tiers](#recommended-pricing-tiers)
6. [The Critical Gap in the $14.99 Tier](#the-critical-gap-in-the-1499-tier)
7. [Revenue Math (Working Model)](#revenue-math-working-model)
8. [Strategic Takeaways](#strategic-takeaways)

---

## Executive Summary

Premium one-time pricing ($14.99–$19.99) is validated by Shenzhen I/O and Turing Complete, but leaves the compounding subscription revenue on the table. Duolingo's freemium model proves that a massive free base + a small percentage of high-value subscribers beats a paid-only strategy at scale. Silicon Forge should ship freemium with two subscription tiers, but the $14.99 tier needs a genuine AI-powered differentiator or it will collapse into the $4.99 tier.

---

## What the Steam Comps Tell You

| Game | Price | Model | Reviews | Rating |
|---|---|---|---|---|
| Shenzhen I/O | $14.99 | One-time, no IAP | 200K–500K owners | Overwhelmingly Positive |
| Turing Complete | $19.99 (rising post-EA) | One-time | 5,027 | Overwhelmingly Positive |

The market will pay $15–20 for this kind of game. Neither competitor benefits from recurring revenue. Neither has a free funnel. That's the opening.

---

## The Duolingo Conversion Formula

- **Free → Paid conversion:** Under 3% of users ever subscribe
- **Total revenue:** $748M/year (2024)
- **Paid subscribers:** 10.3M at Q1 2025, +40% YoY
- **Top tier driver:** Duolingo Max and family plans, which raised ARPU significantly

The freemium model is explicitly designed for scale: more free learners means more data, more word-of-mouth, more conversions. A hard paywall makes this impossible. The premium tier must offer genuinely exclusive AI-powered features — not just cosmetic skins.

**Lesson for Silicon Forge:** the highest tier must justify itself with something expensive to replicate (live circuit simulation feedback, AI explanation of suboptimal solutions, social challenge engine).

---

## Subscription Benchmarks

- **Trial duration sweet spot:** 17–32 days yields the highest median conversion at 45.7% — but gaming apps overwhelmingly favor short trials, with 96.3% running four days or less.
- **Practical recommendation:** 7-day trial. Long enough to feel the second random event and complete one mini-game contract; short enough to fit gaming-app norms.
- **First-month churn:** ~30% of annual subscriptions are canceled in the first month. Onboarding days 1–7 are everything.

---

## Recommended Pricing Tiers

| Tier | Price | What's Included | Strategic Role |
|---|---|---|---|
| Free | $0 | Core loop, 3 locations, basic mini-games | Funnel + virality |
| Engineer | $4.99/mo | All locations, cloud HDL compile, advanced puzzles | Mass conversion tier |
| Founder | $14.99/mo | Multiplayer IP trading, tapeout simulator, export tools, AI tutor | High-ARPU tier |
| Hardware Kit | $149 one-time | Physical FPGA trainer + app bundle | Margin product |

---

## The Critical Gap in the $14.99 Tier

Right now Engineer ($4.99) and Founder ($14.99) are too close in feature value to justify a 3× price difference. The Founder tier needs something equivalent to Duolingo Max — AI-powered, hard to clone, solves a real pain point. Candidates:

- **Live AI circuit critique:** "Your timing path is 14ns over budget. Here's why and how to pipeline it."
- **AI tutor that explains *why* a solution is suboptimal**, not just whether it passes
- **Social challenge engine:** weekly community puzzles with leaderboard + AI-generated variants
- **Real toolchain bridging:** auto-translate in-game designs to Vivado/Yosys-ready Verilog

Without one of those, most engaged users will park at $4.99 and never move up — and the LTV math collapses.

---

## Revenue Math (Working Model)

Assuming 50K MAU at month 6:
- 70% never subscribe → $0
- 27% subscribe at $4.99 → 13,500 × $4.99 = $67K MRR
- 3% subscribe at $14.99 → 1,500 × $14.99 = $22K MRR
- **Subscription MRR ≈ $89K**

Plus hardware kits: 100 units/month × $149 × ~40% margin ≈ $6K/month contribution. Combined run-rate ~$95K/month at month 6 is the optimistic-but-plausible case.

The 3% Founder conversion is the load-bearing assumption. If that drops to 1% (because there's no AI differentiator), MRR drops to $74K and the hardware roadmap stalls.

---

## Strategic Takeaways

1. **Ship freemium, not paid.** The free funnel is the moat.
2. **7-day trial.** Aligned with gaming-app norms; gives players time to feel one random event cycle.
3. **Build the AI differentiator before launch.** Without it, the Founder tier doesn't survive its first quarter.
4. **Hardware kit is the margin pillar.** Price subscriptions to maximize funnel into the kit.
