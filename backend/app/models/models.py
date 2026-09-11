from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    contents = relationship("Content", back_populates="user", cascade="all, delete-orphan")

class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    source_url = Column(String(1024), nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="contents")
    trust_score = relationship("TrustScore", back_populates="content", uselist=False, cascade="all, delete-orphan")
    claims = relationship("ClaimRecord", back_populates="content", cascade="all, delete-orphan")
    source_links = relationship("ContentSourceLink", back_populates="content", cascade="all, delete-orphan")

class TrustScore(Base):
    __tablename__ = "trust_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id", ondelete="CASCADE"), unique=True, nullable=False)
    overall_score = Column(Float, nullable=False)
    tier = Column(String(64), nullable=False)
    confidence = Column(Float, nullable=False)
    
    # Sub-scores (0-100)
    claim_score = Column(Float, nullable=False)
    source_score = Column(Float, nullable=False)
    evidence_score = Column(Float, nullable=False)
    agreement_score = Column(Float, nullable=False)
    contradiction_score = Column(Float, nullable=False)
    linguistic_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    content = relationship("Content", back_populates="trust_score")
    explainability_report = relationship("ExplainabilityReport", back_populates="trust_score", uselist=False, cascade="all, delete-orphan")

class ExplainabilityReport(Base):
    __tablename__ = "explainability_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    trust_score_id = Column(Integer, ForeignKey("trust_scores.id", ondelete="CASCADE"), unique=True, nullable=False)
    summary = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    factor_breakdown = Column(JSON, nullable=True)
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    trust_score = relationship("TrustScore", back_populates="explainability_report")

class Source(Base):
    __tablename__ = "sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=False)
    publisher = Column(String(255), nullable=False)
    publication_date = Column(String(64), nullable=True)
    credibility_score = Column(Float, nullable=False)
    domain = Column(String(255), nullable=False)
    
    source_links = relationship("ContentSourceLink", back_populates="source")

class ContentSourceLink(Base):
    __tablename__ = "content_source_links"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id", ondelete="CASCADE"), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id", ondelete="CASCADE"), nullable=False)
    claim_index = Column(Integer, default=0)
    relationship_type = Column(String(32), nullable=False)  # SUPPORTS, CONTRADICTS, RELEVANT
    
    content = relationship("Content", back_populates="source_links")
    source = relationship("Source", back_populates="source_links")

class ScoringRule(Base):
    __tablename__ = "scoring_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    code = Column(String(64), unique=True, nullable=False)
    description = Column(String(512), nullable=False)
    weight = Column(Float, nullable=False)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ClaimRecord(Base):
    __tablename__ = "claim_records"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id", ondelete="CASCADE"), nullable=False)
    claim_index = Column(Integer, nullable=False)
    claim_text = Column(Text, nullable=False)
    status = Column(String(64), nullable=False)  # Verified, Mostly Verified, Unverified, Disputed, False, Insufficient Evidence
    confidence = Column(Float, nullable=False)
    evidence_quote = Column(Text, nullable=True)
    explanation = Column(Text, nullable=False)
    certainty_score = Column(Float, default=1.0)
    
    content = relationship("Content", back_populates="claims")
