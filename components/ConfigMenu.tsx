import React from 'react';
import { Settings2, ChevronDown, Zap, BrainCircuit } from 'lucide-react';
import { ToneStyle, GeminiModel } from '../types';

interface ConfigMenuProps {
  selectedStyle: ToneStyle;
  onStyleChange: (style: ToneStyle) => void;
  selectedModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
  customInstruction: string;
  onCustomInstructionChange: (instruction: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const ConfigMenu: React.FC<ConfigMenuProps> = ({
  selectedStyle,
  onStyleChange,
  selectedModel,
  onModelChange,
  customInstruction,
  onCustomInstructionChange,
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
          <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 sm:w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-5">
              
              {/* Model Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Model Engine</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onModelChange(GeminiModel.Flash)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                      selectedModel === GeminiModel.Flash 
                        ? 'bg-zinc-800 border-indigo-500/50 text-indigo-200 ring-1 ring-indigo-500/20' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <Zap className="w-4 h-4 mb-1.5" />
                    <span>Flash 3.0</span>
                    <span className="text-[10px] opacity-60 font-normal">Fast</span>
                  </button>
                  <button
                    onClick={() => onModelChange(GeminiModel.Pro)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                      selectedModel === GeminiModel.Pro
                        ? 'bg-zinc-800 border-purple-500/50 text-purple-200 ring-1 ring-purple-500/20' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <BrainCircuit className="w-4 h-4 mb-1.5" />
                    <span>Pro 3.0</span>
                    <span className="text-[10px] opacity-60 font-normal">Deep Think</span>
                  </button>
                </div>
              </div>

              {/* Style Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Style & Tone</label>
                <div className="relative">
                  <select 
                    value={selectedStyle}
                    onChange={(e) => onStyleChange(e.target.value as ToneStyle)}
                    className="w-full appearance-none bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-lg focus:ring-2 focus:ring-zinc-700 focus:border-zinc-700 block p-2.5 pr-8 transition-colors cursor-pointer"
                  >
                    {Object.values(ToneStyle).map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {selectedStyle === ToneStyle.Custom && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Custom Instruction</label>
                  <textarea
                    value={customInstruction}
                    onChange={(e) => onCustomInstructionChange(e.target.value)}
                    placeholder="E.g., Make it sound like a 1920s detective..."
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-lg focus:ring-2 focus:ring-zinc-700 focus:border-zinc-700 p-2.5 resize-none h-24 placeholder:text-zinc-600"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={onClose}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
