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
import { CalculationResult, CalculatorInputs } from '../constants';
import { formatCurrency } from '../utils/format';

interface ResultChartProps {
    result: CalculationResult;
    inputs: CalculatorInputs;
}

export function ResultChart({ result, inputs }: ResultChartProps) {
    const costSeriesLabel = inputs.computeMode === 'cloud-api'
        ? 'Cumulative API Cost'
        : 'Cumulative GPU Cost';

    const data = result.monthlyData.map((row) => ({
        name: `M${row.month}`,
        month: row.month,
        [costSeriesLabel]: row.cumulativeGPUCost,
        'Cumulative Savings': row.cumulativeSavings,
        'Net Monthly Savings': row.netSavings,
    }));

    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-stone-100 mb-4">12-Month Cash Flow Projection</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#3a3122" />
                        <XAxis
                            dataKey="name"
                            stroke="#bfa06a"
                            tick={{ fill: '#bfa06a', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#bfa06a"
                            tick={{ fill: '#bfa06a', fontSize: 12 }}
                            tickFormatter={(value) => formatCurrency(value, true)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#11100d',
                                border: '1px solid #4b3f2a',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                            }}
                            labelStyle={{ color: '#f8e7bf' }}
                            formatter={(value: number, name: string) => {
                                let label = name;
                                if (name === 'Cumulative GPU Cost' && inputs.computeMode === 'self-hosted' && inputs.deploymentStrategy !== 'cloud' && inputs.includeTaxDepreciation) {
                                    label = 'Cumulative GPU Cost (Net after Tax)';
                                }
                                return [formatCurrency(value), label];
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => <span style={{ color: '#bfa06a' }}>{value}</span>}
                        />
                        <ReferenceLine y={0} stroke="#5a4b31" strokeDasharray="3 3" />

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
                            dataKey={costSeriesLabel}
                            stroke="#f97316"
                            strokeWidth={2}
                            dot={{ fill: '#f97316', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: '#f97316' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Cumulative Savings"
                            stroke="#d4a93a"
                            strokeWidth={2}
                            dot={{ fill: '#d4a93a', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: '#d4a93a' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
