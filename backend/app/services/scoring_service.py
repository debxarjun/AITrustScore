from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import ScoringRule

class ScoringService:
    """
    Transparent and configurable Trust Scoring Engine.
    Combines:
    - Claim Verification: 30%
    - Source Credibility: 20%
    - Evidence Strength: 20%
    - Cross-Source Agreement: 15%
    - Contradiction Detection: 10%
    - Linguistic Reliability: 5%
    """
    
    STATUS_WEIGHTS = {
        "Verified": 100.0,
        "Mostly Verified": 80.0,
        "Unverified": 50.0,
        "Insufficient Evidence": 40.0,
        "Disputed": 25.0,
        "False": 0.0
    }

    def calculate_scores(
        self,
        claims_evaluated: List[Dict[str, Any]],
        source_metrics: Dict[str, Any],
        db: Session
    ) -> Dict[str, Any]:
        
        # 1. Claim Verification Score (0-100)
        if claims_evaluated:
            claim_scores = [
                self.STATUS_WEIGHTS.get(c.get("status", "Unverified"), 50.0)
                for c in claims_evaluated
            ]
            claim_score = sum(claim_scores) / len(claim_scores)
        else:
            claim_score = 50.0
            
        # 2. Source Credibility Score (0-100)
        source_score = source_metrics.get("average_credibility", 30.0)
        
        # 3. Evidence Strength Score (0-100)
        # Proportion of claims backed by verified evidence
        claims_with_evidence = sum(
            1 for c in claims_evaluated if len(c.get("evidence_matches", [])) > 0
        )
        if claims_evaluated:
            evidence_ratio = claims_with_evidence / len(claims_evaluated)
            evidence_score = min(100.0, (evidence_ratio * 70.0) + (source_metrics.get("supports_count", 0) * 10.0))
        else:
            evidence_score = 30.0
            
        # 4. Cross-Source Agreement Score (0-100)
        sup = source_metrics.get("supports_count", 0)
        con = source_metrics.get("contradicts_count", 0)
        total_rel = sup + con
        
        if total_rel > 0:
            agreement_score = (sup / total_rel) * 100.0
        else:
            agreement_score = 50.0  # neutral when no clear corroboration
            
        # 5. Contradiction Detection Score (0-100)
        # 100 means zero contradictions; drops heavily if false/contradictory claims present
        false_claims_count = sum(
            1 for c in claims_evaluated if c.get("status") in ["False", "Disputed"] or con > 0
        )
        if false_claims_count == 0 and con == 0:
            contradiction_score = 100.0
        elif false_claims_count == 1:
            contradiction_score = 40.0
        else:
            contradiction_score = max(0.0, 30.0 - (false_claims_count * 15.0))
            
        # 6. Linguistic Reliability Score (0-100)
        if claims_evaluated:
            ling_scores = [c.get("certainty_score", 1.0) * 100.0 for c in claims_evaluated]
            linguistic_score = sum(ling_scores) / len(ling_scores)
        else:
            linguistic_score = 80.0
            
        # Retrieve configurable rules from DB
        rules = db.query(ScoringRule).filter(ScoringRule.enabled == True).all()
        
        rule_weights = {
            "claim_verification": 0.30,
            "source_credibility": 0.20,
            "evidence_strength": 0.20,
            "cross_source_agreement": 0.15,
            "contradiction_detection": 0.10,
            "linguistic_reliability": 0.05,
        }
        
        for r in rules:
            rule_weights[r.code] = r.weight
            
        total_weight = sum(rule_weights.values()) or 1.0
        
        raw_trust_score = (
            (claim_score * rule_weights.get("claim_verification", 0.30)) +
            (source_score * rule_weights.get("source_credibility", 0.20)) +
            (evidence_score * rule_weights.get("evidence_strength", 0.20)) +
            (agreement_score * rule_weights.get("cross_source_agreement", 0.15)) +
            (contradiction_score * rule_weights.get("contradiction_detection", 0.10)) +
            (linguistic_score * rule_weights.get("linguistic_reliability", 0.05))
        ) / total_weight
        
        final_trust_score = round(max(0.0, min(100.0, raw_trust_score)), 1)
        
        # Calculate Confidence Score (0-100)
        if claims_evaluated:
            conf_avg = sum(c.get("confidence", 50.0) for c in claims_evaluated) / len(claims_evaluated)
            evidence_factor = 1.0 if claims_with_evidence > 0 else 0.7
            confidence = round(max(30.0, min(99.0, conf_avg * evidence_factor)), 1)
        else:
            confidence = 50.0
            
        tier = self.determine_tier(final_trust_score)
        
        return {
            "overall_score": final_trust_score,
            "tier": tier,
            "confidence": confidence,
            "claim_score": round(claim_score, 1),
            "source_score": round(source_score, 1),
            "evidence_score": round(evidence_score, 1),
            "agreement_score": round(agreement_score, 1),
            "contradiction_score": round(contradiction_score, 1),
            "linguistic_score": round(linguistic_score, 1),
            "rule_weights": rule_weights
        }

    @staticmethod
    def determine_tier(score: float) -> str:
        if score >= 90.0:
            return "Highly Trustworthy"
        elif score >= 75.0:
            return "Mostly Trustworthy"
        elif score >= 50.0:
            return "Needs Verification"
        elif score >= 25.0:
            return "Low Trust"
        else:
            return "Highly Unreliable"
