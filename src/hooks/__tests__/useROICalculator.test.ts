import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useROICalculator } from '../useROICalculator';
import { getDefaultInputs } from '../../constants';

describe('useROICalculator', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useROICalculator());
        const defaults = getDefaultInputs();

        expect(result.current.inputs).toEqual(defaults);
        expect(result.current.monthlyData).toHaveLength(12);
    });

    it('should calculate Cloud GPU cost correctly', () => {
        const { result } = renderHook(() => useROICalculator());

        // 8 GPUs, 60% util, $3/hr, 730 hrs
        // Cost = 8 * 0.6 * 3 * 730 = 10512
        const expectedBaseGPUCost = 8 * 0.6 * 3.00 * 730;

        // Storage is $500 default
        const storage = 500;

        // Overhead is 15% default
        const overhead = (expectedBaseGPUCost + storage) * 0.15;

        const total = expectedBaseGPUCost + storage + overhead;

        expect(result.current.result.monthlyGPUCost).toBeCloseTo(total, 1);
    });

    it('should not double count on-prem capex in annual totals', () => {
        const { result } = renderHook(() => useROICalculator());

        act(() => {
            result.current.updateInput('deploymentStrategy', 'onprem');
            result.current.updateInput('computeMode', 'self-hosted');
        });

        // Annual cost should be monthly selected cost * 12 (no extra upfront add-on).
        expect(result.current.result.totalGPUCost).toBeCloseTo(result.current.result.monthlyGPUCost * 12, 1);
    });

    it('should calculate Engineering Savings correctly', () => {
        const { result } = renderHook(() => useROICalculator());

        // 10 Engineers
        // Cost per engineer = ($200k + $25k) / 12 = 18750
        // Total Baseline = 187,500

        // AI Efficiency = 30% (default)
        // Debug Ratio = 50%
        // Gross Savings = 187,500 * 0.5 * 0.3 = 28,125
        // Human Review (20%) = 5,625
        // Net Savings = 22,500

        expect(result.current.result.monthlyHumanReviewCost).toBeCloseTo(5625, 0);
        expect(result.current.result.monthlyEngineerValueSaved).toBeCloseTo(22500, 0);
        expect(result.current.result.annualHumanReviewCost).toBeCloseTo(67500, 0);
    });

    it('should match legacy savings when human review percent is zero', () => {
        const { result } = renderHook(() => useROICalculator());

        act(() => {
            result.current.updateInput('humanReviewPercent', 0);
        });

        expect(result.current.result.monthlyHumanReviewCost).toBeCloseTo(0, 5);
        expect(result.current.result.monthlyEngineerValueSaved).toBeCloseTo(28125, 0);
    });

    it('should reduce net ROI as human review percent increases', () => {
        const { result } = renderHook(() => useROICalculator());

        act(() => {
            result.current.updateInput('humanReviewPercent', 0);
        });
        const roiAtZero = result.current.result.roiPercent;

        act(() => {
            result.current.updateInput('humanReviewPercent', 60);
        });
        const roiAtSixty = result.current.result.roiPercent;

        expect(roiAtSixty).toBeLessThan(roiAtZero);
    });

    it('should delay or eliminate break-even at higher human review percent in marginal scenario', () => {
        const { result } = renderHook(() => useROICalculator());

        act(() => {
            result.current.updateInput('numGPUs', 16);
            result.current.updateInput('humanReviewPercent', 0);
        });
        const breakEvenLowReview = result.current.result.breakEvenMonth;

        act(() => {
            result.current.updateInput('humanReviewPercent', 60);
        });
        const breakEvenHighReview = result.current.result.breakEvenMonth;

        if (breakEvenLowReview !== null && breakEvenHighReview !== null) {
            expect(breakEvenHighReview).toBeGreaterThanOrEqual(breakEvenLowReview);
        } else {
            expect(breakEvenHighReview === null || breakEvenLowReview === null).toBe(true);
        }
    });

    it('should use API bill as primary compute cost in cloud-api mode', () => {
        const { result } = renderHook(() => useROICalculator());

        act(() => {
            result.current.updateInput('computeMode', 'cloud-api');
        });

        expect(result.current.result.monthlyGPUCost).toBeCloseTo(result.current.result.monthlyAPIBill, 5);
        expect(result.current.result.opExDelta).toBeCloseTo(
            result.current.result.monthlyAPIBill - result.current.result.monthlyEngineerValueSaved,
            5
        );
    });

    it('should update inputs and recalculate', () => {
        const { result } = renderHook(() => useROICalculator());

        act(() => {
            result.current.updateInput('numGPUs', 20);
        });

        expect(result.current.inputs.numGPUs).toBe(20);

        // Cost should increase
        // 20 * 0.6 * 3 * 730 = 26280
        // + 500 storage
        // + 15% overhead
        const expected = (26280 + 500) * 1.15;

        expect(result.current.result.monthlyGPUCost).toBeCloseTo(expected, 1);
    });

    it('should correctly recommend API vs GPU', () => {
        const { result } = renderHook(() => useROICalculator());

        // Default Case: 10 Eng, 5 Jobs/Day, 10 Regression/Night
        // Interactive Vol = 10 * 5 * 20 = 1000
        // Regression Vol = 10 * 30 = 300
        // Total Jobs = 1300

        // API Cost (approx $0.54/file based on defaults)
        // Retries = 2 default -> Multiplier = 3
        // Tokens Input = 50k * 3 = 150k -> $0.45 ($3/1M)
        // Tokens Output = 2k * 3 = 6k -> $0.09 ($15/1M)
        // Total per file = $0.54

        const costPerFile = 0.54;
        const totalBill = 1300 * costPerFile; // $702

        expect(result.current.result.monthlyAPIBill).toBeCloseTo(totalBill, 0);
        expect(result.current.result.isAPIRecommended).toBe(true);

        // New Crossover Logic (Interactive Jobs Break Even):
        // GPU Cost ~12,089 (calculated in previous test)
        // API Cost per file = 0.54
        // Max Total Volume = 12,089 / 0.54 = ~22,387
        // Fixed Regression Volume = 300
        // Available Interactive Volume = 22,387 - 300 = 22,087
        // Break Even Jobs/Day/Eng = 22,087 / (10 * 20) = ~110.4

        expect(result.current.result.apiVsGPUCrossoverJobsPerDay).toBeGreaterThan(100);
        expect(result.current.result.apiVsGPUCrossoverJobsPerDay).toBeLessThan(120);
    });

    it('should switch recommendation to GPU when volume is massive', () => {
        const { result } = renderHook(() => useROICalculator());

        act(() => {
            // Crank up the volume
            result.current.updateInput('interactiveJobsPerDay', 150);
            // 150 jobs/day > 110 (break even) -> Should still be somewhat comparable but we need to force the switch
            // to insure the boolean flips.

            // Let's make GPU cheap to guarantee switch
            result.current.updateInput('numGPUs', 1);
        });
        // 1 GPU (~$1600) vs API (huge volume).

        expect(result.current.result.isAPIRecommended).toBe(false);
    });
});
