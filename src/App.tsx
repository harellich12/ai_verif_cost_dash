import { useEffect, useState } from 'react';
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
import { Cpu, Briefcase, BookOpen, SlidersHorizontal, Eye, RotateCcw } from 'lucide-react';
import { PrintReportBtn } from './components/PrintReportBtn';
import { UserManualModal } from './components/UserManualModal';
import { VaaSKPICards } from './components/VaaSKPICards';
import { VaaSExcelExportBtn } from './components/VaaSExcelExportBtn';

type AppMode = 'roi' | 'vaas';
type ViewMode = 'admin' | 'presentation';

interface PresentationConfig {
    sidebar: {
        roi: {
            computeMode: boolean;
            resources: boolean;
            performance: boolean;
            risk: boolean;
            deployment: boolean;
            advanced: boolean;
        };
        vaas: {
            blockType: boolean;
            complexity: boolean;
            teamDelay: boolean;
            pricing: boolean;
            annualPlanning: boolean;
            benchmark: boolean;
        };
    };
    content: {
        roi: {
            kpiCards: boolean;
            resultChart: boolean;
        };
        vaas: {
            kpiCards: boolean;
            idleCostChart: boolean;
            timelineChart: boolean;
            benchmarkBadge: boolean;
        };
    };
}

const PRESENTATION_CONFIG_KEY = 'presentation-mode-config-v1';

function createDefaultPresentationConfig(): PresentationConfig {
    return {
        sidebar: {
            roi: {
                computeMode: true,
                resources: true,
                performance: true,
                risk: true,
                deployment: true,
                advanced: true,
            },
            vaas: {
                blockType: true,
                complexity: true,
                teamDelay: true,
                pricing: true,
                annualPlanning: true,
                benchmark: true,
            },
        },
        content: {
            roi: {
                kpiCards: true,
                resultChart: true,
            },
            vaas: {
                kpiCards: true,
                idleCostChart: true,
                timelineChart: true,
                benchmarkBadge: true,
            },
        },
    };
}

function loadPresentationConfig(): PresentationConfig {
    const fallback = createDefaultPresentationConfig();
    try {
        const raw = localStorage.getItem(PRESENTATION_CONFIG_KEY);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw) as Partial<PresentationConfig>;
        return {
            sidebar: {
                roi: { ...fallback.sidebar.roi, ...(parsed.sidebar?.roi ?? {}) },
                vaas: { ...fallback.sidebar.vaas, ...(parsed.sidebar?.vaas ?? {}) },
            },
            content: {
                roi: { ...fallback.content.roi, ...(parsed.content?.roi ?? {}) },
                vaas: { ...fallback.content.vaas, ...(parsed.content?.vaas ?? {}) },
            },
        };
    } catch {
        return fallback;
    }
}

function App() {
    const [mode, setMode] = useState<AppMode>('roi');
    const [viewMode, setViewMode] = useState<ViewMode>('admin');
    const [isPresentationSetupOpen, setIsPresentationSetupOpen] = useState(false);
    const roiCalc = useROICalculator();
    const vaasCalc = useVaaSEstimator();
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [presentationConfig, setPresentationConfig] = useState<PresentationConfig>(loadPresentationConfig);

    useEffect(() => {
        localStorage.setItem(PRESENTATION_CONFIG_KEY, JSON.stringify(presentationConfig));
    }, [presentationConfig]);

    const isPresentation = viewMode === 'presentation';

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

    const roiSidebarVisibility = isPresentation ? presentationConfig.sidebar.roi : undefined;
    const vaasSidebarVisibility = isPresentation ? presentationConfig.sidebar.vaas : undefined;
    const showRoiKpiCards = viewMode === 'admin' || presentationConfig.content.roi.kpiCards;
    const showRoiResultChart = viewMode === 'admin' || presentationConfig.content.roi.resultChart;
    const showVaasKpiCards = viewMode === 'admin' || presentationConfig.content.vaas.kpiCards;
    const showVaasIdleCostChart = viewMode === 'admin' || presentationConfig.content.vaas.idleCostChart;
    const showVaasTimelineChart = viewMode === 'admin' || presentationConfig.content.vaas.timelineChart;
    const showVaasBenchmarkBadge = viewMode === 'admin' || presentationConfig.content.vaas.benchmarkBadge;

    const resetPresentationConfig = () => {
        localStorage.removeItem(PRESENTATION_CONFIG_KEY);
        setPresentationConfig(createDefaultPresentationConfig());
    };

    return (
        <div className="flex min-h-screen">
            {mode === 'roi' && (
                <ControlsSidebar
                    inputs={roiCalc.inputs}
                    onInputChange={roiCalc.updateInput}
                    onReset={roiCalc.resetInputs}
                    sectionVisibility={roiSidebarVisibility}
                />
            )}

            {mode === 'vaas' && (
                <VaaSSidebar
                    inputs={vaasCalc.inputs}
                    onInputChange={vaasCalc.updateInput}
                    onReset={vaasCalc.resetInputs}
                    sectionVisibility={vaasSidebarVisibility}
                />
            )}

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-wrap justify-end">
                            <div className={`p-2 rounded-lg ${mode === 'roi' ? 'bg-accent/20' : 'bg-violet-500/20'}`}>
                                <Icon className={`w-6 h-6 ${mode === 'roi' ? 'text-accent' : 'text-violet-400'}`} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-100">{config.title}</h1>
                                <p className="text-sm text-slate-400">{config.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                                <button
                                    onClick={() => setMode('roi')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'roi'
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
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
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase size={14} />
                                        VaaS
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                                <button
                                    onClick={() => setViewMode('admin')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'admin'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    Admin
                                </button>
                                <button
                                    onClick={() => setViewMode('presentation')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'presentation'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    Presentation
                                </button>
                            </div>

                            {viewMode === 'admin' && (
                                <button
                                    onClick={() => setIsPresentationSetupOpen(true)}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                                    title="Configure what clients can see in Presentation mode"
                                >
                                    <SlidersHorizontal size={16} />
                                    Presentation Setup
                                </button>
                            )}

                            {viewMode === 'admin' && (
                                <button
                                    onClick={() => setViewMode('presentation')}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-200 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700/60 rounded-lg transition-colors"
                                    title="Preview the client-facing presentation mode"
                                >
                                    <Eye size={16} />
                                    Preview as Client
                                </button>
                            )}

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
                            {mode === 'vaas' && (
                                <VaaSExcelExportBtn inputs={vaasCalc.inputs} result={vaasCalc.result} />
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 space-y-6 animate-fade-in" id="dashboard-container">
                    <div className="flex justify-end mb-2" data-html2canvas-ignore="true">
                        <PrintReportBtn />
                    </div>

                    {mode === 'roi' && (
                        <>
                            {showRoiKpiCards && (
                                <section>
                                    <KPICards result={roiCalc.result} inputs={roiCalc.inputs} />
                                </section>
                            )}
                            {showRoiResultChart && (
                                <section>
                                    <ResultChart result={roiCalc.result} inputs={roiCalc.inputs} />
                                </section>
                            )}
                            <section>
                                <ExecutiveSummary inputs={roiCalc.inputs} result={roiCalc.result} />
                            </section>
                        </>
                    )}

                    {mode === 'vaas' && (
                        <>
                            {(showVaasIdleCostChart || showVaasTimelineChart) && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {showVaasIdleCostChart && (
                                            <section>
                                                <IdleCostChart result={vaasCalc.result} />
                                            </section>
                                        )}
                                        {showVaasTimelineChart && (
                                            <section>
                                                <TimelineComparison result={vaasCalc.result} />
                                            </section>
                                        )}
                                    </div>
                                )}

                            {showVaasKpiCards && (
                                <section>
                                    <VaaSKPICards result={vaasCalc.result} />
                                </section>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <section>
                                    <SecurityScorecard />
                                </section>
                                {showVaasBenchmarkBadge && (
                                    <section>
                                        <BenchmarkBadge
                                            annualBlockCount={vaasCalc.inputs.annualBlockCount}
                                            parallelBlocks={vaasCalc.inputs.parallelBlocks}
                                        />
                                    </section>
                                )}
                            </div>
                        </>
                    )}

                    <footer className="text-center text-sm text-slate-500 py-4 border-t border-slate-800">
                        <p>
                            {config.footerText}
                            {' '}All calculations are estimates for planning purposes.
                        </p>
                    </footer>
                </div>
            </main>

            {isPresentationSetupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-100">Presentation Mode Setup</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Choose what clients can see and interact with in Presentation mode.</p>
                            </div>
                            <button
                                onClick={() => setIsPresentationSetupOpen(false)}
                                className="text-slate-400 hover:text-white"
                                aria-label="Close setup"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-200 mb-3">ROI Sidebar</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.sidebar.roi).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => setPresentationConfig(prev => ({
                                                    ...prev,
                                                    sidebar: {
                                                        ...prev.sidebar,
                                                        roi: {
                                                            ...prev.sidebar.roi,
                                                            [key]: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                            <span>{key}</span>
                                        </label>
                                    ))}
                                </div>

                                <h4 className="text-sm font-semibold text-slate-200 mt-5 mb-3">ROI Content</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.content.roi).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => setPresentationConfig(prev => ({
                                                    ...prev,
                                                    content: {
                                                        ...prev.content,
                                                        roi: {
                                                            ...prev.content.roi,
                                                            [key]: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                            <span>{key}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-slate-200 mb-3">VaaS Sidebar</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.sidebar.vaas).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => setPresentationConfig(prev => ({
                                                    ...prev,
                                                    sidebar: {
                                                        ...prev.sidebar,
                                                        vaas: {
                                                            ...prev.sidebar.vaas,
                                                            [key]: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                            <span>{key}</span>
                                        </label>
                                    ))}
                                </div>

                                <h4 className="text-sm font-semibold text-slate-200 mt-5 mb-3">VaaS Content</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.content.vaas).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => setPresentationConfig(prev => ({
                                                    ...prev,
                                                    content: {
                                                        ...prev.content,
                                                        vaas: {
                                                            ...prev.content.vaas,
                                                            [key]: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                            <span>{key}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-4 border-t border-slate-700 flex items-center justify-between">
                            <button
                                onClick={resetPresentationConfig}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg"
                            >
                                <RotateCcw size={14} />
                                Reset Presentation Filters
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsPresentationSetupOpen(false)}
                                    className="px-3 py-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setViewMode('presentation');
                                        setIsPresentationSetupOpen(false);
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                                >
                                    <Eye size={14} />
                                    Preview as Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        </div>
    );
}

export default App;
