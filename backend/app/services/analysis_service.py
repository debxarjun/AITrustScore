from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.models import Content, TrustScore, ExplainabilityReport, ClaimRecord, Source, ContentSourceLink
from app.services.claim_service import ClaimService
from app.services.source_service import SourceService
from app.services.scoring_service import ScoringService
from app.services.explainability_service import ExplainabilityService
from app.providers.demo_provider import DemoFactCheckProvider
from app.providers.external_provider import ExternalFactCheckProvider
from app.core.config import settings

class AnalysisService:
    def __init__(self):
        self.claim_service = ClaimService()
        self.source_service = SourceService()
        self.scoring_service = ScoringService()
        self.explainability_service = ExplainabilityService()
        
        # Provider architecture: uses ExternalFactCheckProvider if API key available, otherwise DemoProvider
        if settings.GOOGLE_FACTCHECK_API_KEY:
            self.provider = ExternalFactCheckProvider(settings.GOOGLE_FACTCHECK_API_KEY)
        else:
            self.provider = DemoFactCheckProvider()

    def analyze_content(
        self,
        title: str,
        body: str,
        source_url: Optional[str],
        is_demo: bool,
        user_id: Optional[int],
        db: Session
    ) -> Dict[str, Any]:
        
        # 1. Content Preprocessing & Claim Extraction
        raw_claims = self.claim_service.extract_claims(body)
        
        # 2. Claim Classification & Evidence Retrieval
        claims_evaluated = []
        for c in raw_claims:
            claim_text = c["claim_text"]
            certainty = c["certainty_score"]
            eval_res = self.provider.evaluate_claim(claim_text)
            
            supporting = [em.source_name for em in eval_res.evidence_matches if em.relationship == "SUPPORTS"]
            contradicting = [em.source_name for em in eval_res.evidence_matches if em.relationship == "CONTRADICTS"]
            
            evidence_quote = eval_res.evidence_matches[0].evidence_text if eval_res.evidence_matches else None
            
            claims_evaluated.append({
                "claim_index": c["claim_index"],
                "claim_text": claim_text,
                "status": eval_res.status,
                "confidence": eval_res.confidence,
                "evidence_quote": evidence_quote,
                "explanation": eval_res.explanation,
                "certainty_score": certainty,
                "evidence_matches": eval_res.evidence_matches,
                "supporting_sources": supporting,
                "contradicting_sources": contradicting
            })
            
        # 3. Source Evaluation & Cross-Source Comparison
        source_metrics = self.source_service.evaluate_sources(claims_evaluated)
        
        # 4. Trust Score & Confidence Calculation
        scores = self.scoring_service.calculate_scores(claims_evaluated, source_metrics, db)
        
        # 5. Explainability & Recommendation Generation
        explainability = self.explainability_service.generate_report(
            scores, claims_evaluated, source_metrics
        )
        
        # 6. Database Persistence
        content = Content(
            user_id=user_id,
            title=title,
            body=body,
            source_url=source_url,
            is_demo=is_demo,
            created_at=datetime.now(timezone.utc)
        )
        db.add(content)
        db.flush()  # gets content.id
        
        trust_score_row = TrustScore(
            content_id=content.id,
            overall_score=scores["overall_score"],
            tier=scores["tier"],
            confidence=scores["confidence"],
            claim_score=scores["claim_score"],
            source_score=scores["source_score"],
            evidence_score=scores["evidence_score"],
            agreement_score=scores["agreement_score"],
            contradiction_score=scores["contradiction_score"],
            linguistic_score=scores["linguistic_score"],
            created_at=datetime.now(timezone.utc)
        )
        db.add(trust_score_row)
        db.flush()
        
        report_row = ExplainabilityReport(
            trust_score_id=trust_score_row.id,
            summary=explainability["summary"],
            recommendation=explainability["recommendation"],
            factor_breakdown=explainability["factor_breakdown"],
            generated_at=datetime.now(timezone.utc)
        )
        db.add(report_row)
        
        # Save Claim Records
        for c in claims_evaluated:
            cr = ClaimRecord(
                content_id=content.id,
                claim_index=c["claim_index"],
                claim_text=c["claim_text"],
                status=c["status"],
                confidence=c["confidence"],
                evidence_quote=c["evidence_quote"],
                explanation=c["explanation"],
                certainty_score=c["certainty_score"]
            )
            db.add(cr)
            
        # Save Sources & Links
        saved_sources = []
        for s in source_metrics["sources"]:
            existing_source = db.query(Source).filter(Source.url == s["url"]).first()
            if not existing_source:
                existing_source = Source(
                    name=s["name"],
                    url=s["url"],
                    publisher=s["publisher"],
                    credibility_score=s["credibility_score"],
                    domain=s["domain"]
                )
                db.add(existing_source)
                db.flush()
                
            link = ContentSourceLink(
                content_id=content.id,
                source_id=existing_source.id,
                claim_index=s.get("claim_index", 1),
                relationship_type=s.get("relationship_type", "RELEVANT")
            )
            db.add(link)
            
            saved_sources.append({
                "id": existing_source.id,
                "name": existing_source.name,
                "url": existing_source.url,
                "publisher": existing_source.publisher,
                "publication_date": existing_source.publication_date,
                "credibility_score": existing_source.credibility_score,
                "domain": existing_source.domain,
                "relationship_type": s.get("relationship_type", "RELEVANT"),
                "claim_index": s.get("claim_index", 1)
            })
            
        db.commit()
        db.refresh(content)
        
        return {
            "content_id": content.id,
            "title": content.title,
            "body": content.body,
            "source_url": content.source_url,
            "is_demo": content.is_demo,
            "created_at": content.created_at,
            "overall_score": scores["overall_score"],
            "tier": scores["tier"],
            "confidence": scores["confidence"],
            "claim_score": scores["claim_score"],
            "source_score": scores["source_score"],
            "evidence_score": scores["evidence_score"],
            "agreement_score": scores["agreement_score"],
            "contradiction_score": scores["contradiction_score"],
            "linguistic_score": scores["linguistic_score"],
            "summary": explainability["summary"],
            "recommendation": explainability["recommendation"],
            "factor_breakdown": explainability["factor_breakdown"],
            "claims": [
                {
                    "claim_index": c["claim_index"],
                    "claim_text": c["claim_text"],
                    "status": c["status"],
                    "confidence": c["confidence"],
                    "evidence_quote": c["evidence_quote"],
                    "explanation": c["explanation"],
                    "certainty_score": c["certainty_score"],
                    "supporting_sources": c["supporting_sources"],
                    "contradicting_sources": c["contradicting_sources"]
                }
                for c in claims_evaluated
            ],
            "sources": saved_sources
        }

    def get_analysis_by_id(self, content_id: int, db: Session) -> Optional[Dict[str, Any]]:
        content = db.query(Content).filter(Content.id == content_id).first()
        if not content:
            return None
            
        ts = content.trust_score
        if not ts:
            return None
            
        report = ts.explainability_report
        
        claims = [
            {
                "claim_index": c.claim_index,
                "claim_text": c.claim_text,
                "status": c.status,
                "confidence": c.confidence,
                "evidence_quote": c.evidence_quote,
                "explanation": c.explanation,
                "certainty_score": c.certainty_score,
                "supporting_sources": [
                    link.source.name for link in content.source_links
                    if link.claim_index == c.claim_index and link.relationship_type == "SUPPORTS"
                ],
                "contradicting_sources": [
                    link.source.name for link in content.source_links
                    if link.claim_index == c.claim_index and link.relationship_type == "CONTRADICTS"
                ]
            }
            for c in content.claims
        ]
        
        sources = [
            {
                "id": link.source.id,
                "name": link.source.name,
                "url": link.source.url,
                "publisher": link.source.publisher,
                "publication_date": link.source.publication_date,
                "credibility_score": link.source.credibility_score,
                "domain": link.source.domain,
                "relationship_type": link.relationship_type,
                "claim_index": link.claim_index
            }
            for link in content.source_links
        ]
        
        return {
            "content_id": content.id,
            "title": content.title,
            "body": content.body,
            "source_url": content.source_url,
            "is_demo": content.is_demo,
            "created_at": content.created_at,
            "overall_score": ts.overall_score,
            "tier": ts.tier,
            "confidence": ts.confidence,
            "claim_score": ts.claim_score,
            "source_score": ts.source_score,
            "evidence_score": ts.evidence_score,
            "agreement_score": ts.agreement_score,
            "contradiction_score": ts.contradiction_score,
            "linguistic_score": ts.linguistic_score,
            "summary": report.summary if report else "",
            "recommendation": report.recommendation if report else "",
            "factor_breakdown": report.factor_breakdown if report else {},
            "claims": claims,
            "sources": sources
        }
