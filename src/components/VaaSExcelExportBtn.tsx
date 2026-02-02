import * as XLSX from 'xlsx';
import { VaaSInputs, VaaSResult, VAAS_CONSTANTS } from '../vaasConstants';
import { Download } from 'lucide-react';

interface VaaSExcelExportBtnProps {
    inputs: VaaSInputs;
    result: VaaSResult;
}

/**
 * VaaS Excel Export Button
 * Exports a snapshot of the VaaS Quote and Timeline to Excel.
 */
export function VaaSExcelExportBtn({ inputs, result }: VaaSExcelExportBtnProps) {

    const handleExport = () => {
        const wb = XLSX.utils.book_new();

        // === Sheet 1: Quote Summary ===
        const wsQuote: XLSX.WorkSheet = {};

        // Header
        wsQuote['A1'] = { t: 's', v: 'VaaS Quote & Timeline Estimator' };
        wsQuote['A2'] = { t: 's', v: 'Export Timestamp:' };
        wsQuote['B2'] = { t: 's', v: new Date().toLocaleString() };

        // Section: Scope & Inputs
        wsQuote['A4'] = { t: 's', v: '=== PROJECT SCOPE ===' };
        wsQuote['A5'] = { t: 's', v: 'Block Type' };
        wsQuote['B5'] = { t: 's', v: inputs.blockType };

        wsQuote['A6'] = { t: 's', v: 'Complexity' };
        wsQuote['B6'] = { t: 's', v: inputs.blockComplexity };

        wsQuote['A7'] = { t: 's', v: 'Internal Team Size' };
        wsQuote['B7'] = { t: 'n', v: inputs.internalTeamSize };
        wsQuote['C7'] = { t: 's', v: 'engineers' };

        wsQuote['A8'] = { t: 's', v: 'Annual Block Count' };
        wsQuote['B8'] = { t: 'n', v: inputs.annualBlockCount };
        wsQuote['C8'] = { t: 's', v: 'blocks/year' };

        wsQuote['A9'] = { t: 's', v: 'Est. RTL Delay Impact' };
        wsQuote['B9'] = { t: 'n', v: inputs.estRtlDelayWeeks };
        wsQuote['C9'] = { t: 's', v: 'weeks' };

        // Section: VaaS Proposal
        wsQuote['A11'] = { t: 's', v: '=== VAAS PROPOSAL ===' };
        wsQuote['A12'] = { t: 's', v: 'VaaS Quote Price' };
        wsQuote['B12'] = { t: 'n', v: inputs.vaasQuotePrice };
        wsQuote['C12'] = { t: 's', v: '$ (Fixed)' };

        wsQuote['A13'] = { t: 's', v: 'Speedup Factor' };
        wsQuote['B13'] = { t: 'n', v: VAAS_CONSTANTS.SPEEDUP_FACTOR * 100 };
        wsQuote['C13'] = { t: 's', v: '% Faster' };

        // Section: Key Outcomes
        wsQuote['A15'] = { t: 's', v: '=== HARD METRICS (Per Block) ===' };
        wsQuote['A16'] = { t: 's', v: 'Metric' };
        wsQuote['B16'] = { t: 's', v: 'Value' };

        wsQuote['A17'] = { t: 's', v: 'Time to Market Saved' };
        wsQuote['B17'] = { t: 'n', v: result.monthsSaved };
        wsQuote['C17'] = { t: 's', v: 'months' };

        wsQuote['A18'] = { t: 's', v: 'Internal Capacity Unlocked' };
        wsQuote['B18'] = { t: 'n', v: result.fteMonthsSaved };
        wsQuote['C18'] = { t: 's', v: 'FTE-Months' };

        wsQuote['A19'] = { t: 's', v: 'Cash Burn Prevented' };
        wsQuote['B19'] = { t: 'n', v: result.totalCashBurnPrevented };
        wsQuote['C19'] = { t: 's', v: '$ (Delay + Idle Waste)' };

        wsQuote['A20'] = { t: 's', v: 'Total Project Cost (Internal)' };
        wsQuote['B20'] = { t: 'n', v: result.internalTeamCost };
        wsQuote['C20'] = { t: 's', v: '$ (Includes Delay)' };

        // Section: Annual Projection
        wsQuote['A22'] = { t: 's', v: '=== ANNUAL EFFICIENCY PROJECTION ===' };
        wsQuote['A23'] = { t: 's', v: 'Based on Annual Block Count:' };
        wsQuote['B23'] = { t: 'n', v: inputs.annualBlockCount };

        wsQuote['A24'] = { t: 's', v: 'Total Capacity Unlocked' };
        wsQuote['B24'] = { t: 'n', v: result.fteMonthsSaved * inputs.annualBlockCount };
        wsQuote['C24'] = { t: 's', v: 'FTE-Months' };

        wsQuote['A25'] = { t: 's', v: 'Total Cash Burn Prevented' };
        wsQuote['B25'] = { t: 'n', v: result.projectedAnnualEfficiency };
        wsQuote['C25'] = { t: 's', v: '$' };

        wsQuote['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
        wsQuote['!ref'] = 'A1:C25';
        XLSX.utils.book_append_sheet(wb, wsQuote, 'Quote Summary');


        // === Sheet 2: Schedule (Weekly) ===
        // Note: We calculate weekly progress dynamically here for the report
        // since the hook provides monthly buckets.
        const weeksPerMonth = 4.33;
        const traditionalWeeks = result.traditionalDurationMonths * weeksPerMonth;
        const vaasWeeks = result.vaasDurationMonths * weeksPerMonth;
        const maxWeeks = Math.ceil(traditionalWeeks);

        const weeklyData = [];
        const headerRow = ['Week', 'Traditional Progress (%)', 'VaaS Progress (%)', 'Traditional Cost ($)', 'VaaS Cost ($)'];

        // Calculate weekly run rate for internal team
        // Internal Cost is linear over time
        const internalWeeklyCost = result.internalTeamCost / traditionalWeeks;

        for (let week = 1; week <= maxWeeks; week++) {
            // Progress Calculation (Linear)
            // Clamp at 100%
            const tradProgress = Math.min((week / traditionalWeeks) * 100, 100);
            const vProgress = Math.min((week / vaasWeeks) * 100, 100);

            // Cost Calculation
            // Traditional: Accumulates linear weekly cost
            const tradCostCurrent = Math.min(week * internalWeeklyCost, result.internalTeamCost);

            // VaaS: Fixed Price. 
            // We show the full price committed from Day 1 (or we could amortize it).
            // Usually fixed quotes are milestones. Let's show full accrued cost for simplicity 
            // or flat cost? The prompt says "No GPU/Hardware amortization".
            // Let's show the Fixed Quote Price constant across the board or accumulating?
            // "VaaS Cost = Quote Price (Fixed scope)".
            // Let's just show the full quote price as the "Cost to date" if signed, 
            // or maybe step it? Let's just put the Total VaaS Price as a constant reference 
            // or linearize it?
            // "Vaus Cost" usually implies "Spend to date".
            // Let's linearize it over the VaaS duration for comparison, then flatline.
            let vaasCostCurrent = 0;
            if (week <= vaasWeeks) {
                vaasCostCurrent = (week / vaasWeeks) * inputs.vaasQuotePrice;
            } else {
                vaasCostCurrent = inputs.vaasQuotePrice;
            }

            weeklyData.push([
                week,
                Math.round(tradProgress) + '%',
                Math.round(vProgress) + '%',
                Math.round(tradCostCurrent),
                Math.round(vaasCostCurrent)
            ]);
        }

        const wsSchedule = XLSX.utils.aoa_to_sheet([headerRow, ...weeklyData]);
        wsSchedule['!cols'] = [
            { wch: 8 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsSchedule, 'Schedule');

        // Generate filename
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const filename = `VaaS_Quote_Estimate_${dateStr}.xlsx`;

        XLSX.writeFile(wb, filename);
    };

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 
                 bg-gradient-to-r from-violet-600 to-violet-500 
                 hover:from-violet-500 hover:to-violet-400
                 text-white font-medium rounded-lg 
                 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                 transition-all duration-200 
                 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
            <Download size={18} className="opacity-90" />
            <span>Export Quote (.xlsx)</span>
        </button>
    );
}
