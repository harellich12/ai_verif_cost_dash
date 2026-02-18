import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from 'recharts';
import { VaaSResult } from '../vaasConstants';

interface IdleCostChartProps {
    result: VaaSResult;
}

// Format currency for display
function formatCurrency(value: number): string {
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
}

export function IdleCostChart({ result }: IdleCostChartProps) {
    // Calculate cost breakdown
    const internalActiveCost = result.internalTeamCost;
    const internalIdleCost = result.idleCashSaved;
    const vaasCost = result.vaasCost + result.clientReviewCostPerBlock;

    // Data for stacked bar chart
    const data = [
        {
            name: 'Internal Team',
            activeCost: internalActiveCost,
            idleCost: internalIdleCost,
            total: result.internalTeamCost + result.idleCashSaved,
        },
        {
            name: 'VaaS',
            activeCost: vaasCost,
            idleCost: 0,
            total: vaasCost,
        },
    ];

    const maxCost = Math.max(result.internalTeamCost + result.idleCashSaved, vaasCost);
    const idleTaxSavings = internalIdleCost;

    return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200">
                    Cost Utilization Comparison
                </h3>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span className="text-slate-400">Active Cost</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-red-500/60" />
                        <span className="text-slate-400">Idle Cost</span>
                    </div>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
                    >
                        <XAxis
                            type="number"
                            domain={[0, maxCost * 1.1]}
                            tickFormatter={(value) => formatCurrency(value)}
                            stroke="#64748b"
                            fontSize={12}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#64748b"
                            fontSize={12}
                            width={100}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                formatCurrency(value),
                                name === 'activeCost' ? 'Active Cost' : 'Idle Cost',
                            ]}
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#f1f5f9' }}
                            cursor={{ fill: '#334155', opacity: 0.2 }}
                        />
                        <Bar
                            dataKey="activeCost"
                            stackId="a"
                            fill="#10b981"
                            radius={[0, 0, 0, 0]}
                        >
                            {data.map((_entry, index) => (
                                <Cell
                                    key={`active-${index}`}
                                    fill={index === 0 ? '#10b981' : '#8b5cf6'}
                                />
                            ))}
                        </Bar>
                        <Bar
                            dataKey="idleCost"
                            stackId="a"
                            fill="#ef4444"
                            radius={[0, 4, 4, 0]}
                        >
                            <LabelList
                                dataKey="idleCost"
                                position="right"
                                formatter={(value: number) =>
                                    value > 0 ? `Idle: ${formatCurrency(value)}` : ''
                                }
                                fill="#f87171"
                                fontSize={11}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Idle Tax Avoidance Callout */}
            <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-red-400">
                            Idle Tax Avoidance
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                            Salary cost during wait/blocked time eliminated with VaaS
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-red-400">
                        {formatCurrency(idleTaxSavings)}
                    </div>
                </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
                VaaS bar includes client-side human review cost.
            </div>
        </div>
    );
}
