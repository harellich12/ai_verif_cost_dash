// Financial Constants - The "Truth" from the Product Context
export const CONSTANTS = {
    // GPU Costs
    H100_GPU_RENTAL_HOURLY: 3.00,           // $/hour
    H100_GPU_PURCHASE: 30_000,              // $/card
    H100_CHASSIS_OVERHEAD: 10_000,          // $ one-time

    // Engineering Costs
    ENGINEER_SALARY_YEARLY: 200_000,        // $ fully loaded
    EDA_LICENSE_YEARLY: 25_000,             // $ per engineer

    // Risk Costs
    SILICON_RESPIN_COST: 5_000_000,         // $ per respin

    // Time Ratios
    DEBUG_TIME_RATIO: 0.50,                 // 50% of time spent debugging

    // Derived Constants
    HOURS_PER_MONTH: 730,                   // Average hours per month (365 * 24 / 12)
    MONTHS_PER_YEAR: 12,

    // V2: Advanced Constants
    DEPRECIATION_MONTHS: 36,                // 3-year useful life for CapEx
    CORPORATE_TAX_RATE: 0.21,               // 21% tax rate for depreciation credit
    GPU_POWER_WATTS: 700,                   // H100 TDP in watts
    POWER_PUE: 1.5,                         // Power Usage Effectiveness (data center overhead)
    ELECTRICITY_RATE: 0.12,                 // $/kWh
} as const;

// Deployment strategy options
export type DeploymentStrategy = 'cloud' | 'onprem' | 'hybrid';

// Input configuration with defaults and bounds
export interface InputConfig {
    label: string;
    min: number;
    max: number;
    step: number;
    default: number;
    unit: string;
    tooltip?: string;
}

export const INPUT_CONFIGS: Record<string, InputConfig> = {
    numEngineers: {
        label: 'Number of Verification Engineers',
        min: 1,
        max: 50,
        step: 1,
        default: 10,
        unit: 'engineers',
        tooltip: 'Current headcount of verification engineers',
    },
    numGPUs: {
        label: 'Number of H100 GPUs',
        min: 1,
        max: 64,
        step: 1,
        default: 8,
        unit: 'GPUs',
        tooltip: 'H100 GPUs dedicated to the AI agent',
    },
    aiEfficiencyGain: {
        label: 'AI Efficiency Gain',
        min: 0,
        max: 100,
        step: 5,
        default: 30,
        unit: '%',
        tooltip: 'Percentage of debugging time saved by AI',
    },
    gpuUtilization: {
        label: 'GPU Utilization',
        min: 20,
        max: 100,
        step: 5,
        default: 60,
        unit: '%',
        tooltip: 'Average GPU utilization during work hours',
    },
    bugProbability: {
        label: 'Bug Escape Probability (Baseline)',
        min: 0,
        max: 50,
        step: 1,
        default: 5,
        unit: '%',
        tooltip: 'Probability of a critical bug causing a respin',
    },
    bugReductionWithAI: {
        label: 'Bug Reduction with AI',
        min: 0,
        max: 100,
        step: 5,
        default: 40,
        unit: '%',
        tooltip: 'Reduction in bug escape probability with AI',
    },
    onPremPercent: {
        label: 'On-Prem Workload %',
        min: 0,
        max: 100,
        step: 10,
        default: 0,
        unit: '%',
        tooltip: 'Percentage of workload on purchased hardware (rest goes to cloud)',
    },
    // V2: Advanced Settings
    electricityRate: {
        label: 'Electricity Cost',
        min: 0.05,
        max: 0.50,
        step: 0.01,
        default: 0.12,
        unit: '$/kWh',
        tooltip: 'Cost of electricity for On-Prem GPUs',
    },
    adminOverhead: {
        label: 'IT Admin Overhead',
        min: 0,
        max: 50,
        step: 1,
        default: 15,
        unit: '%',
        tooltip: 'Percentage overhead for IT administration and support',
    },
    storageCost: {
        label: 'Storage/Egress',
        min: 0,
        max: 5000,
        step: 100,
        default: 500,
        unit: '$/mo',
        tooltip: 'Monthly cost for storage and data egress',
    },
} as const;

export type InputKey = keyof typeof INPUT_CONFIGS;

export interface CalculatorInputs {
    numEngineers: number;
    numGPUs: number;
    aiEfficiencyGain: number;      // percentage
    gpuUtilization: number;        // percentage
    bugProbability: number;        // percentage
    bugReductionWithAI: number;    // percentage
    deploymentStrategy: DeploymentStrategy;  // V2: cloud, onprem, or hybrid
    onPremPercent: number;         // V2: 0-100, used when hybrid
    includeTaxDepreciation: boolean; // V2: Toggle for tax credit
    electricityRate: number;       // V2: $/kWh
    adminOverhead: number;         // V2: %
    storageCost: number;           // V2: $/mo
}

export interface MonthlyData {
    month: number;
    gpuCost: number;
    engineerCostBaseline: number;
    engineerCostWithAI: number;
    netSavings: number;
    cumulativeSavings: number;
    cumulativeGPUCost: number;
}

export interface CalculationResult {
    // Monthly breakdown
    monthlyData: MonthlyData[];

    // Summary KPIs
    totalGPUCost: number;
    totalEngineerSavings: number;
    netSavingsYear: number;
    roiPercent: number;
    breakEvenMonth: number | null;  // null if never breaks even

    // Risk-adjusted values
    baselineRiskValue: number;
    riskValueWithAI: number;
    riskReduction: number;

    // OpEx comparison
    monthlyGPUCost: number;
    monthlyEngineerValueSaved: number;
    opExDelta: number;
}

export function getDefaultInputs(): CalculatorInputs {
    return {
        numEngineers: INPUT_CONFIGS.numEngineers.default,
        numGPUs: INPUT_CONFIGS.numGPUs.default,
        aiEfficiencyGain: INPUT_CONFIGS.aiEfficiencyGain.default,
        gpuUtilization: INPUT_CONFIGS.gpuUtilization.default,
        bugProbability: INPUT_CONFIGS.bugProbability.default,
        bugReductionWithAI: INPUT_CONFIGS.bugReductionWithAI.default,
        deploymentStrategy: 'cloud',  // Default to cloud-only
        onPremPercent: INPUT_CONFIGS.onPremPercent.default,
        includeTaxDepreciation: true, // Default to including tax credit
        electricityRate: INPUT_CONFIGS.electricityRate.default,
        adminOverhead: INPUT_CONFIGS.adminOverhead.default,
        storageCost: INPUT_CONFIGS.storageCost.default,
    };
}
