import { useState, useMemo, useCallback } from 'react';
import {
    CONSTANTS,
    INPUT_CONFIGS,
    CalculatorInputs,
    CalculationResult,
    MonthlyData,
    getDefaultInputs,
} from '../constants';

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
        setInputs(prev => {
            if (typeof value === 'number') {
                let nextValue = Number.isFinite(value) ? value : (prev[key] as number);
                const config = INPUT_CONFIGS[key as string];
                if (config) {
                    nextValue = Math.min(config.max, Math.max(config.min, nextValue));
                }
                return { ...prev, [key]: nextValue as CalculatorInputs[K] };
            }
            return { ...prev, [key]: value };
        });
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
            humanReviewPercent,
            gpuUtilization,
            bugProbability,
            bugReductionWithAI,
            deploymentStrategy,
            onPremPercent,
            includeTaxDepreciation,
            electricityRate,
            adminOverhead,
            storageCost,
            computeMode,
            // V4: API inputs
            interactiveJobsPerDay,
            regressionRunsPerNight,
            avgAgentRetries,
            depreciationMonths,
        } = inputs;

        // Convert percentages to decimals
        const efficiencyGainDecimal = aiEfficiencyGain / 100;
        const humanReviewDecimal = humanReviewPercent / 100;
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
            ? ((onPremGPUs * CONSTANTS.H100_GPU_PURCHASE) + CONSTANTS.H100_CHASSIS_OVERHEAD) / depreciationMonths
            : 0;

        // V2: Power & Cooling for On-Prem
        // Formula: GPU Power (700W) × PUE (1.5) × Hours × $/kWh (input)
        const powerPerGPUMonthly = (CONSTANTS.GPU_POWER_WATTS / 1000) * CONSTANTS.POWER_PUE *
            CONSTANTS.HOURS_PER_MONTH * electricityRate;
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
        // === Total Monthly GPU Cost (Base) ===
        const baseMonthlyGPUCost = onPremHardwareCost + onPremPowerCost + cloudCost - onPremTaxCredit;

        // V2: Overhead Costs (Storage + Admin)
        const monthlyStorageCost = storageCost;
        // Admin overhead applies to the aggregate of GPU + Storage costs
        const monthlyAdminCost = (baseMonthlyGPUCost + monthlyStorageCost) * (adminOverhead / 100);

        // Final monthly self-hosted cost path.
        const monthlySelfHostedCost = baseMonthlyGPUCost + monthlyStorageCost + monthlyAdminCost;

        // === Engineering Value per Engineer per Month ===
        const engineerMonthlyCost = (CONSTANTS.ENGINEER_SALARY_YEARLY + CONSTANTS.EDA_LICENSE_YEARLY)
            / CONSTANTS.MONTHS_PER_YEAR;

        // Baseline engineer cost (all engineers)
        const monthlyEngineerCostBaseline = numEngineers * engineerMonthlyCost;

        // Value of debugging time saved with AI
        const debugTimeSavedFraction = CONSTANTS.DEBUG_TIME_RATIO * efficiencyGainDecimal;
        const grossMonthlyEngineerValueSaved = numEngineers * engineerMonthlyCost * debugTimeSavedFraction;
        const monthlyHumanReviewCost = grossMonthlyEngineerValueSaved * humanReviewDecimal;
        const monthlyEngineerValueSaved = grossMonthlyEngineerValueSaved - monthlyHumanReviewCost;

        // Effective cost with AI
        const monthlyEngineerCostWithAI = monthlyEngineerCostBaseline - monthlyEngineerValueSaved;

        // === V4: API Cost Calculations (Updated with Retry Multiplier & Split Volume) ===
        // Token multiplier: base tokens × (1 + retries)
        const tokenMultiplier = 1 + avgAgentRetries;
        const tokensPerFileInput = CONSTANTS.API_BASE_TOKENS_INPUT * tokenMultiplier;
        const tokensPerFileOutput = CONSTANTS.API_BASE_TOKENS_OUTPUT * tokenMultiplier;

        // API Cost per File = (input_tokens/1M × input_price) + (output_tokens/1M × output_price)
        const apiCostPerFile =
            (tokensPerFileInput / 1_000_000) * CONSTANTS.API_CLAUDE_INPUT_PRICE +
            (tokensPerFileOutput / 1_000_000) * CONSTANTS.API_CLAUDE_OUTPUT_PRICE;

        // V4: Split Volume Calculation
        // Interactive: Jobs × Engineers × 20 business days
        // Regression: Runs × 30 calendar days (team-wide, not per-engineer)
        const interactiveVolume = interactiveJobsPerDay * numEngineers * CONSTANTS.WORKING_DAYS_PER_MONTH;
        const regressionVolume = regressionRunsPerNight * CONSTANTS.CALENDAR_DAYS_PER_MONTH;
        const totalMonthlyJobs = interactiveVolume + regressionVolume;

        // Monthly API Bill = Cost_Per_File × Total_Monthly_Jobs
        const monthlyAPIBill = apiCostPerFile * totalMonthlyJobs;

        // Primary cost path selected by compute mode.
        const monthlySelectedCost = computeMode === 'cloud-api'
            ? monthlyAPIBill
            : monthlySelfHostedCost;

        // Legacy field name retained for compatibility with existing UI.
        const monthlyGPUCost = monthlySelectedCost;

        // === OpEx Delta ===
        const opExDelta = monthlySelectedCost - monthlyEngineerValueSaved;

        // === 12-Month Cash Flow Breakdown ===
        const monthlyData: MonthlyData[] = [];
        let cumulativeSavings = 0;
        let cumulativeGPUCost = 0;

        for (let month = 1; month <= 12; month++) {
            const netSavings = monthlyEngineerValueSaved - monthlySelectedCost;
            cumulativeSavings += netSavings;
            cumulativeGPUCost += monthlySelectedCost;

            monthlyData.push({
                month,
                gpuCost: monthlySelectedCost,
                engineerCostBaseline: monthlyEngineerCostBaseline,
                engineerCostWithAI: monthlyEngineerCostWithAI,
                netSavings,
                cumulativeSavings,
                cumulativeGPUCost,
            });
        }

        // === Break-Even Point ===
        let breakEvenMonth: number | null = null;
        let runningTotal = 0;

        for (let i = 0; i < monthlyData.length; i++) {
            runningTotal += monthlyData[i].netSavings;
            if (runningTotal >= 0 && breakEvenMonth === null) {
                breakEvenMonth = i + 1;
                break;
            }
        }

        // === Total Annual Values ===
        const totalGPUCost = monthlySelectedCost * 12;
        const totalEngineerSavings = monthlyEngineerValueSaved * 12;
        const annualHumanReviewCost = monthlyHumanReviewCost * 12;
        const netSavingsYear = totalEngineerSavings - totalGPUCost;
        const roiPercent = totalGPUCost > 0 ? ((totalEngineerSavings - totalGPUCost) / totalGPUCost) * 100 : 0;

        // === Risk-Adjusted Values ===
        const baselineRiskValue = bugProbDecimal * CONSTANTS.SILICON_RESPIN_COST;
        const reducedBugProb = bugProbDecimal * (1 - bugReductionDecimal);
        const riskValueWithAI = reducedBugProb * CONSTANTS.SILICON_RESPIN_COST;
        const riskReduction = baselineRiskValue - riskValueWithAI;

        // Crossover Analysis: Interactive Jobs/day threshold
        // Solve: apiCostPerFile × (InteractiveVol + RegressionVol) = monthlySelfHostedCost
        // InteractiveVol = (monthlySelfHostedCost / apiCostPerFile) - RegressionVol
        const maxApiVolumeForBreakEven = apiCostPerFile > 0
            ? monthlySelfHostedCost / apiCostPerFile
            : Number.POSITIVE_INFINITY;
        const breakEvenInteractiveVolume = maxApiVolumeForBreakEven - regressionVolume;

        // Convert volume back to Jobs/Day per Engineer (divide by: Engineers * 20 days)
        // If result is negative, it means regressions alone already cost more than GPU.
        const interactiveDenominator = numEngineers * CONSTANTS.WORKING_DAYS_PER_MONTH;
        const apiVsGPUCrossoverJobsPerDay = interactiveDenominator > 0
            ? breakEvenInteractiveVolume / interactiveDenominator
            : 0;

        // Recommendation: API is cheaper if monthlyAPIBill < monthly self-hosted path.
        const isAPIRecommended = monthlyAPIBill < monthlySelfHostedCost;

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
            monthlySelfHostedCost,
            monthlyEngineerValueSaved,
            monthlyHumanReviewCost,
            annualHumanReviewCost,
            opExDelta,
            // V3: API cost comparison
            apiCostPerFile,
            monthlyAPIBill,
            apiVsGPUCrossoverJobsPerDay,
            isAPIRecommended,
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
