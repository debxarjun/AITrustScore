import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.database.session import init_db
from app.api import auth, analyze, sources, rules, stats

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    
    from app.database.session import SessionLocal
    from app.models.models import Content
    from app.services.analysis_service import AnalysisService
    
    db = SessionLocal()
    try:
        if db.query(Content).count() == 0:
            svc = AnalysisService()
            svc.analyze_content(
                title="Geological Age and Formation of the Earth",
                body="The Earth is approximately 4.54 billion years old, verified through radiometric dating of meteorite samples and oldest terrestrial minerals. Furthermore, carbon dioxide acts as a greenhouse gas absorbing infrared radiation in the atmosphere.",
                source_url="https://usgs.gov/earth-age",
                is_demo=True,
                user_id=None,
                db=db
            )
            svc.analyze_content(
                title="Observational Study on Coffee Consumption and Longevity",
                body="Epidemiological research demonstrates that drinking coffee is correlated with improved metabolic health markers. Several researchers claim that drinking coffee regularly increases lifespan by exactly 20%.",
                source_url="https://health.harvard.edu/coffee",
                is_demo=True,
                user_id=None,
                db=db
            )
            svc.analyze_content(
                title="Viral Social Media Claim on Lunar Composition",
                body="NASA scientists have recently confirmed that the Moon is made entirely of ice. In a related leak, medical clinics revealed a secret miracle cure for cancer that cures all tumors overnight.",
                source_url="https://viral-unverified-blog.net/lunar-shock",
                is_demo=True,
                user_id=None,
                db=db
            )
            svc.analyze_content(
                title="Breakthrough Room-Temperature Quantum Processor Announcement",
                body="A clandestine tech startup has developed a revolutionary quantum processor operating with ambient room-temperature superconductivity with zero published peer-reviewed whitepapers.",
                source_url=None,
                is_demo=True,
                user_id=None,
                db=db
            )
    finally:
        db.close()
        
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="An Intelligent Trust Scoring Framework for AI-Generated Content — B.Tech Project by Tamohar Das (24BPS1016, VIT Chennai)",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(sources.router, prefix="/api")
app.include_router(rules.router, prefix="/api")
app.include_router(stats.router, prefix="/api")

@app.get("/api")
def api_info():
    return {
        "project": "AITrustScore",
        "description": "An Intelligent Trust Scoring Framework for AI-Generated Content",
        "student": "Tamohar Das",
        "reg_no": "24BPS1016",
        "institution": "VIT Chennai",
        "program": "B.Tech CSE (Cyber Physical Systems)",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "AITrustScore"}

# Static Frontend SPA Mounting (if built)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json"]:
            return None
        candidate = os.path.join(frontend_dist, full_path)
        if os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "project": "AITrustScore",
            "description": "An Intelligent Trust Scoring Framework for AI-Generated Content",
            "student": "Tamohar Das",
            "reg_no": "24BPS1016",
            "institution": "VIT Chennai",
            "program": "B.Tech CSE (Cyber Physical Systems)",
            "docs": "/docs",
            "status": "online"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
