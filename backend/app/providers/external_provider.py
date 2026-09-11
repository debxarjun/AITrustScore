import os
import httpx
from typing import Optional
from app.providers.base import FactCheckProvider, ClaimEvaluation
from app.providers.demo_provider import DemoFactCheckProvider

class ExternalFactCheckProvider(FactCheckProvider):
    """
    Pluggable external fact-check provider that queries external APIs
    (e.g., Google Fact Check Tools API) if an API key is present,
    otherwise cleanly falls back to the deterministic DemoFactCheckProvider.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GOOGLE_FACTCHECK_API_KEY", "")
        self.fallback = DemoFactCheckProvider()
        
    def evaluate_claim(self, claim: str) -> ClaimEvaluation:
        if not self.api_key:
            return self.fallback.evaluate_claim(claim)
            
        try:
            # Query Google Fact Check Tools API
            url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
            params = {
                "query": claim,
                "key": self.api_key,
                "languageCode": "en"
            }
            with httpx.Client(timeout=4.0) as client:
                resp = client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    claims = data.get("claims", [])
                    if claims:
                        top = claims[0]
                        claim_reviews = top.get("claimReview", [])
                        if claim_reviews:
                            review = claim_reviews[0]
                            rating = review.get("textualRating", "Unverified")
                            publisher = review.get("publisher", {}).get("name", "External Fact Checker")
                            rev_url = review.get("url", "https://news.google.com")
                            
                            status = "Verified" if "true" in rating.lower() else ("False" if "false" in rating.lower() else "Disputed")
                            from app.providers.base import EvidenceMatch
                            return ClaimEvaluation(
                                claim_text=claim,
                                status=status,
                                confidence=88.0,
                                evidence_matches=[
                                    EvidenceMatch(
                                        evidence_text=f"External review by {publisher}: Rated '{rating}'",
                                        relationship="SUPPORTS" if status == "Verified" else "CONTRADICTS",
                                        source_name=f"{publisher} Review",
                                        source_url=rev_url,
                                        source_publisher=publisher,
                                        source_credibility=90.0,
                                        source_domain="google.com",
                                        confidence=88.0
                                    )
                                ],
                                explanation=f"Externally indexed fact-check from {publisher} rated this claim as: {rating}."
                            )
        except Exception:
            pass
            
        return self.fallback.evaluate_claim(claim)
