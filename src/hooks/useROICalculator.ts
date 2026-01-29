import { useState, useMemo, useCallback } from 'react';
import { CONSTANTS, CalculatorInputs, CalculationResult, MonthlyData, getDefaultInputs } from '../constants';

// Summary metrics for easy access
interface SummaryMetrics {
    netAnnualSavings: number;
    roiPercent: number;
    breakEvenMonth: number | null;
    riskReduction: number;
    monthlyOpExDelta: number;
    totalGPUCost: number;
    totalEngineerSavings: number;
}

interface UseROICalculatorReturn {
    inputs: CalculatorInputs;
    setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
    updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
    resetInputs: () => void;
    monthlyData: MonthlyData[];
    summaryMetrics: SummaryMetrics;
    result: CalculationResult;
}

/**
 * Custom hook for ROI Calculator state and calculations
 * 
 * Manages all input state and computes 12-month projections
 * based on financial constants from the product context.
 */
export function useROICalculator(): UseROICalculatorReturn {
    // === State for all inputs ===
    const [inputs, setInputs] = useState<CalculatorInputs>(getDefaultInputs);

    // === Convenience methods ===
    const updateInput = useCallback(<K extends keyof CalculatorInputs>(
        key: K,
        value: CalculatorInputs[K]
    ) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetInputs = useCallback(() => {
        setInputs(getDefaultInputs());
    }, []);

    // === Core calculation (memoized) ===
    const result = useMemo((): CalculationResult => {
        const {
            numEngineers,
            numGPUs,
            aiEfficiencyGain,
            gpuUtilization,
            bugProbability,
            bugReductionWithAI,
            useRental,
        } = inputs;

        // Convert percentages to decimals
        const efficiencyGainDecimal = aiEfficiencyGain / 100;
        const utilizationDecimal = gpuUtilization / 100;
        const bugProbDecimal = bugProbability / 100;
        const bugReductionDecimal = bugReductionWithAI / 100;

        // === Monthly GPU Cost ===
        let monthlyGPUCost: number;
        let upfrontCost = 0;

        if (useRental) {
            // Rental: hourly rate * utilization * hours per month
            monthlyGPUCost = numGPUs * CONSTANTS.H100_GPU_RENTAL_HOURLY *
                CONSTANTS.HOURS_PER_MONTH * utilizationDecimal;
        } else {
            // Purchase: Depreciate over 3 years (36 months)
            upfrontCost = (numGPUs * CONSTANTS.H100_GPU_PURCHASE) + CONSTANTS.H100_CHASSIS_OVERHEAD;
            monthlyGPUCost = upfrontCost / 36;
        }

        // === Engineering Value per Engineer per Month ===
        const engineerMonthlyCost = (CONSTANTS.ENGINEER_SALARY_YEARLY + CONSTANTS.EDA_LICENSE_YEARLY)
            / CONSTANTS.MONTHS_PER_YEAR;

        // Baseline engineer cost (all engineers)
        const monthlyEngineerCostBaseline = numEngineers * engineerMonthlyCost;

        // Value of debugging time saved with AI
        const debugTimeSavedFraction = CONSTANTS.DEBUG_TIME_RATIO * efficiencyGainDecimal;
        const monthlyEngineerValueSaved = numEngineers * engineerMonthlyCost * debugTimeSavedFraction;

        // Effective cost with AI
        const monthlyEngineerCostWithAI = monthlyEngineerCostBaseline - monthlyEngineerValueSaved;

        // === OpEx Delta ===
        const opExDelta = monthlyGPUCost - monthlyEngineerValueSaved;

        // === 12-Month Cash Flow Breakdown ===
        const monthlyData: MonthlyData[] = [];
        let cumulativeSavings = 0;
        let cumulativeGPUCost = useRental ? 0 : upfrontCost;

        for (let month = 1; month <= 12; month++) {
            const netSavings = monthlyEngineerValueSaved - monthlyGPUCost;
            cumulativeSavings += netSavings;
            cumulativeGPUCost += monthlyGPUCost;

            monthlyData.push({
                month,
                gpuCost: monthlyGPUCost,
                engineerCostBaseline: monthlyEngineerCostBaseline,
                engineerCostWithAI: monthlyEngineerCostWithAI,
                netSavings,
                cumulativeSavings,
                cumulativeGPUCost,
            });
        }

        // === Break-Even Point ===
        let breakEvenMonth: number | null = null;
        const initialInvestment = useRental ? 0 : upfrontCost;
        let runningTotal = -initialInvestment;

        for (let i = 0; i < monthlyData.length; i++) {
            runningTotal += monthlyData[i].netSavings;
            if (runningTotal >= 0 && breakEvenMonth === null) {
                breakEvenMonth = i + 1;
                break;
            }
        }

        // === Total Annual Values ===
        const totalGPUCost = (monthlyGPUCost * 12) + (useRental ? 0 : upfrontCost);
        const totalEngineerSavings = monthlyEngineerValueSaved * 12;
        const netSavingsYear = totalEngineerSavings - totalGPUCost;
        const roiPercent = totalGPUCost > 0 ? ((totalEngineerSavings - totalGPUCost) / totalGPUCost) * 100 : 0;

        // === Risk-Adjusted Values ===
        const baselineRiskValue = bugProbDecimal * CONSTANTS.SILICON_RESPIN_COST;
        const reducedBugProb = bugProbDecimal * (1 - bugReductionDecimal);
        const riskValueWithAI = reducedBugProb * CONSTANTS.SILICON_RESPIN_COST;
        const riskReduction = baselineRiskValue - riskValueWithAI;

        return {
            monthlyData,
            totalGPUCost,
            totalEngineerSavings,
            netSavingsYear,
            roiPercent,
            breakEvenMonth,
            baselineRiskValue,
            riskValueWithAI,
            riskReduction,
            monthlyGPUCost,
            monthlyEngineerValueSaved,
            opExDelta,
        };
    }, [inputs]);

    // === Summary Metrics (convenient subset) ===
    const summaryMetrics = useMemo((): SummaryMetrics => ({
        netAnnualSavings: result.netSavingsYear,
        roiPercent: result.roiPercent,
        breakEvenMonth: result.breakEvenMonth,
        riskReduction: result.riskReduction,
        monthlyOpExDelta: result.opExDelta,
        totalGPUCost: result.totalGPUCost,
        totalEngineerSavings: result.totalEngineerSavings,
    }), [result]);

    return {
        inputs,
        setInputs,
        updateInput,
        resetInputs,
        monthlyData: result.monthlyData,
        summaryMetrics,
        result,
    };
}
