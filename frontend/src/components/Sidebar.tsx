import React from "react";
import { LayoutDashboard, FileSearch, History, Database, Sliders, BookOpen, GraduationCap } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyze", label: "Analyze Content", icon: FileSearch },
    { id: "history", label: "Analysis History", icon: History },
    { id: "sources", label: "Sources Directory", icon: Database },
    { id: "methodology", label: "Scoring Methodology", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Sliders },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/40 p-4 transition-colors light:border-slate-200 light:bg-white/60">
      
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Menu
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Academic Credits Footer */}
      <div className="pt-4 border-t border-slate-800/80 light:border-slate-200 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 light:text-emerald-600 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>VIT Chennai Project</span>
        </div>
        <div className="text-[11px] text-slate-400 light:text-slate-500 space-y-0.5">
          <p className="font-medium text-slate-300 light:text-slate-700">Tamohar Das</p>
          <p>Reg: 24BPS1016</p>
          <p>B.Tech CSE (CPS)</p>
        </div>
      </div>

    </aside>
  );
};
