import { ShieldCheck } from 'lucide-react';

const SECURITY_ITEMS = [
    {
        label: 'On-Prem Sandbox',
        description: 'All code runs in your isolated environment',
    },
    {
        label: 'Zero-Retention API',
        description: 'No model training on your data',
    },
    {
        label: 'Cage Code Compliant',
        description: 'Defense contractor ready',
    },
    {
        label: 'US-Based Support',
        description: '24/7 domestic engineering team',
    },
] as const;

export function SecurityScorecard() {
    return (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                    Security & Compliance
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SECURITY_ITEMS.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-start gap-2 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/20"
                    >
                        <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-xs font-medium text-emerald-300">
                                {item.label}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                {item.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
