import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { CalculationResult } from '../constants';
import { formatCurrency } from '../utils/format';

interface ResultChartProps {
    result: CalculationResult;
}

export function ResultChart({ result }: ResultChartProps) {
    const data = result.monthlyData.map((row) => ({
        name: `M${row.month}`,
        month: row.month,
        'Cumulative GPU Cost': row.cumulativeGPUCost,
        'Cumulative Savings': row.cumulativeSavings,
        'Net Monthly Savings': row.netSavings,
    }));

    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">12-Month Cash Flow Projection</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => formatCurrency(value, true)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                            }}
                            labelStyle={{ color: '#f1f5f9' }}
                            formatter={(value: number) => [formatCurrency(value), '']}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                        />
                        <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />

                        {/* Break-even reference line */}
                        {result.breakEvenMonth && (
                            <ReferenceLine
                                x={`M${result.breakEvenMonth}`}
                                stroke="#f59e0b"
                                strokeDasharray="5 5"
                                label={{
                                    value: 'Break-Even',
                                    position: 'top',
                                    fill: '#f59e0b',
                                    fontSize: 12,
                                }}
                            />
                        )}

                        <Line
                            type="monotone"
                            dataKey="Cumulative GPU Cost"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: '#ef4444' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Cumulative Savings"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: '#22c55e' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
