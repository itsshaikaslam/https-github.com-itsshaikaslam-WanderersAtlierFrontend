import React, { useState } from 'react';
import { Icons } from '../constants';
import { generateImageFromText } from '../services/geminiService';
import { ImageAspectRatio } from '../types';

const TextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(ImageAspectRatio.SQUARE);
  const [style, setStyle] = useState('Cinematic');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImageFromText(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (error) {
      if ((error as Error).message.includes("API Key")) {
        alert("Please set your Gemini API Key in the Settings menu (Gear icon) to generate images.");
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)]">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Left Control Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
            <div>
                <h2 className="text-3xl font-bold text-lime-500 mb-2">AI Image Generator</h2>
                <p className="text-slate-600 text-sm">Bring your creative visions to life with the power of text.</p>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-900">Describe your vision...</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A futuristic city at night, neon lights reflecting on wet streets, cinematic style"
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none resize-none bg-white text-slate-800 shadow-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-2">Artistic Style</label>
                    <select 
                        value={style} 
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-lime-500 outline-none cursor-pointer"
                    >
                        <option>Cinematic</option>
                        <option>Photorealistic</option>
                        <option>Anime</option>
                        <option>Digital Art</option>
                        <option>Oil Painting</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-2">Aspect Ratio</label>
                    <select 
                        value={aspectRatio} 
                        onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}
                        className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-lime-500 outline-none cursor-pointer"
                    >
                        <option value={ImageAspectRatio.SQUARE}>1:1 (Square)</option>
                        <option value={ImageAspectRatio.LANDSCAPE}>16:9 (Landscape)</option>
                        <option value={ImageAspectRatio.PORTRAIT}>9:16 (Portrait)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-900 mb-2">Dimensions</label>
                <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-lime-500 text-slate-900 font-bold text-xs rounded-lg shadow-sm">1024x1024</button>
                    <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50">1280x720</button>
                    <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50">720x1280</button>
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="mt-auto w-full py-4 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-lime-500/20 transition-all transform active:scale-95"
            >
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
        </div>

        {/* Right Preview Panel */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden shadow-inner">
            {isLoading ? (
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Generating your vision...</p>
                </div>
            ) : generatedImage ? (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                    <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain shadow-2xl" />
                    <div className="absolute bottom-6 right-6 flex gap-3">
                         <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors">
                            <Icons.Refresh className="w-6 h-6" />
                         </button>
                         <button className="p-3 bg-lime-500 hover:bg-lime-400 rounded-full text-slate-900 shadow-lg shadow-lime-500/30 transition-colors">
                            <Icons.Download className="w-6 h-6" />
                         </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-400">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.Image className="w-8 h-8 opacity-50" />
                    </div>
                    <p>Your generated image will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TextToImage;