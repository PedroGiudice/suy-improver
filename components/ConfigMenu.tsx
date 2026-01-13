import React from 'react';
import { Settings2, ChevronDown, Zap, BrainCircuit, Thermometer, Cpu } from 'lucide-react';
import { GeminiModel } from '../types';

interface ConfigMenuProps {
  selectedModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
  systemInstruction: string;
  onSystemInstructionChange: (instruction: string) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  thinkingBudget: number;
  onThinkingBudgetChange: (budget: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const ConfigMenu: React.FC<ConfigMenuProps> = ({
  selectedModel,
  onModelChange,
  systemInstruction,
  onSystemInstructionChange,
  temperature,
  onTemperatureChange,
  thinkingBudget,
  onThinkingBudgetChange,
  isOpen,
  onToggle,
  onClose
}) => {
  return (
    <div className="relative z-50">
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors border ${
          isOpen 
            ? 'bg-zinc-800 border-zinc-700 text-zinc-100' 
            : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
        }`}
      >
        <Settings2 className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline-block">Configuration</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={onClose} 
            aria-hidden="true" 
          />
          <div className="absolute right-0 sm:left-0 top-full mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-6">
              
              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Model Engine</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onModelChange(GeminiModel.Flash)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedModel === GeminiModel.Flash 
                        ? 'bg-zinc-800 border-indigo-500/50 text-indigo-200 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/10' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <Zap className="w-5 h-5 mb-2" />
                    <span>Flash 3.0</span>
                    <span className="text-[10px] opacity-60 font-normal mt-0.5">Fast & Efficient</span>
                  </button>
                  <button
                    onClick={() => onModelChange(GeminiModel.Pro)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedModel === GeminiModel.Pro
                        ? 'bg-zinc-800 border-purple-500/50 text-purple-200 ring-1 ring-purple-500/20 shadow-lg shadow-purple-500/10' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <BrainCircuit className="w-5 h-5 mb-2" />
                    <span>Pro 3.0</span>
                    <span className="text-[10px] opacity-60 font-normal mt-0.5">Deep Reasoning</span>
                  </button>
                </div>
              </div>

              {/* Advanced Settings based on Model */}
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800 space-y-4">
                {selectedModel === GeminiModel.Flash ? (
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-zinc-400">
                           <Thermometer className="w-4 h-4" />
                           <label className="text-xs font-semibold uppercase tracking-wider">Temperature</label>
                        </div>
                        <span className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">{temperature.toFixed(1)}</span>
                     </div>
                     <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="0.1"
                        value={temperature}
                        onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                     />
                     <div className="flex justify-between text-[10px] text-zinc-600 font-medium">
                        <span>Precise</span>
                        <span>Creative</span>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-zinc-400">
                           <Cpu className="w-4 h-4" />
                           <label className="text-xs font-semibold uppercase tracking-wider">Thinking Budget</label>
                        </div>
                        <span className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">{thinkingBudget}</span>
                     </div>
                     <input 
                        type="range" 
                        min="1024" 
                        max="32768" 
                        step="1024"
                        value={thinkingBudget}
                        onChange={(e) => onThinkingBudgetChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                     />
                     <div className="flex justify-between text-[10px] text-zinc-600 font-medium">
                        <span>Low (Faster)</span>
                        <span>Max (Deep)</span>
                     </div>
                  </div>
                )}
              </div>

              {/* Custom System Instruction */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">System Instruction</label>
                <textarea
                  value={systemInstruction}
                  onChange={(e) => onSystemInstructionChange(e.target.value)}
                  placeholder="Define exactly how the AI should behave. E.g., 'You are a strict academic editor focused on AP style...'"
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-xl focus:ring-2 focus:ring-zinc-700 focus:border-zinc-700 p-3 resize-none h-40 placeholder:text-zinc-600 leading-relaxed"
                />
              </div>
            </div>
            
            <div className="mt-5 pt-3 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={onClose}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
