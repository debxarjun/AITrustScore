import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

db_url = settings.DATABASE_URL

# SQLite special connection parameters
if db_url.startswith("sqlite"):
    engine = create_engine(
        db_url, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(db_url, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.models import models
    Base.metadata.create_all(bind=engine)
    
    # Seed initial scoring rules and sources if not present
    db = SessionLocal()
    try:
        if db.query(models.ScoringRule).count() == 0:
            default_rules = [
                models.ScoringRule(
                    name="Claim Verification",
                    code="claim_verification",
                    description="Measures ratio of verified vs false/unverified factual assertions",
                    weight=0.30,
                    enabled=True
                ),
                models.ScoringRule(
                    name="Source Credibility",
                    code="source_credibility",
                    description="Evaluates institutional reputation, domain trust and editorial rigor",
                    weight=0.20,
                    enabled=True
                ),
                models.ScoringRule(
                    name="Evidence Strength",
                    code="evidence_strength",
                    description="Assesses empirical data, study citations and direct quotes available",
                    weight=0.20,
                    enabled=True
                ),
                models.ScoringRule(
                    name="Cross-Source Agreement",
                    code="cross_source_agreement",
                    description="Verifies whether independent reputable publishers corroborate the claim",
                    weight=0.15,
                    enabled=True
                ),
                models.ScoringRule(
                    name="Contradiction Detection",
                    code="contradiction_detection",
                    description="Penalizes direct conflicts with established scientific/factual consensus",
                    weight=0.10,
                    enabled=True
                ),
                models.ScoringRule(
                    name="Linguistic Reliability",
                    code="linguistic_reliability",
                    description="Checks for sensationalism, unsubstantiated absolutes and clickbait markers",
                    weight=0.05,
                    enabled=True
                ),
            ]
            db.add_all(default_rules)
            db.commit()

        if db.query(models.Source).count() == 0:
            seed_sources = [
                models.Source(
                    name="Nature Scientific Reports",
                    url="https://www.nature.com/srep/",
                    publisher="Springer Nature",
                    publication_date="2025-10-15",
                    credibility_score=96.0,
                    domain="nature.com"
                ),
                models.Source(
                    name="NASA Science Exploration",
                    url="https://science.nasa.gov/",
                    publisher="National Aeronautics and Space Administration",
                    publication_date="2026-01-20",
                    credibility_score=98.0,
                    domain="nasa.gov"
                ),
                models.Source(
                    name="World Health Organization Research",
                    url="https://www.who.int/",
                    publisher="World Health Organization",
                    publication_date="2025-11-04",
                    credibility_score=95.0,
                    domain="who.int"
                ),
                models.Source(
                    name="Harvard Health Publishing",
                    url="https://www.health.harvard.edu/",
                    publisher="Harvard Medical School",
                    publication_date="2025-08-12",
                    credibility_score=94.0,
                    domain="harvard.edu"
                ),
                models.Source(
                    name="US Geological Survey (USGS)",
                    url="https://www.usgs.gov/",
                    publisher="United States Geological Survey",
                    publication_date="2024-04-10",
                    credibility_score=97.0,
                    domain="usgs.gov"
                ),
                models.Source(
                    name="Reuters Fact Check",
                    url="https://www.reuters.com/fact-check/",
                    publisher="Thomson Reuters",
                    publication_date="2026-02-01",
                    credibility_score=93.0,
                    domain="reuters.com"
                ),
            ]
            db.add_all(seed_sources)
            db.commit()
    finally:
        db.close()
