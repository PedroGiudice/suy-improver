import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Download, Copy, Check, AlignLeft, FileText, History, Zap, ArrowRight, X, BrainCircuit } from 'lucide-react';
import { improveText } from './services/geminiService';
import { HistoryItem, GeminiModel } from './types';
import { Button } from './components/Button';
import { ConfigMenu } from './components/ConfigMenu';
import { HistoryList } from './components/HistoryList';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuration State
  const [selectedModel, setSelectedModel] = useState<GeminiModel>(GeminiModel.Flash);
  const [systemInstruction, setSystemInstruction] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [thinkingBudget, setThinkingBudget] = useState(16000); // Default mid-range thinking

  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');
  const [hasCopied, setHasCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // UI States
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('textRefineHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  // Save history to local storage when it changes
  useEffect(() => {
    localStorage.setItem('textRefineHistory', JSON.stringify(history));
  }, [history]);

  const handleImprove = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    
    try {
      const result = await improveText(
        inputText, 
        selectedModel, 
        systemInstruction, 
        temperature, 
        thinkingBudget
      );
      setOutputText(result);

      // Add to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        original: inputText,
        improved: result,
        model: selectedModel,
        systemInstruction: systemInstruction,
        temperature: selectedModel === GeminiModel.Flash ? temperature : undefined,
        thinkingBudget: selectedModel === GeminiModel.Pro ? thinkingBudget : undefined
      };
      
      setHistory(prev => [newItem, ...prev]);

    } catch (error) {
      console.error(error);
      setOutputText("Error: Failed to generate text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const restoreVersion = (item: HistoryItem) => {
    setInputText(item.original);
    setOutputText(item.improved);
    if (item.model) setSelectedModel(item.model);
    if (item.systemInstruction) setSystemInstruction(item.systemInstruction);
    if (item.temperature !== undefined) setTemperature(item.temperature);
    if (item.thinkingBudget !== undefined) setThinkingBudget(item.thinkingBudget);
    
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  const handleExport = () => {
    if (!outputText) return;
    
    // Extract filename from first line
    const lines = outputText.split('\n');
    let filename = `improved_text_${Date.now()}.md`;
    
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Heuristic: If first line is reasonably short and doesn't look like a normal sentence
      if (firstLine.length < 100 && firstLine.length > 0) {
         const reallySafeName = firstLine.replace(/[^a-zA-Z0-9\._-]/g, '');
         if (reallySafeName.length > 0) {
            filename = reallySafeName;
            if (!filename.toLowerCase().endsWith('.md')) {
                filename += '.md';
            }
         }
      }
    }

    const blob = new Blob([outputText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded-lg shadow-lg transition-colors duration-500 ${selectedModel === GeminiModel.Pro ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20' : 'bg-gradient-to-br from-indigo-500 to-cyan-600 shadow-indigo-500/20'}`}>
              {selectedModel === GeminiModel.Pro ? <BrainCircuit className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-zinc-100 leading-none">TextRefine AI</span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide mt-0.5">
                {selectedModel === GeminiModel.Pro ? 'PRO REASONING' : 'FLASH SPEED'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
             <ConfigMenu 
               selectedModel={selectedModel}
               onModelChange={setSelectedModel}
               systemInstruction={systemInstruction}
               onSystemInstructionChange={setSystemInstruction}
               temperature={temperature}
               onTemperatureChange={setTemperature}
               thinkingBudget={thinkingBudget}
               onThinkingBudgetChange={setThinkingBudget}
               isOpen={isConfigOpen}
               onToggle={() => setIsConfigOpen(!isConfigOpen)}
               onClose={() => setIsConfigOpen(false)}
             />

             <div className="h-6 w-px bg-zinc-800 mx-2 hidden sm:block"></div>

             <button
               onClick={() => setIsHistoryOpen(true)}
               className="flex items-center space-x-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
               title="History"
             >
               <History className="w-4 h-4" />
               <span className="text-sm font-medium hidden sm:inline-block">History</span>
             </button>
          </div>
        </div>
      </header>

      <HistoryList 
        history={history}
        onSelect={restoreVersion}
        onClear={handleClearHistory}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col">
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
          
          {/* Input Panel */}
          <div className="flex flex-col h-full bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden ring-1 ring-white/5">
            <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Original Text</span>
              </div>
              <span className="text-xs text-zinc-600 font-mono">{inputText.length} chars</span>
            </div>
            
            <div className="flex-1 relative group">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-full p-5 bg-transparent border-0 focus:ring-0 resize-none text-base leading-relaxed text-zinc-300 placeholder:text-zinc-600 outline-none font-mono"
                spellCheck={false}
              />
              {/* Floating Action Button for mobile mostly, but good for quick access */}
              <div className="absolute bottom-4 right-4 z-10">
                 <Button 
                    onClick={handleImprove} 
                    isLoading={isLoading} 
                    disabled={!inputText.trim()}
                    icon={selectedModel === GeminiModel.Pro ? <BrainCircuit className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    className={`shadow-lg border-none !text-white ${selectedModel === GeminiModel.Pro ? '!bg-purple-600 hover:!bg-purple-500 shadow-purple-500/20' : '!bg-indigo-600 hover:!bg-indigo-500 shadow-indigo-500/20'}`}
                  >
                    {isLoading ? 'Refining...' : 'Improve'}
                  </Button>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col h-full bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden ring-1 ring-white/5 relative">
            <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${selectedModel === GeminiModel.Pro ? 'bg-purple-500 shadow-purple-500/40' : 'bg-emerald-500 shadow-emerald-500/40'}`}></div>
                 <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Refined Version</span>
              </div>
              
              <div className="flex items-center space-x-1">
                 <div className="flex bg-zinc-950/50 p-0.5 rounded-lg mr-2 border border-zinc-800">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`p-1.5 rounded-md transition-all ${activeTab === 'preview' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      title="Preview"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab('markdown')}
                      className={`p-1.5 rounded-md transition-all ${activeTab === 'markdown' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      title="Markdown Source"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                 </div>
                 
                 <Button variant="ghost" onClick={handleCopy} disabled={!outputText} className="!p-1.5 h-7 w-7" title="Copy">
                    {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                 </Button>
                 <Button variant="ghost" onClick={handleExport} disabled={!outputText} className="!p-1.5 h-7 w-7" title="Export">
                    <Download className="w-3.5 h-3.5" />
                 </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 relative bg-zinc-900/30">
               {!outputText && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 p-8 text-center select-none pointer-events-none">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 shadow-inner">
                      <ArrowRight className="w-5 h-5 text-zinc-600" />
                   </div>
                   <p className="text-sm font-medium text-zinc-500">Waiting for input...</p>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/60 backdrop-blur-[2px] z-10">
                   <div className="relative">
                     <div className={`w-12 h-12 rounded-full border-2 animate-spin ${selectedModel === GeminiModel.Pro ? 'border-purple-500/30 border-t-purple-500' : 'border-indigo-500/30 border-t-indigo-500'}`}></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        {selectedModel === GeminiModel.Pro ? <BrainCircuit className="w-4 h-4 text-purple-500" /> : <Sparkles className="w-4 h-4 text-indigo-500" />}
                     </div>
                   </div>
                   {selectedModel === GeminiModel.Pro && (
                     <p className="mt-4 text-xs font-mono text-purple-400 animate-pulse">Reasoning...</p>
                   )}
                </div>
              )}

              {outputText && (
                 <div className="prose prose-invert prose-zinc max-w-none">
                    {activeTab === 'preview' ? (
                      <ReactMarkdown 
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-zinc-100 mb-4 pb-2 border-b border-zinc-800" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-zinc-100 mt-6 mb-3" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-medium text-zinc-200 mt-5 mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="leading-relaxed text-zinc-300 mb-4" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-4 space-y-1 text-zinc-300" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 text-zinc-300" {...props} />,
                          li: ({node, ...props}) => <li className="text-zinc-300" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500/50 pl-4 italic text-zinc-400 my-4" {...props} />,
                          code: ({node, ...props}) => <code className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
                          pre: ({node, ...props}) => <pre className="bg-zinc-950 border border-zinc-800 text-zinc-300 p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />,
                          strong: ({node, ...props}) => <strong className="text-zinc-100 font-semibold" {...props} />,
                        }}
                      >
                        {outputText}
                      </ReactMarkdown>
                    ) : (
                      <textarea 
                        readOnly 
                        value={outputText}
                        className="w-full h-full bg-transparent border-0 resize-none font-mono text-sm text-zinc-400 focus:ring-0 p-0"
                        style={{ minHeight: '100%' }}
                      />
                    )}
                 </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center">
           <p className="text-xs text-zinc-600">Powered by Gemini 3 Flash & Pro • Secure & Private</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
