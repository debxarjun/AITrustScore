from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.models import User, Content, TrustScore
from app.schemas.schemas import AnalyzeRequest, AnalysisResultResponse, AnalysisHistoryItem
from app.services.analysis_service import AnalysisService
from app.core.dependencies import get_optional_user, get_current_user

router = APIRouter(tags=["Analysis"])
analysis_service = AnalysisService()

@router.post("/analyze", response_model=AnalysisResultResponse, status_code=status.HTTP_201_CREATED)
def analyze_content(
    payload: AnalyzeRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    if len(payload.body.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Content body must be at least 10 characters long."
        )
        
    user_id = user.id if user else None
    result = analysis_service.analyze_content(
        title=payload.title.strip(),
        body=payload.body.strip(),
        source_url=payload.source_url.strip() if payload.source_url else None,
        is_demo=payload.is_demo,
        user_id=user_id,
        db=db
    )
    return result

@router.get("/analyses", response_model=List[AnalysisHistoryItem])
def list_analyses(
    q: Optional[str] = Query(None, description="Search by title or text"),
    tier: Optional[str] = Query(None, description="Filter by trust tier"),
    min_score: Optional[float] = Query(None, ge=0, le=100),
    max_score: Optional[float] = Query(None, ge=0, le=100),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(Content).join(TrustScore, Content.id == TrustScore.content_id)
    
    if user:
        # Show user's analyses + public demo analyses
        query = query.filter((Content.user_id == user.id) | (Content.is_demo == True))
    else:
        # If unauthenticated, show public demo analyses or recent analyses
        pass
        
    if q:
        search = f"%{q.strip()}%"
        query = query.filter(Content.title.ilike(search) | Content.body.ilike(search))
        
    if tier:
        query = query.filter(TrustScore.tier == tier)
        
    if min_score is not None:
        query = query.filter(TrustScore.overall_score >= min_score)
        
    if max_score is not None:
        query = query.filter(TrustScore.overall_score <= max_score)
        
    contents = query.order_by(desc(Content.created_at)).limit(100).all()
    
    items = []
    for c in contents:
        items.append(
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
        )
    return items

@router.get("/analyses/{content_id}", response_model=AnalysisResultResponse)
def get_analysis_detail(content_id: int, db: Session = Depends(get_db)):
    res = analysis_service.get_analysis_by_id(content_id, db)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found."
        )
    return res

@router.delete("/analyses/{content_id}", status_code=status.HTTP_200_OK)
def delete_analysis(
    content_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found."
        )
        
    db.delete(content)
    db.commit()
    return {"message": "Analysis deleted successfully.", "id": content_id}
