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
            deploymentStrategy,
            onPremPercent,
            includeTaxDepreciation,
        } = inputs;

        // Convert percentages to decimals
        const efficiencyGainDecimal = aiEfficiencyGain / 100;
        const utilizationDecimal = gpuUtilization / 100;
        const bugProbDecimal = bugProbability / 100;
        const bugReductionDecimal = bugReductionWithAI / 100;

        // === V2: Determine On-Prem vs Cloud Split ===
        let onPremFraction: number;
        if (deploymentStrategy === 'cloud') {
            onPremFraction = 0;
        } else if (deploymentStrategy === 'onprem') {
            onPremFraction = 1;
        } else {
            // Hybrid mode
            onPremFraction = onPremPercent / 100;
        }
        const cloudFraction = 1 - onPremFraction;

        // === V2: On-Prem Costs (Fixed, doesn't scale with utilization) ===
        const onPremGPUs = numGPUs * onPremFraction;
        const onPremHardwareCost = onPremGPUs > 0
            ? ((onPremGPUs * CONSTANTS.H100_GPU_PURCHASE) + CONSTANTS.H100_CHASSIS_OVERHEAD) / CONSTANTS.DEPRECIATION_MONTHS
            : 0;

        // V2: Power & Cooling for On-Prem
        // Formula: GPU Power (700W) × PUE (1.5) × Hours × $/kWh ($0.12)
        const powerPerGPUMonthly = (CONSTANTS.GPU_POWER_WATTS / 1000) * CONSTANTS.POWER_PUE *
            CONSTANTS.HOURS_PER_MONTH * CONSTANTS.ELECTRICITY_RATE;
        const onPremPowerCost = onPremGPUs * powerPerGPUMonthly;

        // V2: Depreciation Tax Credit (On-Prem only)
        // Formula: Monthly Credit = (Total Hardware Cost / 36) × 21% tax rate
        // Conditioned on includeTaxDepreciation toggle
        const onPremTaxCredit = includeTaxDepreciation
            ? onPremHardwareCost * CONSTANTS.CORPORATE_TAX_RATE
            : 0;

        // === V2: Cloud Costs (Scales with utilization) ===
        const cloudGPUs = numGPUs * cloudFraction;
        const cloudCost = cloudGPUs * CONSTANTS.H100_GPU_RENTAL_HOURLY *
            CONSTANTS.HOURS_PER_MONTH * utilizationDecimal;

        // === Total Monthly GPU Cost ===
        const monthlyGPUCost = onPremHardwareCost + onPremPowerCost + cloudCost - onPremTaxCredit;

        // === Upfront Cost (for break-even calculation) ===
        const upfrontCost = onPremGPUs > 0
            ? (onPremGPUs * CONSTANTS.H100_GPU_PURCHASE) + CONSTANTS.H100_CHASSIS_OVERHEAD
            : 0;

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
        let cumulativeGPUCost = upfrontCost;

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
        const initialInvestment = upfrontCost;
        let runningTotal = -initialInvestment;

        for (let i = 0; i < monthlyData.length; i++) {
            runningTotal += monthlyData[i].netSavings;
            if (runningTotal >= 0 && breakEvenMonth === null) {
                breakEvenMonth = i + 1;
                break;
            }
        }

        // === Total Annual Values ===
        const totalGPUCost = (monthlyGPUCost * 12) + upfrontCost;
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
