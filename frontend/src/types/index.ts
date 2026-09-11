export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ClaimDetail {
  claim_index: number;
  claim_text: string;
  status: "Verified" | "Mostly Verified" | "Unverified" | "Disputed" | "False" | "Insufficient Evidence";
  confidence: number;
  evidence_quote?: string | null;
  explanation: string;
  certainty_score: number;
  supporting_sources: string[];
  contradicting_sources: string[];
}

export interface SourceDetail {
  id?: number;
  name: string;
  url: string;
  publisher: string;
  publication_date?: string | null;
  credibility_score: number;
  domain: string;
  relationship_type: "SUPPORTS" | "CONTRADICTS" | "RELEVANT";
  claim_index?: number;
}

export interface FactorDetail {
  score: number;
  label: string;
  description: string;
}

export interface AnalysisResult {
  content_id: number;
  title: string;
  body: string;
  source_url?: string | null;
  is_demo: boolean;
  created_at: string;
  
  overall_score: number;
  tier: "Highly Trustworthy" | "Mostly Trustworthy" | "Needs Verification" | "Low Trust" | "Highly Unreliable";
  confidence: number;
  
  claim_score: number;
  source_score: number;
  evidence_score: number;
  agreement_score: number;
  contradiction_score: number;
  linguistic_score: number;
  
  summary: string;
  recommendation: string;
  factor_breakdown?: Record<string, FactorDetail>;
  
  claims: ClaimDetail[];
  sources: SourceDetail[];
}

export interface AnalysisHistoryItem {
  id: number;
  title: string;
  created_at: string;
  overall_score: number;
  tier: string;
  confidence: number;
  claims_count: number;
  is_demo: boolean;
}

export interface DashboardStats {
  total_analyses: number;
  average_trust_score: number;
  high_confidence_count: number;
  flagged_analyses_count: number;
  recent_analyses: AnalysisHistoryItem[];
}

export interface ScoringRule {
  id: number;
  name: string;
  code: string;
  description: string;
  weight: number;
  enabled: boolean;
}
