import React, { useState, useRef } from 'react';
import { Icons } from '../constants';
import { generateImageFromSketch } from '../services/geminiService';

const SketchToImage: React.FC = () => {
  const [sketchFile, setSketchFile] = useState<File | null>(null);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSketchFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setSketchPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sketchPreview) return;
    setIsLoading(true);
    try {
      const result = await generateImageFromSketch(sketchPreview, prompt);
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
        <h2 className="text-3xl font-bold text-lime-500 mb-2">Sketch to Image</h2>
        <p className="text-slate-600">Transform your simple drawings into stunning, detailed visuals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Input Side */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex gap-4 mb-4 border-b border-slate-100 pb-2">
                <button className="text-lime-600 font-semibold border-b-2 border-lime-500 pb-2">Upload Sketch</button>
                <button className="text-slate-500 font-medium hover:text-slate-700 pb-2">Draw Sketch</button>
            </div>

            <div 
                className="flex-1 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
            >
                {sketchPreview ? (
                    <img src={sketchPreview} alt="Sketch Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                    <>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Drag & Drop Your Sketch Here</h3>
                        <p className="text-sm text-slate-500 mb-6">Or, browse your files to upload.</p>
                        <button className="px-6 py-2 bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold rounded-lg shadow-sm">
                            Upload Sketch
                        </button>
                    </>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            
            {/* Simple Controls */}
            <div className="mt-6 space-y-4">
                 <input 
                    type="text" 
                    placeholder="Describe the desired output (optional)..." 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-lime-500 outline-none text-sm"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                 />
                 <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 w-20">Creativity</span>
                    <input type="range" className="flex-1 accent-lime-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                    <span className="text-xs text-slate-500 w-8">50</span>
                 </div>
            </div>
        </div>

        {/* Output Side */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex-1 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                 {isLoading ? (
                     <div className="text-center">
                        <Icons.Refresh className="w-10 h-10 animate-spin text-lime-500 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Rendering...</p>
                     </div>
                 ) : generatedImage ? (
                     <img src={generatedImage} alt="Result" className="w-full h-full object-cover" />
                 ) : (
                     <div className="text-center text-slate-400">
                        <Icons.Image className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-semibold text-slate-800">Your generated image will appear here.</h3>
                        <p className="text-sm">Upload a sketch and click generate to begin.</p>
                     </div>
                 )}
            </div>
             <div className="mt-6 flex gap-3">
                 <button className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                     <Icons.Download className="w-5 h-5" /> Download
                 </button>
                 <button 
                    onClick={handleGenerate}
                    disabled={!sketchPreview || isLoading}
                    className="flex-[2] py-3 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-colors flex items-center justify-center gap-2"
                 >
                     <Icons.Magic className="w-5 h-5" /> Generate
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default SketchToImage;