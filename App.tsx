import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import PromptEnhancer from './components/PromptEnhancer';
import TextToImage from './components/TextToImage';
import SketchToImage from './components/SketchToImage';
import ProductAdEnhancer from './components/ProductAdEnhancer';
import ImageEditor from './components/ImageEditor';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import { AppView } from './types';
import { setApiKey, getApiKey } from './services/geminiService';
import { Icons } from './constants';

const App: React.FC = () => {
  // Simple auth state for demo
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.TEXT_TO_IMAGE);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Load existing key on mount
  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setApiKeyInput(key);
      setHasApiKey(true);
    }
  }, []);

  const handleSaveKey = () => {
    setApiKey(apiKeyInput);
    setHasApiKey(!!apiKeyInput);
    setShowSettings(false);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.PROMPT_ENHANCER:
        return <PromptEnhancer />;
      case AppView.TEXT_TO_IMAGE:
        return <TextToImage />;
      case AppView.SKETCH_TO_IMAGE:
        return <SketchToImage />;
      case AppView.PRODUCT_AD:
        return <ProductAdEnhancer />;
      case AppView.IMAGE_EDITOR:
        return <ImageEditor />;
      case AppView.THUMBNAIL_GEN:
        return <ThumbnailGenerator />;
      default:
        return <TextToImage />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-cyan-50 relative">
      <Navbar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={() => setIsAuthenticated(false)} 
        onOpenSettings={() => setShowSettings(true)}
      />
      
      {!hasApiKey && (
        <div className="bg-lime-100 border-b border-lime-200 text-lime-800 px-4 py-3 text-center text-sm font-medium">
          Welcome to Wanderer’s Atelier! Please <button onClick={() => setShowSettings(true)} className="underline font-bold hover:text-lime-900">set your API Key</button> in settings to start creating.
        </div>
      )}

      <main className="animate-fade-in">
        {renderView()}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Icons.Settings className="w-5 h-5 text-lime-500" />
                API Configuration
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Google Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-lime-500 outline-none text-slate-900 font-mono text-sm"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Your key is stored locally in your browser and used only for API requests.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveKey}
                  className="flex-1 py-2 bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-lime-500/20 transition-colors"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;