from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# User Schemas
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Claim Schema
class ClaimDetail(BaseModel):
    claim_index: int
    claim_text: str
    status: str
    confidence: float
    evidence_quote: Optional[str] = None
    explanation: str
    certainty_score: float = 1.0
    supporting_sources: List[str] = []
    contradicting_sources: List[str] = []

# Source Schema
class SourceDetail(BaseModel):
    id: Optional[int] = None
    name: str
    url: str
    publisher: str
    publication_date: Optional[str] = None
    credibility_score: float
    domain: str
    relationship_type: str = "RELEVANT"
    claim_index: Optional[int] = 0

# Scoring Rule Schema
class ScoringRuleResponse(BaseModel):
    id: int
    name: str
    code: str
    description: str
    weight: float
    enabled: bool

    model_config = ConfigDict(from_attributes=True)

class ScoringRuleUpdate(BaseModel):
    weight: Optional[float] = None
    enabled: Optional[bool] = None

# Content Submission Schema
class AnalyzeRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    body: str = Field(..., min_length=10, max_length=15000)
    source_url: Optional[str] = None
    is_demo: bool = False

# Analysis Response Schema
class AnalysisResultResponse(BaseModel):
    content_id: int
    title: str
    body: str
    source_url: Optional[str] = None
    is_demo: bool
    created_at: datetime
    
    overall_score: float
    tier: str
    confidence: float
    
    # Subscores
    claim_score: float
    source_score: float
    evidence_score: float
    agreement_score: float
    contradiction_score: float
    linguistic_score: float
    
    summary: str
    recommendation: str
    factor_breakdown: Optional[Dict[str, Any]] = None
    
    claims: List[ClaimDetail] = []
    sources: List[SourceDetail] = []

# Analysis History Summary Item
class AnalysisHistoryItem(BaseModel):
    id: int
    title: str
    created_at: datetime
    overall_score: float
    tier: str
    confidence: float
    claims_count: int
    is_demo: bool

# Dashboard Stats Response
class DashboardStats(BaseModel):
    total_analyses: int
    average_trust_score: float
    high_confidence_count: int
    flagged_analyses_count: int
    recent_analyses: List[AnalysisHistoryItem]
