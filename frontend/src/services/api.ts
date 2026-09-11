import type { AnalysisResult, AnalysisHistoryItem, DashboardStats, ScoringRule, SourceDetail, AuthResponse, User } from "../types";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || (typeof window !== "undefined" && window.location.port === "5173" ? "http://localhost:8000/api" : "/api");

function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (includeAuth) {
    const token = localStorage.getItem("aitrustscore_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(err.detail || "Registration failed");
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Invalid email or password");
    }
    return res.json();
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  // Analysis
  async analyze(title: string, body: string, sourceUrl?: string, isDemo = false): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({
        title,
        body,
        source_url: sourceUrl || null,
        is_demo: isDemo,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
      throw new Error(err.detail || "Analysis request failed");
    }
    return res.json();
  },

  async getAnalysis(id: number): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error("Analysis report not found");
    return res.json();
  },

  async getHistory(params?: { q?: string; tier?: string; min_score?: number; max_score?: number }): Promise<AnalysisHistoryItem[]> {
    const query = new URLSearchParams();
    if (params?.q) query.append("q", params.q);
    if (params?.tier) query.append("tier", params.tier);
    if (params?.min_score !== undefined) query.append("min_score", params.min_score.toString());
    if (params?.max_score !== undefined) query.append("max_score", params.max_score.toString());

    const res = await fetch(`${API_BASE}/analyses?${query.toString()}`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error("Failed to fetch analyses");
    return res.json();
  },

  async deleteAnalysis(id: number): Promise<{ message: string; id: number }> {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error("Failed to delete analysis");
    return res.json();
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  },

  // Sources
  async getSources(): Promise<SourceDetail[]> {
    const res = await fetch(`${API_BASE}/sources`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error("Failed to fetch sources");
    return res.json();
  },

  // Scoring Rules
  async getScoringRules(): Promise<ScoringRule[]> {
    const res = await fetch(`${API_BASE}/scoring-rules`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error("Failed to fetch scoring rules");
    return res.json();
  },

  async updateScoringRule(id: number, weight?: number, enabled?: boolean): Promise<ScoringRule> {
    const res = await fetch(`${API_BASE}/scoring-rules/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify({ weight, enabled }),
    });
    if (!res.ok) throw new Error("Failed to update scoring rule");
    return res.json();
  },
};
