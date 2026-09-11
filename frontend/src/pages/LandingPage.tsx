import React from "react";
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers, GraduationCap } from "lucide-react";
import { ScoreGauge } from "../components/ScoreGauge";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Trust Scoring Framework for AI-Generated Content</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white light:text-slate-900 leading-tight">
          Know what to trust. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Before you share it.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 light:text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AITrustScore analyzes AI-generated content, verifies its claims against authoritative evidence, detects contradictions, and explains exactly why a piece of content deserves your trust.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate("analyze")}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5"
          >
            <span>Analyze Content Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => onNavigate("methodology")}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-all light:bg-white light:border-slate-300 light:text-slate-700 light:hover:bg-slate-50"
          >
            <BookOpen className="w-4 h-4" />
            <span>How It Works</span>
          </button>
        </div>

        {/* Live Interactive Hero Score Preview */}
        <div className="mt-14 max-w-3xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl light:border-slate-200 light:bg-white/80">
          <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-4 text-left">
            Live Trust Analysis Preview
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <ScoreGauge score={84} tier="Mostly Trustworthy" confidence={92} size={150} />
            </div>
            <div className="md:col-span-2 text-left space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs light:bg-slate-50 light:border-slate-200">
                <span className="font-bold text-emerald-400 block mb-1">Claim 1 (Verified):</span>
                <p className="text-slate-300 light:text-slate-700">"The Earth is approximately 4.54 billion years old." — Supported by USGS radiometric dating.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs light:bg-slate-50 light:border-slate-200">
                <span className="font-bold text-amber-400 block mb-1">Claim 2 (Disputed):</span>
                <p className="text-slate-300 light:text-slate-700">"Coffee increases lifespan by exactly 20%." — Observational correlation overclaimed as deterministic causation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Verification Matters */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white light:text-slate-900">
            Why AI Content Demands Explainable Trust
          </h2>
          <p className="text-sm text-slate-400 light:text-slate-600 mt-2 max-w-xl mx-auto">
            Generative AI writes persuasively, but often blends factual truth with fabricated statistics, out-of-context citations, and subtle hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 light:border-slate-200 light:bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white light:text-slate-900">Hallucinated Specificity</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              LLMs often fabricate precise percentages (e.g. "increases lifespan by exactly 20%") that sound authoritative but lack peer-reviewed backing.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 light:border-slate-200 light:bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white light:text-slate-900">Deceptive Claim Blending</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              False assertions are routinely sandwiched between verified scientific consensus, making manual human fact-checking tedious and error-prone.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 light:border-slate-200 light:bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white light:text-slate-900">Transparent Explainability</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              AITrustScore breaks down every individual claim, maps it to citations, and explains why a score was awarded without black-box opacity.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Citation Footer */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 light:bg-emerald-50/50 light:border-emerald-200 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-emerald-400 light:text-emerald-700 font-semibold text-sm">
            <GraduationCap className="w-5 h-5" />
            <span>Academic Project Specification</span>
          </div>
          <p className="text-xs text-slate-300 light:text-slate-700">
            <strong>AITrustScore</strong> — An Intelligent Trust Scoring Framework for AI-Generated Content
          </p>
          <p className="text-[11px] text-slate-400 light:text-slate-500">
            Student: <strong>Tamohar Das</strong> | Reg No: <strong>24BPS1016</strong> | Institution: <strong>Vellore Institute of Technology (VIT) Chennai</strong> | Program: <strong>B.Tech CSE (Cyber Physical Systems)</strong>
          </p>
        </div>
      </section>

    </div>
  );
};
