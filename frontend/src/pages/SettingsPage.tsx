import React, { useEffect, useState } from "react";
import { Sliders, Sun, Moon, User, Check, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import type { ScoringRule } from "../types";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [rules, setRules] = useState<ScoringRule[]>([]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getScoringRules();
        setRules(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleWeightChange = async (id: number, newWeight: number) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, weight: newWeight } : r))
    );
    try {
      await api.updateScoringRule(id, newWeight);
      setSavedMessage("Scoring weights dynamically updated in database!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      <div>
        <h1 className="text-2xl font-bold text-white light:text-slate-900">Settings & Configuration</h1>
        <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
          Manage user profile, theme preferences, and tune scoring engine weights.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-4">
        <h2 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <User className="w-4 h-4 text-emerald-400" />
          <span>User Profile</span>
        </h2>

        {user ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Name</span>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 font-semibold text-white light:bg-slate-50 light:border-slate-200 light:text-slate-900">
                {user.name}
              </div>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Email</span>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 font-semibold text-white light:bg-slate-50 light:border-slate-200 light:text-slate-900">
                {user.email}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            You are browsing in guest mode. Sign in to save personal analysis history.
          </p>
        )}
      </div>

      {/* Appearance Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-4">
        <h2 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          <span>Theme & Appearance</span>
        </h2>
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-200 light:text-slate-800 block">Color Theme</span>
            <span className="text-slate-400">Toggle between Cyberpunk Dark and Clean Light aesthetic</span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 light:border-slate-300 light:hover:bg-slate-100 font-semibold transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span className="text-slate-200 light:text-slate-800 capitalize">{theme} Mode</span>
          </button>
        </div>
      </div>

      {/* Scoring Engine Rule Weights Config */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Configurable Scoring Rule Weights</span>
          </h2>
          <span className="text-[11px] text-slate-500">Persisted in Database</span>
        </div>

        <div className="space-y-4">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 light:border-slate-200 light:bg-slate-50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 light:text-slate-800">{rule.name}</span>
                  <p className="text-[11px] text-slate-400">{rule.description}</p>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {Math.round(rule.weight * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={rule.weight}
                onChange={e => handleWeightChange(rule.id, parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Project Viva Metadata */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/20 text-xs text-slate-400 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Information</span>
        </div>
        <p>Student: <strong>Tamohar Das</strong> (24BPS1016)</p>
        <p>Institution: <strong>VIT Chennai</strong> | School of Computer Science & Engineering</p>
        <p>Specialization: <strong>Cyber Physical Systems</strong></p>
      </div>

    </div>
  );
};
