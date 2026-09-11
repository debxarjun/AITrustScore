import re
from typing import List, Dict, Any

class ClaimService:
    """
    Extracts individual factual propositions from raw text,
    filtering noise and analyzing linguistic certainty indicators.
    """
    
    ABSOLUTE_MARKERS = [
        "miracle", "100%", "proven without doubt", "guaranteed",
        "cure all", "secret conspiracy", "magical", "never fails",
        "conclusively proven", "revolutionary breakthrough overnight"
    ]
    
    EXACT_NUMERICAL_PATTERNS = [
        r"exactly\s+\d+%",
        r"increases\s+.*by\s+exactly",
        r"precisely\s+\d+",
        r"100%\s+effective"
    ]

    def extract_claims(self, text: str) -> List[Dict[str, Any]]:
        # Clean text
        clean_text = text.strip()
        if not clean_text:
            return []
            
        # Split into sentences using punctuation boundaries
        raw_sentences = re.split(r'(?<=[.!?])\s+', clean_text)
        claims = []
        
        for idx, sentence in enumerate(raw_sentences):
            s = sentence.strip()
            # Filter out very short phrases, greetings, or pure rhetoric
            if len(s) < 15:
                continue
            if s.endswith("?") and not any(k in s.lower() for k in ["did", "was", "is", "has"]):
                continue
                
            certainty_score = self.evaluate_linguistic_certainty(s)
            claims.append({
                "claim_index": len(claims) + 1,
                "claim_text": s,
                "certainty_score": certainty_score
            })
            
        # Fallback if no clean sentences were parsed
        if not claims and len(clean_text) >= 10:
            claims.append({
                "claim_index": 1,
                "claim_text": clean_text,
                "certainty_score": self.evaluate_linguistic_certainty(clean_text)
            })
            
        return claims

    def evaluate_linguistic_certainty(self, text: str) -> float:
        """
        Scores language certainty (1.0 = balanced/objective, lower = sensationalist/absolute).
        """
        score = 1.0
        lower = text.lower()
        
        for marker in self.ABSOLUTE_MARKERS:
            if marker in lower:
                score -= 0.3
                
        for pat in self.EXACT_NUMERICAL_PATTERNS:
            if re.search(pat, lower):
                score -= 0.3
                
        return max(0.1, min(1.0, score))
