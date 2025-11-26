import React, { useState, useRef } from 'react';
import { Icons } from '../constants';
import { editImageWithPrompt } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
          setOriginalImage(e.target?.result as string);
          setEditedImage(null); // Reset edit on new upload
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
      if (!originalImage || !prompt) return;
      setIsLoading(true);
      try {
        const result = await editImageWithPrompt(originalImage, prompt);
        setEditedImage(result);
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

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-lime-500 mb-2">AI Image Editor</h2>
        <p className="text-slate-600">Describe the changes you want, and let our AI bring them to life.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Controls */}
          <div className="w-full lg:w-1/3 space-y-6">
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-cyan-100/50 border-2 border-dashed border-cyan-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-100 transition-colors"
               >
                   <Icons.Upload className="w-10 h-10 text-cyan-600 mb-2" />
                   <p className="font-semibold text-cyan-800">Upload an Image</p>
                   <p className="text-xs text-cyan-600">to start editing</p>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               </div>

               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <label className="block text-sm font-semibold text-slate-900 mb-2">AI Prompt</label>
                   <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Change hair to platinum blonde and add a futuristic city background."
                      className="w-full h-32 p-4 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-lime-500 resize-none text-sm"
                   />
               </div>
                
                <button 
                    onClick={handleGenerate}
                    disabled={!originalImage || !prompt || isLoading}
                    className="w-full py-4 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2"
                >
                     {isLoading ? <Icons.Refresh className="w-5 h-5 animate-spin" /> : null}
                     {isLoading ? 'Processing...' : 'Generate'}
                </button>

                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                     <div className="flex justify-between items-center cursor-pointer">
                         <span className="font-semibold text-slate-700">Adjustments</span>
                         <Icons.Check className="w-4 h-4 text-slate-400" />
                     </div>
                     <div className="space-y-3">
                         <div className="flex items-center gap-4 text-xs text-slate-600">
                             <span className="w-16">Brightness</span>
                             <input type="range" className="flex-1 accent-lime-500 h-1.5 bg-slate-200 rounded-lg" />
                         </div>
                         <div className="flex items-center gap-4 text-xs text-slate-600">
                             <span className="w-16">Contrast</span>
                             <input type="range" className="flex-1 accent-lime-500 h-1.5 bg-slate-200 rounded-lg" />
                         </div>
                         <div className="flex items-center gap-4 text-xs text-slate-600">
                             <span className="w-16">Saturation</span>
                             <input type="range" className="flex-1 accent-lime-500 h-1.5 bg-slate-200 rounded-lg" />
                         </div>
                     </div>
                 </div>
          </div>

          {/* Main Viewport */}
          <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative min-h-[500px]">
              {originalImage ? (
                  <div 
                    className="relative w-full h-full select-none cursor-ew-resize group"
                    onMouseMove={handleDrag}
                    onClick={handleDrag}
                  >
                      {/* Base Image (Original) */}
                      <img src={originalImage} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
                      
                      {/* Overlay Image (Edited) - Clipped */}
                      {editedImage && (
                          <div 
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${sliderPosition}%` }}
                          >
                               <img src={editedImage} alt="Edited" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100vw' }} /> 
                               {/* Note: In a real app, width needs to match container, simplified here with 100vw but ideally calculate parent width */}
                          </div>
                      )}

                       {/* Slider Handle */}
                       {editedImage && (
                           <div 
                                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-xl"
                                style={{ left: `${sliderPosition}%` }}
                           >
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                               </div>
                           </div>
                       )}

                       {/* Labels */}
                        <span className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded font-bold">BEFORE</span>
                        {editedImage && <span className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded font-bold">AFTER</span>}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                       <Icons.Image className="w-20 h-20 opacity-20 mb-4" />
                       <p>Upload an image to start editing</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default ImageEditor;