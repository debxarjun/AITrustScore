import React, { useEffect, useState } from "react";
import { Shield, CheckCircle2, AlertTriangle, FileText, ArrowRight, PlusCircle, RefreshCw } from "lucide-react";
import { api } from "../services/api";
import type { DashboardStats } from "../types";

interface DashboardPageProps {
  onNavigate: (page: string, id?: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Highly Trustworthy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Mostly Trustworthy":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
      case "Needs Verification":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-red-400 bg-red-500/10 border-red-500/30";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">Executive Dashboard</h1>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Real-time analytics and credibility metrics across all evaluated content.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadStats}
            title="Refresh Statistics"
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 light:border-slate-200 light:bg-slate-100 light:text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => onNavigate("analyze")}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Analyses */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase">Total Analyses</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white light:text-slate-900">
            {stats ? stats.total_analyses : "..."}
          </div>
          <div className="text-[11px] text-slate-400">Evaluated against knowledge bases</div>
        </div>

        {/* Average Trust Score */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase">Average Trust Score</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400 light:text-cyan-600">
            {stats ? `${stats.average_trust_score}` : "..."}
            <span className="text-sm font-normal text-slate-400 light:text-slate-500"> / 100</span>
          </div>
          <div className="text-[11px] text-slate-400">Weighted cross-dimensional index</div>
        </div>

        {/* High Confidence */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase">High-Confidence</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 light:text-emerald-600">
            {stats ? stats.high_confidence_count : "..."}
          </div>
          <div className="text-[11px] text-slate-400">Confidence rating ≥ 80%</div>
        </div>

        {/* Flagged Analyses */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase">Flagged Analyses</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-400 light:text-red-600">
            {stats ? stats.flagged_analyses_count : "..."}
          </div>
          <div className="text-[11px] text-slate-400">Score &lt; 50 (Low trust or contradicted)</div>
        </div>

      </div>

      {/* Quick Submission Banner */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-cyan-950/20 light:from-emerald-50 light:to-cyan-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white light:text-slate-900">Ready to audit new content?</h3>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
            Submit text or select a viva benchmark preset to run claim extraction and evidence corroboration.
          </p>
        </div>
        <button
          onClick={() => onNavigate("analyze")}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <span>Open Analysis Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Analyses Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-800 light:border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider">
            Recent Analysis Reports
          </h2>
          <button
            onClick={() => onNavigate("history")}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 light:bg-slate-50 text-slate-400 border-b border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Content Title</th>
                <th className="py-3 px-4 font-semibold">Trust Score</th>
                <th className="py-3 px-4 font-semibold">Status Tier</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold">Claims</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {stats && stats.recent_analyses.length > 0 ? (
                stats.recent_analyses.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-200 light:text-slate-800 max-w-xs truncate">
                      {item.title}
                      {item.is_demo && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-normal">
                          Demo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100 light:text-slate-900">
                      {item.overall_score}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTierColor(item.tier)}`}>
                        {item.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-medium">
                      {item.confidence}%
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.claims_count} propositions
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigate("analysis", item.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No analyses recorded yet. Click "New Analysis" to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
