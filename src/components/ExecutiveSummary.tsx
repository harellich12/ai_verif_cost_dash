import { CalculatorInputs, CalculationResult, CONSTANTS } from '../constants';
import { formatCurrency } from '../utils/format';
import { TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

interface ExecutiveSummaryProps {
    inputs: CalculatorInputs;
    result: CalculationResult;
}

/**
 * Generates dynamic recommendation text based on ROI results
 */
function generateRecommendation(inputs: CalculatorInputs, result: CalculationResult): {
    isPositive: boolean;
    headline: string;
    body: string;
    suggestions: string[];
} {
    const { numGPUs } = inputs;
    const { netSavingsYear, roiPercent, breakEvenMonth } = result;

    // Calculate equivalent engineer headcount
    const engineerTotalCost = CONSTANTS.ENGINEER_SALARY_YEARLY + CONSTANTS.EDA_LICENSE_YEARLY;
    const equivalentEngineers = Math.abs(netSavingsYear) / engineerTotalCost;

    if (netSavingsYear > 0) {
        // Positive ROI
        const headline = `Deploying ${numGPUs} GPUs saves ${formatCurrency(netSavingsYear, true)}/year`;

        let body = `This is equivalent to hiring ${equivalentEngineers.toFixed(1)} senior engineers. `;

        if (breakEvenMonth && breakEvenMonth <= 3) {
            body += `The investment pays for itself in just ${breakEvenMonth} month${breakEvenMonth > 1 ? 's' : ''}, indicating strong financial viability.`;
        } else if (breakEvenMonth && breakEvenMonth <= 6) {
            body += `With a break-even point at month ${breakEvenMonth}, this represents a solid medium-term investment.`;
        } else if (breakEvenMonth) {
            body += `Break-even occurs at month ${breakEvenMonth}. Consider strategies to accelerate payback.`;
        } else {
            body += `Strong positive returns demonstrate the value of AI-assisted verification.`;
        }

        const suggestions = [
            `ROI of ${roiPercent.toFixed(0)}% significantly exceeds typical infrastructure investments`,
            `Consider expanding GPU allocation if utilization remains high`,
            `Document efficiency gains to build case for further AI adoption`,
        ];

        return { isPositive: true, headline, body, suggestions };
    } else {
        // Negative ROI
        const headline = `Warning: Infrastructure costs exceed productivity gains`;

        const body = `Current configuration shows a net annual cost of ${formatCurrency(Math.abs(netSavingsYear), true)}. ` +
            `This represents ${equivalentEngineers.toFixed(1)} engineer-equivalents in excess spending. ` +
            `The model indicates the AI investment does not generate positive returns under these parameters.`;

        const suggestions = [
            `Increase GPU utilization rate to improve cost efficiency`,
            `Validate AI efficiency assumptions with pilot programs`,
            `Consider reducing GPU count or switching to on-demand rental`,
            `Explore hybrid approaches with selective AI deployment`,
        ];

        return { isPositive: false, headline, body, suggestions };
    }
}

export function ExecutiveSummary({ inputs, result }: ExecutiveSummaryProps) {
    const recommendation = generateRecommendation(inputs, result);

    return (
        <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${recommendation.isPositive
            ? 'bg-gradient-to-br from-emerald-900/40 via-emerald-900/20 to-slate-900/80 ring-1 ring-emerald-500/30'
            : 'bg-gradient-to-br from-amber-900/40 via-amber-900/20 to-slate-900/80 ring-1 ring-amber-500/30'
            }`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${recommendation.isPositive ? 'border-emerald-500/20' : 'border-amber-500/20'
                }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${recommendation.isPositive
                        ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30'
                        : 'bg-amber-500/20 ring-1 ring-amber-500/30'
                        }`}>
                        {recommendation.isPositive
                            ? <TrendingUp className="w-5 h-5 text-emerald-400" />
                            : <AlertTriangle className="w-5 h-5 text-amber-400" />
                        }
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Executive Recommendation</p>
                        <h3 className={`text-lg font-semibold ${recommendation.isPositive ? 'text-emerald-300' : 'text-amber-300'
                            }`}>
                            {recommendation.headline}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
                <p className="text-slate-300 leading-relaxed mb-5">
                    {recommendation.body}
                </p>

                {/* Key Insights */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Key Insights</span>
                    </div>
                    {recommendation.suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
                        >
                            <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${recommendation.isPositive ? 'text-emerald-500/60' : 'text-amber-500/60'
                                }`} />
                            <span>{suggestion}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Badge */}
            <div className={`px-6 py-3 border-t ${recommendation.isPositive ? 'border-emerald-500/20 bg-emerald-950/30' : 'border-amber-500/20 bg-amber-950/30'
                }`}>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        Based on {inputs.numEngineers} engineers, {inputs.numGPUs} GPUs, {inputs.aiEfficiencyGain}% efficiency gain
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${recommendation.isPositive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                        }`}>
                        {recommendation.isPositive ? '✓ Recommended' : '⚠ Review Required'}
                    </span>
                </div>
            </div>
        </div>
    );
}
