import {
    Layers,
    Users,
    DollarSign,
    Server,
    HelpCircle,
    RotateCcw,
    ChevronDown,
} from 'lucide-react';
import { VAAS_CONSTANTS, VAAS_INPUT_CONFIGS, VaaSInputs, BlockComplexity } from '../vaasConstants';

interface VaaSSidebarProps {
    inputs: VaaSInputs;
    onInputChange: <K extends keyof VaaSInputs>(key: K, value: VaaSInputs[K]) => void;
    onReset: () => void;
    sectionVisibility?: {
        blockType?: boolean;
        complexity?: boolean;
        teamDelay?: boolean;
        pricing?: boolean;
        annualPlanning?: boolean;
        benchmark?: boolean;
    };
}

export function VaaSSidebar({ inputs, onInputChange, onReset, sectionVisibility }: VaaSSidebarProps) {
    const complexityLabels: Record<BlockComplexity, string> = {
        small: 'Low (4 mo)',
        medium: 'Medium (7 mo)',
        large: 'High (12 mo)',
    };

    const BLOCK_PRESETS: Record<string, BlockComplexity | null> = {
        'UART Controller': 'small',
        'SPI/I2C Interface': 'small',
        'DDR Memory Controller': 'medium',
        'USB Controller': 'medium',
        'Ethernet MAC': 'medium',
        'PCIe Controller': 'large',
        'Custom IP Block': null,
    };

    const handleBlockTypeChange = (selectedType: string) => {
        onInputChange('blockType', selectedType);
        const presetComplexity = BLOCK_PRESETS[selectedType];
        if (presetComplexity) {
            onInputChange('blockComplexity', presetComplexity);
        }
    };

    const SliderHelp = ({ text }: { text: string }) => (
        <div className="relative">
            <button className="text-slate-500 hover:text-violet-400 transition-colors group relative">
                <HelpCircle size={14} />
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-[100] text-xs text-slate-300 hidden group-hover:block whitespace-normal">
                    {text}
                </div>
            </button>
        </div>
    );

    return (
        <aside className="w-80 bg-slate-900 border-r border-slate-700/50 overflow-y-auto flex flex-col">
            <header className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-violet-500/20 rounded-lg">
                            <Layers className="w-5 h-5 text-violet-400" />
                        </div>
                        <span className="font-semibold text-slate-200">Project Scoper</span>
                    </div>
                    <button
                        onClick={onReset}
                        className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Reset to Defaults"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </header>

            <div className="flex-1 p-4 space-y-6">
                {sectionVisibility?.blockType !== false && (
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-slate-400">
                            <Layers size={14} />
                            Block Type
                        </label>
                        <div className="relative">
                            <select
                                value={inputs.blockType}
                                onChange={(e) => handleBlockTypeChange(e.target.value)}
                                className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
                            >
                                {VAAS_CONSTANTS.BLOCK_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                )}

                {sectionVisibility?.complexity !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <Layers size={14} />
                                Complexity
                            </label>
                            <span className="text-sm font-medium text-violet-400">
                                {complexityLabels[inputs.blockComplexity]}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            {(['small', 'medium', 'large'] as BlockComplexity[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => onInputChange('blockComplexity', level)}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${inputs.blockComplexity === level
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {sectionVisibility?.teamDelay !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <Users size={14} />
                                Internal Team Size
                                <SliderHelp text={VAAS_INPUT_CONFIGS.internalTeamSize.tooltip || 'Number of verification engineers on your internal team'} />
                            </label>
                            <span className="text-sm font-medium text-violet-400">
                                {inputs.internalTeamSize} engineers
                            </span>
                        </div>
                        <input
                            type="range"
                            min={VAAS_INPUT_CONFIGS.internalTeamSize.min}
                            max={VAAS_INPUT_CONFIGS.internalTeamSize.max}
                            step={VAAS_INPUT_CONFIGS.internalTeamSize.step}
                            value={inputs.internalTeamSize}
                            onChange={(e) => onInputChange('internalTeamSize', Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>{VAAS_INPUT_CONFIGS.internalTeamSize.min}</span>
                            <span>{VAAS_INPUT_CONFIGS.internalTeamSize.max}</span>
                        </div>
                    </div>
                )}

                {sectionVisibility?.teamDelay !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <Users size={14} />
                                Internal Hiring Lag
                                <SliderHelp text={VAAS_INPUT_CONFIGS.hiringLagMonths.tooltip || 'Time required to recruit, hire, and onboard before productive work begins'} />
                            </label>
                            <span className="text-sm font-medium text-slate-400">
                                {inputs.hiringLagMonths} months
                            </span>
                        </div>
                        <input
                            type="range"
                            min={VAAS_INPUT_CONFIGS.hiringLagMonths.min}
                            max={VAAS_INPUT_CONFIGS.hiringLagMonths.max}
                            step={VAAS_INPUT_CONFIGS.hiringLagMonths.step}
                            value={inputs.hiringLagMonths}
                            onChange={(e) => onInputChange('hiringLagMonths', Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>{VAAS_INPUT_CONFIGS.hiringLagMonths.min}</span>
                            <span>{VAAS_INPUT_CONFIGS.hiringLagMonths.max}</span>
                        </div>
                    </div>
                )}

                {sectionVisibility?.teamDelay !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <Layers size={14} />
                                Est. RTL Delay
                                <SliderHelp text={VAAS_INPUT_CONFIGS.estRtlDelayWeeks.tooltip || 'Expected delay in RTL delivery that burns engineering cash'} />
                            </label>
                            <span className="text-sm font-medium text-amber-400">
                                {inputs.estRtlDelayWeeks} weeks
                            </span>
                        </div>
                        <input
                            type="range"
                            min={VAAS_INPUT_CONFIGS.estRtlDelayWeeks.min}
                            max={VAAS_INPUT_CONFIGS.estRtlDelayWeeks.max}
                            step={VAAS_INPUT_CONFIGS.estRtlDelayWeeks.step}
                            value={inputs.estRtlDelayWeeks}
                            onChange={(e) => onInputChange('estRtlDelayWeeks', Number(e.target.value))}
                            disabled={inputs.hiringLagMonths > 0}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                        {inputs.hiringLagMonths > 0 && (
                            <div className="text-[11px] text-amber-500">
                                RTL delay is disabled while Hiring Lag is set (&gt; 0). These delay modes are mutually exclusive.
                            </div>
                        )}
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Best Case ({VAAS_INPUT_CONFIGS.estRtlDelayWeeks.min})</span>
                            <span>Worst Case ({VAAS_INPUT_CONFIGS.estRtlDelayWeeks.max})</span>
                        </div>
                    </div>
                )}

                {sectionVisibility?.pricing !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <DollarSign size={14} />
                                VaaS Quote Price
                                <SliderHelp text={VAAS_INPUT_CONFIGS.vaasQuotePrice.tooltip || 'Fixed price quote for the VaaS engagement'} />
                            </label>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                min={VAAS_INPUT_CONFIGS.vaasQuotePrice.min}
                                max={VAAS_INPUT_CONFIGS.vaasQuotePrice.max}
                                step={VAAS_INPUT_CONFIGS.vaasQuotePrice.step}
                                value={inputs.vaasQuotePrice}
                                onChange={(e) => onInputChange('vaasQuotePrice', Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}

                {sectionVisibility?.annualPlanning !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <Layers size={14} />
                                Annual Block Count
                                <SliderHelp text={VAAS_INPUT_CONFIGS.annualBlockCount.tooltip || 'Number of similar verification blocks expected annually'} />
                            </label>
                            <span className="text-sm font-medium text-violet-400">
                                {inputs.annualBlockCount} blocks/yr
                            </span>
                        </div>
                        <input
                            type="range"
                            min={VAAS_INPUT_CONFIGS.annualBlockCount.min}
                            max={VAAS_INPUT_CONFIGS.annualBlockCount.max}
                            step={VAAS_INPUT_CONFIGS.annualBlockCount.step}
                            value={inputs.annualBlockCount}
                            onChange={(e) => onInputChange('annualBlockCount', Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>{VAAS_INPUT_CONFIGS.annualBlockCount.min}</span>
                            <span>{VAAS_INPUT_CONFIGS.annualBlockCount.max}</span>
                        </div>
                    </div>
                )}

                {sectionVisibility?.annualPlanning !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <Server size={14} />
                                Parallel Blocks
                                <SliderHelp text={VAAS_INPUT_CONFIGS.parallelBlocks.tooltip || 'Average number of blocks executed in parallel'} />
                            </label>
                            <span className="text-sm font-medium text-blue-400">
                                {inputs.parallelBlocks} in flight
                            </span>
                        </div>
                        <input
                            type="range"
                            min={VAAS_INPUT_CONFIGS.parallelBlocks.min}
                            max={VAAS_INPUT_CONFIGS.parallelBlocks.max}
                            step={VAAS_INPUT_CONFIGS.parallelBlocks.step}
                            value={inputs.parallelBlocks}
                            onChange={(e) => onInputChange('parallelBlocks', Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>{VAAS_INPUT_CONFIGS.parallelBlocks.min}</span>
                            <span>{VAAS_INPUT_CONFIGS.parallelBlocks.max}</span>
                        </div>
                    </div>
                )}

                {sectionVisibility?.pricing !== false && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                <DollarSign size={14} />
                                Market Upside
                                <SliderHelp text={VAAS_INPUT_CONFIGS.marketUpsidePerMonth.tooltip || 'Optional business upside from earlier delivery'} />
                            </label>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                min={VAAS_INPUT_CONFIGS.marketUpsidePerMonth.min}
                                max={VAAS_INPUT_CONFIGS.marketUpsidePerMonth.max}
                                step={VAAS_INPUT_CONFIGS.marketUpsidePerMonth.step}
                                value={inputs.marketUpsidePerMonth}
                                onChange={(e) => onInputChange('marketUpsidePerMonth', Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-12 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">/mo</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-700/50 space-y-4">
                {sectionVisibility?.benchmark !== false && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inputs.isBenchmarkMode}
                                    onChange={(e) => onInputChange('isBenchmarkMode', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-600 text-violet-500 focus:ring-violet-500 bg-slate-700"
                                />
                                Benchmark Validator
                            </label>
                            {inputs.isBenchmarkMode && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                    Calibrated
                                </span>
                            )}
                        </div>

                        {inputs.isBenchmarkMode && (
                            <div className="mt-3 space-y-3 pt-3 border-t border-slate-700/50 animated-fade-in">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">
                                        Internal Days (Benchmark)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={inputs.benchmarkInternalDays}
                                        onChange={(e) => onInputChange('benchmarkInternalDays', Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">
                                        VaaS Days (Benchmark)
                                    </label>
                                    <input
                                        type="number"
                                        min="0.5"
                                        max={inputs.benchmarkInternalDays}
                                        value={inputs.benchmarkVaasDays}
                                        onChange={(e) => onInputChange('benchmarkVaasDays', Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200"
                                    />
                                </div>
                                <div className="text-[10px] text-slate-500 italic">
                                    Uses this proven ratio to calibrate estimates.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Server size={16} className="text-emerald-400" />
                        <span className="text-xs font-medium">Infrastructure Required</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-200">
                        Standard VM (8-Core / 32GB)
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                        No H100 GPUs required • Azure OpenAI / AWS Anthropic
                    </div>
                </div>
            </div>
        </aside>
    );
}
