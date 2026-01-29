import {
    CONSTANTS,
    CalculatorInputs,
    CalculationResult,
    MonthlyData,
} from '../constants';

/**
 * Calculate all ROI metrics based on inputs
 */
export function calculateROI(inputs: CalculatorInputs): CalculationResult {
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
    // Engineers spend DEBUG_TIME_RATIO of time debugging
    // AI saves efficiencyGainDecimal of that time
    const debugTimeSavedFraction = CONSTANTS.DEBUG_TIME_RATIO * efficiencyGainDecimal;
    const monthlyEngineerValueSaved = numEngineers * engineerMonthlyCost * debugTimeSavedFraction;

    // Effective cost with AI (we save the debugging time, so cost is reduced)
    const monthlyEngineerCostWithAI = monthlyEngineerCostBaseline - monthlyEngineerValueSaved;

    // === OpEx Delta ===
    // Positive = AI costs more than it saves, Negative = AI saves money
    const opExDelta = monthlyGPUCost - monthlyEngineerValueSaved;

    // === Monthly Cash Flow Breakdown ===
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
}

/**
 * Format currency with appropriate suffix for large numbers
 */
export function formatCurrency(value: number, compact = false): string {
    if (compact) {
        const absValue = Math.abs(value);
        if (absValue >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(1)}M`;
        } else if (absValue >= 1_000) {
            return `$${(value / 1_000).toFixed(0)}K`;
        }
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
