import React from 'react';
import { Icons } from '../constants';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, onLogout, onOpenSettings }) => {
  const navItems = [
    { id: AppView.PROMPT_ENHANCER, label: 'Prompt Enhancer' },
    { id: AppView.TEXT_TO_IMAGE, label: 'Image Generator' },
    { id: AppView.SKETCH_TO_IMAGE, label: 'Sketch to Image' },
    { id: AppView.PRODUCT_AD, label: 'Ad Enhancer' },
    { id: AppView.IMAGE_EDITOR, label: 'Image Editor' },
    { id: AppView.THUMBNAIL_GEN, label: 'Thumbnail Gen' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onChangeView(AppView.TEXT_TO_IMAGE)}>
              <Icons.Magic className="h-8 w-8 text-lime-500" />
              <span className="font-bold text-xl text-slate-900 hidden md:block">Wanderer’s Atelier</span>
            </div>
            <div className="hidden xl:ml-10 xl:flex xl:space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-lime-50 text-lime-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={onOpenSettings}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2"
                title="Settings / API Key"
            >
                <Icons.Settings className="w-5 h-5" />
            </button>
            <button className="bg-lime-500 hover:bg-lime-400 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-colors hidden sm:block">
              Upgrade
            </button>
            <div className="relative group cursor-pointer">
                 <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden">
                     <img src="https://picsum.photos/seed/user/100/100" alt="User" />
                 </div>
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-200 hidden group-hover:block">
                     <button onClick={onOpenSettings} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left">API Settings</button>
                     <button onClick={onLogout} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left">Sign Out</button>
                 </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="xl:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-slate-100 scrollbar-hide">
         {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={`px-3 py-1 mr-2 rounded-full text-xs font-medium border transition-colors ${
                    currentView === item.id
                      ? 'bg-lime-500 text-slate-900 border-lime-500'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;