import * as XLSX from 'xlsx';
import { CalculatorInputs } from '../constants';
import { Download } from 'lucide-react';

interface ExcelExportBtnProps {
    inputs: CalculatorInputs;
}

/**
 * Excel Export Button Component
 * Creates a workbook with formulas for interactive spreadsheet editing
 */
export function ExcelExportBtn({ inputs }: ExcelExportBtnProps) {

    const handleExport = () => {
        const wb = XLSX.utils.book_new();

        // === Sheet 1: Summary with Input Cells and Formula References ===
        const ws: XLSX.WorkSheet = {};

        // Header
        ws['A1'] = { t: 's', v: 'GenAI Verification ROI Calculator - Interactive Model' };
        ws['A2'] = { t: 's', v: 'Generated:' };
        ws['B2'] = { t: 's', v: new Date().toLocaleString() };

        // === INPUT PARAMETERS (editable cells) ===
        ws['A4'] = { t: 's', v: '=== INPUT PARAMETERS (Edit these values) ===' };
        ws['A5'] = { t: 's', v: 'Parameter' };
        ws['B5'] = { t: 's', v: 'Value' };
        ws['C5'] = { t: 's', v: 'Unit' };

        // Input values - these are the cells users can edit
        ws['A6'] = { t: 's', v: 'Number of Engineers' };
        ws['B6'] = { t: 'n', v: inputs.numEngineers };  // B6 = Engineers
        ws['C6'] = { t: 's', v: 'engineers' };

        ws['A7'] = { t: 's', v: 'Number of H100 GPUs' };
        ws['B7'] = { t: 'n', v: inputs.numGPUs };  // B7 = GPUs
        ws['C7'] = { t: 's', v: 'GPUs' };

        ws['A8'] = { t: 's', v: 'AI Efficiency Gain' };
        ws['B8'] = { t: 'n', v: inputs.aiEfficiencyGain / 100 };  // B8 = Efficiency (decimal)
        ws['C8'] = { t: 's', v: '% (as decimal)' };

        ws['A9'] = { t: 's', v: 'GPU Utilization' };
        ws['B9'] = { t: 'n', v: inputs.gpuUtilization / 100 };  // B9 = Utilization (decimal)
        ws['C9'] = { t: 's', v: '% (as decimal)' };

        ws['A10'] = { t: 's', v: 'Bug Escape Probability' };
        ws['B10'] = { t: 'n', v: inputs.bugProbability / 100 };  // B10 = Bug Prob (decimal)
        ws['C10'] = { t: 's', v: '% (as decimal)' };

        ws['A11'] = { t: 's', v: 'Bug Reduction with AI' };
        ws['B11'] = { t: 'n', v: inputs.bugReductionWithAI / 100 };  // B11 = Bug Reduction (decimal)
        ws['C11'] = { t: 's', v: '% (as decimal)' };

        ws['A12'] = { t: 's', v: 'Use Rental (1) or Purchase (0)' };
        ws['B12'] = { t: 'n', v: inputs.useRental ? 1 : 0 };  // B12 = Rental flag
        ws['C12'] = { t: 's', v: '1=Rental, 0=Purchase' };

        // === CONSTANTS (fixed values) ===
        ws['A14'] = { t: 's', v: '=== CONSTANTS ===' };
        ws['A15'] = { t: 's', v: 'Constant' };
        ws['B15'] = { t: 's', v: 'Value' };

        ws['A16'] = { t: 's', v: 'H100 GPU Rental ($/hour)' };
        ws['B16'] = { t: 'n', v: 3.00 };  // B16 = GPU hourly rate

        ws['A17'] = { t: 's', v: 'H100 GPU Purchase ($)' };
        ws['B17'] = { t: 'n', v: 30000 };  // B17 = GPU purchase price

        ws['A18'] = { t: 's', v: 'Chassis Overhead ($)' };
        ws['B18'] = { t: 'n', v: 10000 };  // B18 = Chassis cost

        ws['A19'] = { t: 's', v: 'Engineer Salary ($/year)' };
        ws['B19'] = { t: 'n', v: 200000 };  // B19 = Engineer salary

        ws['A20'] = { t: 's', v: 'EDA License ($/year)' };
        ws['B20'] = { t: 'n', v: 25000 };  // B20 = EDA license

        ws['A21'] = { t: 's', v: 'Respin Cost ($)' };
        ws['B21'] = { t: 'n', v: 5000000 };  // B21 = Respin cost

        ws['A22'] = { t: 's', v: 'Debug Time Ratio' };
        ws['B22'] = { t: 'n', v: 0.50 };  // B22 = Debug ratio

        ws['A23'] = { t: 's', v: 'Hours per Month' };
        ws['B23'] = { t: 'n', v: 730 };  // B23 = Hours/month

        // === CALCULATED RESULTS (formulas) ===
        ws['A25'] = { t: 's', v: '=== CALCULATED RESULTS (Formulas) ===' };
        ws['A26'] = { t: 's', v: 'Metric' };
        ws['B26'] = { t: 's', v: 'Value' };
        ws['C26'] = { t: 's', v: 'Formula Description' };

        // Monthly GPU Cost (Rental)
        // =IF(B12=1, B7*B16*B23*B9, (B7*B17+B18)/36)
        ws['A27'] = { t: 's', v: 'Monthly GPU Cost ($)' };
        ws['B27'] = { t: 'n', f: 'IF(B12=1,B7*B16*B23*B9,(B7*B17+B18)/36)' };
        ws['C27'] = { t: 's', v: 'If Rental: GPUs × Rate × Hours × Util. Else: (GPUs × Price + Chassis) / 36' };

        // Engineer Monthly Cost
        // =(B19+B20)/12
        ws['A28'] = { t: 's', v: 'Engineer Monthly Cost ($)' };
        ws['B28'] = { t: 'n', f: '(B19+B20)/12' };
        ws['C28'] = { t: 's', v: '(Salary + EDA License) / 12 months' };

        // Monthly Engineer Value Saved
        // =B6*B28*B22*B8
        ws['A29'] = { t: 's', v: 'Monthly Eng. Value Saved ($)' };
        ws['B29'] = { t: 'n', f: 'B6*B28*B22*B8' };
        ws['C29'] = { t: 's', v: 'Engineers × Monthly Cost × Debug Ratio × Efficiency' };

        // Monthly OpEx Delta
        // =B27-B29
        ws['A30'] = { t: 's', v: 'Monthly OpEx Delta ($)' };
        ws['B30'] = { t: 'n', f: 'B27-B29' };
        ws['C30'] = { t: 's', v: 'GPU Cost - Value Saved (negative = savings)' };

        // Upfront Cost (for purchase)
        // =IF(B12=0, B7*B17+B18, 0)
        ws['A31'] = { t: 's', v: 'Upfront Investment ($)' };
        ws['B31'] = { t: 'n', f: 'IF(B12=0,B7*B17+B18,0)' };
        ws['C31'] = { t: 's', v: 'Purchase only: GPUs × Price + Chassis' };

        // Total Annual GPU Cost
        // =B27*12+B31
        ws['A32'] = { t: 's', v: 'Total Annual GPU Cost ($)' };
        ws['B32'] = { t: 'n', f: 'B27*12+B31' };
        ws['C32'] = { t: 's', v: 'Monthly GPU × 12 + Upfront' };

        // Total Annual Savings
        // =B29*12
        ws['A33'] = { t: 's', v: 'Total Annual Eng. Savings ($)' };
        ws['B33'] = { t: 'n', f: 'B29*12' };
        ws['C33'] = { t: 's', v: 'Monthly Value Saved × 12' };

        // Net Annual Savings
        // =B33-B32
        ws['A34'] = { t: 's', v: 'Net Annual Savings ($)' };
        ws['B34'] = { t: 'n', f: 'B33-B32' };
        ws['C34'] = { t: 's', v: 'Eng. Savings - GPU Cost (positive = profit)' };

        // ROI %
        // =IF(B32>0, (B33-B32)/B32*100, 0)
        ws['A35'] = { t: 's', v: 'ROI (%)' };
        ws['B35'] = { t: 'n', f: 'IF(B32>0,(B33-B32)/B32*100,0)' };
        ws['C35'] = { t: 's', v: '(Savings - Cost) / Cost × 100' };

        // === RISK ANALYSIS ===
        ws['A37'] = { t: 's', v: '=== RISK ANALYSIS ===' };

        // Baseline Risk Value
        // =B10*B21
        ws['A38'] = { t: 's', v: 'Baseline Risk Value ($)' };
        ws['B38'] = { t: 'n', f: 'B10*B21' };
        ws['C38'] = { t: 's', v: 'Bug Probability × Respin Cost' };

        // Risk with AI
        // =B10*(1-B11)*B21
        ws['A39'] = { t: 's', v: 'Risk Value with AI ($)' };
        ws['B39'] = { t: 'n', f: 'B10*(1-B11)*B21' };
        ws['C39'] = { t: 's', v: 'Reduced Bug Prob × Respin Cost' };

        // Risk Reduction
        // =B38-B39
        ws['A40'] = { t: 's', v: 'Risk Reduction ($)' };
        ws['B40'] = { t: 'n', f: 'B38-B39' };
        ws['C40'] = { t: 's', v: 'Baseline - With AI = Avoided Risk' };

        // Set column widths
        ws['!cols'] = [
            { wch: 35 },
            { wch: 20 },
            { wch: 50 },
        ];

        // Set range
        ws['!ref'] = 'A1:C40';

        XLSX.utils.book_append_sheet(wb, ws, 'Summary');

        // === Sheet 2: Cash Flow with Formulas ===
        const wsCF: XLSX.WorkSheet = {};

        // Header row
        wsCF['A1'] = { t: 's', v: 'Month' };
        wsCF['B1'] = { t: 's', v: 'GPU Cost ($)' };
        wsCF['C1'] = { t: 's', v: 'Eng. Cost Baseline ($)' };
        wsCF['D1'] = { t: 's', v: 'Eng. Cost with AI ($)' };
        wsCF['E1'] = { t: 's', v: 'Net Savings ($)' };
        wsCF['F1'] = { t: 's', v: 'Cumulative Savings ($)' };

        // Data rows with formulas referencing Summary sheet
        for (let i = 0; i < 12; i++) {
            const row = i + 2;

            // Month number
            wsCF[`A${row}`] = { t: 'n', v: i + 1 };

            // GPU Cost = Summary!B27
            wsCF[`B${row}`] = { t: 'n', f: 'Summary!$B$27' };

            // Engineer Cost Baseline = Engineers × Monthly Cost
            wsCF[`C${row}`] = { t: 'n', f: 'Summary!$B$6*Summary!$B$28' };

            // Engineer Cost with AI = Baseline - Value Saved
            wsCF[`D${row}`] = { t: 'n', f: 'C' + row + '-Summary!$B$29' };

            // Net Savings = Value Saved - GPU Cost
            wsCF[`E${row}`] = { t: 'n', f: 'Summary!$B$29-Summary!$B$27' };

            // Cumulative Savings
            if (i === 0) {
                // First month: just net savings minus upfront
                wsCF[`F${row}`] = { t: 'n', f: 'E' + row + '-Summary!$B$31' };
            } else {
                // Subsequent months: previous cumulative + net savings
                wsCF[`F${row}`] = { t: 'n', f: 'F' + (row - 1) + '+E' + row };
            }
        }

        // Totals row
        wsCF['A14'] = { t: 's', v: 'TOTAL' };
        wsCF['B14'] = { t: 'n', f: 'SUM(B2:B13)' };
        wsCF['C14'] = { t: 'n', f: 'SUM(C2:C13)' };
        wsCF['D14'] = { t: 'n', f: 'SUM(D2:D13)' };
        wsCF['E14'] = { t: 'n', f: 'SUM(E2:E13)' };
        wsCF['F14'] = { t: 'n', f: 'F13' };

        // Column widths
        wsCF['!cols'] = [
            { wch: 8 },
            { wch: 18 },
            { wch: 22 },
            { wch: 20 },
            { wch: 18 },
            { wch: 22 },
        ];

        wsCF['!ref'] = 'A1:F14';

        XLSX.utils.book_append_sheet(wb, wsCF, 'Cash Flow');

        // Generate filename with date
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const filename = `ROI_Model_${dateStr}.xlsx`;

        XLSX.writeFile(wb, filename);
    };

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 
                 bg-gradient-to-r from-blue-600 to-blue-500 
                 hover:from-blue-500 hover:to-blue-400
                 text-white font-medium rounded-lg 
                 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                 transition-all duration-200 
                 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
            <Download size={18} className="opacity-90" />
            <span>Export Model (.xlsx)</span>
        </button>
    );
}
