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
            monthlyRevenueValue,
            vaasQuotePrice,
            annualBlockCount,
        } = inputs;

        // === Timeline Calculation ===
        const traditionalDurationMonths = VAAS_CONSTANTS.BLOCK_DURATIONS[blockComplexity];
        const vaasDurationMonths = traditionalDurationMonths * VAAS_CONSTANTS.SPEEDUP_FACTOR;
        const monthsSaved = traditionalDurationMonths - vaasDurationMonths;
        const weeksSaved = monthsSaved * VAAS_CONSTANTS.WEEKS_PER_MONTH;

        // === Cost Calculation ===
        // Internal Team: Fixed cost for full duration (includes idle time)
        const engineerMonthlyCost = VAAS_CONSTANTS.ENGINEER_SALARY_YEARLY / VAAS_CONSTANTS.MONTHS_PER_YEAR;
        const internalTeamCost = internalTeamSize * engineerMonthlyCost * traditionalDurationMonths;

        // VaaS: Fixed quote price (no idle billing)
        const vaasCost = vaasQuotePrice;

        // Idle Cash Saved: The "idle tax" avoided
        // In traditional model, engineers are paid during wait/blocked time
        // Assumption: ~30% of traditional timeline is idle/wait time
        const idleTimeFraction = 0.30;
        const idleCashSaved = internalTeamCost * idleTimeFraction;

        // === Revenue Impact ===
        // Revenue gained by launching earlier
        const weeklyRevenueValue = monthlyRevenueValue / VAAS_CONSTANTS.WEEKS_PER_MONTH;
        const revenueGained = weeksSaved * weeklyRevenueValue;

        // === Monthly Breakdown (Timeline Projection) ===
        const maxMonths = Math.ceil(traditionalDurationMonths);
        const monthlyData: VaaSMonthlyData[] = [];

        for (let month = 1; month <= maxMonths; month++) {
            // Traditional: Linear progress over full duration
            const traditionalProgress = Math.min((month / traditionalDurationMonths) * 100, 100);

            // VaaS: Linear progress but 2x faster
            const vaasProgress = Math.min((month / vaasDurationMonths) * 100, 100);

            // Cumulative costs
            const traditionalCost = internalTeamSize * engineerMonthlyCost * month;
            const vaasMonthCost = month <= vaasDurationMonths ? vaasQuotePrice : vaasQuotePrice;

            // Idle cost (only for traditional, accumulates during wait periods)
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
        // If user runs N similar blocks per year, total savings = savings × N
        const perBlockSavings = revenueGained + idleCashSaved;
        const projectedAnnualEfficiency = perBlockSavings * annualBlockCount;
        const projectedAnnualTimeSaved = monthsSaved * annualBlockCount;

        return {
            traditionalDurationMonths,
            vaasDurationMonths,
            monthsSaved,
            weeksSaved,
            internalTeamCost,
            vaasCost,
            idleCashSaved,
            revenueGained,
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
