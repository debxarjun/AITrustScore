from abc import ABC, abstractmethod
from typing import List, Optional
from pydantic import BaseModel

class EvidenceMatch(BaseModel):
    evidence_text: str
    relationship: str  # SUPPORTS, CONTRADICTS, RELEVANT
    source_name: str
    source_url: str
    source_publisher: str
    source_credibility: float
    source_domain: str
    confidence: float

class ClaimEvaluation(BaseModel):
    claim_text: str
    status: str  # Verified, Mostly Verified, Unverified, Disputed, False, Insufficient Evidence
    confidence: float
    evidence_matches: List[EvidenceMatch] = []
    explanation: str
    certainty_score: float = 1.0

class FactCheckProvider(ABC):
    @abstractmethod
    def evaluate_claim(self, claim: str) -> ClaimEvaluation:
        """Evaluates an individual claim against factual evidence."""
        pass
