from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import ScoringRule
from app.schemas.schemas import ScoringRuleResponse, ScoringRuleUpdate

router = APIRouter(prefix="/scoring-rules", tags=["Scoring Rules"])

@router.get("", response_model=List[ScoringRuleResponse])
def get_scoring_rules(db: Session = Depends(get_db)):
    return db.query(ScoringRule).order_by(ScoringRule.id).all()

@router.put("/{rule_id}", response_model=ScoringRuleResponse)
def update_scoring_rule(
    rule_id: int,
    payload: ScoringRuleUpdate,
    db: Session = Depends(get_db)
):
    rule = db.query(ScoringRule).filter(ScoringRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scoring rule not found."
        )
        
    if payload.weight is not None:
        rule.weight = max(0.0, min(1.0, payload.weight))
    if payload.enabled is not None:
        rule.enabled = payload.enabled
        
    db.commit()
    db.refresh(rule)
    return rule
