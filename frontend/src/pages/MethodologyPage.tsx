import React from "react";
import { AlertTriangle, Scale } from "lucide-react";

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
          Trust Scoring Methodology
        </h1>
        <p className="text-sm text-slate-400 light:text-slate-600 mt-2">
          Mathematical architecture, claim decomposition, and explainable AI principles behind AITrustScore.
        </p>
      </div>

      {/* Academic Viva Disclaimer Alert */}
      <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 light:bg-amber-50 light:border-amber-200 flex items-start space-x-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-amber-200/90 light:text-amber-900">
          <strong className="font-bold text-amber-300 light:text-amber-950 block">Academic & Epistemological Boundary:</strong>
          <p>
            AITrustScore provides an analytical trust assessment based on available evidence, cross-publisher consensus, and its configured scoring framework. It does not guarantee that information is objectively or metaphysically true, but rather quantifies evidentiary alignment against authoritative scientific and journalistic knowledge bases.
          </p>
        </div>
      </div>

      {/* Conceptual Formula */}
      <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-4">
        <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center space-x-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>The Mathematical Model</span>
        </h2>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-emerald-400 light:bg-slate-900 overflow-x-auto leading-relaxed">
          TrustScore = (0.30 × ClaimVerification) + (0.20 × SourceCredibility) + (0.20 × EvidenceStrength) + (0.15 × CrossSourceAgreement) + (0.10 × ContradictionDetection) + (0.05 × LinguisticReliability)
        </div>
        <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
          The final composite index is normalized strictly to the interval [0, 100] and mapped to 5 transparent qualitative tiers.
        </p>
      </section>

      {/* 6 Dimensions Breakdown */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white light:text-slate-900">The 6 Scoring Dimensions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              weight: "30%",
              title: "Claim Verification",
              desc: "Measures the ratio of verified assertions against empirical citations. Claims rated Verified contribute 100%, Mostly Verified 80%, Insufficient Evidence 40%, Disputed 25%, and False 0%."
            },
            {
              weight: "20%",
              title: "Source Credibility",
              desc: "Evaluates institutional reputation, editorial oversight, and peer-review status of cited domains (e.g., USGS, NASA, Nature > 90%)."
            },
            {
              weight: "20%",
              title: "Evidence Strength",
              desc: "Assesses the availability of primary empirical studies, measurement figures, satellite telemetry, or randomized trial data."
            },
            {
              weight: "15%",
              title: "Cross-Source Agreement",
              desc: "Corroboration index calculating the consensus ratio between independent publishers supporting vs contradicting the claim."
            },
            {
              weight: "10%",
              title: "Contradiction Detection",
              desc: "Applies severe penalties whenever a claim directly conflicts with settled astrophysical, historical, or biomedical consensus."
            },
            {
              weight: "5%",
              title: "Linguistic Reliability",
              desc: "NLP certainty parsing that penalizes clickbait markers, false precision (e.g., 'increases lifespan by exactly 20%'), and hyperbolic cure-all framing."
            },
          ].map((dim, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 light:border-slate-200 light:bg-white space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 light:text-slate-800">{dim.title}</span>
                <span className="font-mono text-emerald-400 font-bold">{dim.weight}</span>
              </div>
              <p className="text-slate-400 light:text-slate-600 leading-relaxed">{dim.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Qualitative Tiers */}
      <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-4">
        <h2 className="text-base font-bold text-white light:text-slate-900">Score Interpretation Tiers</h2>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 light:text-emerald-800">
            <span className="font-bold">90 – 100</span>
            <span className="font-semibold">Highly Trustworthy</span>
            <span>Backed by unanimous institutional scientific consensus.</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 light:text-cyan-800">
            <span className="font-bold">75 – 89</span>
            <span className="font-semibold">Mostly Trustworthy</span>
            <span>Sound factual basis; minor secondary details require caution.</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 light:text-amber-800">
            <span className="font-bold">50 – 74</span>
            <span className="font-semibold">Needs Verification</span>
            <span>Mixed factual basis; numerical overclaims or observational gaps.</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 light:text-orange-800">
            <span className="font-bold">25 – 49</span>
            <span className="font-semibold">Low Trust</span>
            <span>Significant lack of corroboration or unverified assertions.</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 light:text-red-800">
            <span className="font-bold">0 – 24</span>
            <span className="font-semibold">Highly Unreliable</span>
            <span>Severe contradiction with validated empirical facts.</span>
          </div>
        </div>
      </section>

    </div>
  );
};
