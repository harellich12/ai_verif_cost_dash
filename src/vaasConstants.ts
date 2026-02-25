// VaaS (Verification as a Service) Constants
// The "New Truth" from the VaaS Product Context

export const VAAS_CONSTANTS = {
    // Speedup Factor: VaaS is 50% faster than traditional
    SPEEDUP_FACTOR: 0.5,

    // Traditional Duration Baselines (in months)
    BLOCK_DURATIONS: {
        small: 4,
        medium: 7,
        large: 12,
    } as const,

    // Block Type Examples (for dropdown)
    BLOCK_TYPES: [
        'UART Controller',
        'PCIe Controller',
        'DDR Memory Controller',
        'USB Controller',
        'Ethernet MAC',
        'SPI/I2C Interface',
        'Custom IP Block',
    ] as const,

    // Cost Model
    ENGINEER_SALARY_YEARLY: 200_000, // $ fully loaded (same as ROI)
    MONTHS_PER_YEAR: 12,
    WEEKS_PER_MONTH: 4.33, // Average weeks per month

    // Infrastructure (for reference - not H100s)
    CLOUD_VM_HOURLY: 0.50, // Standard 8-core VM, much cheaper than H100
} as const;

// Block Complexity Enum
export type BlockComplexity = 'small' | 'medium' | 'large' | 'custom';

// VaaS Input Configuration
export interface VaaSInputConfig {
    label: string;
    min: number;
    max: number;
    step: number;
    default: number;
    unit: string;
    tooltip?: string;
}

export const VAAS_INPUT_CONFIGS: Record<string, VaaSInputConfig> = {
    internalTeamSize: {
        label: 'Internal Team Size',
        min: 1,
        max: 20,
        step: 1,
        default: 3, // Updated default per new requirement
        unit: 'engineers',
        tooltip: 'Number of verification engineers on your internal team',
    },
    estRtlDelayWeeks: {
        label: 'Est. RTL Delay',
        min: 0,
        max: 12,
        step: 1,
        default: 2,
        unit: 'weeks',
        tooltip: 'Expected delay in RTL delivery that burns engineering cash (waiting time). VaaS eliminates this billing risk.',
    },
    vaasQuotePrice: {
        label: 'VaaS Quote Price',
        min: 50_000,
        max: 2_000_000,
        step: 25_000,
        default: 250_000,
        unit: '$',
        tooltip: 'Fixed price quote for the VaaS engagement (scope-based, no idle billing)',
    },
    annualBlockCount: {
        label: 'Annual Block Count',
        min: 1,
        max: 50,
        step: 1,
        default: 20,
        unit: 'blocks/year',
        tooltip: 'Number of similar verification blocks you expect to run annually (for efficiency projection)',
    },
    parallelBlocks: {
        label: 'Parallel Blocks',
        min: 1,
        max: 10,
        step: 1,
        default: 1,
        unit: 'blocks',
        tooltip: 'Average number of verification blocks executed in parallel',
    },
    marketUpsidePerMonth: {
        label: 'Market Upside',
        min: 0,
        max: 5_000_000,
        step: 50_000,
        default: 0,
        unit: '$/mo',
        tooltip: 'Optional business upside from earlier delivery (revenue/profit impact per month)',
    },
    humanReviewPercent: {
        label: 'Human Review %',
        min: 0,
        max: 60,
        step: 5,
        default: 20,
        unit: '%',
        tooltip: 'Client-side engineer review effort to verify and control AI output quality',
    },
    hiringLagMonths: {
        label: 'Internal Hiring Lag',
        min: 0,
        max: 6,
        step: 0.5,
        default: 1,
        unit: 'months',
        tooltip: 'Time required to recruit, hire, and onboard the internal team before productive work begins.',
    },
    customBlockDurationMonths: {
        label: 'Custom Block Size',
        min: 1,
        max: 36,
        step: 0.5,
        default: 7,
        unit: 'months',
        tooltip: 'Manual block duration used when Block Size is set to Custom.',
    },
} as const;

// VaaS Inputs Interface
export interface VaaSInputs {
    blockType: string;
    blockComplexity: BlockComplexity;
    customBlockDurationMonths: number;
    internalTeamSize: number;
    estRtlDelayWeeks: number; // Replaces monthlyRevenueValue
    vaasQuotePrice: number;
    annualBlockCount: number;
    parallelBlocks: number;
    marketUpsidePerMonth: number;
    humanReviewPercent: number;
    hiringLagMonths: number;
    isBenchmarkMode?: boolean;
    benchmarkInternalDays?: number;
    benchmarkVaasDays?: number;
}

// Monthly Timeline Data for projections
export interface VaaSMonthlyData {
    month: number;
    traditionalProgress: number;  // 0-100% completion
    vaasProgress: number;         // 0-100% completion
    traditionalCost: number;      // Cumulative internal cost
    vaasCost: number;             // Cumulative VaaS cost
    clientReviewCost: number;     // Cumulative client-side review cost
    idleCost: number;             // Idle time cost (internal only)
}

export interface VaaSSalesMonthlyData {
    month: number;
    externalCost: number;
    activeCost: number;
    idleCost: number;
    progress: number;
}

// VaaS Calculation Result
export interface VaaSResult {
    // Timeline
    traditionalDurationMonths: number;
    vaasDurationMonths: number;
    monthsSaved: number;
    weeksSaved: number;

    // Cost Comparison
    internalTeamCost: number;      // Full duration INCLUDING delay impact
    vaasCost: number;              // Fixed quote

    // Hard Metrics (New)
    fteMonthsSaved: number;        // Capacity Dividend
    costOfRtlDelay: number;        // Burn Rate (Waste)
    totalCashBurnPrevented: number; // Delay Savings + Efficiency Savings (Idle Tax) [Replaces Revenue Gained]
    idleCashSaved: number;         // Kept for chart/logic, represents inefficiency of internal flow
    businessUpsidePerBlock: number; // Optional upside from faster time to market
    clientReviewCostPerBlock: number; // Client-side human review cost
    annualClientReviewCost: number;   // Client-side human review cost annualized
    netBenefitPerBlock: number;     // Internal comparable cost + upside - VaaS quote

    // Monthly Breakdown
    monthlyData: VaaSMonthlyData[];
    salesMonthlyData: VaaSSalesMonthlyData[];

    // Sales View Metrics (External/Traditional cost framing)
    salesExternalCostPerBlock: number;
    salesExternalCostAnnual: number;
    salesDelayCostPerBlock: number;
    salesIdleCostPerBlock: number;
    salesActiveCostPerBlock: number;

    // Efficiency Projection
    projectedAnnualEfficiency: number;  // Savings × annual block count
    projectedAnnualTimeSaved: number;   // Months saved × annual block count
    projectedAnnualNetBenefit: number;  // Net benefit × annual block count

    // Benchmark & Advanced Timeline Props (Optional)
    isBenchmarkMode?: boolean;         // If true, shows "Verified" styling
    provenSpeedupRatio?: number;       // e.g. 0.82 for 82% speedup
    internalStartOffset?: number;      // "Hiring Lag" or ramp-up delay in months
}

// Default Inputs
export function getDefaultVaaSInputs(): VaaSInputs {
    return {
        blockType: VAAS_CONSTANTS.BLOCK_TYPES[0],
        blockComplexity: 'medium',
        customBlockDurationMonths: VAAS_INPUT_CONFIGS.customBlockDurationMonths.default,
        internalTeamSize: VAAS_INPUT_CONFIGS.internalTeamSize.default,
        estRtlDelayWeeks: VAAS_INPUT_CONFIGS.estRtlDelayWeeks.default,
        vaasQuotePrice: VAAS_INPUT_CONFIGS.vaasQuotePrice.default,
        annualBlockCount: VAAS_INPUT_CONFIGS.annualBlockCount.default,
        parallelBlocks: VAAS_INPUT_CONFIGS.parallelBlocks.default,
        marketUpsidePerMonth: VAAS_INPUT_CONFIGS.marketUpsidePerMonth.default,
        humanReviewPercent: VAAS_INPUT_CONFIGS.humanReviewPercent.default,
        hiringLagMonths: VAAS_INPUT_CONFIGS.hiringLagMonths.default,
        isBenchmarkMode: false,
        benchmarkInternalDays: 20,
        benchmarkVaasDays: 5,
    };
}
