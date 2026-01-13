import React from 'react';
import { History, Clock, ArrowRight, Trash2, Zap, BrainCircuit, Thermometer, Cpu } from 'lucide-react';
import { HistoryItem, GeminiModel } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onClear,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-zinc-900 border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2 text-zinc-100">
            <History className="w-5 h-5" />
            <span className="font-semibold">Version History</span>
          </div>
          <div className="flex items-center space-x-2">
             {history.length > 0 && (
              <button 
                onClick={onClear}
                className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-center">
              <Clock className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">No versions saved yet.</p>
              <p className="text-xs mt-1 opacity-60">Generate some text to see history here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-600 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {item.model === GeminiModel.Pro ? (
                       <div className="flex items-center space-x-2">
                         <div className="flex items-center text-xs font-medium text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full border border-purple-400/20">
                            <BrainCircuit className="w-3 h-3 mr-1" /> Pro
                         </div>
                         {item.thinkingBudget && (
                           <div className="flex items-center text-[10px] text-zinc-500" title="Thinking Budget">
                             <Cpu className="w-3 h-3 mr-1 opacity-70" /> {item.thinkingBudget}
                           </div>
                         )}
                       </div>
                    ) : (
                       <div className="flex items-center space-x-2">
                         <div className="flex items-center text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            <Zap className="w-3 h-3 mr-1" /> Flash
                         </div>
                         {item.temperature !== undefined && (
                           <div className="flex items-center text-[10px] text-zinc-500" title="Temperature">
                             <Thermometer className="w-3 h-3 mr-1 opacity-70" /> {item.temperature}
                           </div>
                         )}
                       </div>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {item.systemInstruction && (
                   <div className="mb-3">
                     <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold mb-1">Instruction</p>
                     <p className="text-xs text-zinc-400 line-clamp-1 italic border-l-2 border-zinc-800 pl-2">
                        {item.systemInstruction}
                     </p>
                   </div>
                )}
                
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold mb-0.5">Original</p>
                    <p className="text-xs text-zinc-400 line-clamp-2 font-mono bg-zinc-900/50 p-1.5 rounded">
                      {item.original}
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-indigo-500/0 rounded-xl group-hover:border-indigo-500/20 pointer-events-none transition-colors"></div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
