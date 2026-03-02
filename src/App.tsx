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
type ViewMode = 'admin' | 'presentation' | 'sales';

type VaaSVisibilityConfig = {
    blockType: boolean;
    complexity: boolean;
    teamDelay: boolean;
    pricing: boolean;
    annualPlanning: boolean;
    benchmark: boolean;
};

type VaaSContentVisibilityConfig = {
    kpiCards: boolean;
    idleCostChart: boolean;
    timelineChart: boolean;
    benchmarkBadge: boolean;
};

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
            presentation: VaaSVisibilityConfig;
            sales: VaaSVisibilityConfig;
        };
    };
    content: {
        roi: {
            kpiCards: boolean;
            resultChart: boolean;
        };
        vaas: {
            presentation: VaaSContentVisibilityConfig;
            sales: VaaSContentVisibilityConfig;
        };
    };
}

const ROI_SIDEBAR_LABELS: Record<keyof PresentationConfig['sidebar']['roi'], string> = {
    computeMode: 'Compute Mode',
    resources: 'Resources',
    performance: 'Performance',
    risk: 'Risk Analysis',
    deployment: 'Deployment Strategy',
    advanced: 'Advanced Settings',
};

const ROI_CONTENT_LABELS: Record<keyof PresentationConfig['content']['roi'], string> = {
    kpiCards: 'KPI Cards',
    resultChart: 'Result Chart',
};

const VAAS_SIDEBAR_LABELS: Record<keyof VaaSVisibilityConfig, string> = {
    blockType: 'Block Type',
    complexity: 'Block Size',
    teamDelay: 'Team, Delay, and Review',
    pricing: 'VaaS Pricing',
    annualPlanning: 'Annual Planning',
    benchmark: 'Benchmark Inputs',
};

const VAAS_CONTENT_LABELS: Record<keyof VaaSContentVisibilityConfig, string> = {
    kpiCards: 'KPI Cards',
    idleCostChart: 'Cost Utilization Chart',
    timelineChart: 'Timeline Chart',
    benchmarkBadge: 'Benchmark Badge',
};

const PRESENTATION_CONFIG_KEY_V2 = 'presentation-mode-config-v2';
const PRESENTATION_CONFIG_KEY_V1 = 'presentation-mode-config-v1';

function createDefaultPresentationConfig(): PresentationConfig {
    const vaasPresentationDefaults: VaaSVisibilityConfig = {
        blockType: true,
        complexity: true,
        teamDelay: true,
        pricing: true,
        annualPlanning: true,
        benchmark: true,
    };
    const vaasSalesDefaults: VaaSVisibilityConfig = {
        ...vaasPresentationDefaults,
        pricing: true,
    };
    const vaasContentDefaults: VaaSContentVisibilityConfig = {
        kpiCards: true,
        idleCostChart: true,
        timelineChart: true,
        benchmarkBadge: true,
    };

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
                presentation: { ...vaasPresentationDefaults },
                sales: { ...vaasSalesDefaults },
            },
        },
        content: {
            roi: {
                kpiCards: true,
                resultChart: true,
            },
            vaas: {
                presentation: { ...vaasContentDefaults },
                sales: { ...vaasContentDefaults },
            },
        },
    };
}

function loadPresentationConfig(): PresentationConfig {
    const fallback = createDefaultPresentationConfig();
    try {
        const rawV2 = localStorage.getItem(PRESENTATION_CONFIG_KEY_V2);
        if (rawV2) {
            const parsed = JSON.parse(rawV2) as Partial<PresentationConfig>;
            return {
                sidebar: {
                    roi: { ...fallback.sidebar.roi, ...(parsed.sidebar?.roi ?? {}) },
                    vaas: {
                        presentation: {
                            ...fallback.sidebar.vaas.presentation,
                            ...(parsed.sidebar?.vaas?.presentation ?? {}),
                        },
                        sales: {
                            ...fallback.sidebar.vaas.sales,
                            ...(parsed.sidebar?.vaas?.sales ?? {}),
                        },
                    },
                },
                content: {
                    roi: { ...fallback.content.roi, ...(parsed.content?.roi ?? {}) },
                    vaas: {
                        presentation: {
                            ...fallback.content.vaas.presentation,
                            ...(parsed.content?.vaas?.presentation ?? {}),
                        },
                        sales: {
                            ...fallback.content.vaas.sales,
                            ...(parsed.content?.vaas?.sales ?? {}),
                        },
                    },
                },
            };
        }

        const rawV1 = localStorage.getItem(PRESENTATION_CONFIG_KEY_V1);
        if (!rawV1) return fallback;
        const parsedV1 = JSON.parse(rawV1) as {
            sidebar?: {
                roi?: Partial<PresentationConfig['sidebar']['roi']>;
                vaas?: Partial<VaaSVisibilityConfig>;
            };
            content?: {
                roi?: Partial<PresentationConfig['content']['roi']>;
                vaas?: Partial<VaaSContentVisibilityConfig>;
            };
        };
        const v1VaaSSidebar = parsedV1.sidebar?.vaas ?? {};
        const v1VaaSContent = parsedV1.content?.vaas ?? {};

        return {
            sidebar: {
                roi: { ...fallback.sidebar.roi, ...(parsedV1.sidebar?.roi ?? {}) },
                vaas: {
                    presentation: { ...fallback.sidebar.vaas.presentation, ...v1VaaSSidebar },
                    sales: { ...fallback.sidebar.vaas.sales, ...v1VaaSSidebar },
                },
            },
            content: {
                roi: { ...fallback.content.roi, ...(parsedV1.content?.roi ?? {}) },
                vaas: {
                    presentation: { ...fallback.content.vaas.presentation, ...v1VaaSContent },
                    sales: { ...fallback.content.vaas.sales, ...v1VaaSContent },
                },
            },
        };
    } catch {
        return fallback;
    }
}

function App() {
    const [mode, setMode] = useState<AppMode>('vaas');
    const [viewMode, setViewMode] = useState<ViewMode>('sales');
    const [isPresentationSetupOpen, setIsPresentationSetupOpen] = useState(false);
    const roiCalc = useROICalculator();
    const vaasCalc = useVaaSEstimator();
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [presentationConfig, setPresentationConfig] = useState<PresentationConfig>(loadPresentationConfig);

    useEffect(() => {
        localStorage.setItem(PRESENTATION_CONFIG_KEY_V2, JSON.stringify(presentationConfig));
    }, [presentationConfig]);

    useEffect(() => {
        if (mode === 'roi' && viewMode === 'sales') {
            setViewMode('presentation');
        }
    }, [mode, viewMode]);

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
    const footerText = mode === 'vaas' && viewMode === 'sales'
        ? 'External client verification cost view (traditional/internal baseline).'
        : config.footerText;

    const roiSidebarVisibility = isPresentation ? presentationConfig.sidebar.roi : undefined;
    const vaasSidebarVisibility = viewMode === 'presentation' || viewMode === 'sales'
        ? {
            ...presentationConfig.sidebar.vaas.presentation,
            ...(viewMode === 'sales' ? { pricing: false } : {}),
        }
        : undefined;
    const showRoiKpiCards = viewMode === 'admin' || presentationConfig.content.roi.kpiCards;
    const showRoiResultChart = viewMode === 'admin' || presentationConfig.content.roi.resultChart;
    const vaasContentVisibility = viewMode === 'presentation' || viewMode === 'sales'
        ? presentationConfig.content.vaas.presentation
        : undefined;
    const showVaasKpiCards = viewMode === 'admin' || vaasContentVisibility?.kpiCards === true;
    const showVaasIdleCostChart = viewMode === 'admin' || vaasContentVisibility?.idleCostChart === true;
    const showVaasTimelineChart = viewMode === 'admin' || vaasContentVisibility?.timelineChart === true;
    const showVaasBenchmarkBadge = viewMode === 'admin' || vaasContentVisibility?.benchmarkBadge === true;
    const roiSidebarKey = `roi-${viewMode}-${JSON.stringify(roiSidebarVisibility ?? {})}`;
    const vaasSidebarKey = `vaas-${viewMode}-${JSON.stringify(vaasSidebarVisibility ?? {})}`;
    const dashboardKey = `dashboard-${mode}-${viewMode}-${JSON.stringify(
        mode === 'roi'
            ? presentationConfig.content.roi
            : presentationConfig.content.vaas.presentation
    )}`;

    const resetPresentationConfig = () => {
        localStorage.removeItem(PRESENTATION_CONFIG_KEY_V2);
        localStorage.removeItem(PRESENTATION_CONFIG_KEY_V1);
        setPresentationConfig(createDefaultPresentationConfig());
    };

    return (
        <div className="flex min-h-screen">
            {mode === 'roi' && (
                <ControlsSidebar
                    key={roiSidebarKey}
                    inputs={roiCalc.inputs}
                    onInputChange={roiCalc.updateInput}
                    onReset={roiCalc.resetInputs}
                    sectionVisibility={roiSidebarVisibility}
                />
            )}

            {mode === 'vaas' && (
                <VaaSSidebar
                    key={vaasSidebarKey}
                    inputs={vaasCalc.inputs}
                    onInputChange={vaasCalc.updateInput}
                    onReset={vaasCalc.resetInputs}
                    viewMode={viewMode}
                    sectionVisibility={vaasSidebarVisibility}
                />
            )}

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-black/85 backdrop-blur-md border-b border-stone-700/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-wrap justify-end">
                            <div className={`p-2 rounded-lg ${mode === 'roi' ? 'bg-amber-500/20' : 'bg-amber-500/20'}`}>
                                <Icon className={`w-6 h-6 ${mode === 'roi' ? 'text-amber-400' : 'text-amber-400'}`} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-stone-100">{config.title}</h1>
                                <p className="text-sm text-stone-400">{config.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-stone-800 rounded-lg p-1 border border-stone-700">
                                <button
                                    onClick={() => setMode('roi')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'roi'
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : 'text-stone-400 hover:text-white hover:bg-stone-700'
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
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : 'text-stone-400 hover:text-white hover:bg-stone-700'
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase size={14} />
                                        VaaS
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-center bg-stone-800 rounded-lg p-1 border border-stone-700">
                                <button
                                    onClick={() => setViewMode('admin')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'admin'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'text-stone-400 hover:text-white hover:bg-stone-700'
                                        }`}
                                >
                                    Admin
                                </button>
                                <button
                                    onClick={() => setViewMode('presentation')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'presentation'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'text-stone-400 hover:text-white hover:bg-stone-700'
                                        }`}
                                >
                                    Presentation
                                </button>
                                {mode === 'vaas' && (
                                    <button
                                        onClick={() => setViewMode('sales')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'sales'
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'text-stone-400 hover:text-white hover:bg-stone-700'
                                            }`}
                                    >
                                        Sales
                                    </button>
                                )}
                            </div>

                            {viewMode === 'admin' && (
                                <button
                                    onClick={() => setIsPresentationSetupOpen(true)}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
                                    title="Configure what clients can see in Presentation mode"
                                >
                                    <SlidersHorizontal size={16} />
                                    Presentation Setup
                                </button>
                            )}

                            {viewMode === 'admin' && (
                                <button
                                    onClick={() => setViewMode('presentation')}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-stone-200 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/60 rounded-lg transition-colors"
                                    title="Preview the client-facing presentation mode"
                                >
                                    <Eye size={16} />
                                    Preview as Client
                                </button>
                            )}

                            <button
                                onClick={() => setIsManualOpen(true)}
                                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors border border-transparent hover:border-stone-700"
                                title="Open User Manual"
                            >
                                <BookOpen size={20} />
                            </button>
                            {mode === 'roi' && (
                                <ExcelExportBtn inputs={roiCalc.inputs} result={roiCalc.result} />
                            )}
                            {mode === 'vaas' && (
                                <VaaSExcelExportBtn inputs={vaasCalc.inputs} result={vaasCalc.result} viewMode={viewMode} />
                            )}
                        </div>
                    </div>
                </header>

                <div key={dashboardKey} className="p-6 space-y-6 animate-fade-in" id="dashboard-container">
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
                                                <IdleCostChart result={vaasCalc.result} viewMode={viewMode} />
                                            </section>
                                        )}
                                        {showVaasTimelineChart && (
                                            <section>
                                                <TimelineComparison result={vaasCalc.result} viewMode={viewMode} />
                                            </section>
                                        )}
                                    </div>
                                )}

                            {showVaasKpiCards && (
                                <section>
                                    <VaaSKPICards result={vaasCalc.result} viewMode={viewMode} />
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
                                            result={vaasCalc.result}
                                            viewMode={viewMode}
                                        />
                                    </section>
                                )}
                            </div>
                        </>
                    )}

                    <footer className="text-center text-sm text-stone-500 py-4 border-t border-stone-800">
                        <p>
                            {footerText}
                            {' '}All calculations are estimates for planning purposes.
                        </p>
                    </footer>
                </div>
            </main>

            {isPresentationSetupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
                    <div className="w-full max-w-3xl bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-stone-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-stone-100">Presentation Mode Setup</h3>
                                <p className="text-xs text-stone-400 mt-0.5">Choose what clients can see and interact with in Presentation mode.</p>
                            </div>
                            <button
                                onClick={() => setIsPresentationSetupOpen(false)}
                                className="text-stone-400 hover:text-white"
                                aria-label="Close setup"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                            <div>
                                <h4 className="text-sm font-semibold text-stone-200 mb-3">ROI Sidebar</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.sidebar.roi).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-stone-300">
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
                                            <span>{ROI_SIDEBAR_LABELS[key as keyof PresentationConfig['sidebar']['roi']]}</span>
                                        </label>
                                    ))}
                                </div>

                                <h4 className="text-sm font-semibold text-stone-200 mt-5 mb-3">ROI Content</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.content.roi).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-stone-300">
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
                                            <span>{ROI_CONTENT_LABELS[key as keyof PresentationConfig['content']['roi']]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-stone-200 mb-3">VaaS Sidebar (Presentation)</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.sidebar.vaas.presentation).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-stone-300">
                                            <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => setPresentationConfig(prev => ({
                                                    ...prev,
                                                    sidebar: {
                                                        ...prev.sidebar,
                                                        vaas: {
                                                            ...prev.sidebar.vaas,
                                                            presentation: {
                                                                ...prev.sidebar.vaas.presentation,
                                                                [key]: e.target.checked,
                                                            },
                                                        },
                                                    },
                                                }))}
                                            />
                                            <span>{VAAS_SIDEBAR_LABELS[key as keyof VaaSVisibilityConfig]}</span>
                                        </label>
                                    ))}
                                </div>

                                <h4 className="text-sm font-semibold text-stone-200 mt-5 mb-3">VaaS Content (Presentation)</h4>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(presentationConfig.content.vaas.presentation).map(([key, enabled]) => (
                                        <label key={key} className="flex items-center gap-2 text-stone-300">
                                            <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => setPresentationConfig(prev => ({
                                                    ...prev,
                                                    content: {
                                                        ...prev.content,
                                                        vaas: {
                                                            ...prev.content.vaas,
                                                            presentation: {
                                                                ...prev.content.vaas.presentation,
                                                                [key]: e.target.checked,
                                                            },
                                                        },
                                                    },
                                                }))}
                                            />
                                            <span>{VAAS_CONTENT_LABELS[key as keyof VaaSContentVisibilityConfig]}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-5 rounded-lg border border-stone-700/60 bg-stone-800/40 px-3 py-2 text-xs text-stone-400">
                                    Sales view mirrors Presentation settings.
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-4 border-t border-stone-700 flex items-center justify-between">
                            <button
                                onClick={resetPresentationConfig}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg"
                            >
                                <RotateCcw size={14} />
                                Reset Presentation Filters
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsPresentationSetupOpen(false)}
                                    className="px-3 py-2 text-sm text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setViewMode('presentation');
                                        setIsPresentationSetupOpen(false);
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-amber-600 hover:bg-amber-500 rounded-lg"
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
