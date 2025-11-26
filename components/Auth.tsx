import React, { useState } from 'react';
import { Icons } from '../constants';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1200/1200')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Amplify Your Imagination.</h1>
          <p className="text-lg text-slate-300 mb-8">
            Unlock your creative potential with our suite of AI-powered tools. Sign up to start creating.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cyan-50">
        <div className="w-full max-w-md">
            <div className="flex items-center gap-2 mb-8">
                <Icons.Magic className="w-8 h-8 text-lime-500" />
                <span className="text-xl font-bold text-slate-900">Wanderer’s Atelier</span>
            </div>

            <h2 className="text-3xl font-bold text-lime-500 mb-2">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-slate-600 mb-8">
                {isLogin ? 'Please enter your details to sign in.' : "Welcome! Let's get you started."}
            </p>

            <div className="flex bg-slate-200 p-1 rounded-lg mb-6">
                <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sign Up
                </button>
                <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sign In
                </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 outline-none bg-white text-slate-900"
                    />
                </div>
                <div>
                    <div className="flex justify-between mb-1">
                         <label className="block text-sm font-medium text-slate-700">Password</label>
                         {isLogin && <a href="#" className="text-sm text-lime-600 hover:underline">Forgot password?</a>}
                    </div>
                   
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 outline-none bg-white text-slate-900"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold py-3 rounded-lg transition-colors shadow-lg shadow-lime-500/20"
                >
                    {isLogin ? 'Sign In' : 'Sign Up with Email'}
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-cyan-50 text-slate-500">OR</span>
                </div>
            </div>

            <div className="space-y-3">
                <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg transition-colors">
                    <Icons.Google className="w-5 h-5" />
                    Continue with Google
                </button>
                <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg transition-colors">
                    <Icons.Github className="w-5 h-5" />
                    Continue with GitHub
                </button>
            </div>
            
             <p className="mt-8 text-center text-xs text-slate-500">
                By signing up, you agree to our <a href="#" className="text-lime-600 hover:underline">Terms of Service</a>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;