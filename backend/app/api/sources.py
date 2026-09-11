from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.models import Source
from app.schemas.schemas import SourceDetail

router = APIRouter(prefix="/sources", tags=["Sources"])

@router.get("", response_model=List[SourceDetail])
def list_sources(db: Session = Depends(get_db)):
    sources = db.query(Source).order_by(desc(Source.credibility_score)).all()
    return [
        SourceDetail(
            id=s.id,
            name=s.name,
            url=s.url,
            publisher=s.publisher,
            publication_date=s.publication_date,
            credibility_score=s.credibility_score,
            domain=s.domain,
            relationship_type="RELEVANT"
        )
        for s in sources
    ]
