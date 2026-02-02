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
        expect(result.current.result.monthsSaved).toBe(3.5);
    });

    it('should calculate weeks saved correctly', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        // 3.5 months saved * 4.33 weeks/month = ~15.16 weeks
        const expectedWeeks = 3.5 * VAAS_CONSTANTS.WEEKS_PER_MONTH;
        expect(result.current.result.weeksSaved).toBeCloseTo(expectedWeeks, 1);
    });

    it('should calculate internal team cost correctly', () => {
        const { result } = renderHook(() => useVaaSEstimator());

        // 5 engineers * ($200k/12) * 7 months = $583,333
        const engineerMonthlyCost = 200_000 / 12;
        const expected = 5 * engineerMonthlyCost * 7;

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
});
