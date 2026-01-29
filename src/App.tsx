import { ControlsSidebar } from './components/ControlsSidebar';
import { KPICards } from './components/KPICards';
import { ResultChart } from './components/ResultChart';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ExcelExportBtn } from './components/ExcelExportBtn';
import { useROICalculator } from './hooks/useROICalculator';
import { Cpu } from 'lucide-react';

function App() {
    const { inputs, updateInput, resetInputs, result } = useROICalculator();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <ControlsSidebar
                inputs={inputs}
                onInputChange={updateInput}
                onReset={resetInputs}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/20 rounded-lg">
                                <Cpu className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-100">GenAI Verification ROI Calculator</h1>
                                <p className="text-sm text-slate-400">AI Coding Agent vs. Manual Labor Cost Analysis</p>
                            </div>
                        </div>
                        <ExcelExportBtn inputs={inputs} />
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6 animate-fade-in">
                    {/* KPI Cards */}
                    <section>
                        <KPICards result={result} />
                    </section>

                    {/* Chart */}
                    <section>
                        <ResultChart result={result} inputs={inputs} />
                    </section>

                    {/* Executive Summary */}
                    <section>
                        <ExecutiveSummary inputs={inputs} result={result} />
                    </section>

                    {/* Footer */}
                    <footer className="text-center text-sm text-slate-500 py-4 border-t border-slate-800">
                        <p>
                            Financial assumptions based on H100 @ ${3}/hr rental, Engineer @ $200K/yr fully loaded.
                            All calculations are estimates for planning purposes.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default App;
