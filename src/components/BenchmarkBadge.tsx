import { useState } from 'react';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

interface BenchmarkBadgeProps {
    annualBlockCount: number;
    parallelBlocks?: number;
}

export function BenchmarkBadge({ annualBlockCount, parallelBlocks = 1 }: BenchmarkBadgeProps) {
    const [daysSaved, setDaysSaved] = useState<number>(5);

    // Extrapolate to annual efficiency
    // daysSaved per block × blocks per year × 8 hours per day = annual hours saved
    const annualDaysSaved = (daysSaved * annualBlockCount) / Math.max(1, parallelBlocks);
    const annualHoursSaved = annualDaysSaved * 8;

    // Convert to engineer-months (~160 hours per month)
    const engineerMonthsSaved = annualHoursSaved / 160;
    const formatOneDecimal = (value: number) => (Math.round(value * 10) / 10).toFixed(1);

    return (
        <div className="bg-gradient-to-br from-violet-500/10 to-emerald-500/10 rounded-xl p-4 border border-violet-500/30">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-violet-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">
                    Projected Annual Efficiency
                </h3>
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={14} />
                    <span>Days Saved per Block:</span>
                </div>
                <input
                    type="number"
                    min={1}
                    max={30}
                    value={daysSaved}
                    onChange={(e) => setDaysSaved(Math.max(1, Math.min(30, Number(e.target.value))))}
                    className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-center text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-xs text-slate-500">× {annualBlockCount} blocks/yr ÷ {parallelBlocks} parallel</span>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-lg font-bold text-violet-400">
                        {formatOneDecimal(annualDaysSaved)}
                    </div>
                    <div className="text-xs text-slate-500">Days/Year</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-lg font-bold text-emerald-400">
                        {formatOneDecimal(annualHoursSaved)}
                    </div>
                    <div className="text-xs text-slate-500">Hours/Year</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-lg font-bold text-amber-400">
                        {formatOneDecimal(engineerMonthsSaved)}
                    </div>
                    <div className="text-xs text-slate-500">Eng-Months</div>
                </div>
            </div>

            {/* Efficiency Badge */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-violet-300">
                <Zap size={12} />
                <span>
                    Equivalent to {formatOneDecimal(engineerMonthsSaved)} engineer-months of capacity annually
                </span>
            </div>
        </div>
    );
}
