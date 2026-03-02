import { VaaSInputs, VaaSResult, VAAS_CONSTANTS } from '../vaasConstants';
import { Download } from 'lucide-react';

interface VaaSExcelExportBtnProps {
    inputs: VaaSInputs;
    result: VaaSResult;
    viewMode?: 'admin' | 'presentation' | 'sales';
}

/**
 * VaaS Excel Export Button
 * Exports a snapshot of the VaaS Quote and Timeline to Excel.
 */
export function VaaSExcelExportBtn({ inputs, result, viewMode = 'admin' }: VaaSExcelExportBtnProps) {
    const isSales = viewMode === 'sales';

    const handleExport = async () => {
        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();

        // === Sheet 1: Quote Summary ===
        const wsQuote: Record<string, unknown> = {};

        // Header
        wsQuote['A1'] = { t: 's', v: isSales ? 'Sales Cost Presentation (External Verification Costs)' : 'VaaS Quote & Timeline Estimator' };
        wsQuote['A2'] = { t: 's', v: 'Export Timestamp:' };
        wsQuote['B2'] = { t: 's', v: new Date().toLocaleString() };

        // Section: Scope & Inputs
        wsQuote['A4'] = { t: 's', v: '=== PROJECT SCOPE ===' };
        wsQuote['A5'] = { t: 's', v: 'Block Type' };
        wsQuote['B5'] = { t: 's', v: inputs.blockType };

        wsQuote['A6'] = { t: 's', v: 'Block Size' };
        wsQuote['B6'] = {
            t: 's',
            v: inputs.blockComplexity === 'custom'
                ? `custom (${inputs.customBlockDurationMonths} months)`
                : inputs.blockComplexity,
        };

        wsQuote['A7'] = { t: 's', v: 'Internal Team Size' };
        wsQuote['B7'] = { t: 'n', v: inputs.internalTeamSize };
        wsQuote['C7'] = { t: 's', v: 'engineers' };

        wsQuote['A8'] = { t: 's', v: 'Engineer Hourly Rate' };
        wsQuote['B8'] = { t: 'n', v: inputs.engineerHourlyRate };
        wsQuote['C8'] = { t: 's', v: '$/hr' };

        wsQuote['A9'] = { t: 's', v: 'Idle Time Factor' };
        wsQuote['B9'] = { t: 'n', v: inputs.idleTimePercent };
        wsQuote['C9'] = { t: 's', v: '%' };

        wsQuote['A10'] = { t: 's', v: 'Annual Block Count' };
        wsQuote['B10'] = { t: 'n', v: inputs.annualBlockCount };
        wsQuote['C10'] = { t: 's', v: 'blocks/year' };

        wsQuote['A11'] = { t: 's', v: 'Parallel Blocks' };
        wsQuote['B11'] = { t: 'n', v: inputs.parallelBlocks };
        wsQuote['C11'] = { t: 's', v: 'in flight' };

        wsQuote['A12'] = { t: 's', v: 'Hiring Lag' };
        wsQuote['B12'] = { t: 'n', v: inputs.hiringLagMonths };
        wsQuote['C12'] = { t: 's', v: 'months' };

        if (isSales) {
            wsQuote['A14'] = { t: 's', v: '=== EXTERNAL COST BASIS ===' };
            wsQuote['A15'] = { t: 's', v: 'External Cost / Block' };
            wsQuote['B15'] = { t: 'n', v: result.salesExternalCostPerBlock };
            wsQuote['C15'] = { t: 's', v: '$' };
            wsQuote['A16'] = { t: 's', v: 'Active Verification Cost / Block' };
            wsQuote['B16'] = { t: 'n', v: result.salesActiveCostPerBlock };
            wsQuote['C16'] = { t: 's', v: '$' };
            wsQuote['A17'] = { t: 's', v: 'Idle Time Cost / Block' };
            wsQuote['B17'] = { t: 'n', v: result.salesIdleCostPerBlock };
            wsQuote['C17'] = { t: 's', v: '$' };
            wsQuote['A18'] = { t: 's', v: 'Delay Cost / Block (not modeled)' };
            wsQuote['B18'] = { t: 'n', v: result.salesDelayCostPerBlock };
            wsQuote['C18'] = { t: 's', v: '$' };
            wsQuote['A19'] = { t: 's', v: 'Traditional Duration' };
            wsQuote['B19'] = { t: 'n', v: result.traditionalDurationMonths + (result.internalStartOffset || 0) };
            wsQuote['C19'] = { t: 's', v: 'months' };

            wsQuote['A21'] = { t: 's', v: '=== ANNUAL EXTERNAL COST PROJECTION ===' };
            wsQuote['A22'] = { t: 's', v: 'Annual External Cost' };
            wsQuote['B22'] = { t: 'n', v: result.salesExternalCostAnnual };
            wsQuote['C22'] = { t: 's', v: '$' };
            wsQuote['A23'] = { t: 's', v: 'Annual Block Count' };
            wsQuote['B23'] = { t: 'n', v: inputs.annualBlockCount };
            wsQuote['C23'] = { t: 's', v: 'blocks/year' };
        } else {
            // Section: VaaS Proposal
            wsQuote['A14'] = { t: 's', v: '=== VAAS PROPOSAL ===' };
            wsQuote['A15'] = { t: 's', v: 'VaaS Quote Price' };
            wsQuote['B15'] = { t: 'n', v: inputs.vaasQuotePrice };
            wsQuote['C15'] = { t: 's', v: '$ (Fixed)' };

            const effectiveSpeedupFactor = result.provenSpeedupRatio ?? VAAS_CONSTANTS.SPEEDUP_FACTOR;
            wsQuote['A16'] = { t: 's', v: 'Speedup Factor' };
            wsQuote['B16'] = { t: 'n', v: effectiveSpeedupFactor * 100 };
            wsQuote['C16'] = { t: 's', v: '% Faster' };

            wsQuote['A17'] = { t: 's', v: 'Market Upside' };
            wsQuote['B17'] = { t: 'n', v: inputs.marketUpsidePerMonth };
            wsQuote['C17'] = { t: 's', v: '$/month' };
            wsQuote['A18'] = { t: 's', v: 'Human Review %' };
            wsQuote['B18'] = { t: 'n', v: inputs.humanReviewPercent };
            wsQuote['C18'] = { t: 's', v: '%' };

            // Section: Key Outcomes
            wsQuote['A19'] = { t: 's', v: '=== HARD METRICS (Per Block) ===' };
            wsQuote['A20'] = { t: 's', v: 'Metric' };
            wsQuote['B20'] = { t: 's', v: 'Value' };

            wsQuote['A21'] = { t: 's', v: 'Time to Market Saved' };
            wsQuote['B21'] = { t: 'n', v: result.monthsSaved };
            wsQuote['C21'] = { t: 's', v: 'months' };

            wsQuote['A22'] = { t: 's', v: 'Internal Capacity Unlocked' };
            wsQuote['B22'] = { t: 'n', v: result.fteMonthsSaved };
            wsQuote['C22'] = { t: 's', v: 'FTE-Months' };

            wsQuote['A23'] = { t: 's', v: 'Cash Burn Prevented' };
            wsQuote['B23'] = { t: 'n', v: result.totalCashBurnPrevented };
            wsQuote['C23'] = { t: 's', v: '$ (Idle Waste)' };

            wsQuote['A24'] = { t: 's', v: 'Business Upside' };
            wsQuote['B24'] = { t: 'n', v: result.businessUpsidePerBlock };
            wsQuote['C24'] = { t: 's', v: '$ (from earlier market entry)' };

            wsQuote['A25'] = { t: 's', v: 'Net Benefit / Block' };
            wsQuote['B25'] = { t: 'n', v: result.netBenefitPerBlock };
            wsQuote['C25'] = { t: 's', v: '$ (internal comparable + upside - quote - client review)' };

            wsQuote['A26'] = { t: 's', v: 'Total Project Cost (Internal)' };
            wsQuote['B26'] = { t: 'n', v: result.internalTeamCost };
            wsQuote['C26'] = { t: 's', v: '$ (baseline internal cost)' };
            wsQuote['A27'] = { t: 's', v: 'Client Review Cost / Block' };
            wsQuote['B27'] = { t: 'n', v: result.clientReviewCostPerBlock };
            wsQuote['C27'] = { t: 's', v: '$ (client-side HITL)' };

            // Section: Annual Projection
            wsQuote['A28'] = { t: 's', v: '=== ANNUAL EFFICIENCY PROJECTION ===' };
            wsQuote['A29'] = { t: 's', v: 'Based on Annual Block Count:' };
            wsQuote['B29'] = { t: 'n', v: inputs.annualBlockCount };

            wsQuote['A30'] = { t: 's', v: 'Total Capacity Unlocked' };
            wsQuote['B30'] = { t: 'n', v: result.fteMonthsSaved * inputs.annualBlockCount };
            wsQuote['C30'] = { t: 's', v: 'FTE-Months' };

            wsQuote['A31'] = { t: 's', v: 'Total Cash Burn Prevented' };
            wsQuote['B31'] = { t: 'n', v: result.projectedAnnualEfficiency };
            wsQuote['C31'] = { t: 's', v: '$' };

            wsQuote['A32'] = { t: 's', v: 'Annual Calendar Time Saved' };
            wsQuote['B32'] = { t: 'n', v: result.projectedAnnualTimeSaved };
            wsQuote['C32'] = { t: 's', v: 'months (parallelism-adjusted)' };

            wsQuote['A33'] = { t: 's', v: 'Annual Net Benefit' };
            wsQuote['B33'] = { t: 'n', v: result.projectedAnnualNetBenefit };
            wsQuote['C33'] = { t: 's', v: '$' };
            wsQuote['A34'] = { t: 's', v: 'Annual Client Review Cost' };
            wsQuote['B34'] = { t: 'n', v: result.annualClientReviewCost };
            wsQuote['C34'] = { t: 's', v: '$' };
        }

        wsQuote['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
        wsQuote['!ref'] = isSales ? 'A1:C23' : 'A1:C34';
        XLSX.utils.book_append_sheet(wb, wsQuote, 'Quote Summary');


        // === Sheet 2: Schedule (Weekly) ===
        const weeksPerMonth = 4.33;
        const traditionalWeeks = (result.traditionalDurationMonths + (result.internalStartOffset || 0)) * weeksPerMonth;
        const vaasWeeks = result.vaasDurationMonths * weeksPerMonth;
        const hiringLagWeeks = (result.internalStartOffset || 0) * weeksPerMonth;
        const executionWeeks = Math.max(result.traditionalDurationMonths * weeksPerMonth, 0.01);
        const maxWeeks = Math.ceil(isSales ? traditionalWeeks : Math.max(traditionalWeeks, vaasWeeks));

        const weeklyData = [];
        const headerRow = isSales
            ? ['Week', 'Traditional Progress (%)', 'Traditional Active Cost ($)', 'Idle Cost ($)', 'External Cost ($)']
            : ['Week', 'Traditional Progress (%)', 'VaaS Progress (%)', 'Traditional Cost ($)', 'VaaS Quote Cost ($)', 'Client Review Cost ($)', 'VaaS Total Cost ($)'];

        // Match hook logic: execution accrues after hiring lag.
        const engineerMonthlyCost = inputs.engineerHourlyRate * VAAS_CONSTANTS.HOURS_PER_MONTH;
        const baseInternalTeamCost = inputs.internalTeamSize * engineerMonthlyCost * result.traditionalDurationMonths;
        const idleTimeFraction = inputs.idleTimePercent / 100;

        for (let week = 1; week <= maxWeeks; week++) {
            const elapsedExecutionWeeks = Math.max(0, week - hiringLagWeeks);
            const tradProgress = Math.min((elapsedExecutionWeeks / executionWeeks) * 100, 100);
            const executionCostToDate = Math.min(
                (elapsedExecutionWeeks / executionWeeks) * baseInternalTeamCost,
                baseInternalTeamCost
            );
            const tradCostCurrent = executionCostToDate;
            if (isSales) {
                const idleCostCurrent = tradCostCurrent * idleTimeFraction;
                weeklyData.push([
                    week,
                    Math.round(tradProgress) + '%',
                    Math.round(tradCostCurrent),
                    Math.round(idleCostCurrent),
                    Math.round(tradCostCurrent + idleCostCurrent),
                ]);
            } else {
                const vProgress = Math.min((week / vaasWeeks) * 100, 100);
                let vaasCostCurrent = 0;
                let reviewCostCurrent = 0;
                if (week <= vaasWeeks) {
                    vaasCostCurrent = (week / vaasWeeks) * inputs.vaasQuotePrice;
                    reviewCostCurrent = (week / vaasWeeks) * result.clientReviewCostPerBlock;
                } else {
                    vaasCostCurrent = inputs.vaasQuotePrice;
                    reviewCostCurrent = result.clientReviewCostPerBlock;
                }

                weeklyData.push([
                    week,
                    Math.round(tradProgress) + '%',
                    Math.round(vProgress) + '%',
                    Math.round(tradCostCurrent),
                    Math.round(vaasCostCurrent),
                    Math.round(reviewCostCurrent),
                    Math.round(vaasCostCurrent + reviewCostCurrent)
                ]);
            }
        }

        const wsSchedule = XLSX.utils.aoa_to_sheet([headerRow, ...weeklyData]);
        wsSchedule['!cols'] = [
            ...(isSales
                ? [{ wch: 8 }, { wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 20 }]
                : [{ wch: 8 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }])
        ];
        XLSX.utils.book_append_sheet(wb, wsSchedule, 'Schedule');

        // Generate filename
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const filename = isSales
            ? `Sales_External_Cost_Presentation_${dateStr}.xlsx`
            : `VaaS_Quote_Estimate_${dateStr}.xlsx`;

        XLSX.writeFile(wb, filename);
    };

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 
                 bg-gradient-to-r from-amber-600 to-amber-500 
                 hover:from-amber-500 hover:to-amber-400
                 text-white font-medium rounded-lg 
                 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40
                 transition-all duration-200 
                 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-stone-900"
        >
            <Download size={18} className="opacity-90" />
            <span>{isSales ? 'Export Sales (.xlsx)' : 'Export Quote (.xlsx)'}</span>
        </button>
    );
}
