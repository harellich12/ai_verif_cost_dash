import { X, BookOpen, TrendingUp, DollarSign, Activity, FileText, SlidersHorizontal, Eye } from 'lucide-react';
import { useEffect } from 'react';

interface UserManualModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UserManualModal({ isOpen, onClose }: UserManualModalProps) {
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <BookOpen size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-100">User Manual</h2>
                            <p className="text-xs text-slate-400">GenAI Verification ROI & VaaS Estimator</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 text-slate-300">
                    <section className="space-y-3">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Activity size={18} className="text-emerald-400" />
                            1. What This Tool Does
                        </h3>
                        <p className="leading-relaxed">
                            This app helps you evaluate internal AI verification economics and VaaS outsourcing scenarios.
                            Use <strong>ROI mode</strong> for internal compute strategy and <strong>VaaS mode</strong> for fixed-quote timeline/cost analysis.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <DollarSign size={18} className="text-blue-400" />
                            2. ROI Mode (Internal AI Economics)
                        </h3>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3 text-sm">
                            <p><strong>Primary outputs:</strong> Net Annual Savings, ROI %, Break-even Month, Risk Reduction, API vs Self-Hosted comparison.</p>
                            <p><strong>Compute paths:</strong> Self-Hosted (GPU infra assumptions) or Cloud API (jobs/runs/retries token model).</p>
                            <p><strong>Core savings logic:</strong></p>
                            <code className="block bg-slate-950 p-2 rounded text-xs font-mono text-emerald-400">
                                Engineer Cost/Mo × Engineers × 50% Debug Time × AI Efficiency %
                            </code>
                            <p>Use slider tooltips (`?`) for assumption definitions.</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <TrendingUp size={18} className="text-violet-400" />
                            3. VaaS Mode (Timeline + Net Benefit)
                        </h3>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3 text-sm">
                            <p><strong>Primary outputs:</strong> Months Saved, Capacity Unlocked, Cash Burn Prevented, Business Upside, Net Benefit per Block.</p>
                            <p><strong>Important rule:</strong> Hiring Lag and RTL Delay are mutually exclusive in the model.</p>
                            <p><strong>Market Upside:</strong> optional $/month business value from earlier delivery.</p>
                            <code className="block bg-slate-950 p-2 rounded text-xs font-mono text-amber-400">
                                Net Benefit/Block = (Internal Team Cost + Idle Cash Saved + Business Upside) - VaaS Quote
                            </code>
                            <p><strong>Parallel Blocks</strong> adjusts annual calendar time-saved projection.</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <SlidersHorizontal size={18} className="text-cyan-400" />
                            4. Admin vs Presentation Mode
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="font-semibold text-slate-200 mb-1">Admin</h4>
                                <p>Full workspace with all controls and the <strong>Presentation Setup</strong> panel.</p>
                                <p className="mt-2">Use this to choose which sidebar sections, KPI cards, and charts are visible to clients.</p>
                            </div>
                            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="font-semibold text-slate-200 mb-1">Presentation</h4>
                                <p>Client-facing filtered view based on your saved setup.</p>
                                <p className="mt-2">Filters are persisted in local storage and can be reset any time.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Eye size={14} />
                            <span>Tip: Use <strong>Preview as Client</strong> from Admin to instantly validate your presentation layout.</span>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FileText size={18} className="text-amber-400" />
                            5. Export & Sharing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="font-semibold text-slate-200 mb-1">PDF Export</h4>
                                <p>Generates a paginated report of the current dashboard state.</p>
                            </div>
                            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="font-semibold text-slate-200 mb-1">Excel Export</h4>
                                <p>Exports a snapshot `.xlsx` (values only, no recalculating formulas).</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-2 text-sm text-slate-400">
                        <h3 className="text-lg font-semibold text-white">6. Notes</h3>
                        <p>All outputs are planning estimates and should be validated with pilot data and finance review.</p>
                        <p>Assumptions are configurable; model quality depends on assumption quality.</p>
                    </section>
                </div>

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
