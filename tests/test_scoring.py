import pytest
from app.database.session import SessionLocal, init_db
from app.services.scoring_service import ScoringService
from app.services.source_service import SourceService
from app.services.claim_service import ClaimService
from app.providers.demo_provider import DemoFactCheckProvider

@pytest.fixture(scope="module")
def db_session():
    init_db()
    db = SessionLocal()
    yield db
    db.close()

def test_high_trust_scoring(db_session):
    """Verified claims + authoritative sources must produce high trust score."""
    provider = DemoFactCheckProvider()
    source_service = SourceService()
    scoring_service = ScoringService()
    
    claim = "The Earth is approximately 4.5 billion years old."
    eval_res = provider.evaluate_claim(claim)
    assert eval_res.status == "Verified"
    
    claim_dict = {
        "claim_index": 1,
        "claim_text": claim,
        "status": eval_res.status,
        "confidence": eval_res.confidence,
        "certainty_score": 1.0,
        "evidence_matches": eval_res.evidence_matches
    }
    
    source_metrics = source_service.evaluate_sources([claim_dict])
    scores = scoring_service.calculate_scores([claim_dict], source_metrics, db_session)
    
    assert scores["overall_score"] >= 85.0
    assert scores["tier"] in ["Highly Trustworthy", "Mostly Trustworthy"]
    assert scores["contradiction_score"] == 100.0

def test_contradictory_misinformation_scoring(db_session):
    """Contradictory and debunked claims must trigger penalties resulting in low score."""
    provider = DemoFactCheckProvider()
    source_service = SourceService()
    scoring_service = ScoringService()
    
    claim = "NASA scientists confirmed the Moon is made entirely of ice."
    eval_res = provider.evaluate_claim(claim)
    assert eval_res.status == "False"
    
    claim_dict = {
        "claim_index": 1,
        "claim_text": claim,
        "status": eval_res.status,
        "confidence": eval_res.confidence,
        "certainty_score": 0.2,
        "evidence_matches": eval_res.evidence_matches
    }
    
    source_metrics = source_service.evaluate_sources([claim_dict])
    scores = scoring_service.calculate_scores([claim_dict], source_metrics, db_session)
    
    assert scores["overall_score"] < 40.0
    assert scores["tier"] in ["Low Trust", "Highly Unreliable"]
    assert scores["contradiction_score"] < 50.0

def test_disputed_numerical_exaggeration(db_session):
    """Claims with unwarranted mathematical precision (20% lifespan) are flagged."""
    provider = DemoFactCheckProvider()
    source_service = SourceService()
    scoring_service = ScoringService()
    
    claim = "Scientists proved that drinking coffee increases lifespan by exactly 20%."
    eval_res = provider.evaluate_claim(claim)
    assert eval_res.status == "Disputed"
    
    claim_dict = {
        "claim_index": 1,
        "claim_text": claim,
        "status": eval_res.status,
        "confidence": eval_res.confidence,
        "certainty_score": 0.6,
        "evidence_matches": eval_res.evidence_matches
    }
    
    source_metrics = source_service.evaluate_sources([claim_dict])
    scores = scoring_service.calculate_scores([claim_dict], source_metrics, db_session)
    
    assert 50.0 <= scores["overall_score"] <= 74.9
    assert scores["tier"] == "Needs Verification"

def test_score_normalization_boundaries(db_session):
    """Ensures scoring normalization stays strictly between 0 and 100."""
    scoring_service = ScoringService()
    source_metrics = {"average_credibility": 0.0, "supports_count": 0, "contradicts_count": 10}
    extreme_claims = [{"status": "False", "certainty_score": 0.0, "evidence_matches": []}]
    
    scores = scoring_service.calculate_scores(extreme_claims, source_metrics, db_session)
    assert 0.0 <= scores["overall_score"] <= 100.0
