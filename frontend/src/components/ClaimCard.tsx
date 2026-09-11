import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ChevronDown, ChevronUp, Link as LinkIcon, ShieldCheck } from "lucide-react";
import type { ClaimDetail } from "../types";

interface ClaimCardProps {
  claim: ClaimDetail;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return {
          icon: CheckCircle2,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          text: "Verified"
        };
      case "Mostly Verified":
        return {
          icon: ShieldCheck,
          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
          text: "Mostly Verified"
        };
      case "Disputed":
        return {
          icon: AlertTriangle,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          text: "Disputed"
        };
      case "False":
        return {
          icon: XCircle,
          color: "text-red-400 bg-red-500/10 border-red-500/30",
          text: "False / Contradicted"
        };
      default:
        return {
          icon: HelpCircle,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
          text: "Insufficient Evidence"
        };
    }
  };

  const badge = getStatusBadge(claim.status);
  const Icon = badge.icon;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-all p-4 space-y-3 light:border-slate-200 light:bg-white light:shadow-sm">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <span className="w-6 h-6 rounded-md bg-slate-800 light:bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 light:text-slate-600 shrink-0 mt-0.5">
            {claim.claim_index}
          </span>
          <p className="text-sm font-medium text-slate-200 light:text-slate-800 leading-relaxed">
            "{claim.claim_text}"
          </p>
        </div>

        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${badge.color}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{badge.text}</span>
        </span>
      </div>

      {/* Accordion Toggle */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/50 light:border-slate-100 text-xs text-slate-400">
        <span className="font-medium">
          Confidence: <strong className="text-slate-300 light:text-slate-700">{claim.confidence}%</strong>
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          <span>{expanded ? "Hide Details" : "View Evidence & Sources"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="pt-3 border-t border-slate-800/80 light:border-slate-100 space-y-3 text-xs animate-fadeIn">
          
          {/* Explanation */}
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Analytical Evaluation:</span>
            <p className="text-slate-300 light:text-slate-600 bg-slate-950/40 light:bg-slate-50 p-2.5 rounded-lg border border-slate-800/60 light:border-slate-200">
              {claim.explanation}
            </p>
          </div>

          {/* Evidence Quote */}
          {claim.evidence_quote && (
            <div>
              <span className="font-semibold text-slate-400 block mb-1">Corroborating Evidence Snippet:</span>
              <p className="text-slate-300 light:text-slate-600 italic bg-emerald-950/20 light:bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-900/30 light:border-emerald-100">
                "{claim.evidence_quote}"
              </p>
            </div>
          )}

          {/* Supporting & Contradicting Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {claim.supporting_sources.length > 0 && (
              <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
                <span className="text-[11px] font-semibold text-emerald-400 light:text-emerald-600 block mb-1">
                  Supporting Sources:
                </span>
                <ul className="space-y-1">
                  {claim.supporting_sources.map((s, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5 text-slate-300 light:text-slate-600">
                      <LinkIcon className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {claim.contradicting_sources.length > 0 && (
              <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
                <span className="text-[11px] font-semibold text-red-400 light:text-red-600 block mb-1">
                  Contradicting Sources:
                </span>
                <ul className="space-y-1">
                  {claim.contradicting_sources.map((s, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5 text-slate-300 light:text-slate-600">
                      <LinkIcon className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
