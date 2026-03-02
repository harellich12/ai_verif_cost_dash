# VaaS Calculator Math Reference

This document explains the full math used by the VaaS estimator in:
- `src/hooks/useVaaSEstimator.ts`
- `src/vaasConstants.ts`

## 1. Inputs and Constants

Core inputs:
- `blockComplexity` in `{small, medium, large, custom}`
- `customBlockDurationMonths` (used when `blockComplexity = custom`)
- `engineerHourlyRate`
- `internalTeamSize`
- `hiringLagMonths`
- `idleTimePercent`
- `vaasQuotePrice`
- `annualBlockCount`
- `parallelBlocks`
- `marketUpsidePerMonth`
- `humanReviewPercent`
- Benchmark mode inputs:
  - `isBenchmarkMode`
  - `benchmarkInternalDays`
  - `benchmarkVaasDays`

Core constants:
- `BLOCK_DURATIONS = { small: 4, medium: 7, large: 12 }` months
- `SPEEDUP_FACTOR = 0.5` (default VaaS duration multiplier)
- `MONTHS_PER_YEAR = 12`
- `WEEKS_PER_MONTH = 4.33`
- `HOURS_PER_MONTH = 4.33 * 40 = 173.2`

Derived:
- `engineerMonthlyCost = engineerHourlyRate * HOURS_PER_MONTH`
- `idleTimeFraction = idleTimePercent / 100`

## 2. Timeline Math

1. Traditional duration:
- if `blockComplexity = custom`: `traditionalDurationMonths = customBlockDurationMonths`
- else: `traditionalDurationMonths = BLOCK_DURATIONS[blockComplexity]`

2. Speedup factor:
- Default: `speedupFactor = SPEEDUP_FACTOR`
- Benchmark mode: `speedupFactor = benchmarkVaasDays / benchmarkInternalDays`

3. VaaS duration:
- `vaasDurationMonths = traditionalDurationMonths * speedupFactor`

4. Internal total timeline:
- `internalStartOffset = hiringLagMonths`
- `internalTotalDuration = traditionalDurationMonths + internalStartOffset`

5. Time saved:
- `monthsSaved = internalTotalDuration - vaasDurationMonths`
- `weeksSaved = monthsSaved * WEEKS_PER_MONTH`

## 3. Internal Cost Math

1. Internal base execution cost:
- `baseInternalTeamCost = internalTeamSize * engineerMonthlyCost * traditionalDurationMonths`

2. Internal total cost:
- `internalTeamCost = baseInternalTeamCost`

## 4. VaaS Cost and Savings Components

1. VaaS quote cost:
- `vaasCost = vaasQuotePrice`

2. Idle cash saved:
- `idleCashSaved = baseInternalTeamCost * idleTimeFraction`

3. Capacity unlocked:
- `fteMonthsSaved = monthsSaved * internalTeamSize`

4. Cash burn prevented:
- `totalCashBurnPrevented = idleCashSaved`

5. Optional business upside:
- `businessUpsidePerBlock = monthsSaved * marketUpsidePerMonth`

## 5. Human-in-the-Loop (HITL) Math

The model applies client review cost to saved effort, not to the full baseline team spend.

1. Saved-effort review base:
- `grossReviewBasePerBlock = fteMonthsSaved * engineerMonthlyCost`

2. Review cost per block:
- `clientReviewCostPerBlock = grossReviewBasePerBlock * (humanReviewPercent / 100)`

3. Annual review cost:
- `annualClientReviewCost = clientReviewCostPerBlock * annualBlockCount`

## 6. Net Benefit Math

1. Comparable internal baseline:
- `internalComparableCost = internalTeamCost + idleCashSaved`

2. Net benefit per block:
- `netBenefitPerBlock = internalComparableCost + businessUpsidePerBlock - vaasCost - clientReviewCostPerBlock`

3. Annualized outputs:
- `projectedAnnualEfficiency = totalCashBurnPrevented * annualBlockCount`
- `projectedAnnualTimeSaved = (monthsSaved * annualBlockCount) / max(1, parallelBlocks)`
- `projectedAnnualNetBenefit = netBenefitPerBlock * annualBlockCount`

## 7. Monthly Timeline / Accrual Series

The hook builds `monthlyData` for months `1..ceil(max(internalTotalDuration, vaasDurationMonths))`.

For month `m`:

1. Progress:
- `elapsedExecutionMonths = max(0, m - internalStartOffset)`
- `traditionalProgress = min((elapsedExecutionMonths / traditionalDurationMonths) * 100, 100)`
- `vaasProgress = min((m / vaasDurationMonths) * 100, 100)`

2. Internal cumulative cost:
- `executionCostToDate = min((elapsedExecutionMonths / traditionalDurationMonths) * baseInternalTeamCost, baseInternalTeamCost)`
- `traditionalCost = executionCostToDate`

3. VaaS cumulative cost:
- `vaasQuoteAccrued = min((m / vaasDurationMonths) * vaasQuotePrice, vaasQuotePrice)`
- `reviewCostAccrued = min((m / vaasDurationMonths) * clientReviewCostPerBlock, clientReviewCostPerBlock)`
- `vaasMonthCost = vaasQuoteAccrued + reviewCostAccrued`

4. Idle cost (shown for comparison):
- `idleCost = traditionalCost * idleTimeFraction`

Each monthly row stores:
- `month`
- `traditionalProgress`
- `vaasProgress`
- `traditionalCost`
- `vaasCost` (quote + review accrual)
- `clientReviewCost` (review accrual only)
- `idleCost`

## 8. Sales-Derived Metrics (External Cost Framing)

The estimator also returns sales-oriented outputs used by VaaS **Sales mode**:

1. External cost per block:
- `salesExternalCostPerBlock = internalTeamCost + idleCashSaved`

2. Annual external cost:
- `salesExternalCostAnnual = salesExternalCostPerBlock * annualBlockCount`

3. Delay cost per block:
- `salesDelayCostPerBlock = 0` (RTL delay is not modeled)

4. Idle cost per block:
- `salesIdleCostPerBlock = idleCashSaved`

5. Active verification cost per block:
- `salesActiveCostPerBlock = internalTeamCost`

6. Sales monthly series (`salesMonthlyData`):
- `externalCost = traditionalCost + idleCost`
- `activeCost = traditionalCost`
- `idleCost = idleCost`
- `progress = traditionalProgress`

## 9. Default-Value Worked Example

Using defaults in `getDefaultVaaSInputs()`:
- `blockComplexity = medium` => `traditionalDurationMonths = 7`
- `engineerHourlyRate ≈ 96.15`
- `internalTeamSize = 3`
- `hiringLagMonths = 1`
- `idleTimePercent = 30`
- `humanReviewPercent = 50`
- `marketUpsidePerMonth = 0`
- `vaasQuotePrice = 250,000`
- `annualBlockCount = 20`
- `parallelBlocks = 1`

Then:
- `vaasDurationMonths = 7 * 0.5 = 3.5`
- `monthsSaved = (7 + 1) - 3.5 = 4.5`
- `engineerMonthlyCost = 96.15 * 173.2 = 16,666.67`
- `baseInternalTeamCost = 3 * 16,666.67 * 7 = 350,000`
- `internalTeamCost = 350,000`
- `idleCashSaved = 350,000 * 0.30 = 105,000`
- `fteMonthsSaved = 4.5 * 3 = 13.5`
- `clientReviewCostPerBlock = 13.5 * 16,666.67 * 0.50 = 112,500`
- `internalComparableCost = 350,000 + 105,000 = 455,000`
- `netBenefitPerBlock = 455,000 + 0 - 250,000 - 112,500 = 92,500`
- `annualClientReviewCost = 112,500 * 20 = 2,250,000`
- `projectedAnnualNetBenefit = 92,500 * 20 = 1,850,000`
- `projectedAnnualTimeSaved = (4.5 * 20) / 1 = 90 months`
- `salesExternalCostPerBlock = 350,000 + 105,000 = 455,000`
- `salesExternalCostAnnual = 455,000 * 20 = 9,100,000`
- `salesDelayCostPerBlock = 0`
- `salesIdleCostPerBlock = 105,000`
- `salesActiveCostPerBlock = 350,000`

## 10. Sensitivity Notes

- `humanReviewPercent` is linear: +10 percentage points increases `clientReviewCostPerBlock` by 10% of `grossReviewBasePerBlock`.
- `parallelBlocks` only affects annual calendar-time saved; it does not change per-block net economics.
- `idleTimePercent` is linear: +10 percentage points increases `idleCashSaved` by 10% of `baseInternalTeamCost`.
