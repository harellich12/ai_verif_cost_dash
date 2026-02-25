import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVaaSEstimator } from '../useVaaSEstimator';
import { getDefaultVaaSInputs, VAAS_CONSTANTS } from '../../vaasConstants';

describe('useVaaSEstimator', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useVaaSEstimator());
        const defaults = getDefaultVaaSInputs();

        expect(result.current.inputs).toEqual(defaults);
    });

    it('should calculate 50% speedup correctly', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        // Default: Medium block = 7 months traditional
        // VaaS = 7 * 0.5 = 3.5 months
        expect(result.current.result.traditionalDurationMonths).toBe(7);
        expect(result.current.result.vaasDurationMonths).toBe(3.5);
        // Includes 1 month default internal hiring lag
        expect(result.current.result.monthsSaved).toBe(4.5);
    });

    it('should calculate weeks saved correctly', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        // 4.5 months saved * 4.33 weeks/month
        const expectedWeeks = 4.5 * VAAS_CONSTANTS.WEEKS_PER_MONTH;
        expect(result.current.result.weeksSaved).toBeCloseTo(expectedWeeks, 1);
    });

    it('should calculate internal team cost correctly', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        act(() => {
            result.current.updateInput('hiringLagMonths', 0);
        });

        // 3 engineers * ($200k/12) * 7 months + 2-week RTL delay burn
        const engineerMonthlyCost = 200_000 / 12;
        const base = 3 * engineerMonthlyCost * 7;
        const delay = (3 * (engineerMonthlyCost / VAAS_CONSTANTS.WEEKS_PER_MONTH)) * 2;
        const expected = base + delay;

        expect(result.current.result.internalTeamCost).toBeCloseTo(expected, 0);
    });

    it('should update block complexity and recalculate', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        act(() => {
            result.current.updateInput('blockComplexity', 'large');
        });

        // Large block = 12 months traditional, 6 months VaaS
        expect(result.current.result.traditionalDurationMonths).toBe(12);
        expect(result.current.result.vaasDurationMonths).toBe(6);
        expect(result.current.result.monthsSaved).toBe(7);
    });

    it('should use custom block size months when complexity is custom', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        act(() => {
            result.current.updateInput('blockComplexity', 'custom');
            result.current.updateInput('customBlockDurationMonths', 10);
        });

        expect(result.current.result.traditionalDurationMonths).toBe(10);
        expect(result.current.result.vaasDurationMonths).toBe(5);
        // 10 months + 1 month hiring lag - 5 months VaaS
        expect(result.current.result.monthsSaved).toBe(6);
    });

    it('should calculate projected annual efficiency', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        // Per-block savings × 20 blocks
        // Per-block savings × 20 blocks
        const perBlockSavings = result.current.result.totalCashBurnPrevented;
        const expected = perBlockSavings * 20; // default annualBlockCount

        expect(result.current.result.projectedAnnualEfficiency).toBeCloseTo(expected, 0);
    });

    it('should treat hiring lag and RTL delay as mutually exclusive', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        act(() => {
            result.current.updateInput('hiringLagMonths', 2);
            result.current.updateInput('estRtlDelayWeeks', 8);
        });

        // Hiring lag active -> RTL delay cost should not be stacked.
        expect(result.current.result.costOfRtlDelay).toBe(0);
    });

    it('should adjust annual time saved by parallel blocks', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        const sequentialTimeSaved = result.current.result.monthsSaved * 20;
        expect(result.current.result.projectedAnnualTimeSaved).toBeCloseTo(sequentialTimeSaved, 5);

        act(() => {
            result.current.updateInput('parallelBlocks', 4);
        });

        expect(result.current.result.projectedAnnualTimeSaved).toBeCloseTo(sequentialTimeSaved / 4, 5);
    });

    it('should model hiring lag and cumulative VaaS cost progression in monthly data', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        const month1 = result.current.result.monthlyData[0];
        const month2 = result.current.result.monthlyData[1];

        // With 1-month hiring lag, internal execution progress starts after month 1.
        expect(month1.traditionalProgress).toBe(0);
        expect(month2.traditionalProgress).toBeGreaterThan(0);

        // VaaS fixed quote accrues over delivery months (not full amount every month).
        expect(month1.vaasCost).toBeLessThan(result.current.result.vaasCost);
        expect(month2.vaasCost).toBeGreaterThan(month1.vaasCost);
    });

    it('should preserve legacy net behavior when human review percent is zero', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        act(() => {
            result.current.updateInput('humanReviewPercent', 0);
        });

        expect(result.current.result.clientReviewCostPerBlock).toBeCloseTo(0, 5);
        const internalComparableCost = result.current.result.internalTeamCost + result.current.result.idleCashSaved;
        const legacyNet = internalComparableCost + result.current.result.businessUpsidePerBlock - result.current.result.vaasCost;
        expect(result.current.result.netBenefitPerBlock).toBeCloseTo(legacyNet, 5);
    });

    it('should compute client review cost from saved effort base', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        const engineerMonthlyCost = VAAS_CONSTANTS.ENGINEER_SALARY_YEARLY / VAAS_CONSTANTS.MONTHS_PER_YEAR;
        const expected = result.current.result.fteMonthsSaved * engineerMonthlyCost * 0.20; // default review %
        expect(result.current.result.clientReviewCostPerBlock).toBeCloseTo(expected, 5);
    });

    it('should reduce annual net benefit by annual client review cost', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        act(() => {
            result.current.updateInput('humanReviewPercent', 0);
        });
        const netAtZero = result.current.result.projectedAnnualNetBenefit;

        act(() => {
            result.current.updateInput('humanReviewPercent', 20);
        });
        const reviewAnnual = result.current.result.annualClientReviewCost;
        const netAtTwenty = result.current.result.projectedAnnualNetBenefit;

        expect(netAtZero - netAtTwenty).toBeCloseTo(reviewAnnual, 1);
    });

    it('should accrue monthly client review cost only during VaaS delivery window', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        const reviewPerBlock = result.current.result.clientReviewCostPerBlock;
        const deliveryEndMonth = Math.ceil(result.current.result.vaasDurationMonths);
        const monthDuringDelivery = result.current.result.monthlyData[Math.min(1, result.current.result.monthlyData.length - 1)];
        const monthAfterDelivery = result.current.result.monthlyData.find((m) => m.month > deliveryEndMonth);
        const lastMonth = result.current.result.monthlyData[result.current.result.monthlyData.length - 1];

        expect(monthDuringDelivery.clientReviewCost).toBeGreaterThan(0);
        expect(monthDuringDelivery.clientReviewCost).toBeLessThanOrEqual(reviewPerBlock);
        if (monthAfterDelivery) {
            expect(monthAfterDelivery.clientReviewCost).toBeCloseTo(reviewPerBlock, 1);
        }
        expect(lastMonth.clientReviewCost).toBeCloseTo(reviewPerBlock, 1);
    });

    it('should compute sales external-cost metrics and monthly sales data', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        const expectedPerBlock = result.current.result.internalTeamCost + result.current.result.idleCashSaved;
        expect(result.current.result.salesExternalCostPerBlock).toBeCloseTo(expectedPerBlock, 5);
        expect(result.current.result.salesExternalCostAnnual).toBeCloseTo(expectedPerBlock * result.current.inputs.annualBlockCount, 5);
        expect(result.current.result.salesDelayCostPerBlock).toBeCloseTo(result.current.result.costOfRtlDelay, 5);
        expect(result.current.result.salesIdleCostPerBlock).toBeCloseTo(result.current.result.idleCashSaved, 5);
        expect(result.current.result.salesActiveCostPerBlock).toBeCloseTo(result.current.result.internalTeamCost, 5);

        const firstSalesMonth = result.current.result.salesMonthlyData[0];
        const firstRegularMonth = result.current.result.monthlyData[0];
        expect(firstSalesMonth.progress).toBeCloseTo(firstRegularMonth.traditionalProgress, 5);
        expect(firstSalesMonth.activeCost).toBeCloseTo(firstRegularMonth.traditionalCost, 5);
        expect(firstSalesMonth.idleCost).toBeCloseTo(firstRegularMonth.idleCost, 5);
        expect(firstSalesMonth.externalCost).toBeCloseTo(firstRegularMonth.traditionalCost + firstRegularMonth.idleCost, 5);
    });
});
