import * as XLSX from 'xlsx';
import { CalculatorInputs, CalculationResult, MonthlyData, CONSTANTS } from '../constants';
import { Download } from 'lucide-react';

interface ExcelExportBtnProps {
    inputs: CalculatorInputs;
    result: CalculationResult;
}

/**
 * V4: Excel Export Button Component (Safe Mode)
 * 
 * Exports a SNAPSHOT of the current calculations - no Excel formulas.
 * This ensures 100% parity between what the user sees in the app and
 * what appears in the Excel file. No risk of formula/code divergence.
 */
export function ExcelExportBtn({ inputs, result }: ExcelExportBtnProps) {

    const handleExport = () => {
        const selectedMonthlyCostLabel = inputs.computeMode === 'cloud-api'
            ? 'Monthly API Cost (Selected Path)'
            : 'Monthly GPU/Infra Cost (Selected Path)';
        const wb = XLSX.utils.book_new();

        // === Sheet 1: Parameters (Input Assumptions) ===
        const wsParams: XLSX.WorkSheet = {};

        // Header
        wsParams['A1'] = { t: 's', v: 'GenAI Verification ROI Calculator - Input Parameters' };
        wsParams['A2'] = { t: 's', v: 'Export Timestamp:' };
        wsParams['B2'] = { t: 's', v: new Date().toLocaleString() };
        wsParams['A3'] = { t: 's', v: '⚠️ This is a SNAPSHOT. Values will not recalculate if edited.' };

        // Core Inputs
        wsParams['A5'] = { t: 's', v: '=== CORE INPUTS ===' };
        wsParams['A6'] = { t: 's', v: 'Parameter' };
        wsParams['B6'] = { t: 's', v: 'Value' };
        wsParams['C6'] = { t: 's', v: 'Unit' };

        wsParams['A7'] = { t: 's', v: 'Number of Engineers' };
        wsParams['B7'] = { t: 'n', v: inputs.numEngineers };
        wsParams['C7'] = { t: 's', v: 'engineers' };

        wsParams['A8'] = { t: 's', v: 'Number of H100 GPUs' };
        wsParams['B8'] = { t: 'n', v: inputs.numGPUs };
        wsParams['C8'] = { t: 's', v: 'GPUs' };

        wsParams['A9'] = { t: 's', v: 'AI Efficiency Gain' };
        wsParams['B9'] = { t: 'n', v: inputs.aiEfficiencyGain };
        wsParams['C9'] = { t: 's', v: '%' };

        wsParams['A10'] = { t: 's', v: 'GPU Utilization' };
        wsParams['B10'] = { t: 'n', v: inputs.gpuUtilization };
        wsParams['C10'] = { t: 's', v: '%' };

        wsParams['A11'] = { t: 's', v: 'Bug Escape Probability' };
        wsParams['B11'] = { t: 'n', v: inputs.bugProbability };
        wsParams['C11'] = { t: 's', v: '%' };

        wsParams['A12'] = { t: 's', v: 'Bug Reduction with AI' };
        wsParams['B12'] = { t: 'n', v: inputs.bugReductionWithAI };
        wsParams['C12'] = { t: 's', v: '%' };

        // V4: API Inputs
        wsParams['A14'] = { t: 's', v: '=== API MODE INPUTS (V4) ===' };
        wsParams['A15'] = { t: 's', v: 'Compute Mode' };
        wsParams['B15'] = { t: 's', v: inputs.computeMode };

        wsParams['A16'] = { t: 's', v: 'Interactive Jobs/Day' };
        wsParams['B16'] = { t: 'n', v: inputs.interactiveJobsPerDay };
        wsParams['C16'] = { t: 's', v: 'jobs/day (×20d)' };

        wsParams['A17'] = { t: 's', v: 'Regression Runs/Night' };
        wsParams['B17'] = { t: 'n', v: inputs.regressionRunsPerNight };
        wsParams['C17'] = { t: 's', v: 'runs/night (×30d)' };

        wsParams['A18'] = { t: 's', v: 'Avg. Agent Retries' };
        wsParams['B18'] = { t: 'n', v: inputs.avgAgentRetries };
        wsParams['C18'] = { t: 's', v: 'retries (token multiplier)' };

        // Deployment
        wsParams['A20'] = { t: 's', v: '=== DEPLOYMENT ===' };
        wsParams['A21'] = { t: 's', v: 'Deployment Strategy' };
        wsParams['B21'] = { t: 's', v: inputs.deploymentStrategy };

        wsParams['A22'] = { t: 's', v: 'On-Prem Workload %' };
        wsParams['B22'] = { t: 'n', v: inputs.onPremPercent };
        wsParams['C22'] = { t: 's', v: '%' };

        wsParams['A23'] = { t: 's', v: 'Include Tax Depreciation' };
        wsParams['B23'] = { t: 's', v: inputs.includeTaxDepreciation ? 'Yes' : 'No' };

        // Advanced
        wsParams['A25'] = { t: 's', v: '=== ADVANCED ===' };
        wsParams['A26'] = { t: 's', v: 'Electricity Rate' };
        wsParams['B26'] = { t: 'n', v: inputs.electricityRate };
        wsParams['C26'] = { t: 's', v: '$/kWh' };

        wsParams['A27'] = { t: 's', v: 'IT Admin Overhead' };
        wsParams['B27'] = { t: 'n', v: inputs.adminOverhead };
        wsParams['C27'] = { t: 's', v: '%' };

        wsParams['A28'] = { t: 's', v: 'Storage Cost' };
        wsParams['B28'] = { t: 'n', v: inputs.storageCost };
        wsParams['C28'] = { t: 's', v: '$/mo' };

        wsParams['A29'] = { t: 's', v: 'Depreciation Period' };
        wsParams['B29'] = { t: 'n', v: inputs.depreciationMonths };
        wsParams['C29'] = { t: 's', v: 'months' };

        // Fixed Constants Reference
        wsParams['A31'] = { t: 's', v: '=== FIXED CONSTANTS (Reference) ===' };
        wsParams['A32'] = { t: 's', v: 'H100 GPU Rental' };
        wsParams['B32'] = { t: 'n', v: CONSTANTS.H100_GPU_RENTAL_HOURLY };
        wsParams['C32'] = { t: 's', v: '$/hour' };

        wsParams['A33'] = { t: 's', v: 'H100 GPU Purchase' };
        wsParams['B33'] = { t: 'n', v: CONSTANTS.H100_GPU_PURCHASE };
        wsParams['C33'] = { t: 's', v: '$' };

        wsParams['A34'] = { t: 's', v: 'Engineer Total Cost' };
        wsParams['B34'] = { t: 'n', v: CONSTANTS.ENGINEER_SALARY_YEARLY + CONSTANTS.EDA_LICENSE_YEARLY };
        wsParams['C34'] = { t: 's', v: '$/year (salary + EDA)' };

        wsParams['A35'] = { t: 's', v: 'Respin Cost' };
        wsParams['B35'] = { t: 'n', v: CONSTANTS.SILICON_RESPIN_COST };
        wsParams['C35'] = { t: 's', v: '$' };

        wsParams['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 25 }];
        wsParams['!ref'] = 'A1:C35';
        XLSX.utils.book_append_sheet(wb, wsParams, 'Parameters');

        // === Sheet 2: Summary Results (Snapshot) ===
        const wsSummary: XLSX.WorkSheet = {};

        wsSummary['A1'] = { t: 's', v: 'GenAI Verification ROI Calculator - Summary Results' };
        wsSummary['A2'] = { t: 's', v: 'Export Timestamp:' };
        wsSummary['B2'] = { t: 's', v: new Date().toLocaleString() };

        // KPIs
        wsSummary['A4'] = { t: 's', v: '=== KEY METRICS ===' };
        wsSummary['A5'] = { t: 's', v: 'Metric' };
        wsSummary['B5'] = { t: 's', v: 'Value' };

        wsSummary['A6'] = { t: 's', v: 'Net Annual Savings' };
        wsSummary['B6'] = { t: 'n', v: result.netSavingsYear };

        wsSummary['A7'] = { t: 's', v: 'ROI (%)' };
        wsSummary['B7'] = { t: 'n', v: result.roiPercent };

        wsSummary['A8'] = { t: 's', v: 'Break-Even Month' };
        wsSummary['B8'] = result.breakEvenMonth !== null
            ? { t: 'n', v: result.breakEvenMonth }
            : { t: 's', v: 'N/A (>12 months)' };

        wsSummary['A9'] = { t: 's', v: 'Total Annual GPU Cost' };
        wsSummary['B9'] = { t: 'n', v: result.totalGPUCost };

        wsSummary['A10'] = { t: 's', v: 'Total Annual Eng. Savings' };
        wsSummary['B10'] = { t: 'n', v: result.totalEngineerSavings };

        // Risk
        wsSummary['A12'] = { t: 's', v: '=== RISK ANALYSIS ===' };
        wsSummary['A13'] = { t: 's', v: 'Baseline Risk Value' };
        wsSummary['B13'] = { t: 'n', v: result.baselineRiskValue };

        wsSummary['A14'] = { t: 's', v: 'Risk Value with AI' };
        wsSummary['B14'] = { t: 'n', v: result.riskValueWithAI };

        wsSummary['A15'] = { t: 's', v: 'Risk Reduction' };
        wsSummary['B15'] = { t: 'n', v: result.riskReduction };

        // Monthly Costs
        wsSummary['A17'] = { t: 's', v: '=== MONTHLY COSTS ===' };
        wsSummary['A18'] = { t: 's', v: selectedMonthlyCostLabel };
        wsSummary['B18'] = { t: 'n', v: result.monthlyGPUCost };

        wsSummary['A19'] = { t: 's', v: 'Monthly Eng. Value Saved' };
        wsSummary['B19'] = { t: 'n', v: result.monthlyEngineerValueSaved };

        wsSummary['A20'] = { t: 's', v: 'Monthly OpEx Delta' };
        wsSummary['B20'] = { t: 'n', v: result.opExDelta };
        wsSummary['A21'] = { t: 's', v: 'Monthly Self-Hosted Baseline' };
        wsSummary['B21'] = { t: 'n', v: result.monthlySelfHostedCost };

        // API Comparison
        wsSummary['A23'] = { t: 's', v: '=== API vs GPU COMPARISON (V4) ===' };
        wsSummary['A24'] = { t: 's', v: 'API Cost per File' };
        wsSummary['B24'] = { t: 'n', v: result.apiCostPerFile };

        // Calculate granular costs for export
        const tokenMultiplier = 1 + inputs.avgAgentRetries;
        const baseCostPerFile = result.apiCostPerFile / tokenMultiplier;
        const retryOverheadPerFile = result.apiCostPerFile - baseCostPerFile;

        const interactiveVolume = inputs.interactiveJobsPerDay * inputs.numEngineers * CONSTANTS.WORKING_DAYS_PER_MONTH;
        const regressionVolume = inputs.regressionRunsPerNight * CONSTANTS.CALENDAR_DAYS_PER_MONTH;
        const totalVolume = interactiveVolume + regressionVolume;

        const interactiveCost = result.apiCostPerFile * interactiveVolume;
        const regressionCost = result.apiCostPerFile * regressionVolume;
        const totalRetryOverhead = retryOverheadPerFile * totalVolume;

        wsSummary['A25'] = { t: 's', v: 'Monthly API Bill' };
        wsSummary['B25'] = { t: 'n', v: result.monthlyAPIBill };

        // Granular Breakdown
        wsSummary['A26'] = { t: 's', v: '↳ Interactive Cost (OpEx)' };
        wsSummary['B26'] = { t: 'n', v: interactiveCost };

        wsSummary['A27'] = { t: 's', v: '↳ Regression Cost (Infra)' };
        wsSummary['B27'] = { t: 'n', v: regressionCost };

        wsSummary['A28'] = { t: 's', v: '↳ Retry Overhead (Waste)' };
        wsSummary['B28'] = { t: 'n', v: totalRetryOverhead };

        wsSummary['A30'] = { t: 's', v: 'Break-Even Volume (Blended)' };
        wsSummary['B30'] = { t: 'n', v: result.apiVsGPUCrossoverJobsPerDay };
        wsSummary['C30'] = { t: 's', v: 'jobs/day (assumes current mix)' };

        wsSummary['A31'] = { t: 's', v: 'Recommendation' };
        wsSummary['B31'] = { t: 's', v: result.isAPIRecommended ? 'Cloud API Recommended' : 'Self-Hosted GPU Recommended' };

        wsSummary['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 35 }];
        wsSummary['!ref'] = 'A1:C31';
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

        // === Sheet 3: Cash Flow (12-Month Projection) ===
        const cashFlowData = [
            ['Month', 'GPU Cost ($)', 'Eng. Baseline ($)', 'Eng. with AI ($)', 'Net Savings ($)', 'Cumulative ($)'],
            ...result.monthlyData.map((m: MonthlyData) => [
                m.month,
                Math.round(m.gpuCost),
                Math.round(m.engineerCostBaseline),
                Math.round(m.engineerCostWithAI),
                Math.round(m.netSavings),
                Math.round(m.cumulativeSavings),
            ]),
        ];

        const wsCashFlow = XLSX.utils.aoa_to_sheet(cashFlowData);
        wsCashFlow['!cols'] = [
            { wch: 8 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsCashFlow, 'Cash Flow');

        // Generate filename with date
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const filename = `ROI_Snapshot_${dateStr}.xlsx`;

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
            <span>Export Snapshot (.xlsx)</span>
        </button>
    );
}
