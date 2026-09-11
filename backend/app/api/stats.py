from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database.session import get_db
from app.models.models import Content, TrustScore
from app.schemas.schemas import DashboardStats, AnalysisHistoryItem
from app.core.dependencies import get_optional_user

router = APIRouter(prefix="/stats", tags=["Dashboard Statistics"])

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), user=Depends(get_optional_user)):
    query = db.query(Content).join(TrustScore, Content.id == TrustScore.content_id)
    
    total = query.count()
    if total == 0:
        return DashboardStats(
            total_analyses=0,
            average_trust_score=0.0,
            high_confidence_count=0,
            flagged_analyses_count=0,
            recent_analyses=[]
        )
        
    avg_score = db.query(func.avg(TrustScore.overall_score)).scalar() or 0.0
    high_conf = db.query(TrustScore).filter(TrustScore.confidence >= 80.0).count()
    flagged = db.query(TrustScore).filter(TrustScore.overall_score < 50.0).count()
    
    recent = query.order_by(desc(Content.created_at)).limit(5).all()
    recent_items = [
        AnalysisHistoryItem(
            id=c.id,
            title=c.title,
            created_at=c.created_at,
            overall_score=c.trust_score.overall_score if c.trust_score else 0.0,
            tier=c.trust_score.tier if c.trust_score else "Unknown",
            confidence=c.trust_score.confidence if c.trust_score else 0.0,
            claims_count=len(c.claims),
            is_demo=c.is_demo
        )
        for c in recent
    ]
    
    return DashboardStats(
        total_analyses=total,
        average_trust_score=round(float(avg_score), 1),
        high_confidence_count=high_conf,
        flagged_analyses_count=flagged,
        recent_analyses=recent_items
    )
