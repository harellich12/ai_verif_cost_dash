import { VaaSResult } from '../vaasConstants';

interface VaaSKPICardsProps {
    result: VaaSResult;
    viewMode?: 'admin' | 'presentation' | 'sales';
}

export function VaaSKPICards({ result, viewMode = 'admin' }: VaaSKPICardsProps) {
    const isSales = viewMode === 'sales';

    if (isSales) {
        const traditionalTotalMonths = result.traditionalDurationMonths + (result.internalStartOffset || 0);
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                    <div className="text-sm text-stone-400">External Cost / Block</div>
                    <div className="text-2xl font-bold text-amber-400">
                        ${(result.salesExternalCostPerBlock / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-stone-500 mt-1">Traditional verification cost basis</div>
                </div>
                <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                    <div className="text-sm text-stone-400">Traditional Duration</div>
                    <div className="text-2xl font-bold text-amber-400">{traditionalTotalMonths.toFixed(1)} mo</div>
                    <div className="text-xs text-stone-500 mt-1">Includes hiring lag + execution</div>
                </div>
                <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                    <div className="text-sm text-stone-400">Active Verification Cost</div>
                    <div className="text-2xl font-bold text-amber-400">
                        ${(result.salesActiveCostPerBlock / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-stone-500 mt-1">Execution + effective delay cost</div>
                </div>
                <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                    <div className="text-sm text-stone-400">Idle Time Cost</div>
                    <div className="text-2xl font-bold text-amber-400">
                        ${(result.salesIdleCostPerBlock / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-stone-500 mt-1">Salary waste during blocked/wait time</div>
                </div>
                <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                    <div className="text-sm text-stone-400">Delay Cost</div>
                    <div className="text-2xl font-bold text-amber-400">
                        ${(result.salesDelayCostPerBlock / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-stone-500 mt-1">Cost of RTL delay where applicable</div>
                </div>
                <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                    <div className="text-sm text-stone-400">External Cost / Year</div>
                    <div className="text-2xl font-bold text-amber-400">
                        ${(result.salesExternalCostAnnual / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-stone-500 mt-1">Annualized by block count</div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                <div className="text-sm text-stone-400">Net Benefit / Block</div>
                <div className={`text-2xl font-bold ${result.netBenefitPerBlock >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                    ${(result.netBenefitPerBlock / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-stone-500 mt-1">
                    Includes quote + optional business upside
                </div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                <div className="text-sm text-stone-400">Months Saved</div>
                <div className="text-2xl font-bold text-amber-400">
                    {result.monthsSaved.toFixed(1)} mo
                </div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm text-stone-400">Capacity Unlocked</div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">FTE</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">
                    {result.fteMonthsSaved.toFixed(1)} mo
                </div>
                <div className="text-xs text-stone-500 mt-1">
                    Engineering time returned to backlog
                </div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                <div className="text-sm text-stone-400">Cash Burn Prevented</div>
                <div className="text-2xl font-bold text-red-400">
                    ${(result.totalCashBurnPrevented / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-stone-500 mt-1">
                    Avoided Delay + Idle Waste
                </div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                <div className="text-sm text-stone-400">Business Upside / Block</div>
                <div className="text-2xl font-bold text-amber-400">
                    ${(result.businessUpsidePerBlock / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-stone-500 mt-1">
                    Time-to-market benefit (optional)
                </div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                <div className="text-sm text-stone-400">Client Review Cost / Block</div>
                <div className="text-2xl font-bold text-yellow-400">
                    ${(result.clientReviewCostPerBlock / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-stone-500 mt-1">
                    Client-side HITL oversight effort
                </div>
            </div>
        </div>
    );
}
