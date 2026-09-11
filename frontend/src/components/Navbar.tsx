import React from "react";
import { Shield, Sun, Moon, LogIn, LogOut, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-[#090e1c]/80 light:border-slate-200 light:bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight text-white light:text-slate-900">AITrust</span>
              <span className="font-bold text-lg tracking-tight text-emerald-400 light:text-emerald-600">Score</span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-1 block font-medium">Credibility Engine</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Analyze Button */}
          {currentPage !== "analyze" && (
            <button
              onClick={() => onNavigate("analyze")}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white transition-colors light:border-slate-200 light:bg-slate-100 light:text-slate-700"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* User Auth Info */}
          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800 light:border-slate-200">
              <div 
                onClick={() => onNavigate("settings")}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-semibold text-emerald-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-semibold text-slate-200 light:text-slate-800">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-red-400 transition-colors light:hover:bg-slate-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
