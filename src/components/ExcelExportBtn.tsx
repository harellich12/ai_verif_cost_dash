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

        // V2: Deployment Strategy (0=Cloud, 1=On-Prem, 2=Hybrid)
        const strategyToNum = { 'cloud': 0, 'onprem': 1, 'hybrid': 2 };
        ws['A12'] = { t: 's', v: 'Deployment Strategy' };
        ws['B12'] = { t: 'n', v: strategyToNum[inputs.deploymentStrategy] };  // B12 = Strategy
        ws['C12'] = { t: 's', v: '0=Cloud, 1=On-Prem, 2=Hybrid' };

        ws['A13'] = { t: 's', v: 'On-Prem Workload %' };
        ws['B13'] = { t: 'n', v: inputs.onPremPercent / 100 };  // B13 = On-Prem fraction
        ws['C13'] = { t: 's', v: '% (as decimal, used in Hybrid mode)' };

        // V2: Include Tax Depreciation (0=No, 1=Yes)
        ws['A14'] = { t: 's', v: 'Include Tax Depreciation' };
        ws['B14'] = { t: 'n', v: inputs.includeTaxDepreciation ? 1 : 0 };  // B14 = Toggle
        ws['C14'] = { t: 's', v: '1 = Apply 21% Tax Credit, 0 = No Credit' };

        // === CONSTANTS (fixed values) ===
        ws['A15'] = { t: 's', v: '=== CONSTANTS ===' };
        ws['A16'] = { t: 's', v: 'Constant' };
        ws['B16'] = { t: 's', v: 'Value' };

        ws['A17'] = { t: 's', v: 'H100 GPU Rental ($/hour)' };
        ws['B17'] = { t: 'n', v: 3.00 };  // B17 = GPU hourly rate

        ws['A18'] = { t: 's', v: 'H100 GPU Purchase ($)' };
        ws['B18'] = { t: 'n', v: 30000 };  // B18 = GPU purchase price

        ws['A19'] = { t: 's', v: 'Chassis Overhead ($)' };
        ws['B19'] = { t: 'n', v: 10000 };  // B19 = Chassis cost

        ws['A20'] = { t: 's', v: 'Engineer Salary ($/year)' };
        ws['B20'] = { t: 'n', v: 200000 };  // B20 = Engineer salary

        ws['A21'] = { t: 's', v: 'EDA License ($/year)' };
        ws['B21'] = { t: 'n', v: 25000 };  // B21 = EDA license

        ws['A22'] = { t: 's', v: 'Respin Cost ($)' };
        ws['B22'] = { t: 'n', v: 5000000 };  // B22 = Respin cost

        ws['A23'] = { t: 's', v: 'Debug Time Ratio' };
        ws['B23'] = { t: 'n', v: 0.50 };  // B23 = Debug ratio

        ws['A24'] = { t: 's', v: 'Hours per Month' };
        ws['B24'] = { t: 'n', v: 730 };  // B24 = Hours/month

        // V2: New Constants
        ws['A25'] = { t: 's', v: 'Depreciation Months' };
        ws['B25'] = { t: 'n', v: 36 };  // B25 = 3-year depreciation

        ws['A26'] = { t: 's', v: 'Corporate Tax Rate' };
        ws['B26'] = { t: 'n', v: 0.21 };  // B26 = 21% tax rate

        ws['A27'] = { t: 's', v: 'GPU Power (kW)' };
        ws['B27'] = { t: 'n', v: 0.7 };  // B27 = 700W = 0.7kW

        ws['A28'] = { t: 's', v: 'Power PUE' };
        ws['B28'] = { t: 'n', v: 1.5 };  // B28 = PUE

        ws['A29'] = { t: 's', v: 'Electricity ($/kWh)' };
        ws['B29'] = { t: 'n', v: inputs.electricityRate };  // B29 = Electricity rate (from input)

        // Advanced Settings Inputs (Side Column)
        ws['E6'] = { t: 's', v: 'Advan. Inputs' };
        ws['F6'] = { t: 's', v: 'Value' };

        ws['E7'] = { t: 's', v: 'IT Admin Overhead' };
        ws['F7'] = { t: 'n', v: inputs.adminOverhead };
        ws['G7'] = { t: 's', v: '%' };

        ws['E8'] = { t: 's', v: 'Storage Cost' };
        ws['F8'] = { t: 'n', v: inputs.storageCost };
        ws['G8'] = { t: 's', v: '$/mo' };


        // === CALCULATED RESULTS (formulas) ===
        ws['A31'] = { t: 's', v: '=== CALCULATED RESULTS (Formulas) ===' };
        ws['A32'] = { t: 's', v: 'Metric' };
        ws['B32'] = { t: 's', v: 'Value' };
        ws['C32'] = { t: 's', v: 'Formula Description' };

        // V2: On-Prem Fraction based on deployment strategy
        // =IF(B12=0, 0, IF(B12=1, 1, B13))
        ws['A33'] = { t: 's', v: 'On-Prem Fraction' };
        ws['B33'] = { t: 'n', f: 'IF(B12=0,0,IF(B12=1,1,B13))' };
        ws['C33'] = { t: 's', v: 'Cloud=0, On-Prem=1, Hybrid=B13' };

        // V2: Cloud Fraction = 1 - On-Prem Fraction
        ws['A34'] = { t: 's', v: 'Cloud Fraction' };
        ws['B34'] = { t: 'n', f: '1-B33' };
        ws['C34'] = { t: 's', v: '1 - On-Prem Fraction' };

        // V2: On-Prem Hardware Cost (monthly, amortized)
        // =IF(B33>0, ((B7*B33*B18)+B19)/B25, 0)
        ws['A35'] = { t: 's', v: 'Monthly On-Prem Hardware ($)' };
        ws['B35'] = { t: 'n', f: 'IF(B33>0,((B7*B33*B18)+B19)/B25,0)' };
        ws['C35'] = { t: 's', v: '(GPUs × OnPremFrac × Price + Chassis) / 36' };

        // V2: On-Prem Power Cost (monthly)
        // =B7*B33*B27*B28*B24*B29
        ws['A36'] = { t: 's', v: 'Monthly On-Prem Power ($)' };
        ws['B36'] = { t: 'n', f: 'B7*B33*B27*B28*B24*B29' };
        ws['C36'] = { t: 's', v: 'GPUs × Fraction × kW × PUE × Hours × $/kWh' };

        // V2: Tax Credit (monthly)
        // =B35*B26*B14
        ws['A37'] = { t: 's', v: 'Monthly Tax Credit ($)' };
        ws['B37'] = { t: 'n', f: 'B35*B26*B14' };
        ws['C37'] = { t: 's', v: 'On-Prem Hardware Cost × Tax Rate × Toggle' };

        // V2: Cloud Cost (monthly, scales with utilization)
        // =B7*B34*B17*B24*B9
        ws['A38'] = { t: 's', v: 'Monthly Cloud Cost ($)' };
        ws['B38'] = { t: 'n', f: 'B7*B34*B17*B24*B9' };
        ws['C38'] = { t: 's', v: 'GPUs × CloudFrac × $/hr × Hours × Util' };

        // V2: Total Monthly Infra Cost (includes Overheads)
        // =(B35+B36+B38-B37 + F8) * (1 + F7/100)
        ws['A39'] = { t: 's', v: 'Monthly Total Infra Cost ($)' };
        ws['B39'] = { t: 'n', f: '(B35+B36+B38-B37+F8)*(1+F7/100)' };
        ws['C39'] = { t: 's', v: '(Base + Storage) * (1 + Admin%)' };

        // Engineer Monthly Cost
        // =(B20+B21)/12
        ws['A40'] = { t: 's', v: 'Engineer Monthly Cost ($)' };
        ws['B40'] = { t: 'n', f: '(B20+B21)/12' };
        ws['C40'] = { t: 's', v: '(Salary + EDA License) / 12 months' };

        // Monthly Engineer Value Saved
        // =B6*B40*B23*B8
        ws['A41'] = { t: 's', v: 'Monthly Eng. Value Saved ($)' };
        ws['B41'] = { t: 'n', f: 'B6*B40*B23*B8' };
        ws['C41'] = { t: 's', v: 'Engineers × Monthly Cost × Debug Ratio × Efficiency' };

        // Monthly OpEx Delta
        // =B39-B41
        ws['A42'] = { t: 's', v: 'Monthly OpEx Delta ($)' };
        ws['B42'] = { t: 'n', f: 'B39-B41' };
        ws['C42'] = { t: 's', v: 'GPU Cost - Value Saved (negative = savings)' };

        // Upfront Investment
        // =IF(B33>0, B7*B33*B18+B19, 0)
        ws['A43'] = { t: 's', v: 'Upfront Investment ($)' };
        ws['B43'] = { t: 'n', f: 'IF(B33>0,B7*B33*B18+B19,0)' };
        ws['C43'] = { t: 's', v: 'On-Prem only: GPUs × Fraction × Price + Chassis' };

        // Total Annual GPU Cost
        // =B39*12+B43
        ws['A44'] = { t: 's', v: 'Total Annual GPU Cost ($)' };
        ws['B44'] = { t: 'n', f: 'B39*12+B43' };
        ws['C44'] = { t: 's', v: 'Monthly GPU × 12 + Upfront' };

        // Total Annual Savings
        // =B41*12
        ws['A45'] = { t: 's', v: 'Total Annual Eng. Savings ($)' };
        ws['B45'] = { t: 'n', f: 'B41*12' };
        ws['C45'] = { t: 's', v: 'Monthly Value Saved × 12' };

        // Net Annual Savings
        // =B45-B44
        ws['A46'] = { t: 's', v: 'Net Annual Savings ($)' };
        ws['B46'] = { t: 'n', f: 'B45-B44' };
        ws['C46'] = { t: 's', v: 'Eng. Savings - GPU Cost (positive = profit)' };

        // ROI %
        // =IF(B44>0, (B45-B44)/B44*100, 0)
        ws['A47'] = { t: 's', v: 'ROI (%)' };
        ws['B47'] = { t: 'n', f: 'IF(B44>0,(B45-B44)/B44*100,0)' };
        ws['C47'] = { t: 's', v: '(Savings - Cost) / Cost × 100' };

        // === RISK ANALYSIS ===
        ws['A49'] = { t: 's', v: '=== RISK ANALYSIS ===' };

        // Baseline Risk Value
        // =B10*B22
        ws['A50'] = { t: 's', v: 'Baseline Risk Value ($)' };
        ws['B50'] = { t: 'n', f: 'B10*B22' };
        ws['C50'] = { t: 's', v: 'Bug Probability × Respin Cost' };

        // Risk with AI
        // =B10*(1-B11)*B22
        ws['A51'] = { t: 's', v: 'Risk Value with AI ($)' };
        ws['B51'] = { t: 'n', f: 'B10*(1-B11)*B22' };
        ws['C51'] = { t: 's', v: 'Reduced Bug Prob × Respin Cost' };

        // Risk Reduction
        // =B50-B51
        ws['A52'] = { t: 's', v: 'Risk Reduction ($)' };
        ws['B52'] = { t: 'n', f: 'B50-B51' };
        ws['C52'] = { t: 's', v: 'Baseline - With AI = Avoided Risk' };

        // Set column widths
        ws['!cols'] = [
            { wch: 35 },
            { wch: 20 },
            { wch: 50 },
        ];

        // Set range
        ws['!ref'] = 'A1:C52';

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

        // Data rows with formulas referencing Summary sheet (V2 cell references)
        for (let i = 0; i < 12; i++) {
            const row = i + 2;

            // Month number
            wsCF[`A${row}`] = { t: 'n', v: i + 1 };

            // GPU Cost = Summary!B39 (Total Monthly GPU Cost)
            wsCF[`B${row}`] = { t: 'n', f: 'Summary!$B$39' };

            // Engineer Cost Baseline = Engineers × Monthly Cost (B6 × B40)
            wsCF[`C${row}`] = { t: 'n', f: 'Summary!$B$6*Summary!$B$40' };

            // Engineer Cost with AI = Baseline - Value Saved
            wsCF[`D${row}`] = { t: 'n', f: 'C' + row + '-Summary!$B$41' };

            // Net Savings = Value Saved - GPU Cost
            wsCF[`E${row}`] = { t: 'n', f: 'Summary!$B$41-Summary!$B$39' };

            // Cumulative Savings
            if (i === 0) {
                // First month: just net savings minus upfront
                wsCF[`F${row}`] = { t: 'n', f: 'E' + row + '-Summary!$B$43' };
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
