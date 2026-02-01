import { VaaSResult } from '../vaasConstants';
import { Clock, Zap, TrendingUp } from 'lucide-react';

interface TimelineComparisonProps {
    result: VaaSResult;
}

export function TimelineComparison({ result }: TimelineComparisonProps) {
    const traditionalMonths = result.traditionalDurationMonths;
    const vaasMonths = result.vaasDurationMonths;
    const monthsSaved = result.monthsSaved;

    // Calculate bar widths as percentages
    const traditionalWidth = 100;
    const vaasWidth = (vaasMonths / traditionalMonths) * 100;
    const opportunityWidth = traditionalWidth - vaasWidth;

    // Format months for display
    const formatMonths = (months: number) => {
        if (months === 1) return '1 month';
        return `${months.toFixed(1)} months`;
    };

    return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-200">
                    Timeline Comparison
                </h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 rounded-full">
                    <Zap size={14} className="text-violet-400" />
                    <span className="text-sm font-medium text-violet-400">
                        50% Faster
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Traditional Flow Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} />
                            <span>Traditional Flow</span>
                        </div>
                        <span className="text-slate-300 font-medium">
                            {formatMonths(traditionalMonths)}
                        </span>
                    </div>
                    <div className="relative h-12 bg-slate-700/50 rounded-lg overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center"
                            style={{ width: `${traditionalWidth}%` }}
                        >
                            <span className="text-sm font-medium text-slate-200">
                                Internal Team
                            </span>
                        </div>
                    </div>
                </div>

                {/* VaaS Flow Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Zap size={14} />
                            <span>Triple Crown Flow (VaaS)</span>
                        </div>
                        <span className="text-emerald-400 font-medium">
                            {formatMonths(vaasMonths)}
                        </span>
                    </div>
                    <div className="relative h-12 bg-slate-700/50 rounded-lg overflow-hidden">
                        {/* VaaS portion */}
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-l-lg flex items-center justify-center"
                            style={{ width: `${vaasWidth}%` }}
                        >
                            <span className="text-sm font-medium text-white">
                                VaaS
                            </span>
                        </div>
                        {/* Market Opportunity Window */}
                        <div
                            className="absolute inset-y-0 bg-gradient-to-r from-violet-500/30 to-violet-600/30 border-2 border-dashed border-violet-500 rounded-r-lg flex items-center justify-center"
                            style={{
                                left: `${vaasWidth}%`,
                                width: `${opportunityWidth}%`
                            }}
                        >
                            <span className="text-xs font-medium text-violet-300 px-2 text-center">
                                Market Opportunity
                            </span>
                        </div>
                    </div>
                </div>

                {/* Time Axis */}
                <div className="relative h-6">
                    <div className="absolute inset-x-0 top-0 border-t border-slate-600" />
                    <div className="flex justify-between text-xs text-slate-500 pt-2">
                        <span>Start</span>
                        <span style={{ position: 'absolute', left: `${vaasWidth}%`, transform: 'translateX(-50%)' }}>
                            VaaS Done
                        </span>
                        <span>Traditional Done</span>
                    </div>
                </div>
            </div>

            {/* Market Opportunity Callout */}
            <div className="mt-6 p-4 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-violet-500/30 rounded-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200">
                            Market Opportunity Window
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                            Extra time in market while competitors are still verifying
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-violet-400">
                            {formatMonths(monthsSaved)}
                        </div>
                        <div className="text-xs text-slate-500">head start</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
