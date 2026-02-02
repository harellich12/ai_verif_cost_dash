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
export type BlockComplexity = 'small' | 'medium' | 'large';

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
} as const;

// VaaS Inputs Interface
export interface VaaSInputs {
    blockType: string;
    blockComplexity: BlockComplexity;
    internalTeamSize: number;
    estRtlDelayWeeks: number; // Replaces monthlyRevenueValue
    vaasQuotePrice: number;
    annualBlockCount: number;
}

// Monthly Timeline Data for projections
export interface VaaSMonthlyData {
    month: number;
    traditionalProgress: number;  // 0-100% completion
    vaasProgress: number;         // 0-100% completion
    traditionalCost: number;      // Cumulative internal cost
    vaasCost: number;             // Cumulative VaaS cost
    idleCost: number;             // Idle time cost (internal only)
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

    // Monthly Breakdown
    monthlyData: VaaSMonthlyData[];

    // Efficiency Projection
    projectedAnnualEfficiency: number;  // Savings × annual block count
    projectedAnnualTimeSaved: number;   // Months saved × annual block count
}

// Default Inputs
export function getDefaultVaaSInputs(): VaaSInputs {
    return {
        blockType: VAAS_CONSTANTS.BLOCK_TYPES[0],
        blockComplexity: 'medium',
        internalTeamSize: VAAS_INPUT_CONFIGS.internalTeamSize.default,
        estRtlDelayWeeks: VAAS_INPUT_CONFIGS.estRtlDelayWeeks.default,
        vaasQuotePrice: VAAS_INPUT_CONFIGS.vaasQuotePrice.default,
        annualBlockCount: VAAS_INPUT_CONFIGS.annualBlockCount.default,
    };
}
