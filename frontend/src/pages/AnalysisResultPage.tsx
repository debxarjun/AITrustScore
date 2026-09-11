import React, { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, RefreshCw, Printer, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "../services/api";
import type { AnalysisResult } from "../types";
import { ScoreGauge } from "../components/ScoreGauge";
import { ClaimCard } from "../components/ClaimCard";

interface AnalysisResultPageProps {
  contentId: number;
  onNavigate: (page: string) => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({ contentId, onNavigate }) => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await api.getAnalysis(contentId);
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to load analysis report");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contentId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading analysis report #{contentId}...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-400 text-sm">{error || "Report not found."}</p>
        <button
          onClick={() => onNavigate("dashboard")}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const chartData = [
    { name: "Claim Verification (30%)", score: result.claim_score, fill: "#10B981" },
    { name: "Source Credibility (20%)", score: result.source_score, fill: "#06B6D4" },
    { name: "Evidence Strength (20%)", score: result.evidence_score, fill: "#3B82F6" },
    { name: "Cross-Source Agreement (15%)", score: result.agreement_score, fill: "#8B5CF6" },
    { name: "Contradiction Detection (10%)", score: result.contradiction_score, fill: result.contradiction_score > 60 ? "#10B981" : "#EF4444" },
    { name: "Linguistic Reliability (5%)", score: result.linguistic_score, fill: "#F59E0B" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors light:border-slate-200 light:hover:bg-slate-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Hero Card */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 light:border-slate-200 light:bg-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Gauge Widget */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 light:border-slate-200 pb-6 lg:pb-0 lg:pr-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Overall Trust Score
            </div>
            <ScoreGauge
              score={result.overall_score}
              tier={result.tier}
              confidence={result.confidence}
              size={180}
            />
          </div>

          {/* Title & Natural Language Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {result.is_demo && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                    Viva Deterministic Demo
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Evaluated on {new Date(result.created_at).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-slate-900 leading-tight">
                {result.title}
              </h1>
              {result.source_url && (
                <a
                  href={result.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:underline mt-1"
                >
                  <span>{result.source_url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Natural Language Explanation Box */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs light:bg-slate-50 light:border-slate-200 space-y-2">
              <span className="font-semibold text-emerald-400 block uppercase tracking-wider text-[11px]">
                Analytical Explainability Report
              </span>
              <p className="text-slate-300 light:text-slate-700 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Actionable Recommendation */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <span className="font-semibold text-amber-400 block uppercase tracking-wider text-[10px]">
                Recommended Action
              </span>
              <p className="text-amber-200/90 light:text-amber-900 leading-relaxed">
                {result.recommendation}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Claim Analysis Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white light:text-slate-900">
            Factual Proposition Analysis ({result.claims.length} Claims Identified)
          </h2>
          <span className="text-xs text-slate-400">
            Click any claim to inspect evidence quotes and citations
          </span>
        </div>

        <div className="space-y-3">
          {result.claims.map((claim, idx) => (
            <ClaimCard key={idx} claim={claim} />
          ))}
        </div>
      </div>

      {/* Score Breakdown Chart */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider">
              Multi-Dimensional Score Breakdown
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
              Transparent assessment of the 6 algorithmic weight dimensions.
            </p>
          </div>
          <button
            onClick={() => onNavigate("methodology")}
            className="flex items-center space-x-1 text-xs text-emerald-400 hover:underline font-semibold"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 160, right: 30, top: 10, bottom: 10 }}>
              <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                formatter={(val: any) => [`${val} / 100`, "Score"]}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Verified Sources Matrix */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-4">
        <h2 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider">
          Corroborating & Debunking Sources ({result.sources.length} Referenced)
        </h2>

        {result.sources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.sources.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 light:border-slate-200 light:bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-200 light:text-slate-800">{s.name}</h3>
                    <p className="text-[11px] text-slate-400">{s.publisher} ({s.domain})</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    s.relationship_type === "SUPPORTS"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                      : s.relationship_type === "CONTRADICTS"
                      ? "text-red-400 bg-red-500/10 border-red-500/30"
                      : "text-slate-400 bg-slate-800 border-slate-700"
                  }`}>
                    {s.relationship_type}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 light:border-slate-200 text-slate-400">
                  <span>Credibility: <strong className="text-emerald-400">{s.credibility_score}%</strong></span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-emerald-400 hover:underline"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            No external primary sources corroborated this claim in the reference knowledge base.
          </p>
        )}
      </div>

    </div>
  );
};
