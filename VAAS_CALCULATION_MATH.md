# VaaS Calculator Math Reference

This document explains the full math used by the VaaS estimator in:
- `src/hooks/useVaaSEstimator.ts`
- `src/vaasConstants.ts`

## 1. Inputs and Constants

Core inputs:
- `blockComplexity` in `{small, medium, large}`
- `internalTeamSize`
- `hiringLagMonths`
- `estRtlDelayWeeks`
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
- `ENGINEER_SALARY_YEARLY = 200,000`
- `MONTHS_PER_YEAR = 12`
- `WEEKS_PER_MONTH = 4.33`
- `idleTimeFraction = 0.30`

Derived:
- `engineerMonthlyCost = ENGINEER_SALARY_YEARLY / MONTHS_PER_YEAR`
- `engineerWeeklyCost = engineerMonthlyCost / WEEKS_PER_MONTH`

## 2. Timeline Math

1. Traditional duration:
- `traditionalDurationMonths = BLOCK_DURATIONS[blockComplexity]`

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

2. Delay-mode mutual exclusivity:
- If `hiringLagMonths > 0`, then `effectiveDelayWeeks = 0`
- Else `effectiveDelayWeeks = estRtlDelayWeeks`

3. Delay waste:
- `costOfRtlDelay = internalTeamSize * engineerWeeklyCost * effectiveDelayWeeks`

4. Internal total cost:
- `internalTeamCost = baseInternalTeamCost + costOfRtlDelay`

## 4. VaaS Cost and Savings Components

1. VaaS quote cost:
- `vaasCost = vaasQuotePrice`

2. Idle cash saved:
- `idleCashSaved = baseInternalTeamCost * 0.30`

3. Capacity unlocked:
- `fteMonthsSaved = monthsSaved * internalTeamSize`

4. Cash burn prevented:
- `totalCashBurnPrevented = costOfRtlDelay + idleCashSaved`

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
- `effectiveDelayMonths = effectiveDelayWeeks / WEEKS_PER_MONTH`
- `delayCostToDate = effectiveDelayWeeks > 0 ? min((m / max(effectiveDelayMonths, 0.01)) * costOfRtlDelay, costOfRtlDelay) : 0`
- `traditionalCost = executionCostToDate + delayCostToDate`

3. VaaS cumulative cost:
- `vaasQuoteAccrued = min((m / vaasDurationMonths) * vaasQuotePrice, vaasQuotePrice)`
- `reviewCostAccrued = min((m / vaasDurationMonths) * clientReviewCostPerBlock, clientReviewCostPerBlock)`
- `vaasMonthCost = vaasQuoteAccrued + reviewCostAccrued`

4. Idle cost (shown for comparison):
- `idleCost = traditionalCost * 0.30`

Each monthly row stores:
- `month`
- `traditionalProgress`
- `vaasProgress`
- `traditionalCost`
- `vaasCost` (quote + review accrual)
- `clientReviewCost` (review accrual only)
- `idleCost`

## 8. Default-Value Worked Example

Using defaults in `getDefaultVaaSInputs()`:
- `blockComplexity = medium` => `traditionalDurationMonths = 7`
- `internalTeamSize = 3`
- `hiringLagMonths = 1`
- `estRtlDelayWeeks = 2` (ignored because hiring lag > 0)
- `humanReviewPercent = 20`
- `marketUpsidePerMonth = 0`
- `vaasQuotePrice = 250,000`
- `annualBlockCount = 20`
- `parallelBlocks = 1`

Then:
- `vaasDurationMonths = 7 * 0.5 = 3.5`
- `monthsSaved = (7 + 1) - 3.5 = 4.5`
- `engineerMonthlyCost = 200,000 / 12 = 16,666.67`
- `baseInternalTeamCost = 3 * 16,666.67 * 7 = 350,000`
- `effectiveDelayWeeks = 0` and `costOfRtlDelay = 0`
- `internalTeamCost = 350,000`
- `idleCashSaved = 350,000 * 0.30 = 105,000`
- `fteMonthsSaved = 4.5 * 3 = 13.5`
- `clientReviewCostPerBlock = 13.5 * 16,666.67 * 0.20 = 45,000`
- `internalComparableCost = 350,000 + 105,000 = 455,000`
- `netBenefitPerBlock = 455,000 + 0 - 250,000 - 45,000 = 160,000`
- `annualClientReviewCost = 45,000 * 20 = 900,000`
- `projectedAnnualNetBenefit = 160,000 * 20 = 3,200,000`
- `projectedAnnualTimeSaved = (4.5 * 20) / 1 = 90 months`

## 9. Sensitivity Notes

- `humanReviewPercent` is linear: +10 percentage points increases `clientReviewCostPerBlock` by 10% of `grossReviewBasePerBlock`.
- `parallelBlocks` only affects annual calendar-time saved; it does not change per-block net economics.
- Hiring lag and RTL delay are intentionally non-additive (mutually exclusive).
