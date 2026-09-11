import React, { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { api } from "../services/api";
import type { SourceDetail } from "../types";

export const SourcesPage: React.FC = () => {
  const [sources, setSources] = useState<SourceDetail[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSources();
        setSources(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white light:text-slate-900">Sources Directory</h1>
        <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
          Catalog of institutional databases, peer-reviewed publishers, and journalistic consensus repositories utilized by AITrustScore.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sources.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.domain}</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Domain</span>
                </span>
              </div>
              <h2 className="text-sm font-bold text-white light:text-slate-900">{s.name}</h2>
              <p className="text-xs text-slate-400 light:text-slate-600">{s.publisher}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 light:border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Credibility Index</span>
                <span className="font-bold text-emerald-400 light:text-emerald-600 text-sm">{s.credibility_score}%</span>
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-emerald-400 hover:underline font-medium"
              >
                <span>Browse Domain</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
