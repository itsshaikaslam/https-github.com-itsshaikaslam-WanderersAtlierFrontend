import React, { useState } from 'react';
import { Icons } from '../constants';
import { generateImageFromText } from '../services/geminiService';
import { ImageAspectRatio, ThumbnailConfig } from '../types';

const ThumbnailGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<ThumbnailConfig>({
        layout: 'Text Over Image',
        fontStyle: 'Futuristic',
        aspectRatio: ImageAspectRatio.LANDSCAPE
    });

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        // Append config to prompt to guide the model
        const fullPrompt = `YouTube Thumbnail, ${config.layout} layout, ${config.fontStyle} font style. ${prompt}`;
        try {
            const result = await generateImageFromText(fullPrompt, config.aspectRatio);
            setGeneratedImage(result);
        } catch (error) {
            if ((error as Error).message.includes("API Key")) {
                alert("Please set your Gemini API Key in the Settings menu (Gear icon).");
            } else {
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="mb-8">
                <h2 className="text-3xl font-bold text-lime-500 mb-2">AI YouTube Thumbnail Generator</h2>
                <p className="text-slate-600">Describe your video, and let AI create the perfect click-worthy thumbnail.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
                {/* Left Controls */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                             <label className="block text-sm font-bold text-slate-900 mb-2">Enter your video title or a descriptive prompt</label>
                             <textarea 
                                className="w-full h-32 p-4 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-lime-500 outline-none text-slate-800 resize-none shadow-sm"
                                placeholder="e.g., 'Unboxing the new futuristic tech gadget'"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                             />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Aspect Ratio</label>
                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                                {['16:9', '1:1', '9:16'].map(ratio => (
                                    <button 
                                        key={ratio} 
                                        onClick={() => setConfig({...config, aspectRatio: ratio === '16:9' ? ImageAspectRatio.LANDSCAPE : ratio === '1:1' ? ImageAspectRatio.SQUARE : ImageAspectRatio.PORTRAIT})}
                                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${
                                            (ratio === '16:9' && config.aspectRatio === ImageAspectRatio.LANDSCAPE) ||
                                            (ratio === '1:1' && config.aspectRatio === ImageAspectRatio.SQUARE) ||
                                            (ratio === '9:16' && config.aspectRatio === ImageAspectRatio.PORTRAIT)
                                            ? 'bg-lime-500 text-slate-900 shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-bold text-slate-900 mb-3">Layout Style</label>
                             <div className="grid grid-cols-3 gap-4">
                                 {['Text Over Image', 'Split Screen', 'Image Only'].map(layout => (
                                     <button 
                                        key={layout}
                                        onClick={() => setConfig({...config, layout: layout as any})}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                            config.layout === layout 
                                            ? 'border-lime-500 bg-lime-50' 
                                            : 'border-slate-200 hover:border-lime-200'
                                        }`}
                                     >
                                         <div className={`w-12 h-8 rounded bg-slate-200 ${
                                             layout === 'Text Over Image' ? 'flex items-center justify-center before:content-[""] before:w-8 before:h-1 before:bg-slate-400' :
                                             layout === 'Split Screen' ? 'flex before:w-1/2 before:bg-slate-400 before:h-full' : ''
                                         }`}></div>
                                         <span className="text-xs font-medium text-slate-600 text-center">{layout}</span>
                                     </button>
                                 ))}
                             </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Font Style</label>
                            <select 
                                className="w-full p-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-lime-500"
                                value={config.fontStyle}
                                onChange={(e) => setConfig({...config, fontStyle: e.target.value})}
                            >
                                <option>Futuristic</option>
                                <option>Bold & Modern</option>
                                <option>Handwritten</option>
                                <option>Minimalist</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={!prompt || isLoading}
                            className="w-full py-4 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 text-lg transition-transform transform active:scale-95"
                        >
                             {isLoading ? 'Creating...' : 'Generate Thumbnail'}
                        </button>
                    </div>
                </div>

                {/* Right Preview */}
                <div className="bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative p-8">
                     {generatedImage ? (
                         <div className="relative w-full h-full flex items-center justify-center">
                              <img src={generatedImage} alt="Thumbnail" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
                         </div>
                     ) : (
                         <div className="text-center text-slate-500">
                             <div className="bg-slate-200 p-6 rounded-full inline-block mb-4">
                                <Icons.Image className="w-12 h-12 text-slate-400" />
                             </div>
                             <p className="text-lg font-medium text-slate-700">Your AI-generated thumbnail will appear here.</p>
                         </div>
                     )}

                     {generatedImage && (
                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                             <button className="px-6 py-2 bg-white border border-slate-200 shadow-sm rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Icons.Download className="w-4 h-4" /> Download
                             </button>
                             <button className="px-6 py-2 bg-white border border-slate-200 shadow-sm rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Icons.Refresh className="w-4 h-4" /> Regenerate
                             </button>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default ThumbnailGenerator;