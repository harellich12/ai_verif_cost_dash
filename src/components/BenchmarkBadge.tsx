import { useState } from 'react';
import { TrendingUp, Calendar, Zap } from 'lucide-react';
import { VaaSResult } from '../vaasConstants';

interface BenchmarkBadgeProps {
    annualBlockCount: number;
    parallelBlocks?: number;
    result: VaaSResult;
    viewMode?: 'admin' | 'presentation' | 'sales';
}

export function BenchmarkBadge({
    annualBlockCount,
    parallelBlocks = 1,
    result,
    viewMode = 'admin',
}: BenchmarkBadgeProps) {
    const isSales = viewMode === 'sales';
    const [daysSaved, setDaysSaved] = useState<number>(5);

    // Extrapolate to annual efficiency
    // daysSaved per block × blocks per year × 8 hours per day = annual hours saved
    const annualDaysSaved = (daysSaved * annualBlockCount) / Math.max(1, parallelBlocks);
    const externalDurationMonths = result.traditionalDurationMonths + (result.internalStartOffset || 0);
    const annualExternalDaysLoad = (externalDurationMonths * 30 * annualBlockCount) / Math.max(1, parallelBlocks);
    const annualHoursSaved = annualDaysSaved * 8;
    const annualExternalHours = annualExternalDaysLoad * 8;

    // Convert to engineer-months (~160 hours per month)
    const engineerMonthsSaved = annualHoursSaved / 160;
    const formatOneDecimal = (value: number) => (Math.round(value * 10) / 10).toFixed(1);

    return (
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/10 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-amber-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-stone-200">
                    {isSales ? 'Annual Verification Workload' : 'Projected Annual Efficiency'}
                </h3>
            </div>

            {/* Input Row */}
            {!isSales && (
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Calendar size={14} />
                        <span>Days Saved per Block:</span>
                    </div>
                    <input
                        type="number"
                        min={1}
                        max={30}
                        value={daysSaved}
                        onChange={(e) => setDaysSaved(Math.max(1, Math.min(30, Number(e.target.value))))}
                        className="w-16 bg-stone-800 border border-stone-700 rounded-lg px-2 py-1 text-sm text-center text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-xs text-stone-500">× {annualBlockCount} blocks/yr ÷ {parallelBlocks} parallel</span>
                </div>
            )}

            {/* Results */}
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-stone-800/50 rounded-lg">
                    <div className="text-lg font-bold text-amber-400">
                        {formatOneDecimal(isSales ? annualExternalDaysLoad : annualDaysSaved)}
                    </div>
                    <div className="text-xs text-stone-500">Days/Year</div>
                </div>
                <div className="text-center p-2 bg-stone-800/50 rounded-lg">
                    <div className="text-lg font-bold text-amber-400">
                        {formatOneDecimal(isSales ? annualExternalHours : annualHoursSaved)}
                    </div>
                    <div className="text-xs text-stone-500">Hours/Year</div>
                </div>
                <div className="text-center p-2 bg-stone-800/50 rounded-lg">
                    <div className="text-lg font-bold text-amber-400">
                        {formatOneDecimal(isSales ? annualExternalHours / 160 : engineerMonthsSaved)}
                    </div>
                    <div className="text-xs text-stone-500">Eng-Months</div>
                </div>
            </div>

            {/* Efficiency Badge */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-300">
                <Zap size={12} />
                <span>
                    {isSales
                        ? `Equivalent to ${formatOneDecimal(annualExternalHours / 160)} engineer-months of external verification load annually`
                        : `Equivalent to ${formatOneDecimal(engineerMonthsSaved)} engineer-months of capacity annually`}
                </span>
            </div>
        </div>
    );
}
