import React, { useEffect, useState } from "react";
import { Search, Trash2, RefreshCw } from "lucide-react";
import { api } from "../services/api";
import type { AnalysisHistoryItem } from "../types";

interface HistoryPageProps {
  onNavigate: (page: string, id?: number) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [minScore] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"newest" | "highest" | "lowest">("newest");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory({
        q: search || undefined,
        tier: tierFilter || undefined,
        min_score: minScore > 0 ? minScore : undefined,
      });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [tierFilter, minScore]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadHistory();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteAnalysis(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setDeleteConfirmId(null);
    } catch (e) {
      console.error("Failed to delete analysis", e);
    }
  };

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

  const sortedItems = [...items].sort((a, b) => {
    if (sortOrder === "highest") return b.overall_score - a.overall_score;
    if (sortOrder === "lowest") return a.overall_score - b.overall_score;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white light:text-slate-900">Analysis History</h1>
        <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
          Search, filter, and inspect previous trust evaluations stored in the database.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or text..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 light:bg-slate-50 light:border-slate-200 light:text-slate-900"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 light:bg-slate-50 light:border-slate-200 light:text-slate-800 focus:outline-none"
          >
            <option value="">All Tiers</option>
            <option value="Highly Trustworthy">Highly Trustworthy (90-100)</option>
            <option value="Mostly Trustworthy">Mostly Trustworthy (75-89)</option>
            <option value="Needs Verification">Needs Verification (50-74)</option>
            <option value="Low Trust">Low Trust (25-49)</option>
            <option value="Highly Unreliable">Highly Unreliable (0-24)</option>
          </select>

          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 light:bg-slate-50 light:border-slate-200 light:text-slate-800 focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="highest">Sort: Highest Trust Score</option>
            <option value="lowest">Sort: Lowest Trust Score</option>
          </select>

          <button
            onClick={loadHistory}
            className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 light:border-slate-200 light:hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 light:bg-slate-50 text-slate-400 border-b border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Content</th>
                <th className="py-3 px-4 font-semibold">Trust Score</th>
                <th className="py-3 px-4 font-semibold">Classification</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {sortedItems.length > 0 ? (
                sortedItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-200 light:text-slate-800 max-w-sm truncate">
                      {item.title}
                      {item.is_demo && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
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
                    <td className="py-3 px-4 text-slate-400">
                      {item.confidence}%
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onNavigate("analysis", item.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete Analysis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No matching analysis records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 light:bg-white light:border-slate-200">
            <h3 className="font-bold text-white light:text-slate-900 text-sm">Delete Analysis Report</h3>
            <p className="text-xs text-slate-400 light:text-slate-600">
              Are you sure you want to delete this analysis report? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 light:border-slate-300 light:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
