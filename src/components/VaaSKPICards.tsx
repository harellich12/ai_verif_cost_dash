import { VaaSResult } from '../vaasConstants';

interface VaaSKPICardsProps {
    result: VaaSResult;
}

export function VaaSKPICards({ result }: VaaSKPICardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400">Net Benefit / Block</div>
                <div className={`text-2xl font-bold ${result.netBenefitPerBlock >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${(result.netBenefitPerBlock / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    Includes quote + optional business upside
                </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400">Months Saved</div>
                <div className="text-2xl font-bold text-violet-400">
                    {result.monthsSaved.toFixed(1)} mo
                </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm text-slate-400">Capacity Unlocked</div>
                    <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded">FTE</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                    {result.fteMonthsSaved.toFixed(1)} mo
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    Engineering time returned to backlog
                </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400">Cash Burn Prevented</div>
                <div className="text-2xl font-bold text-red-400">
                    ${(result.totalCashBurnPrevented / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    Avoided Delay + Idle Waste
                </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400">Business Upside / Block</div>
                <div className="text-2xl font-bold text-amber-400">
                    ${(result.businessUpsidePerBlock / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    Time-to-market benefit (optional)
                </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400">Client Review Cost / Block</div>
                <div className="text-2xl font-bold text-cyan-400">
                    ${(result.clientReviewCostPerBlock / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    Client-side HITL oversight effort
                </div>
            </div>
        </div>
    );
}
