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
    viewMode?: 'admin' | 'presentation' | 'sales';
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

export function IdleCostChart({ result, viewMode = 'admin' }: IdleCostChartProps) {
    const isSales = viewMode === 'sales';
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
        ...(isSales
            ? []
            : [{
                name: 'VaaS',
                activeCost: vaasCost,
                idleCost: 0,
                total: vaasCost,
            }]),
    ];

    const maxCost = Math.max(result.internalTeamCost + result.idleCashSaved, vaasCost);
    const idleTaxSavings = internalIdleCost;

    return (
        <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-200">
                    {isSales ? 'External Cost Breakdown' : 'Cost Utilization Comparison'}
                </h3>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-amber-500" />
                        <span className="text-stone-400">Active Cost</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-amber-700/70" />
                        <span className="text-stone-400">Idle Cost</span>
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
                            stroke="#bfa06a"
                            fontSize={12}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#bfa06a"
                            fontSize={12}
                            width={100}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                formatCurrency(value),
                                name === 'activeCost' ? 'Active Cost' : 'Idle Cost',
                            ]}
                            contentStyle={{
                                backgroundColor: '#11100d',
                                border: '1px solid #4b3f2a',
                                borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#f8e7bf' }}
                            cursor={{ fill: '#3a3122', opacity: 0.2 }}
                        />
                        <Bar
                            dataKey="activeCost"
                            stackId="a"
                            fill="#d4a93a"
                            radius={[0, 0, 0, 0]}
                        >
                            {data.map((_entry, index) => (
                                <Cell
                                    key={`active-${index}`}
                                    fill={index === 0 ? '#d4a93a' : '#f59e0b'}
                                />
                            ))}
                        </Bar>
                        <Bar
                            dataKey="idleCost"
                            stackId="a"
                            fill="#9a6a1f"
                            radius={[0, 4, 4, 0]}
                        >
                            <LabelList
                                dataKey="idleCost"
                                position="right"
                                formatter={(value: number) =>
                                    value > 0 ? `Idle: ${formatCurrency(value)}` : ''
                                }
                                fill="#eab308"
                                fontSize={11}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Idle Time Cost Callout */}
            <div className="mt-4 p-3 bg-gradient-to-r from-amber-700/20 to-transparent border-l-4 border-amber-500 rounded-r-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-amber-400">
                            Idle Time Cost
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                            {isSales
                                ? 'Salary cost during wait/blocked time in the current verification flow'
                                : 'Salary cost during wait/blocked time eliminated with VaaS'}
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">
                        {formatCurrency(idleTaxSavings)}
                    </div>
                </div>
            </div>
            {!isSales && (
                <div className="mt-2 text-xs text-stone-500">
                    VaaS bar includes client-side human review cost.
                </div>
            )}
        </div>
    );
}
