import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BenchmarkBadge } from '../BenchmarkBadge';
import { VaaSResult } from '../../vaasConstants';
import { formatCurrency } from '../../utils/format';

function createResult(overrides: Partial<VaaSResult> = {}): VaaSResult {
    return {
        traditionalDurationMonths: 1,
        vaasDurationMonths: 0.5,
        monthsSaved: 0.5,
        weeksSaved: 2.165,
        internalTeamCost: 0,
        vaasCost: 0,
        fteMonthsSaved: 0,
        costOfRtlDelay: 0,
        totalCashBurnPrevented: 0,
        idleCashSaved: 0,
        businessUpsidePerBlock: 0,
        clientReviewCostPerBlock: 0,
        annualClientReviewCost: 0,
        netBenefitPerBlock: 0,
        monthlyData: [],
        salesMonthlyData: [],
        salesExternalCostPerBlock: 0,
        salesExternalCostAnnual: 0,
        salesDelayCostPerBlock: 0,
        salesIdleCostPerBlock: 0,
        salesActiveCostPerBlock: 0,
        projectedAnnualEfficiency: 0,
        projectedAnnualTimeSaved: 0,
        projectedAnnualNetBenefit: 0,
        ...overrides,
    };
}

describe('BenchmarkBadge', () => {
    it('renders idle-cost KPI tile only in sales view', () => {
        const result = createResult();
        const { rerender } = render(
            <BenchmarkBadge
                annualBlockCount={1}
                parallelBlocks={1}
                engineerHourlyRate={10}
                idleTimePercent={10}
                result={result}
                viewMode="sales"
            />
        );

        expect(screen.queryByText('Idle Cost / Year')).not.toBeNull();

        rerender(
            <BenchmarkBadge
                annualBlockCount={1}
                parallelBlocks={1}
                engineerHourlyRate={10}
                idleTimePercent={10}
                result={result}
                viewMode="admin"
            />
        );

        expect(screen.queryByText('Idle Cost / Year')).toBeNull();
    });

    it('computes annual idle cost as annual hours x hourly rate x idle fraction', () => {
        const result = createResult({ traditionalDurationMonths: 2, internalStartOffset: 1 });
        const annualBlockCount = 4;
        const parallelBlocks = 2;
        const engineerHourlyRate = 120;
        const idleTimePercent = 25;

        render(
            <BenchmarkBadge
                annualBlockCount={annualBlockCount}
                parallelBlocks={parallelBlocks}
                engineerHourlyRate={engineerHourlyRate}
                idleTimePercent={idleTimePercent}
                result={result}
                viewMode="sales"
            />
        );

        const annualExternalDaysLoad = ((result.traditionalDurationMonths + (result.internalStartOffset || 0)) * 30 * annualBlockCount) / parallelBlocks;
        const annualExternalHours = annualExternalDaysLoad * 8;
        const expectedAnnualIdleCost = annualExternalHours * engineerHourlyRate * (idleTimePercent / 100);

        expect(screen.queryByText(formatCurrency(expectedAnnualIdleCost, true))).not.toBeNull();
    });

    it('shows zero annual idle cost when idle time percent is zero', () => {
        const result = createResult();

        render(
            <BenchmarkBadge
                annualBlockCount={1}
                parallelBlocks={1}
                engineerHourlyRate={100}
                idleTimePercent={0}
                result={result}
                viewMode="sales"
            />
        );

        expect(screen.queryByText('$0')).not.toBeNull();
    });

    it('scales annual idle cost linearly with hourly rate and inverse with parallel blocks', () => {
        const result = createResult({ traditionalDurationMonths: 1, internalStartOffset: 0 });
        const annualBlockCount = 1;
        const idleTimePercent = 10;

        const { rerender } = render(
            <BenchmarkBadge
                annualBlockCount={annualBlockCount}
                parallelBlocks={1}
                engineerHourlyRate={10}
                idleTimePercent={idleTimePercent}
                result={result}
                viewMode="sales"
            />
        );

        const annualExternalHoursP1 = ((1 * 30 * annualBlockCount) / 1) * 8;
        const expectedAtRate10 = annualExternalHoursP1 * 10 * (idleTimePercent / 100);
        expect(screen.queryByText(formatCurrency(expectedAtRate10, true))).not.toBeNull();

        rerender(
            <BenchmarkBadge
                annualBlockCount={annualBlockCount}
                parallelBlocks={1}
                engineerHourlyRate={20}
                idleTimePercent={idleTimePercent}
                result={result}
                viewMode="sales"
            />
        );
        const expectedAtRate20 = annualExternalHoursP1 * 20 * (idleTimePercent / 100);
        expect(screen.queryByText(formatCurrency(expectedAtRate20, true))).not.toBeNull();

        rerender(
            <BenchmarkBadge
                annualBlockCount={annualBlockCount}
                parallelBlocks={2}
                engineerHourlyRate={20}
                idleTimePercent={idleTimePercent}
                result={result}
                viewMode="sales"
            />
        );
        const annualExternalHoursP2 = ((1 * 30 * annualBlockCount) / 2) * 8;
        const expectedParallelAdjusted = annualExternalHoursP2 * 20 * (idleTimePercent / 100);
        expect(screen.queryByText(formatCurrency(expectedParallelAdjusted, true))).not.toBeNull();
    });
});
