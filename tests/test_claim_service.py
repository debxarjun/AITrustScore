from app.services.claim_service import ClaimService

def test_extract_claims_from_paragraph():
    svc = ClaimService()
    text = "The Earth is approximately 4.5 billion years old. NASA scientists discovered that the Moon is made of rock. Is coffee healthy?"
    claims = svc.extract_claims(text)
    
    assert len(claims) >= 2
    assert "4.5 billion years old" in claims[0]["claim_text"]
    assert "Moon is made of rock" in claims[1]["claim_text"]

def test_linguistic_certainty_detection():
    svc = ClaimService()
    sensational = "This magical miracle cure for cancer increases lifespan by exactly 20% guaranteed."
    balanced = "Epidemiological studies indicate moderate coffee consumption may be associated with cardiovascular benefits."
    
    score_sensational = svc.evaluate_linguistic_certainty(sensational)
    score_balanced = svc.evaluate_linguistic_certainty(balanced)
    
    assert score_sensational < score_balanced
    assert score_sensational <= 0.4
    assert score_balanced == 1.0
