import { CalculationResult } from '../constants';
import { formatCurrency, formatPercent } from '../utils/format';
import { TrendingUp, TrendingDown, Target, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

interface KPICardsProps {
    result: CalculationResult;
}

export function KPICards({ result }: KPICardsProps) {
    const isPositiveROI = result.netSavingsYear > 0;
    const hasBreakEven = result.breakEvenMonth !== null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Net Annual Savings */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        {isPositiveROI ? (
                            <TrendingUp className="w-5 h-5 text-success" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-danger" />
                        )}
                        <span className="text-sm font-medium text-slate-400">Net Annual Savings</span>
                    </div>
                    <div className={`text-3xl font-bold ${isPositiveROI ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(result.netSavingsYear, true)}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                        {isPositiveROI ? 'Cost savings over 12 months' : 'Additional cost over 12 months'}
                    </div>
                </div>
            </div>

            {/* ROI Percentage */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium text-slate-400">Return on Investment</span>
                    </div>
                    <div className="kpi-value">
                        {formatPercent(result.roiPercent)}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                        Annual return on GPU investment
                    </div>
                </div>
            </div>

            {/* Break-Even Month */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-warning" />
                        <span className="text-sm font-medium text-slate-400">Break-Even Point</span>
                    </div>
                    <div className={`text-3xl font-bold ${hasBreakEven ? 'text-warning' : 'text-slate-500'}`}>
                        {hasBreakEven ? `Month ${result.breakEvenMonth}` : 'N/A'}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                        {hasBreakEven ? 'When cumulative savings exceed costs' : 'No break-even within 12 months'}
                    </div>
                </div>
            </div>

            {/* Risk Reduction */}
            <div className="kpi-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-slate-400">Risk Reduction Value</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-400">
                        {formatCurrency(result.riskReduction, true)}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                        Expected respin cost avoided
                    </div>
                </div>
            </div>

            {/* Monthly OpEx Delta */}
            <div className="kpi-card group col-span-1 md:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-zinc-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm font-medium text-slate-400">Monthly OpEx Comparison</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-lg font-semibold text-slate-300">
                                {formatCurrency(result.monthlyGPUCost, true)}
                            </div>
                            <div className="text-xs text-slate-500">GPU Cost</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-success">
                                {formatCurrency(result.monthlyEngineerValueSaved, true)}
                            </div>
                            <div className="text-xs text-slate-500">Eng. Value Saved</div>
                        </div>
                        <div>
                            <div className={`text-lg font-semibold ${result.opExDelta < 0 ? 'text-success' : 'text-danger'}`}>
                                {result.opExDelta < 0 ? '-' : '+'}{formatCurrency(Math.abs(result.opExDelta), true)}
                            </div>
                            <div className="text-xs text-slate-500">Net Delta</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Investment */}
            <div className="kpi-card group col-span-1 md:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-400">Annual Investment Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-lg font-semibold text-slate-300">
                                {formatCurrency(result.totalGPUCost, true)}
                            </div>
                            <div className="text-xs text-slate-500">Total GPU Investment</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-success">
                                {formatCurrency(result.totalEngineerSavings, true)}
                            </div>
                            <div className="text-xs text-slate-500">Total Engineering Savings</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
