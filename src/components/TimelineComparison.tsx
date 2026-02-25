import { VaaSResult } from '../vaasConstants';
import { Clock, Zap, TrendingUp, UserPlus } from 'lucide-react';

interface TimelineComparisonProps {
    result: VaaSResult;
    viewMode?: 'admin' | 'presentation' | 'sales';
}

export function TimelineComparison({ result, viewMode = 'admin' }: TimelineComparisonProps) {
    const isSales = viewMode === 'sales';
    const traditionalMonths = result.traditionalDurationMonths;
    const vaasMonths = result.vaasDurationMonths;
    const monthsSaved = result.monthsSaved;
    const offsetMonths = result.internalStartOffset || 0;

    // Total timeline width is determined by the longer path (Internal + Lag vs VaaS)
    // Theoretically VaaS could be longer if user inputs weird benchmark data, but usually Internal is longer.
    const internalTotalMonths = offsetMonths + traditionalMonths;
    const maxMonths = Math.max(internalTotalMonths, vaasMonths);

    // Calculate bar widths and positions as percentages of the max duration
    const getPercent = (months: number) => (months / maxMonths) * 100;

    const offsetWidth = getPercent(offsetMonths);
    const traditionalWidth = getPercent(traditionalMonths);
    const vaasWidth = getPercent(vaasMonths);

    // Opportunity window is the gap between VaaS Finish and Internal Finish
    // Internal Finish = offsetWidth + traditionalWidth
    // Gap starts at VaaS Finish (vaasWidth)
    // Width = Internal Finish - VaaS Finish
    const internalFinishPercent = offsetWidth + traditionalWidth;
    const opportunityWidth = internalFinishPercent - vaasWidth;

    // Format months for display
    const formatMonths = (months: number) => {
        if (months === 1) return '1 month';
        return `${months.toFixed(1)} months`;
    };

    if (isSales) {
        return (
            <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700/50">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-stone-200">Traditional Timeline</h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full">
                        <Clock size={14} className="text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">
                            {formatMonths(internalTotalMonths)} total
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-stone-400">
                            <Clock size={14} />
                            <span>Current Verification Flow</span>
                        </div>
                        <span className="text-stone-300 font-medium">{formatMonths(internalTotalMonths)}</span>
                    </div>

                    <div className="relative h-12 bg-stone-700/50 rounded-lg overflow-hidden flex">
                        {offsetWidth > 0 && (
                            <div
                                className="h-full border-r-2 border-dashed border-stone-600 bg-stone-800/50 flex items-center justify-center"
                                style={{ width: `${offsetWidth}%` }}
                            >
                                <span className="text-[10px] text-stone-500 px-1">Recruiting</span>
                            </div>
                        )}
                        <div
                            className="h-full bg-gradient-to-r from-amber-700 to-amber-600 flex items-center justify-center"
                            style={{ width: `${traditionalWidth}%` }}
                        >
                            <span className="text-sm font-medium text-amber-100 px-2">Internal Team</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-stone-500 px-1">
                        <span style={{ width: `${Math.max(offsetWidth, 20)}%` }} className="text-left">
                            Hiring Lag ({offsetMonths.toFixed(1)}mo)
                        </span>
                        <span className="flex-1 text-right">Execution ({traditionalMonths.toFixed(1)}mo)</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700/50">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-stone-200">
                    Timeline Comparison
                </h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full">
                    <Zap size={14} className="text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">
                        {result.provenSpeedupRatio
                            ? `${((1 - result.provenSpeedupRatio) * 100).toFixed(0)}% Faster (Proven)`
                            : '50% Faster'}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Traditional Flow Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-stone-400">
                            <Clock size={14} />
                            <span>Traditional Flow</span>
                        </div>
                        <span className="text-stone-300 font-medium">
                            {formatMonths(internalTotalMonths)} total
                        </span>
                    </div>
                    <div className="relative h-12 bg-stone-700/50 rounded-lg overflow-hidden flex">
                        {/* Hiring Lag / Ghost Bar */}
                        {offsetWidth > 0 && (
                            <div
                                className="h-full border-r-2 border-dashed border-stone-600 bg-stone-800/50 flex items-center justify-center relative group"
                                style={{ width: `${offsetWidth}%` }}
                            >
                                <UserPlus size={14} className="text-stone-500" />
                                {/* Tooltip for valid width */}
                                {offsetWidth > 10 && (
                                    <span className="text-[10px] text-stone-500 ml-1 font-medium whitespace-nowrap overflow-hidden text-ellipsis px-1">
                                        Recruiting
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Traditional Execution Bar */}
                        <div
                            className="h-full bg-gradient-to-r from-stone-600 to-stone-500 flex items-center justify-center"
                            style={{ width: `${traditionalWidth}%` }}
                        >
                            <span className="text-sm font-medium text-stone-200 whitespace-nowrap overflow-hidden text-ellipsis px-2">
                                Internal Team
                            </span>
                        </div>
                    </div>
                    {/* Tick for hiring lag */}
                    {offsetWidth > 0 && (
                        <div className="flex justify-between text-[10px] text-stone-500 px-1">
                            <span style={{ width: `${offsetWidth}%` }} className="text-center">Hiring Lag ({offsetMonths}mo)</span>
                            <span className="flex-1 text-center">Execution ({traditionalMonths}mo)</span>
                        </div>
                    )}
                </div>

                {/* VaaS Flow Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            {result.isBenchmarkMode ? (
                                <div className="flex items-center gap-2 text-amber-400">
                                    <Zap size={14} fill="currentColor" />
                                    <span className="font-bold">Triple Crown Flow (VaaS)</span>
                                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase tracking-widest">
                                        Verified
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-amber-400">
                                    <Zap size={14} />
                                    <span>Triple Crown Flow (VaaS)</span>
                                </div>
                            )}
                        </div>
                        <span className={result.isBenchmarkMode ? "text-amber-400 font-bold" : "text-amber-400 font-medium"}>
                            {formatMonths(vaasMonths)}
                        </span>
                    </div>
                    <div className="relative h-12 bg-stone-700/50 rounded-lg overflow-hidden">
                        {/* VaaS portion */}
                        <div
                            className={`absolute inset-y-0 left-0 rounded-l-lg flex items-center justify-center transition-all duration-500 ${result.isBenchmarkMode
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                    : 'bg-gradient-to-r from-amber-600 to-amber-500'
                                }`}
                            style={{ width: `${vaasWidth}%` }}
                        >
                            <span className={`text-sm font-medium ${result.isBenchmarkMode ? 'text-stone-900 font-bold' : 'text-white'}`}>
                                VaaS
                            </span>
                        </div>

                        {/* Market Opportunity Window */}
                        {opportunityWidth > 0 && (
                            <div
                                className="absolute inset-y-0 bg-gradient-to-r from-amber-500/30 to-amber-600/30 border-2 border-dashed border-amber-500 rounded-r-lg flex items-center justify-center"
                                style={{
                                    left: `${vaasWidth}%`,
                                    width: `${opportunityWidth}%`
                                }}
                            >
                                <span className="text-xs font-medium text-amber-300 px-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                                    Market Opportunity
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Time Axis */}
                <div className="relative h-6 mt-2">
                    <div className="absolute inset-x-0 top-0 border-t border-stone-600" />
                    <div className="flex text-xs text-stone-500 pt-2 relative h-full">
                        <span className="absolute left-0">Start</span>

                        {/* VaaS Finish Tick */}
                        <div className="absolute flex flex-col items-center" style={{ left: `${vaasWidth}%`, transform: 'translateX(-50%)' }}>
                            <div className="h-1.5 w-px bg-stone-600 mb-1"></div>
                            <span>VaaS Done</span>
                        </div>

                        {/* Traditional Finish Tick */}
                        <span className="absolute right-0">Traditional Done</span>
                    </div>
                </div>
            </div>

            {/* Market Opportunity Callout */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-stone-200">
                            Market Opportunity Window
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                            Extra time in market while competitors are still {offsetMonths > 0 ? 'hiring or ' : ''}verifying
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-amber-400">
                            {formatMonths(monthsSaved)}
                        </div>
                        <div className="text-xs text-stone-500">head start</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
