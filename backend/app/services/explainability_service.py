from typing import List, Dict, Any

class ExplainabilityService:
    """
    Generates transparent, contextual natural-language explanations
    and actionable recommendations derived strictly from scoring components.
    """

    def generate_report(
        self,
        scores: Dict[str, Any],
        claims_evaluated: List[Dict[str, Any]],
        source_metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        overall = scores["overall_score"]
        tier = scores["tier"]
        
        # Component scores
        cs = scores["claim_score"]
        ss = scores["source_score"]
        es = scores["evidence_score"]
        ags = scores["agreement_score"]
        cds = scores["contradiction_score"]
        ls = scores["linguistic_score"]
        
        # Identify strengths and weaknesses
        components = [
            ("claim verification", cs),
            ("source credibility", ss),
            ("evidence strength", es),
            ("cross-source agreement", ags),
            ("contradiction detection", cds),
            ("linguistic reliability", ls),
        ]
        components.sort(key=lambda x: x[1], reverse=True)
        strongest = components[0]
        weakest = components[-1]
        
        # Count statuses
        false_claims = [c for c in claims_evaluated if c.get("status") == "False"]
        disputed_claims = [c for c in claims_evaluated if c.get("status") == "Disputed"]
        verified_claims = [c for c in claims_evaluated if c.get("status") in ["Verified", "Mostly Verified"]]
        unverified_claims = [c for c in claims_evaluated if c.get("status") in ["Unverified", "Insufficient Evidence"]]
        
        summary_sentences = []
        
        if overall >= 90:
            summary_sentences.append(
                f"Content is evaluated as {tier} ({overall}/100). The analyzed claims align closely with established scientific consensus and authoritative primary citations."
            )
        elif overall >= 75:
            summary_sentences.append(
                f"Content is evaluated as {tier} ({overall}/100). Most major claims are well-corroborated, though minor linguistic hedging or unverified secondary details were detected."
            )
        elif overall >= 50:
            summary_sentences.append(
                f"Content is evaluated as {tier} ({overall}/100). Factual basis is mixed; key assertions lack verifiable primary citations or present observational correlations as causal certainty."
            )
        elif overall >= 25:
            summary_sentences.append(
                f"Content is evaluated as {tier} ({overall}/100). Significant concerns detected: assertions directly contradict established consensus or rely heavily on uncorroborated claims."
            )
        else:
            summary_sentences.append(
                f"Content is evaluated as {tier} ({overall}/100). High risk of misinformation: multiple claims directly contradict established institutional evidence and scientific records."
            )
            
        # Add component insight
        if weakest[1] < 60:
            summary_sentences.append(
                f"The score was most heavily reduced by {weakest[0]} ({weakest[1]}%), reflecting {weakest[0]} vulnerabilities."
            )
            
        if false_claims:
            summary_sentences.append(
                f"Specifically, {len(false_claims)} claim(s) directly contradicted validated empirical references."
            )
        elif disputed_claims:
            summary_sentences.append(
                f"One or more claims made specific numerical assertions (e.g., exact percentages) not supported by consensus clinical or laboratory trials."
            )
            
        summary = " ".join(summary_sentences)
        
        # Generate actionable recommendation
        recommendations = []
        if false_claims:
            recommendations.append(
                "Do not publish or disseminate without retracting the false assertions that directly conflict with empirical consensus."
            )
        if disputed_claims:
            recommendations.append(
                "Revise specific numerical or causal claims to accurately reflect observational study boundaries rather than deterministic results."
            )
        if unverified_claims:
            recommendations.append(
                "Add explicit links to recognized peer-reviewed papers or authoritative institutional sources to corroborate unverified statements."
            )
        if ls < 70:
            recommendations.append(
                "Moderate absolute or hyperbolic language (e.g., 'proven without doubt', 'miracle') in favor of objective, calibrated terminology."
            )
        if not recommendations:
            recommendations.append(
                "The content exhibits high factual integrity and strong evidentiary backing. Safe to cite or publish with standard citation references."
            )
            
        recommendation = " ".join(recommendations)
        
        factor_breakdown = {
            "claim_verification": {
                "score": cs,
                "label": "Claim Verification",
                "description": f"{len(verified_claims)} verified, {len(unverified_claims)} unverified, {len(false_claims)} false"
            },
            "source_credibility": {
                "score": ss,
                "label": "Source Credibility",
                "description": f"Average matched domain credibility: {ss}%"
            },
            "evidence_strength": {
                "score": es,
                "label": "Evidence Strength",
                "description": f"{source_metrics.get('supports_count', 0)} supporting evidence citations identified"
            },
            "cross_source_agreement": {
                "score": ags,
                "label": "Cross-Source Agreement",
                "description": f"Consensus ratio between supporting and conflicting sources: {ags}%"
            },
            "contradiction_detection": {
                "score": cds,
                "label": "Contradiction Detection",
                "description": "Zero direct contradictions detected" if cds == 100 else f"Direct contradictions detected (score: {cds}%)"
            },
            "linguistic_reliability": {
                "score": ls,
                "label": "Linguistic Reliability",
                "description": "Objective and calibrated tone" if ls >= 80 else "Hyperbolic or overly absolute assertions detected"
            },
        }
        
        return {
            "summary": summary,
            "recommendation": recommendation,
            "factor_breakdown": factor_breakdown
        }
