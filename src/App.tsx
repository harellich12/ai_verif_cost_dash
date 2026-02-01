import { ControlsSidebar } from './components/ControlsSidebar';
import { VaaSSidebar } from './components/VaaSSidebar';
import { KPICards } from './components/KPICards';
import { ResultChart } from './components/ResultChart';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ExcelExportBtn } from './components/ExcelExportBtn';
import { IdleCostChart } from './components/IdleCostChart';
import { TimelineComparison } from './components/TimelineComparison';
import { SecurityScorecard } from './components/SecurityScorecard';
import { BenchmarkBadge } from './components/BenchmarkBadge';
import { useROICalculator } from './hooks/useROICalculator';
import { useVaaSEstimator } from './hooks/useVaaSEstimator';
import { Cpu, Briefcase, BookOpen } from 'lucide-react';
import { PrintReportBtn } from './components/PrintReportBtn';
import { UserManualModal } from './components/UserManualModal';
import { useState } from 'react';

type AppMode = 'roi' | 'vaas';

function App() {
    const [mode, setMode] = useState<AppMode>('roi');
    const roiCalc = useROICalculator();
    const vaasCalc = useVaaSEstimator();
    const [isManualOpen, setIsManualOpen] = useState(false);

    // Mode-specific configuration
    const modeConfig = {
        roi: {
            icon: Cpu,
            title: 'GenAI Verification ROI Calculator',
            subtitle: 'AI Coding Agent vs. Manual Labor Cost Analysis',
            footerText: 'Financial assumptions based on H100 @ $3/hr rental, Engineer @ $200K/yr fully loaded.',
        },
        vaas: {
            icon: Briefcase,
            title: 'VaaS Quote Estimator',
            subtitle: 'Verification as a Service vs. Internal Team Analysis',
            footerText: 'VaaS delivers 50% faster timelines. Standard VM infrastructure, no H100s required.',
        },
    };

    const config = modeConfig[mode];
    const Icon = config.icon;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar - ROI mode only for now */}
            {mode === 'roi' && (
                <ControlsSidebar
                    inputs={roiCalc.inputs}
                    onInputChange={roiCalc.updateInput}
                    onReset={roiCalc.resetInputs}
                />
            )}

            {/* VaaS Sidebar */}
            {mode === 'vaas' && (
                <VaaSSidebar
                    inputs={vaasCalc.inputs}
                    onInputChange={vaasCalc.updateInput}
                    onReset={vaasCalc.resetInputs}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${mode === 'roi' ? 'bg-accent/20' : 'bg-violet-500/20'}`}>
                                <Icon className={`w-6 h-6 ${mode === 'roi' ? 'text-accent' : 'text-violet-400'}`} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-100">{config.title}</h1>
                                <p className="text-sm text-slate-400">{config.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Mode Toggle */}
                            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                                <button
                                    onClick={() => setMode('roi')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'roi'
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Cpu size={14} />
                                        ROI
                                    </span>
                                </button>
                                <button
                                    onClick={() => setMode('vaas')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'vaas'
                                        ? 'bg-violet-500 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase size={14} />
                                        VaaS
                                    </span>
                                </button>
                            </div>
                            <button
                                onClick={() => setIsManualOpen(true)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                                title="Open User Manual"
                            >
                                <BookOpen size={20} />
                            </button>
                            {mode === 'roi' && (
                                <ExcelExportBtn inputs={roiCalc.inputs} result={roiCalc.result} />
                            )}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6 animate-fade-in" id="dashboard-container">
                    {/* Header Actions */}
                    <div className="flex justify-end mb-2" data-html2canvas-ignore="true">
                        <PrintReportBtn />
                    </div>

                    {/* ROI Mode Content */}
                    {mode === 'roi' && (
                        <>
                            <section>
                                <KPICards result={roiCalc.result} />
                            </section>
                            <section>
                                <ResultChart result={roiCalc.result} inputs={roiCalc.inputs} />
                            </section>
                            <section>
                                <ExecutiveSummary inputs={roiCalc.inputs} result={roiCalc.result} />
                            </section>
                        </>
                    )}

                    {/* VaaS Mode Content */}
                    {mode === 'vaas' && (
                        <>
                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <section>
                                    <IdleCostChart result={vaasCalc.result} />
                                </section>
                                <section>
                                    <TimelineComparison result={vaasCalc.result} />
                                </section>
                            </div>

                            {/* Summary Stats */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                    <div className="text-sm text-slate-400">Months Saved</div>
                                    <div className="text-2xl font-bold text-violet-400">
                                        {vaasCalc.result.monthsSaved.toFixed(1)} mo
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                    <div className="text-sm text-slate-400">Revenue Gained</div>
                                    <div className="text-2xl font-bold text-emerald-400">
                                        ${(vaasCalc.result.revenueGained / 1000).toFixed(0)}K
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                    <div className="text-sm text-slate-400">Idle Cash Saved</div>
                                    <div className="text-2xl font-bold text-red-400">
                                        ${(vaasCalc.result.idleCashSaved / 1000).toFixed(0)}K
                                    </div>
                                </div>
                            </section>

                            {/* Trust Signals Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <section>
                                    <SecurityScorecard />
                                </section>
                                <section>
                                    <BenchmarkBadge annualBlockCount={vaasCalc.inputs.annualBlockCount} />
                                </section>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <footer className="text-center text-sm text-slate-500 py-4 border-t border-slate-800">
                        <p>
                            {config.footerText}
                            {' '}All calculations are estimates for planning purposes.
                        </p>
                    </footer>
                </div>
            </main>
            {/* User Manual Modal */}
            <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        </div>
    );
}

export default App;
