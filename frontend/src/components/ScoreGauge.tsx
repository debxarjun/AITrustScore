import React from "react";

interface ScoreGaugeProps {
  score: number;
  tier: string;
  confidence: number;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, tier, confidence, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color scheme based on tier / score
  const getColor = (s: number) => {
    if (s >= 90) return { stroke: "#10B981", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" };
    if (s >= 75) return { stroke: "#06B6D4", text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" };
    if (s >= 50) return { stroke: "#F59E0B", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" };
    if (s >= 25) return { stroke: "#F97316", text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" };
    return { stroke: "#EF4444", text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" };
  };

  const scheme = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/60 light:text-slate-200"
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-black tracking-tight ${scheme.text} light:text-slate-900`}>
            {Math.round(score)}
          </span>
          <span className="text-xs font-semibold text-slate-400 light:text-slate-500">out of 100</span>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="mt-4 flex flex-col items-center space-y-1.5 text-center">
        <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${scheme.bg} ${scheme.border} ${scheme.text}`}>
          {tier}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Confidence: <strong className="text-slate-200 light:text-slate-800">{confidence}%</strong>
        </span>
      </div>
    </div>
  );
};
