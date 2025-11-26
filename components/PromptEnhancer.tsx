import React, { useState } from 'react';
import { Icons } from '../constants';
import { enhancePrompt } from '../services/geminiService';

const PromptEnhancer: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnhance = async () => {
    if (!inputPrompt.trim()) return;
    setIsLoading(true);
    const result = await enhancePrompt(inputPrompt);
    setEnhancedPrompt(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-lime-500 mb-2">Prompt Enhancer</h2>
        <p className="text-slate-600">Refine your ideas into powerful, detailed prompts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Input/Output Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Your Prompt</label>
            <textarea
              className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none resize-none bg-slate-50 text-slate-800"
              placeholder="Enter your prompt here..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            ></textarea>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400">{inputPrompt.length}/2000 characters</span>
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setInputPrompt(''); setEnhancedPrompt(''); }}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={handleEnhance}
                        disabled={isLoading || !inputPrompt}
                        className="flex items-center gap-2 px-6 py-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-lg transition-colors shadow-lg shadow-lime-500/20"
                    >
                         {isLoading ? (
                            <Icons.Refresh className="w-5 h-5 animate-spin" />
                        ) : (
                            <Icons.Magic className="w-5 h-5" />
                        )}
                        Enhance
                    </button>
                </div>
            </div>
          </div>

          {enhancedPrompt && (
            <div className="bg-cyan-100/50 rounded-2xl p-6 border border-cyan-200 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900">Enhanced Prompt</h3>
                <button 
                    onClick={() => navigator.clipboard.writeText(enhancedPrompt)}
                    className="p-2 hover:bg-cyan-200/50 rounded-lg transition-colors text-cyan-700"
                    title="Copy to clipboard"
                >
                    <Icons.Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-800 leading-relaxed bg-white/60 p-4 rounded-xl border border-cyan-200/50">
                {enhancedPrompt}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 flex gap-4">
               <button className="flex-1 text-center py-2 text-sm font-medium text-lime-600 border-b-2 border-lime-500">History</button>
               <button className="flex-1 text-center py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Examples</button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                {/* Mock History Items */}
                <div className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                    <p className="font-medium text-slate-900 text-sm mb-1 truncate">Original: "Astronaut on Mars"</p>
                    <p className="text-xs text-slate-500 line-clamp-2">Enhanced: "A hyper-realistic, cinematic 4K photograph of a lone astronaut standing..."</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">2 hours ago</span>
                </div>
                <div className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                    <p className="font-medium text-slate-900 text-sm mb-1 truncate">Original: "Cat in a library"</p>
                    <p className="text-xs text-slate-500 line-clamp-2">Enhanced: "A cozy, sunlit library with towering oak bookshelves..."</p>
                     <span className="text-[10px] text-slate-400 mt-2 block">1 day ago</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEnhancer;
