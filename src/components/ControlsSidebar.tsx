import { CalculatorInputs, INPUT_CONFIGS, getDefaultInputs } from '../constants';
import { RotateCcw, Cpu, Users, Zap, Activity, Bug, Shield, Cloud, Server, Combine } from 'lucide-react';

interface ControlsSidebarProps {
    inputs: CalculatorInputs;
    onInputChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
    onReset: () => void;
}

export function ControlsSidebar({ inputs, onInputChange, onReset }: ControlsSidebarProps) {
    const handleSliderChange = (key: keyof CalculatorInputs, value: string) => {
        onInputChange(key, parseFloat(value) as CalculatorInputs[typeof key]);
    };

    const defaults = getDefaultInputs();

    return (
        <aside className="w-80 min-w-80 bg-slate-900/95 border-r border-slate-700/50 flex flex-col h-screen">
            {/* Header */}
            <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg ring-1 ring-blue-500/30">
                            <Cpu className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-100 tracking-wide uppercase">Control Panel</h2>
                            <p className="text-xs text-slate-500">Model Parameters</p>
                        </div>
                    </div>
                    <button
                        onClick={onReset}
                        className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg 
                       transition-all duration-200 group"
                        title="Reset to defaults"
                    >
                        <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">

                {/* Resources Section */}
                <ControlSection title="Resources" icon={<Users size={14} />}>
                    <ControlSlider
                        icon={<Users size={14} className="text-cyan-400" />}
                        label="Verification Engineers"
                        value={inputs.numEngineers}
                        config={INPUT_CONFIGS.numEngineers}
                        onChange={(v) => handleSliderChange('numEngineers', v)}
                        isDefault={inputs.numEngineers === defaults.numEngineers}
                        accentColor="cyan"
                    />
                    <ControlSlider
                        icon={<Cpu size={14} className="text-green-400" />}
                        label="H100 GPUs"
                        value={inputs.numGPUs}
                        config={INPUT_CONFIGS.numGPUs}
                        onChange={(v) => handleSliderChange('numGPUs', v)}
                        isDefault={inputs.numGPUs === defaults.numGPUs}
                        accentColor="green"
                    />
                </ControlSection>

                {/* Performance Section */}
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
                        icon={<Activity size={14} className="text-purple-400" />}
                        label="GPU Utilization"
                        value={inputs.gpuUtilization}
                        config={INPUT_CONFIGS.gpuUtilization}
                        onChange={(v) => handleSliderChange('gpuUtilization', v)}
                        isDefault={inputs.gpuUtilization === defaults.gpuUtilization}
                        accentColor="purple"
                    />
                </ControlSection>

                {/* Risk Analysis Section */}
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
                        icon={<Shield size={14} className="text-emerald-400" />}
                        label="Bug Reduction with AI"
                        value={inputs.bugReductionWithAI}
                        config={INPUT_CONFIGS.bugReductionWithAI}
                        onChange={(v) => handleSliderChange('bugReductionWithAI', v)}
                        isDefault={inputs.bugReductionWithAI === defaults.bugReductionWithAI}
                        accentColor="emerald"
                    />
                </ControlSection>

                {/* Deployment Strategy Section - V2 */}
                <ControlSection title="Deployment Strategy" icon={<Cloud size={14} />}>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-slate-400 uppercase tracking-wide">Infrastructure Mode</span>
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
                        {inputs.deploymentStrategy === 'hybrid' && (
                            <div className="mt-3 pt-3 border-t border-slate-700/50">
                                <ControlSlider
                                    icon={<Server size={14} className="text-orange-400" />}
                                    label="On-Prem Workload"
                                    value={inputs.onPremPercent}
                                    config={INPUT_CONFIGS.onPremPercent}
                                    onChange={(v) => handleSliderChange('onPremPercent', v)}
                                    isDefault={inputs.onPremPercent === defaults.onPremPercent}
                                    accentColor="orange"
                                />
                            </div>
                        )}

                        {/* Cost Summary */}
                        <div className="mt-3 pt-3 border-t border-slate-700/50 text-[10px] text-slate-500">
                            {inputs.deploymentStrategy === 'cloud' && (
                                <span>💨 Cloud: $3/hr × utilization (scales with usage)</span>
                            )}
                            {inputs.deploymentStrategy === 'onprem' && (
                                <span>🏢 On-Prem: $30K/GPU + power (fixed cost)</span>
                            )}
                            {inputs.deploymentStrategy === 'hybrid' && (
                                <span>⚡ Hybrid: {inputs.onPremPercent}% On-Prem, {100 - inputs.onPremPercent}% Cloud Burst</span>
                            )}
                        </div>
                    </div>
                </ControlSection>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/80">
                <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Financial Model v2.0</p>
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
                <span className="text-slate-500">{icon}</span>
                <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
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
    config: { min: number; max: number; step: number; unit: string };
    onChange: (value: string) => void;
    isDefault: boolean;
    accentColor: 'cyan' | 'green' | 'yellow' | 'purple' | 'red' | 'emerald' | 'blue' | 'orange';
}

const colorMap = {
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', ring: 'ring-cyan-500/30' },
    green: { bg: 'bg-green-500', text: 'text-green-400', ring: 'ring-green-500/30' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', ring: 'ring-yellow-500/30' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-400', ring: 'ring-purple-500/30' },
    red: { bg: 'bg-red-500', text: 'text-red-400', ring: 'ring-red-500/30' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-400', ring: 'ring-blue-500/30' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-500/30' },
};

function ControlSlider({ icon, label, value, config, onChange, isDefault, accentColor }: ControlSliderProps) {
    const percentage = ((value - config.min) / (config.max - config.min)) * 100;
    const colors = colorMap[accentColor];

    return (
        <div className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800/70 transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-xs text-slate-300">{label}</span>
                </div>
                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${isDefault ? 'text-slate-400 bg-slate-700/50' : `${colors.text} bg-slate-700/80 ring-1 ${colors.ring}`
                    }`}>
                    {value}{config.unit === '%' ? '%' : ''}
                </span>
            </div>
            <div className="relative h-1.5 bg-slate-700 rounded-full overflow-hidden">
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
                <span className="text-[10px] text-slate-600">{config.min}</span>
                <span className="text-[10px] text-slate-600">{config.max}</span>
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
                ? 'bg-blue-500/20 ring-1 ring-blue-500/50 text-blue-300'
                : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300'
                }`}
        >
            <div className="flex flex-col items-center gap-1">
                {icon}
                <span className="text-[10px] font-medium">{label}</span>
            </div>
        </button>
    );
}
