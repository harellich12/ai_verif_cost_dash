import { useState, useMemo, useCallback } from 'react';
import {
    VAAS_CONSTANTS,
    VaaSInputs,
    VaaSResult,
    VaaSMonthlyData,
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
        setInputs(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetInputs = useCallback(() => {
        setInputs(getDefaultVaaSInputs());
    }, []);

    const result = useMemo((): VaaSResult => {
        const {
            blockComplexity,
            internalTeamSize,
            estRtlDelayWeeks,
            vaasQuotePrice,
            annualBlockCount,
        } = inputs;

        // === Timeline Calculation ===
        const traditionalDurationMonths = VAAS_CONSTANTS.BLOCK_DURATIONS[blockComplexity];
        const vaasDurationMonths = traditionalDurationMonths * VAAS_CONSTANTS.SPEEDUP_FACTOR;
        const monthsSaved = traditionalDurationMonths - vaasDurationMonths;
        const weeksSaved = monthsSaved * VAAS_CONSTANTS.WEEKS_PER_MONTH;

        // === Cost Calculation ===
        // Engineer Monthly Burn Rate (per person)
        const engineerMonthlyCost = VAAS_CONSTANTS.ENGINEER_SALARY_YEARLY / VAAS_CONSTANTS.MONTHS_PER_YEAR;

        // Internal Team Cost (Baseline w/o Delay)
        const baseInternalTeamCost = internalTeamSize * engineerMonthlyCost * traditionalDurationMonths;

        // 1. Cost of RTL Delay (Burn Rate Sensitivity)
        // Delay Cost = Team Size * Weekly Burn * Delay Weeks
        // Weekly Burn per person = Monthly / 4.33 approx
        const engineerWeeklyCost = engineerMonthlyCost / VAAS_CONSTANTS.WEEKS_PER_MONTH;
        const costOfRtlDelay = (internalTeamSize * engineerWeeklyCost) * estRtlDelayWeeks;

        // Total Internal Cost = Base Execution + Delay Waste
        const internalTeamCost = baseInternalTeamCost + costOfRtlDelay;

        // VaaS: Fixed quote price (no idle billing)
        const vaasCost = vaasQuotePrice;

        // 2. Idle Cash Saved (Efficiency)
        // Assumption: ~30% of traditional timeline is idle/wait time
        const idleTimeFraction = 0.30;
        const idleCashSaved = baseInternalTeamCost * idleTimeFraction;

        // 3. Capacity Dividend (Hard Metric)
        // FTE Months Saved = (Traditional Duration - VaaS Duration) * Team Size
        const fteMonthsSaved = monthsSaved * internalTeamSize;

        // 4. Total Cash Burn Prevented
        // Combines "Delay Savings" (Avoiding the delay cost) + "Idle Savings" (Avoiding the idle tax)
        // Note: VaaS eliminates the billing for the delay because it is fixed price scope.
        // It also eliminates the idle time billing.
        const totalCashBurnPrevented = costOfRtlDelay + idleCashSaved;

        // === Monthly Breakdown (Timeline Projection) ===
        const maxMonths = Math.ceil(traditionalDurationMonths);
        const monthlyData: VaaSMonthlyData[] = [];

        for (let month = 1; month <= maxMonths; month++) {
            // Traditional: Linear progress over full duration
            const traditionalProgress = Math.min((month / traditionalDurationMonths) * 100, 100);

            // VaaS: Linear progress but 2x faster
            const vaasProgress = Math.min((month / vaasDurationMonths) * 100, 100);

            // Cumulative costs (Internal includes projected delay amortized? Or just base?)
            // For simple chart, let's show Base Internal vs Fixed VaaS. 
            // Delay is usually an "Oh no" add-on. We'll stick to base for the main line 
            // line chart to keep it clean, or we could add it at end.
            // Let's use Base for the timeline chart to be conservative.
            const traditionalCost = internalTeamSize * engineerMonthlyCost * month;
            const vaasMonthCost = month <= vaasDurationMonths ? vaasQuotePrice : vaasQuotePrice;

            // Idle cost
            const idleCost = traditionalCost * idleTimeFraction;

            monthlyData.push({
                month,
                traditionalProgress,
                vaasProgress,
                traditionalCost,
                vaasCost: vaasMonthCost,
                idleCost,
            });
        }

        // === Projected Annual Efficiency ===
        // If user runs N similar blocks per year
        // Value = Cash Burn Prevented * Count
        const projectedAnnualEfficiency = totalCashBurnPrevented * annualBlockCount;
        const projectedAnnualTimeSaved = monthsSaved * annualBlockCount;

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
            monthlyData,
            projectedAnnualEfficiency,
            projectedAnnualTimeSaved,
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
