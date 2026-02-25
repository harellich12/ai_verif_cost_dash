import { useState } from 'react';
import { CalculatorInputs, INPUT_CONFIGS, getDefaultInputs, CONSTANTS } from '../constants';
import { RotateCcw, Cpu, Users, Zap, Activity, Bug, Shield, Cloud, Server, Combine, ChevronDown, ChevronUp, Settings, Globe, Briefcase, HelpCircle } from 'lucide-react';

interface ControlsSidebarProps {
    inputs: CalculatorInputs;
    onInputChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
    onReset: () => void;
    sectionVisibility?: {
        computeMode?: boolean;
        resources?: boolean;
        performance?: boolean;
        risk?: boolean;
        deployment?: boolean;
        advanced?: boolean;
    };
}

export function ControlsSidebar({ inputs, onInputChange, onReset, sectionVisibility }: ControlsSidebarProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSliderChange = (key: keyof CalculatorInputs, value: string) => {
        onInputChange(key, parseFloat(value) as CalculatorInputs[typeof key]);
    };

    const defaults = getDefaultInputs();

    return (
        <aside className="w-80 min-w-80 bg-stone-900/95 border-r border-stone-700/50 flex flex-col h-screen">
            {/* Header */}
            <div className="p-5 border-b border-stone-700/50 bg-gradient-to-r from-stone-800/50 to-stone-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg ring-1 ring-amber-500/30">
                            <Cpu className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-stone-100 tracking-wide uppercase">Control Panel</h2>
                            <p className="text-xs text-stone-500">Model Parameters</p>
                        </div>
                    </div>
                    <button
                        onClick={onReset}
                        className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-700/50 rounded-lg 
                       transition-all duration-200 group"
                        title="Reset to defaults"
                    >
                        <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">

                {/* V3: Compute Mode Section */}
                {sectionVisibility?.computeMode !== false && (
                    <ControlSection title="Compute Mode" icon={<Cpu size={14} />}>
                    <div className="bg-stone-800/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-stone-400 uppercase tracking-wide">AI Processing Path</span>
                        </div>
                        {/* 2-way Toggle */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <StrategyButton
                                icon={<Server size={14} />}
                                label="Self-Hosted"
                                isActive={inputs.computeMode === 'self-hosted'}
                                onClick={() => onInputChange('computeMode', 'self-hosted')}
                            />
                            <StrategyButton
                                icon={<Globe size={14} />}
                                label="Cloud API"
                                isActive={inputs.computeMode === 'cloud-api'}
                                onClick={() => onInputChange('computeMode', 'cloud-api')}
                            />
                        </div>

                        {/* Mode Description */}
                        <div className="text-[10px] text-stone-500">
                            {inputs.computeMode === 'self-hosted' ? (
                                <span>⚡ Self-Hosted: Pay for GPU infrastructure (rental or purchase)</span>
                            ) : (
                                <span>☁️ Cloud API: Pay per token usage (Claude API pricing)</span>
                            )}
                        </div>
                    </div>
                    </ControlSection>
                )}

                {/* Resources Section */}
                {sectionVisibility?.resources !== false && (
                    <ControlSection title="Resources" icon={<Users size={14} />}>
                    <ControlSlider
                        icon={<Users size={14} className="text-yellow-400" />}
                        label="Verification Engineers"
                        value={inputs.numEngineers}
                        config={INPUT_CONFIGS.numEngineers}
                        onChange={(v) => handleSliderChange('numEngineers', v)}
                        isDefault={inputs.numEngineers === defaults.numEngineers}
                        accentColor="cyan"
                    />
                    {/* GPU count only shown in self-hosted mode */}
                    {inputs.computeMode === 'self-hosted' && (
                        <ControlSlider
                            icon={<Cpu size={14} className="text-amber-400" />}
                            label="H100 GPUs"
                            value={inputs.numGPUs}
                            config={INPUT_CONFIGS.numGPUs}
                            onChange={(v) => handleSliderChange('numGPUs', v)}
                            isDefault={inputs.numGPUs === defaults.numGPUs}
                            accentColor="green"
                        />
                    )}
                    {/* V4: API Mode sliders - Interactive, Regression, Retries */}
                    {inputs.computeMode === 'cloud-api' && (
                        <>
                            <ControlSlider
                                icon={<Briefcase size={14} className="text-amber-400" />}
                                label="Interactive Jobs/Day"
                                value={inputs.interactiveJobsPerDay}
                                config={INPUT_CONFIGS.interactiveJobsPerDay}
                                onChange={(v) => handleSliderChange('interactiveJobsPerDay', v)}
                                isDefault={inputs.interactiveJobsPerDay === defaults.interactiveJobsPerDay}
                                accentColor="purple"
                            />
                            <ControlSlider
                                icon={<Activity size={14} className="text-amber-400" />}
                                label="Regression Runs/Night"
                                value={inputs.regressionRunsPerNight}
                                config={INPUT_CONFIGS.regressionRunsPerNight}
                                onChange={(v) => handleSliderChange('regressionRunsPerNight', v)}
                                isDefault={inputs.regressionRunsPerNight === defaults.regressionRunsPerNight}
                                accentColor="blue"
                            />
                            <ControlSlider
                                icon={<RotateCcw size={14} className="text-amber-400" />}
                                label="Avg. Agent Retries"
                                value={inputs.avgAgentRetries}
                                config={INPUT_CONFIGS.avgAgentRetries}
                                onChange={(v) => handleSliderChange('avgAgentRetries', v)}
                                isDefault={inputs.avgAgentRetries === defaults.avgAgentRetries}
                                accentColor="orange"
                            />
                            {/* V4: Dynamic API Cost estimate */}
                            <div className="bg-stone-800/50 rounded-lg p-3 mt-2">
                                <div className="text-xs text-stone-400 mb-2">API Cost Estimate</div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-stone-500">Tokens/File:</span>
                                        <span className="text-amber-400 ml-1 font-mono">
                                            {((CONSTANTS.API_BASE_TOKENS_INPUT + CONSTANTS.API_BASE_TOKENS_OUTPUT) * (1 + inputs.avgAgentRetries) / 1000).toFixed(0)}k
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-stone-500">Cost/File:</span>
                                        <span className="text-amber-400 ml-1 font-mono">
                                            ${((CONSTANTS.API_BASE_TOKENS_INPUT * (1 + inputs.avgAgentRetries) / 1_000_000 * CONSTANTS.API_CLAUDE_INPUT_PRICE) +
                                                (CONSTANTS.API_BASE_TOKENS_OUTPUT * (1 + inputs.avgAgentRetries) / 1_000_000 * CONSTANTS.API_CLAUDE_OUTPUT_PRICE)).toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 text-[10px] text-stone-500">
                                    ×{1 + inputs.avgAgentRetries} passes | Interactive ×20d + Regression ×30d
                                </div>
                            </div>
                        </>
                    )}
                    </ControlSection>
                )}

                {/* Performance Section */}
                {sectionVisibility?.performance !== false && (
                    <ControlSection title="Performance" icon={<Zap size={14} />}>
                    <ControlSlider
                        icon={<Zap size={14} className="text-yellow-400" />}
                        label="AI Efficiency Gain"
                        value={inputs.aiEfficiencyGain}
                        config={INPUT_CONFIGS.aiEfficiencyGain}
                        onChange={(v) => handleSliderChange('aiEfficiencyGain', v)}
                        isDefault={inputs.aiEfficiencyGain === defaults.aiEfficiencyGain}
                        accentColor="yellow"
                    />
                    <ControlSlider
                        icon={<Users size={14} className="text-yellow-400" />}
                        label="Human Review %"
                        value={inputs.humanReviewPercent}
                        config={INPUT_CONFIGS.humanReviewPercent}
                        onChange={(v) => handleSliderChange('humanReviewPercent', v)}
                        isDefault={inputs.humanReviewPercent === defaults.humanReviewPercent}
                        accentColor="cyan"
                    />
                    {inputs.computeMode === 'self-hosted' && (
                        <ControlSlider
                            icon={<Activity size={14} className="text-amber-400" />}
                            label="GPU Utilization"
                            value={inputs.gpuUtilization}
                            config={INPUT_CONFIGS.gpuUtilization}
                            onChange={(v) => handleSliderChange('gpuUtilization', v)}
                            isDefault={inputs.gpuUtilization === defaults.gpuUtilization}
                            accentColor="purple"
                        />
                    )}
                    </ControlSection>
                )}

                {/* Risk Analysis Section */}
                {sectionVisibility?.risk !== false && (
                    <ControlSection title="Risk Analysis" icon={<Shield size={14} />}>
                    <ControlSlider
                        icon={<Bug size={14} className="text-red-400" />}
                        label="Bug Escape Probability"
                        value={inputs.bugProbability}
                        config={INPUT_CONFIGS.bugProbability}
                        onChange={(v) => handleSliderChange('bugProbability', v)}
                        isDefault={inputs.bugProbability === defaults.bugProbability}
                        accentColor="red"
                    />
                    <ControlSlider
                        icon={<Shield size={14} className="text-amber-400" />}
                        label="Bug Reduction with AI"
                        value={inputs.bugReductionWithAI}
                        config={INPUT_CONFIGS.bugReductionWithAI}
                        onChange={(v) => handleSliderChange('bugReductionWithAI', v)}
                        isDefault={inputs.bugReductionWithAI === defaults.bugReductionWithAI}
                        accentColor="emerald"
                    />
                    </ControlSection>
                )}

                {/* Deployment Strategy Section - V2 (Only for self-hosted mode) */}
                {sectionVisibility?.deployment !== false && inputs.computeMode === 'self-hosted' && (
                    <ControlSection title="Deployment Strategy" icon={<Cloud size={14} />}>
                        <div className="bg-stone-800/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-stone-400 uppercase tracking-wide">Infrastructure Mode</span>
                            </div>
                            {/* 3-way Toggle */}
                            <div className="grid grid-cols-3 gap-1 mb-3">
                                <StrategyButton
                                    icon={<Cloud size={14} />}
                                    label="Cloud"
                                    isActive={inputs.deploymentStrategy === 'cloud'}
                                    onClick={() => onInputChange('deploymentStrategy', 'cloud')}
                                />
                                <StrategyButton
                                    icon={<Combine size={14} />}
                                    label="Hybrid"
                                    isActive={inputs.deploymentStrategy === 'hybrid'}
                                    onClick={() => onInputChange('deploymentStrategy', 'hybrid')}
                                />
                                <StrategyButton
                                    icon={<Server size={14} />}
                                    label="On-Prem"
                                    isActive={inputs.deploymentStrategy === 'onprem'}
                                    onClick={() => onInputChange('deploymentStrategy', 'onprem')}
                                />
                            </div>

                            {/* Conditional Hybrid Slider */}
                            {/* Conditional Hybrid Slider */}
                            {inputs.deploymentStrategy === 'hybrid' && (
                                <div className="mt-3 pt-3 border-t border-stone-700/50">
                                    <ControlSlider
                                        icon={<Server size={14} className="text-amber-400" />}
                                        label="On-Prem Workload"
                                        value={inputs.onPremPercent}
                                        config={INPUT_CONFIGS.onPremPercent}
                                        onChange={(v) => handleSliderChange('onPremPercent', v)}
                                        isDefault={inputs.onPremPercent === defaults.onPremPercent}
                                        accentColor="orange"
                                    />
                                </div>
                            )}

                            {/* Tax Depreciation Toggle */}
                            {inputs.deploymentStrategy !== 'cloud' && (
                                <div className="mt-3 pt-3 border-t border-stone-700/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-stone-300">Include Tax Depreciation</span>
                                        <span className="text-[10px] text-stone-500">(21% Credit)</span>
                                    </div>
                                    <button
                                        onClick={() => onInputChange('includeTaxDepreciation', !inputs.includeTaxDepreciation)}
                                        className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${inputs.includeTaxDepreciation ? 'bg-amber-500' : 'bg-stone-700'
                                            }`}
                                        title="Toggle Depreciation Tax Credit"
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${inputs.includeTaxDepreciation ? 'translate-x-4' : 'translate-x-0'
                                            }`} />
                                    </button>
                                </div>
                            )}

                            {/* Cost Summary */}
                            <div className="mt-3 pt-3 border-t border-stone-700/50 text-[10px] text-stone-500">
                                {inputs.deploymentStrategy === 'cloud' && (
                                    <span>💨 Cloud: $3/hr × utilization (scales with usage)</span>
                                )}
                                {inputs.deploymentStrategy === 'onprem' && (
                                    <span>🏢 On-Prem: $30K/GPU + power {inputs.includeTaxDepreciation ? '- tax credit ' : ''}(fixed)</span>
                                )}
                                {inputs.deploymentStrategy === 'hybrid' && (
                                    <span>⚡ Hybrid: {inputs.onPremPercent}% On-Prem, {100 - inputs.onPremPercent}% Cloud Burst</span>
                                )}
                            </div>
                        </div>
                    </ControlSection>
                )}

                {/* Advanced Settings */}
                {sectionVisibility?.advanced !== false && (
                    <div className="border border-stone-700/50 rounded-xl overflow-hidden bg-stone-800/20">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-800/50 transition-colors"
                    >
                        <div className="flex items-center gap-2 text-stone-400">
                            <Settings size={14} />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Advanced Settings</span>
                        </div>
                        {showAdvanced ? <ChevronUp size={14} className="text-stone-500" /> : <ChevronDown size={14} className="text-stone-500" />}
                    </button>

                    {showAdvanced && (
                        <div className="px-4 pb-4 pt-2 space-y-3 bg-stone-900/30 border-t border-stone-700/50 animate-in slide-in-from-top-2 duration-200">
                            <ControlSlider
                                icon={<Zap size={14} className="text-yellow-400" />}
                                label="Electricity Cost"
                                value={inputs.electricityRate}
                                config={INPUT_CONFIGS.electricityRate}
                                onChange={(v) => handleSliderChange('electricityRate', v)}
                                isDefault={inputs.electricityRate === defaults.electricityRate}
                                accentColor="yellow"
                            />

                            <ControlSlider
                                icon={<Users size={14} className="text-amber-400" />}
                                label="IT Admin Overhead"
                                value={inputs.adminOverhead}
                                config={INPUT_CONFIGS.adminOverhead}
                                onChange={(v) => handleSliderChange('adminOverhead', v)}
                                isDefault={inputs.adminOverhead === defaults.adminOverhead}
                                accentColor="purple"
                            />

                            <ControlSlider
                                icon={<Server size={14} className="text-yellow-400" />}
                                label="Storage / Egress"
                                value={inputs.storageCost}
                                config={INPUT_CONFIGS.storageCost}
                                onChange={(v) => handleSliderChange('storageCost', v)}
                                isDefault={inputs.storageCost === defaults.storageCost}
                                accentColor="cyan"
                            />

                            <ControlSlider
                                icon={<Activity size={14} className="text-amber-400" />}
                                label="Depreciation Period"
                                value={inputs.depreciationMonths}
                                config={INPUT_CONFIGS.depreciationMonths}
                                onChange={(v) => handleSliderChange('depreciationMonths', v)}
                                isDefault={inputs.depreciationMonths === defaults.depreciationMonths}
                                accentColor="orange"
                            />
                        </div>
                    )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-700/50 bg-stone-900/80">
                <div className="text-center">
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">Financial Model v2.0</p>
                </div>
            </div>
        </aside>
    );
}

// === Sub-components ===

interface ControlSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function ControlSection({ title, icon, children }: ControlSectionProps) {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-stone-500">{icon}</span>
                <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">{title}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-stone-700/50 to-transparent" />
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

interface ControlSliderProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    config: { min: number; max: number; step: number; unit: string; tooltip?: string };
    onChange: (value: string) => void;
    isDefault: boolean;
    accentColor: 'cyan' | 'green' | 'yellow' | 'purple' | 'red' | 'emerald' | 'blue' | 'orange';
}

const colorMap = {
    cyan: {
        bg: 'bg-yellow-500',
        activeInput: 'bg-stone-900/80 border-yellow-500/50 text-yellow-400 ring-1 ring-yellow-500/30 focus:ring-yellow-500/30',
    },
    green: {
        bg: 'bg-amber-500',
        activeInput: 'bg-stone-900/80 border-amber-500/50 text-amber-400 ring-1 ring-amber-500/30 focus:ring-amber-500/30',
    },
    yellow: {
        bg: 'bg-yellow-500',
        activeInput: 'bg-stone-900/80 border-yellow-500/50 text-yellow-400 ring-1 ring-yellow-500/30 focus:ring-yellow-500/30',
    },
    purple: {
        bg: 'bg-amber-500',
        activeInput: 'bg-stone-900/80 border-amber-500/50 text-amber-400 ring-1 ring-amber-500/30 focus:ring-amber-500/30',
    },
    red: {
        bg: 'bg-red-500',
        activeInput: 'bg-stone-900/80 border-red-500/50 text-red-400 ring-1 ring-red-500/30 focus:ring-red-500/30',
    },
    emerald: {
        bg: 'bg-amber-500',
        activeInput: 'bg-stone-900/80 border-amber-500/50 text-amber-400 ring-1 ring-amber-500/30 focus:ring-amber-500/30',
    },
    blue: {
        bg: 'bg-amber-500',
        activeInput: 'bg-stone-900/80 border-amber-500/50 text-amber-400 ring-1 ring-amber-500/30 focus:ring-amber-500/30',
    },
    orange: {
        bg: 'bg-amber-500',
        activeInput: 'bg-stone-900/80 border-amber-500/50 text-amber-400 ring-1 ring-amber-500/30 focus:ring-amber-500/30',
    },
};

function ControlSlider({ icon, label, value, config, onChange, isDefault, accentColor }: ControlSliderProps) {
    const percentage = ((value - config.min) / (config.max - config.min)) * 100;
    const colors = colorMap[accentColor];

    return (
        <div className="bg-stone-800/50 rounded-lg p-3 hover:bg-stone-800/70 transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-xs text-stone-300">{label}</span>
                    {config.tooltip && (
                        <div className="relative group">
                            <HelpCircle size={12} className="text-stone-500 group-hover:text-stone-300 transition-colors" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-2.5 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-[100] text-[11px] text-stone-300 hidden group-hover:block whitespace-normal">
                                {config.tooltip}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-12 px-1 py-0.5 text-xs font-mono text-right border rounded focus:outline-none focus:ring-1 transition-all
                            ${isDefault
                                ? 'bg-stone-900/50 border-stone-700 text-stone-400'
                                : colors.activeInput
                            }
                        `}
                    />
                    <span className="text-xs text-stone-500 w-4">{config.unit === '%' ? '%' : ''}</span>
                </div>
            </div>
            <div className="relative h-1.5 bg-stone-700 rounded-full overflow-hidden">
                <div
                    className={`absolute left-0 top-0 h-full ${colors.bg} rounded-full transition-all duration-150`}
                    style={{ width: `${percentage}%` }}
                />
                <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-stone-600">{config.min}</span>
                <span className="text-[10px] text-stone-600">{config.max}</span>
            </div>
        </div>
    );
}

interface StrategyButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

function StrategyButton({ icon, label, isActive, onClick }: StrategyButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg text-center transition-all duration-200 ${isActive
                ? 'bg-amber-500/20 ring-1 ring-amber-500/50 text-amber-300'
                : 'bg-stone-700/30 hover:bg-stone-700/50 text-stone-400 hover:text-stone-300'
                }`}
        >
            <div className="flex flex-col items-center gap-1">
                {icon}
                <span className="text-[10px] font-medium">{label}</span>
            </div>
        </button>
    );
}
