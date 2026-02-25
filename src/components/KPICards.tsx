import { CalculationResult, CalculatorInputs } from '../constants';
import { formatCurrency, formatPercent } from '../utils/format';
import { TrendingUp, TrendingDown, Target, ShieldCheck, DollarSign, Calendar, ArrowLeftRight } from 'lucide-react';

interface KPICardsProps {
    result: CalculationResult;
    inputs: CalculatorInputs;
}

export function KPICards({ result, inputs }: KPICardsProps) {
    const isPositiveROI = result.netSavingsYear > 0;
    const hasBreakEven = result.breakEvenMonth !== null;
    const selectedCostLabel = inputs.computeMode === 'cloud-api' ? 'API Cost' : 'GPU Cost';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Net Annual Savings */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        {isPositiveROI ? (
                            <TrendingUp className="w-5 h-5 text-success" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-danger" />
                        )}
                        <span className="text-sm font-medium text-stone-400">Net Annual Savings</span>
                    </div>
                    <div className={`text-3xl font-bold ${isPositiveROI ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(result.netSavingsYear, true)}
                    </div>
                    <div className="text-sm text-stone-500 mt-1">
                        {isPositiveROI ? 'Cost savings over 12 months' : 'Additional cost over 12 months'}
                    </div>
                </div>
            </div>

            {/* ROI Percentage */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-stone-400">Return on Investment</span>
                    </div>
                    <div className="kpi-value">
                        {formatPercent(result.roiPercent)}
                    </div>
                    <div className="text-sm text-stone-500 mt-1">
                        Annual return on GPU investment
                    </div>
                </div>
            </div>

            {/* Break-Even Month */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-warning" />
                        <span className="text-sm font-medium text-stone-400">Break-Even Point</span>
                    </div>
                    <div className={`text-3xl font-bold ${hasBreakEven ? 'text-warning' : 'text-stone-500'}`}>
                        {hasBreakEven ? `Month ${result.breakEvenMonth}` : 'N/A'}
                    </div>
                    <div className="text-sm text-stone-500 mt-1">
                        {hasBreakEven ? 'When cumulative savings exceed costs' : 'No break-even within 12 months'}
                    </div>
                </div>
            </div>

            {/* Risk Reduction */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-stone-400">Risk Reduction Value</span>
                    </div>
                    <div className="text-3xl font-bold text-amber-400">
                        {formatCurrency(result.riskReduction, true)}
                    </div>
                    <div className="text-sm text-stone-500 mt-1">
                        Expected respin cost avoided
                    </div>
                </div>
            </div>

            {/* Monthly OpEx Delta */}
            <div className="kpi-card group col-span-1 md:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-500/10 to-stone-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-medium text-stone-400">Monthly OpEx Comparison</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <div className="text-lg font-semibold text-stone-300">
                                {formatCurrency(result.monthlyGPUCost, true)}
                            </div>
                            <div className="text-xs text-stone-500">{selectedCostLabel}</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-success">
                                {formatCurrency(result.monthlyEngineerValueSaved, true)}
                            </div>
                            <div className="text-xs text-stone-500">Eng. Value Saved</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-amber-400">
                                {formatCurrency(result.monthlyHumanReviewCost, true)}
                            </div>
                            <div className="text-xs text-stone-500">Human Review Cost</div>
                        </div>
                        <div>
                            <div className={`text-lg font-semibold ${result.opExDelta < 0 ? 'text-success' : 'text-danger'}`}>
                                {result.opExDelta < 0 ? '-' : '+'}{formatCurrency(Math.abs(result.opExDelta), true)}
                            </div>
                            <div className="text-xs text-stone-500">Net Delta</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Investment */}
            <div className="kpi-card group col-span-1 md:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-stone-400">Annual Investment Summary</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-lg font-semibold text-stone-300">
                                {formatCurrency(result.totalGPUCost, true)}
                            </div>
                            <div className="text-xs text-stone-500">Total AI Compute Cost</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-success">
                                {formatCurrency(result.totalEngineerSavings, true)}
                            </div>
                            <div className="text-xs text-stone-500">Total Engineering Savings</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-amber-400">
                                {formatCurrency(result.annualHumanReviewCost, true)}
                            </div>
                            <div className="text-xs text-stone-500">Annual Human Review Cost</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* V3: API vs GPU Cost Comparison */}
            <div className="kpi-card group col-span-1 md:col-span-2 lg:col-span-4">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <ArrowLeftRight className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-medium text-stone-400">Compute Path Comparison</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${result.isAPIRecommended
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-amber-500/20 text-amber-400'
                            }`}>
                            {result.isAPIRecommended ? '☁️ API Recommended' : '⚡ GPU Recommended'}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <div className="text-lg font-semibold text-amber-400">
                                {formatCurrency(result.monthlyAPIBill, true)}
                            </div>
                            <div className="text-xs text-stone-500">Monthly API Cost</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-stone-300">
                                {formatCurrency(result.monthlySelfHostedCost, true)}
                            </div>
                            <div className="text-xs text-stone-500">Monthly Self-Hosted Cost</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-amber-400">
                                {result.apiVsGPUCrossoverJobsPerDay > 0
                                    ? `${result.apiVsGPUCrossoverJobsPerDay.toFixed(1)} /day`
                                    : 'N/A (< 0)'}
                            </div>
                            <div className="text-xs text-stone-500">Break-Even Interactive</div>
                        </div>
                        <div>
                            <div className={`text-lg font-semibold ${result.isAPIRecommended ? 'text-amber-400' : 'text-amber-400'}`}>
                                {formatCurrency(Math.abs(result.monthlyAPIBill - result.monthlySelfHostedCost), true)}/mo
                            </div>
                            <div className="text-xs text-stone-500">
                                {result.isAPIRecommended ? 'API saves' : 'GPU saves'}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-stone-700/50 text-xs text-stone-500">
                        {result.isAPIRecommended
                            ? `Start with Cloud API. It's cheaper until you exceed ${result.apiVsGPUCrossoverJobsPerDay.toFixed(1)} interactive jobs/day per engineer.`
                            : result.apiVsGPUCrossoverJobsPerDay < 0
                                ? `Switch to Self-Hosted GPU. Your regression volume alone costs more than the self-hosted baseline.`
                                : `Switch to Self-Hosted GPU. At your volume, you're saving ${formatCurrency(result.monthlySelfHostedCost - result.monthlyAPIBill, true)}/mo vs API.`
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
