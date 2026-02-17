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
    DEPRECIATION_MONTHS: 24,                // 2-year useful life (H100 rapid obsolescence)
    CORPORATE_TAX_RATE: 0.21,               // 21% tax rate for depreciation credit
    GPU_POWER_WATTS: 700,                   // H100 TDP in watts
    POWER_PUE: 1.5,                         // Power Usage Effectiveness (data center overhead)
    ELECTRICITY_RATE: 0.12,                 // $/kWh

    // V3: API Cost Constants (Part 8)
    API_CLAUDE_INPUT_PRICE: 3.00,           // $/1M tokens
    API_CLAUDE_OUTPUT_PRICE: 15.00,         // $/1M tokens
    // V4: Base tokens per file (single pass, before retries)
    API_BASE_TOKENS_INPUT: 50_000,          // 50k context per pass
    API_BASE_TOKENS_OUTPUT: 2_000,          // 2k code per pass
    WORKING_DAYS_PER_MONTH: 20,             // Business days (Interactive jobs)
    CALENDAR_DAYS_PER_MONTH: 30,            // All days (Regression runs)
    H100_MONTHLY_RENTAL_BASELINE: 2190,     // $3/hr × 730 hours (single GPU baseline)
} as const;

// Deployment strategy options
export type DeploymentStrategy = 'cloud' | 'onprem' | 'hybrid';

// V3: Compute mode - Self-Hosted GPU vs Cloud API
export type ComputeMode = 'self-hosted' | 'cloud-api';

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
    depreciationMonths: {
        label: 'Hardware Depreciation',
        min: 12,
        max: 60,
        step: 6,
        default: 24,
        unit: 'months',
        tooltip: 'Amortization period for on-prem hardware (H100 lifecycle)',
    },
    // V3: API-related inputs
    // V4: Split volume into Interactive (×20 days) and Regression (×30 days)
    interactiveJobsPerDay: {
        label: 'Interactive Jobs/Day',
        min: 0,
        max: 50,
        step: 1,
        default: 5,
        unit: 'jobs/day',
        tooltip: 'Engineer-triggered AI verification jobs (×20 business days)',
    },
    regressionRunsPerNight: {
        label: 'Regression Runs/Night',
        min: 0,
        max: 100,
        step: 5,
        default: 10,
        unit: 'runs/night',
        tooltip: 'CI/CD triggered nightly regressions (×30 calendar days)',
    },
    avgAgentRetries: {
        label: 'Avg. Agent Retries',
        min: 0,
        max: 5,
        step: 1,
        default: 2,
        unit: 'retries',
        tooltip: 'Average self-healing loop retries per job (impacts token cost)',
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
    // V3 → V4: API Cost Mode
    computeMode: ComputeMode;              // 'self-hosted' | 'cloud-api'
    // V4: Split workload volume
    interactiveJobsPerDay: number;         // Engineer-triggered jobs (×20 days)
    regressionRunsPerNight: number;        // CI/CD regressions (×30 days)
    avgAgentRetries: number;               // Retry multiplier for tokens
    storageCost: number;                   // $/mo
    depreciationMonths: number;            // Hardware amortization period
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
    monthlyGPUCost: number; // Selected compute path monthly cost (legacy field name)
    monthlySelfHostedCost: number; // Self-hosted monthly infra cost for API-vs-GPU comparison
    monthlyEngineerValueSaved: number;
    opExDelta: number;

    // V3: API Cost comparison
    apiCostPerFile: number;              // Cost per file verification via API
    monthlyAPIBill: number;              // Monthly API bill
    apiVsGPUCrossoverJobsPerDay: number; // Jobs/day threshold where GPU becomes cheaper
    isAPIRecommended: boolean;           // true if API is currently cheaper
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
        // V4: API Cost defaults
        computeMode: 'self-hosted',
        interactiveJobsPerDay: INPUT_CONFIGS.interactiveJobsPerDay.default,
        regressionRunsPerNight: INPUT_CONFIGS.regressionRunsPerNight.default,
        avgAgentRetries: INPUT_CONFIGS.avgAgentRetries.default,
        depreciationMonths: INPUT_CONFIGS.depreciationMonths.default,
    };
}
