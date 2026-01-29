import { X, BookOpen, TrendingUp, DollarSign, Activity, FileText } from 'lucide-react';
import { useEffect } from 'react';

interface UserManualModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UserManualModal({ isOpen, onClose }: UserManualModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <BookOpen size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-100">User Manual</h2>
                            <p className="text-xs text-slate-400">GenAI Verification ROI Calculator</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 text-slate-300">

                    {/* Introduction */}
                    <section className="space-y-3">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Activity size={18} className="text-emerald-400" />
                            1. Introduction
                        </h3>
                        <p className="leading-relaxed">
                            This tool provides a data-driven answer to the question:
                            <em className="text-slate-200 not-italic"> "Should we hire more verification engineers or invest in AI infrastructure?"</em>.
                            It models the trade-offs between CapEx (GPUs), OpEx (Cloud/Salaries), and productivity gains.
                        </p>
                    </section>

                    {/* How ROI is Calculated */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <DollarSign size={18} className="text-blue-400" />
                            2. The Financial Model
                        </h3>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4">
                            <div>
                                <h4 className="font-medium text-slate-200 mb-2">Cost of AI</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm marker:text-slate-500">
                                    <li><strong>Rental:</strong> GPUs × $3/hr × 730 hrs × Utilization</li>
                                    <li><strong>Purchase:</strong> (GPUs × $30k + Chassis) / 36 months</li>
                                    <li><strong>Hybrid:</strong> Mix of Purchase (Baseload) and Rental (Burst)</li>
                                </ul>
                            </div>
                            <div className="border-t border-slate-700/50 pt-4">
                                <h4 className="font-medium text-slate-200 mb-2">Value of AI (Savings)</h4>
                                <p className="text-sm italic mb-2">
                                    "How many engineering hours did we save?"
                                </p>
                                <code className="block bg-slate-950 p-2 rounded text-xs font-mono text-emerald-400">
                                    Engineer Cost/Mo × Engineers × 50% Debug Time × AI Efficiency %
                                </code>
                            </div>
                        </div>
                    </section>

                    {/* Input Guide */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <TrendingUp size={18} className="text-purple-400" />
                            3. Input Guide
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Parameter</th>
                                        <th className="px-4 py-3">Recommended</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    <tr className="bg-slate-800/20">
                                        <td className="px-4 py-3 font-medium text-slate-200">AI Efficiency Gain</td>
                                        <td className="px-4 py-3">10% - 50%</td>
                                        <td className="px-4 py-3 text-slate-400">Time saved per engineer (conservative: 20-30%)</td>
                                    </tr>
                                    <tr className="bg-slate-800/20">
                                        <td className="px-4 py-3 font-medium text-slate-200">Deployment Model</td>
                                        <td className="px-4 py-3">Cloud / On-Prem</td>
                                        <td className="px-4 py-3 text-slate-400">Cloud (OpEx) vs. On-Prem (CapEx 3yr Amortization)</td>
                                    </tr>
                                    <tr className="bg-slate-800/20">
                                        <td className="px-4 py-3 font-medium text-slate-200">Advanced Settings</td>
                                        <td className="px-4 py-3">Custom</td>
                                        <td className="px-4 py-3 text-slate-400">Electricity ($0.12), Admin (15%), Storage ($500)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Export Features */}
                    <section className="space-y-3">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FileText size={18} className="text-amber-400" />
                            4. Export & Sharing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="font-semibold text-slate-200 mb-1">PDF Brief</h4>
                                <p className="text-sm">Generates a "Confidential" one-page summary suitable for executive presentations.</p>
                            </div>
                            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="font-semibold text-slate-200 mb-1">Excel Model</h4>
                                <p className="text-sm">Downloads a `.xlsx` file with <strong>live formulas</strong>. Great for Finance teams to audit assumptions.</p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Close Manual
                    </button>
                </div>
            </div>
        </div>
    );
}
