import React, { useState, useRef } from 'react';
import { Icons } from '../constants';
import { enhanceProductAd } from '../services/geminiService';
import { ProductAdConfig } from '../types';

const ProductAdEnhancer: React.FC = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [generatedAd, setGeneratedAd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [config, setConfig] = useState<ProductAdConfig>({
      background: 'Studio',
      lighting: 'Bright',
      resolution: 'Print (3000x2000)'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setProductImage(e.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEnhance = async () => {
      if (!productImage) return;
      setIsLoading(true);
      try {
        const result = await enhanceProductAd(productImage, config);
        setGeneratedAd(result);
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
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">AI Product Ad Enhancer</h2>
        <p className="text-slate-600 text-lg">Transform your product photos into professional-grade advertisements in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Config Panel */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                 {!productImage ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-cyan-300 bg-cyan-50 rounded-2xl p-8 text-center cursor-pointer hover:bg-cyan-100 transition-colors"
                    >
                        <h3 className="text-slate-900 font-bold mb-2">Drag & drop your product photo</h3>
                        <p className="text-xs text-slate-500 mb-6">Supports JPG, PNG. Max 10MB.</p>
                        <button className="px-6 py-2 bg-lime-500 text-slate-900 text-sm font-bold rounded-full">
                            Upload Product Photo
                        </button>
                    </div>
                 ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                        <img src={productImage} alt="Product" className="w-full h-48 object-cover" />
                        <button 
                            onClick={() => setProductImage(null)}
                            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-slate-600 hover:text-red-500"
                        >
                            <Icons.Refresh className="w-4 h-4 rotate-45" />
                        </button>
                         <div className="p-3 bg-white">
                             <p className="text-sm font-semibold text-slate-900">Uploading image.jpg...</p>
                             <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                                 <div className="bg-lime-500 h-2 rounded-full w-full"></div>
                             </div>
                         </div>
                    </div>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3">Background Style</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Studio', 'Outdoor', 'Gradient'].map(style => (
                            <button 
                                key={style}
                                onClick={() => setConfig({...config, background: style as any})}
                                className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${config.background === style ? 'border-lime-500 ring-2 ring-lime-200' : 'border-transparent'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10`} />
                                <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white z-20">{style}</span>
                                {/* Mock Backgrounds */}
                                <div className={`w-full h-full ${
                                    style === 'Studio' ? 'bg-slate-700' : 
                                    style === 'Outdoor' ? 'bg-green-700' : 'bg-indigo-600'
                                }`}></div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3">Lighting Effects</label>
                    <div className="flex flex-wrap gap-2">
                         {['Bright', 'Dramatic', 'Soft'].map(light => (
                            <button 
                                key={light}
                                onClick={() => setConfig({...config, lighting: light as any})}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                                    config.lighting === light 
                                    ? 'bg-lime-500 text-slate-900' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {light}
                            </button>
                        ))}
                    </div>
                </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3">Image Resolution</label>
                    <select 
                        className="w-full p-3 rounded-xl bg-slate-100 border-none text-sm text-slate-700 outline-none focus:ring-2 focus:ring-lime-500"
                        value={config.resolution}
                        onChange={(e) => setConfig({...config, resolution: e.target.value})}
                    >
                        <option>Print (3000x2000)</option>
                        <option>Web (1920x1080)</option>
                        <option>Social (1080x1080)</option>
                    </select>
                </div>

                <button 
                    onClick={handleEnhance}
                    disabled={!productImage || isLoading}
                    className="w-full py-4 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2"
                >
                     <Icons.Magic className="w-5 h-5" /> Enhance Ad
                </button>
            </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl min-h-[600px] flex items-center justify-center">
            {isLoading ? (
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-slate-700 border-t-lime-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300 animate-pulse">Enhancing your product...</p>
                </div>
            ) : generatedAd ? (
                 <img src={generatedAd} alt="Enhanced Ad" className="w-full h-full object-contain" />
            ) : productImage ? (
                <img src={productImage} alt="Original" className="w-full h-full object-contain opacity-50 blur-sm transform scale-95 transition-all" />
            ) : (
                <div className="text-slate-600 text-center">
                    <Icons.Image className="w-24 h-24 mx-auto mb-4 opacity-20" />
                    <p>Upload a product to see magic happen</p>
                </div>
            )}
            
            {generatedAd && (
                <div className="absolute bottom-8 right-8 flex gap-4">
                     <button className="px-6 py-3 bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold rounded-full flex items-center gap-2 shadow-lg">
                        <Icons.Download className="w-5 h-5" /> Download
                    </button>
                     <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full flex items-center gap-2">
                        Share
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductAdEnhancer;