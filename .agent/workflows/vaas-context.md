---
description: VaaS-specific context and formulas
---

# VaaS PRODUCT CONTEXT

## 1. Purpose
Model timeline and cost outcomes for VaaS versus internal verification execution.

## 2. Inputs
- Block sizing:
  - `blockComplexity` in `small|medium|large|custom`
  - `customBlockDurationMonths` when `custom`
- Team and cost:
  - `engineerHourlyRate`
  - `internalTeamSize`
  - `hiringLagMonths`
- Efficiency:
  - `idleTimePercent`
- Economics:
  - `vaasQuotePrice`
  - `annualBlockCount`
  - `parallelBlocks`
  - `marketUpsidePerMonth`
  - `humanReviewPercent`
- Optional benchmark:
  - `isBenchmarkMode`
  - `benchmarkInternalDays`
  - `benchmarkVaasDays`

## 3. Core Formulas
- Traditional duration:
  - preset: `BLOCK_DURATIONS[blockComplexity]`
  - custom: `customBlockDurationMonths`
- VaaS duration:
  - default: `traditionalDurationMonths * SPEEDUP_FACTOR`
  - benchmark: `traditionalDurationMonths * (benchmarkVaasDays / benchmarkInternalDays)`
- Internal total duration:
  - `traditionalDurationMonths + hiringLagMonths`
- Internal team cost:
  - `baseInternalTeamCost`
- Idle cash saved:
  - `baseInternalTeamCost * idleTimePercent`
- Net benefit per block:
  - `(internalTeamCost + idleCashSaved + businessUpsidePerBlock) - vaasQuotePrice - clientReviewCostPerBlock`

## 4. Sales Mode Metrics
Sales mode is display-only framing over existing VaaS calculations:
- `salesExternalCostPerBlock = internalTeamCost + idleCashSaved`
- `salesExternalCostAnnual = salesExternalCostPerBlock * annualBlockCount`
- `salesDelayCostPerBlock = 0` (RTL delay not modeled)
- `salesIdleCostPerBlock = idleCashSaved`
- `salesActiveCostPerBlock = internalTeamCost`
- `salesMonthlyData`:
  - `externalCost = traditionalCost + idleCost`
  - `activeCost = traditionalCost`
  - `idleCost = idleCost`
  - `progress = traditionalProgress`

## 5. UI Expectations
- Keep VaaS layout sections in Sales view
- Remap labels/values to external/traditional cost framing
- Timeline chart in Sales mode emphasizes traditional path
- Idle cost chart in Sales mode removes VaaS bar

## 6. Exports
- VaaS Excel supports view-based branching:
  - `Admin/Presentation`: quote summary + full comparison schedule
  - `Sales`: external-cost summary + traditional/external schedule only
