import React, { useState } from "react";
import { Sparkles, ArrowRight, Globe, AlertCircle } from "lucide-react";
import { api } from "../services/api";

interface AnalyzePageProps {
  onAnalysisComplete: (id: number) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalysisComplete }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const demoPresets = [
    {
      id: "high_trust",
      title: "Geological Age and Formation of the Earth",
      body: "The Earth is approximately 4.54 billion years old, verified through radiometric dating of meteorite samples and oldest terrestrial minerals. Furthermore, carbon dioxide acts as a greenhouse gas absorbing infrared radiation in the atmosphere.",
      sourceUrl: "https://usgs.gov/earth-age",
      badge: "Highly Trustworthy Example",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    },
    {
      id: "disputed",
      title: "Observational Study on Coffee Consumption and Longevity",
      body: "Epidemiological research demonstrates that drinking coffee is correlated with improved metabolic health markers. Several researchers claim that drinking coffee regularly increases lifespan by exactly 20%.",
      sourceUrl: "https://health.harvard.edu/coffee",
      badge: "Disputed Overclaim (Needs Verification)",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30"
    },
    {
      id: "misinfo",
      title: "Viral Social Media Claim on Lunar Composition",
      body: "NASA scientists have recently confirmed that the Moon is made entirely of ice. In a related leak, medical clinics revealed a secret miracle cure for cancer that cures all tumors overnight.",
      sourceUrl: "https://viral-unverified-blog.net/lunar-shock",
      badge: "Misinformation / Contradicted Example",
      badgeColor: "text-red-400 bg-red-500/10 border-red-500/30"
    },
    {
      id: "unsupported",
      title: "Breakthrough Room-Temperature Quantum Processor Announcement",
      body: "A clandestine tech startup has developed a revolutionary quantum processor operating with ambient room-temperature superconductivity with zero published peer-reviewed whitepapers.",
      sourceUrl: "",
      badge: "Unsupported Novel Assertions",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/30"
    }
  ];

  const handleSelectPreset = (preset: typeof demoPresets[0]) => {
    setTitle(preset.title);
    setBody(preset.body);
    setSourceUrl(preset.sourceUrl);
    setIsDemo(true);
    setError(null);
  };

  const analysisSteps = [
    "Preprocessing and tokenizing raw text...",
    "Extracting discrete factual claims and certainty markers...",
    "Evaluating claims against reference scientific consensus...",
    "Assessing cross-source credibility and institutional trust...",
    "Calculating Trust Score, contradiction penalty, and confidence...",
    "Generating natural-language explainability and recommendations...",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setError("Please enter or paste the text content to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await api.analyze(title || "Untitled Content Analysis", body, sourceUrl, isDemo);
      clearInterval(interval);
      onAnalysisComplete(result.content_id);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Failed to analyze content.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white light:text-slate-900">Content Analysis Studio</h1>
        <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
          Paste AI-generated or human-authored text to extract claims, verify against evidence, and produce an explainable Trust Score.
        </p>
      </div>

      {/* 4 Viva Demo Presets */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 light:border-slate-200 light:bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 light:text-slate-700 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Viva Demonstration Presets (Click to Load Deterministic Benchmarks)</span>
          </span>
          <span className="text-[11px] text-slate-500">Instant Evaluation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {demoPresets.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-left p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-emerald-500/40 hover:bg-slate-900/60 light:border-slate-200 light:bg-slate-50 light:hover:bg-emerald-50/50 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 light:text-slate-800 truncate">{preset.title}</span>
              </div>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 light:border-slate-200 light:bg-white space-y-5">
        
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
            Content Title / Headline
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Observational Study on Coffee Consumption and Longevity"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 light:bg-slate-50 light:border-slate-200 light:text-slate-900"
          />
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
            Claimed Source URL (Optional)
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="url"
              value={sourceUrl}
              onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 light:bg-slate-50 light:border-slate-200 light:text-slate-900"
            />
          </div>
        </div>

        {/* Body Text */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700">
              Text / Content to Evaluate
            </label>
            <span className="text-[11px] text-slate-500">
              {body.length} characters
            </span>
          </div>
          <textarea
            required
            rows={6}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Paste article, AI response, or statement here to extract claims and verify credibility..."
            className="w-full p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 light:bg-slate-50 light:border-slate-200 light:text-slate-900 leading-relaxed resize-y"
          />
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 light:border-slate-100">
          <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isDemo}
              onChange={e => setIsDemo(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span>Mark as Demo Benchmark Analysis</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>{loading ? "Analyzing..." : "Analyze Content"}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </form>

      {/* Analysis Staged Animation Loading State */}
      {loading && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-950/80 backdrop-blur-md space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white light:text-slate-900">
                AITrustScore Engine Active
              </h4>
              <p className="text-xs text-emerald-400">
                {analysisSteps[currentStep]}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 pt-2">
            {analysisSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx <= currentStep ? "bg-emerald-400" : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
