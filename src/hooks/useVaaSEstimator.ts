import { useState, useMemo, useCallback } from 'react';
import {
    VAAS_CONSTANTS,
    VAAS_INPUT_CONFIGS,
    VaaSInputs,
    VaaSResult,
    VaaSMonthlyData,
    VaaSSalesMonthlyData,
    getDefaultVaaSInputs,
} from '../vaasConstants';

interface UseVaaSEstimatorReturn {
    inputs: VaaSInputs;
    setInputs: React.Dispatch<React.SetStateAction<VaaSInputs>>;
    updateInput: <K extends keyof VaaSInputs>(key: K, value: VaaSInputs[K]) => void;
    resetInputs: () => void;
    result: VaaSResult;
}

/**
 * VaaS Estimator Hook
 * 
 * Calculates timeline acceleration and cost savings for
 * Verification as a Service vs. traditional internal teams.
 * 
 * Core premise: VaaS is 50% faster (Timeline Acceleration)
 */
export function useVaaSEstimator(): UseVaaSEstimatorReturn {
    const [inputs, setInputs] = useState<VaaSInputs>(getDefaultVaaSInputs);

    const updateInput = useCallback(<K extends keyof VaaSInputs>(
        key: K,
        value: VaaSInputs[K]
    ) => {
        setInputs(prev => {
            if (typeof value === 'number') {
                let nextValue = Number.isFinite(value) ? value : (prev[key] as number);
                const config = VAAS_INPUT_CONFIGS[key as string];
                if (config) {
                    nextValue = Math.min(config.max, Math.max(config.min, nextValue));
                }

                if (key === 'benchmarkInternalDays') {
                    nextValue = Math.max(1, nextValue);
                    const updated = { ...prev, [key]: nextValue as VaaSInputs[K] };
                    const currentVaaSDays = updated.benchmarkVaasDays ?? 0.5;
                    updated.benchmarkVaasDays = Math.min(currentVaaSDays, nextValue);
                    return updated;
                }

                if (key === 'benchmarkVaasDays') {
                    const maxVaaSDays = Math.max(0.5, prev.benchmarkInternalDays ?? 0.5);
                    nextValue = Math.min(maxVaaSDays, Math.max(0.5, nextValue));
                }

                return { ...prev, [key]: nextValue as VaaSInputs[K] };
            }
            return { ...prev, [key]: value };
        });
    }, []);

    const resetInputs = useCallback(() => {
        setInputs(getDefaultVaaSInputs());
    }, []);

    const result = useMemo((): VaaSResult => {
        const {
            blockComplexity,
            customBlockDurationMonths,
            engineerHourlyRate,
            internalTeamSize,
            vaasQuotePrice,
            annualBlockCount,
            parallelBlocks,
            marketUpsidePerMonth,
            humanReviewPercent,
            idleTimePercent,
        } = inputs;

        // === Timeline Calculation ===
        const traditionalDurationMonths = blockComplexity === 'custom'
            ? customBlockDurationMonths
            : VAAS_CONSTANTS.BLOCK_DURATIONS[blockComplexity];

        // Benchmark Mode Logic
        let speedupFactor = VAAS_CONSTANTS.SPEEDUP_FACTOR;
        let provenSpeedupRatio: number | undefined;

        if (inputs.isBenchmarkMode && inputs.benchmarkInternalDays && inputs.benchmarkVaasDays) {
            speedupFactor = inputs.benchmarkVaasDays / inputs.benchmarkInternalDays;
            provenSpeedupRatio = speedupFactor;
        }

        const vaasDurationMonths = traditionalDurationMonths * speedupFactor;
        const safeTraditionalDurationMonths = Math.max(traditionalDurationMonths, 0.01);
        const safeVaaSDurationMonths = Math.max(vaasDurationMonths, 0.01);

        // Months Saved needs to account for Hiring Lag (Internal finishes LATER)
        // Internal Finish = Hiring Lag + Traditional Duration
        // VaaS Finish = VaaS Duration (starts immediately, no hiring lag assumed for VaaS)
        const internalStartOffset = inputs.hiringLagMonths || 0;
        const internalTotalDuration = traditionalDurationMonths + internalStartOffset;
        const monthsSaved = internalTotalDuration - vaasDurationMonths;
        const weeksSaved = monthsSaved * VAAS_CONSTANTS.WEEKS_PER_MONTH;

        // === Cost Calculation ===
        // Engineer Monthly Burn Rate (per person)
        const engineerMonthlyCost = engineerHourlyRate * VAAS_CONSTANTS.HOURS_PER_MONTH;

        // Internal Team Cost (Baseline w/o Delay)
        const baseInternalTeamCost = internalTeamSize * engineerMonthlyCost * traditionalDurationMonths;

        // 1. Cost of Delay (Removed)
        // RTL delay is no longer modeled in VaaS.
        const costOfRtlDelay = 0;

        // Total Internal Cost = Base Execution + Delay Waste
        const internalTeamCost = baseInternalTeamCost + costOfRtlDelay;

        // VaaS: Fixed quote price (no idle billing)
        const vaasCost = vaasQuotePrice;

        // 2. Idle Cash Saved (Efficiency)
        // Assumption: ~30% of traditional timeline is idle/wait time
        const idleTimeFraction = idleTimePercent / 100;
        const idleCashSaved = baseInternalTeamCost * idleTimeFraction;

        // 3. Capacity Dividend (Hard Metric)
        // FTE Months Saved = (Traditional Duration - VaaS Duration) * Team Size
        // NOTE: Does Hiring Lag count as FTE savings? 
        // Yes, because you don't need the FTEs during that time either (or you are paying for recruiting).
        // For simplicity, we stick to the execution phase comparison for FTE calculation usually, 
        // but if we are calculating "Months Saved" based on total timeline, it propagates here.
        // Let's keep FTE savings based on the execution difference to be conservative, 
        // or consistent with monthsSaved. 
        // If we treat monthsSaved as the total time-to-market advantage, then:
        const fteMonthsSaved = monthsSaved * internalTeamSize;

        // 4. Total Cash Burn Prevented
        // Idle savings only (delay removed from model).
        const totalCashBurnPrevented = idleCashSaved;

        // 5. Optional business upside from faster time-to-market.
        const businessUpsidePerBlock = monthsSaved * marketUpsidePerMonth;

        // 6. Client-side HITL review burden on saved effort.
        const grossReviewBasePerBlock = fteMonthsSaved * engineerMonthlyCost;
        const clientReviewCostPerBlock = grossReviewBasePerBlock * (humanReviewPercent / 100);
        const annualClientReviewCost = clientReviewCostPerBlock * annualBlockCount;

        // 7. Net economic value per block.
        const internalComparableCost = internalTeamCost + idleCashSaved;
        const netBenefitPerBlock = internalComparableCost + businessUpsidePerBlock - vaasCost - clientReviewCostPerBlock;

        // === Monthly Breakdown (Timeline Projection) ===
        const maxMonths = Math.ceil(Math.max(internalTotalDuration, vaasDurationMonths));
        const monthlyData: VaaSMonthlyData[] = [];
        const salesMonthlyData: VaaSSalesMonthlyData[] = [];

        for (let month = 1; month <= maxMonths; month++) {
            // Traditional starts after internal hiring lag.
            const elapsedExecutionMonths = Math.max(0, month - internalStartOffset);
            const traditionalProgress = Math.min((elapsedExecutionMonths / safeTraditionalDurationMonths) * 100, 100);

            // VaaS: Linear progress but 2x faster
            const vaasProgress = Math.min((month / safeVaaSDurationMonths) * 100, 100);

            // Internal execution cost accrues only after hiring lag.
            const executionCostToDate = Math.min(
                (elapsedExecutionMonths / safeTraditionalDurationMonths) * baseInternalTeamCost,
                baseInternalTeamCost
            );
            const traditionalCost = executionCostToDate;

            // VaaS fixed quote accrues linearly until delivery, then flatlines.
            const vaasQuoteAccrued = Math.min((month / safeVaaSDurationMonths) * vaasQuotePrice, vaasQuotePrice);
            const reviewCostAccrued = Math.min((month / safeVaaSDurationMonths) * clientReviewCostPerBlock, clientReviewCostPerBlock);
            const vaasMonthCost = vaasQuoteAccrued + reviewCostAccrued;

            // Idle cost
            const idleCost = traditionalCost * idleTimeFraction;

            monthlyData.push({
                month,
                traditionalProgress,
                vaasProgress,
                traditionalCost,
                vaasCost: vaasMonthCost,
                clientReviewCost: reviewCostAccrued,
                idleCost,
            });

            salesMonthlyData.push({
                month,
                externalCost: traditionalCost + idleCost,
                activeCost: traditionalCost,
                idleCost,
                progress: traditionalProgress,
            });
        }

        // === Projected Annual Efficiency ===
        // If user runs N similar blocks per year
        // Value = Cash Burn Prevented * Count
        const projectedAnnualEfficiency = totalCashBurnPrevented * annualBlockCount;
        const projectedAnnualTimeSaved = (monthsSaved * annualBlockCount) / Math.max(1, parallelBlocks);
        const projectedAnnualNetBenefit = netBenefitPerBlock * annualBlockCount;
        const salesExternalCostPerBlock = internalTeamCost + idleCashSaved;
        const salesExternalCostAnnual = salesExternalCostPerBlock * annualBlockCount;
        const salesDelayCostPerBlock = costOfRtlDelay;
        const salesIdleCostPerBlock = idleCashSaved;
        const salesActiveCostPerBlock = internalTeamCost;

        return {
            traditionalDurationMonths,
            vaasDurationMonths,
            monthsSaved,
            weeksSaved,
            internalTeamCost,
            vaasCost,
            fteMonthsSaved,
            costOfRtlDelay,
            totalCashBurnPrevented,
            idleCashSaved,
            businessUpsidePerBlock,
            clientReviewCostPerBlock,
            annualClientReviewCost,
            netBenefitPerBlock,
            monthlyData,
            salesMonthlyData,
            projectedAnnualEfficiency,
            projectedAnnualTimeSaved,
            projectedAnnualNetBenefit,
            salesExternalCostPerBlock,
            salesExternalCostAnnual,
            salesDelayCostPerBlock,
            salesIdleCostPerBlock,
            salesActiveCostPerBlock,
            isBenchmarkMode: inputs.isBenchmarkMode,
            provenSpeedupRatio,
            internalStartOffset,
        };
    }, [inputs]);

    return {
        inputs,
        setInputs,
        updateInput,
        resetInputs,
        result,
    };
}
