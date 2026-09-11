# AITrustScore — An Intelligent Trust Scoring Framework for AI-Generated Content

**Student:** Debarjun Chatterjee  
**Registration Number:** 25BAI1775  
**Institution:** Vellore Institute of Technology (VIT) Chennai  
**Program:** B.Tech Computer Science and Engineering (Artificial Intelligence and Machine Learning)  

---

## 1. Project Overview

**AITrustScore** is a web-based, explainable intelligence platform designed to evaluate the **trustworthiness, evidential basis, and factual credibility of AI-generated content**.

Rather than treating AI text verification as a naive binary classification problem ("AI vs. Human"), AITrustScore performs **fine-grained propositional claim extraction**, cross-checks each factual assertion against empirical scientific repositories and peer-reviewed consensus, penalizes direct contradictions and linguistic overclaims, and computes a multi-dimensional **Trust Score (0–100)** with natural-language explainability reports and actionable editorial recommendations.

---

## 2. Key Features

- **Propositional Claim Extraction:** Uses sentence boundary parsing and NLP linguistic certainty scoring to identify discrete verifiable assertions.
- **Multi-Factor Deterministic Scoring Engine:** Computes an explainable weighted index:
  1. **Claim Verification (30%)**
  2. **Source Credibility (20%)**
  3. **Evidence Strength (20%)**
  4. **Cross-Source Agreement (15%)**
  5. **Contradiction Detection (10%)**
  6. **Linguistic Reliability (5%)**
- **Pluggable Fact-Check Provider Architecture:** Supports `DemoFactCheckProvider` for deterministic offline presentations and unit testing, and `ExternalFactCheckProvider` for live fact-checking APIs (Google Fact Check Tools API / Wikipedia).
- **Explainable AI (XAI) Panel:** Details *why* the score was awarded, identifying which component factors reduced or boosted the overall score.
- **Evidence Matrix & Citation Cards:** Displays institutional publishers (NASA, USGS, WHO, Nature, Harvard Health, Reuters) with domain trust metrics, relationship flags (`SUPPORTS`, `CONTRADICTS`, `RELEVANT`), and direct evidence quotes.
- **4 Deterministic Viva Demo Presets:**
  - *Benchmark 1:* Planetary formation & greenhouse gases (Consensus Science $	o$ 90+ Score)
  - *Benchmark 2:* Coffee consumption & longevity (Disputed numerical overclaim "20%" $	o$ 50–74 Score)
  - *Benchmark 3:* Lunar ice & miracle cancer cure (Direct contradiction/misinformation $	o$ < 30 Score)
  - *Benchmark 4:* Room-temperature quantum superconductor (Unsupported novel assertion $	o$ Insufficient Evidence)
- **Executive Analytics Dashboard:** Real-time metrics for total analyses, average trust index, high-confidence ratio, and flagged content.
- **Historical Analysis Audit Trail:** Search, filter by score category, filter by tier, sort by date/score, view report, and delete analysis with confirmation modal.
- **Configurable Scoring Rules:** Interactive weight sliders allowing real-time adjustment of scoring formulas persisted in the database.
- **Dark / Light Theme System:** High-end AI aesthetic ("Perplexity × modern cybersecurity dashboard × research platform").

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS 3.4 (Dark/Light mode support)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (SVG Bar charts and animated circular gauges)

### Backend
- **Framework:** Python 3.14 + FastAPI + Pydantic v2
- **Database ORM:** SQLAlchemy 2.0 (Dual-driver: SQLite for zero-config local runs; PostgreSQL for containerized deployments)
- **Security:** PBKDF2-HMAC-SHA256 password hashing, PyJWT bearer token authentication
- **Testing:** Pytest 9.1 + HTTPX TestClient

---

## 4. Architecture & Data Flow

```
[User submits AI-generated text]
               │
               ▼
   [Content Preprocessing]
               │
               ▼
   [Claim Extraction & Certainty NLP]
               │
               ▼
   [Fact-Check Provider Dispatch] ──────────► [Knowledge Base / External API]
               │                                      │
               ▼                                      ▼
   [Evidence Retrieval & Matching] ◄──────────────────┘
               │
               ▼
   [Source Credibility & Agreement Scoring]
               │
               ▼
   [Contradiction Detection]
               │
               ▼
   [Trust Scoring Engine (Weighted Formula)]
               │
               ▼
   [Confidence Rating Calculation]
               │
               ▼
   [Explainability & Recommendations Generator]
               │
               ▼
   [SQLAlchemy Database Persistence]
               │
               ▼
   [Interactive React Dashboard & Report]
```

---

## 5. Database Schema

The relational database architecture is modeled around 8 core entities:

1. **`users`**: `id`, `name`, `email`, `password_hash`, `created_at`
2. **`contents`**: `id`, `user_id` (FK), `title`, `body`, `source_url`, `is_demo`, `created_at`
3. **`trust_scores`**: `id`, `content_id` (FK), `overall_score`, `tier`, `confidence`, `claim_score`, `source_score`, `evidence_score`, `agreement_score`, `contradiction_score`, `linguistic_score`, `created_at`
4. **`explainability_reports`**: `id`, `trust_score_id` (FK), `summary`, `recommendation`, `factor_breakdown` (JSON), `generated_at`
5. **`claim_records`**: `id`, `content_id` (FK), `claim_index`, `claim_text`, `status`, `confidence`, `evidence_quote`, `explanation`, `certainty_score`
6. **`sources`**: `id`, `name`, `url`, `publisher`, `publication_date`, `credibility_score`, `domain`
7. **`content_source_links`**: `id`, `content_id` (FK), `source_id` (FK), `claim_index`, `relationship_type` (`SUPPORTS`, `CONTRADICTS`, `RELEVANT`)
8. **`scoring_rules`**: `id`, `name`, `code`, `description`, `weight`, `enabled`, `created_at`

---

## 6. Quick Start & Local Execution

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ and npm

### Option A: Standard Local Execution (Recommended for Viva Demonstration)

#### 1. Start the Backend API
```powershell
cd backend

# Create and activate virtual environment (using uv or python venv)
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The backend automatically creates `aitrustscore.db` (SQLite) and seeds initial benchmark reports and verified sources on startup.*

- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

#### 2. Start the Frontend Application
```powershell
cd frontend

# Install node packages
npm install

# Start Vite development server
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

### Option B: Docker Compose (PostgreSQL + Backend + Frontend)

```bash
docker-compose up --build
```
- PostgreSQL: Port `5432`
- FastAPI Backend: [http://localhost:8000](http://localhost:8000)
- React Frontend: [http://localhost:5173](http://localhost:5173)

---

## 7. Running the Automated Test Suite

To run the unit and integration test suite:

```powershell
cd backend
$env:PYTHONPATH="C:\Users\Debarjun\.gemini\antigravity\scratch\AITrustScore\backend"
.venv\Scripts\pytest ..\tests -v
```

### Test Coverage:
- `test_high_trust_scoring`: Verifies high scores for consensus science with authoritative citations.
- `test_contradictory_misinformation_scoring`: Verifies contradiction detection penalties for false assertions.
- `test_disputed_numerical_exaggeration`: Verifies flagging of unwarranted precision ("20% lifespan").
- `test_score_normalization_boundaries`: Validates that composite scores are strictly bounded in $[0, 100]$.
- `test_extract_claims_from_paragraph`: Tests sentence boundary splitting and claim extraction.
- `test_linguistic_certainty_detection`: Tests NLP linguistic certainty markers.
- `test_root_endpoint`: Tests root API metadata and academic attribution.
- `test_auth_and_analysis_flow`: Tests full end-to-end user registration, login, content analysis, report retrieval, and deletion.

---

## 8. Viva Demonstration Guide

### Demo Account Credentials
- **Email:** `tamohar@vit.ac.in`
- **Password:** `DemoPassword123!`
*(A 1-click button "Fill Viva Demo Credentials" is available directly on the sign-in modal).*

### Live Viva Workflow:
1. **Landing Page (`/`):** Demonstrate the hero value proposition, "Live Trust Analysis Preview", and academic citation banner.
2. **Analysis Studio (`/analyze`):**
   - Click the preset: **"Geological Age and Formation of the Earth"** $	o$ Observe multi-step staged progress animation $	o$ Yields **94.8 / 100 (Highly Trustworthy)**.
   - Click the preset: **"Observational Study on Coffee Consumption"** $	o$ Detects numerical overclaim ("exactly 20%") $	o$ Yields **68.2 / 100 (Needs Verification)**.
   - Click the preset: **"Viral Social Media Claim on Lunar Composition"** $	o$ Debunked by NASA LRO data $	o$ Yields **24.0 / 100 (Highly Unreliable)** with direct contradiction flags.
3. **Analysis Report (`/analysis/:id`):**
   - Inspect the animated SVG Score Gauge, natural-language explainability summary, and specific recommendations.
   - Expand Claim Cards to view evidence quotes and supporting vs contradicting sources.
   - Inspect the Multi-Dimensional Score Breakdown chart.
4. **Analysis History (`/history`):**
   - Demonstrate real-time search, filter by score category, filter by tier, and report deletion.
5. **Methodology (`/methodology`):**
   - Highlight the mathematical model, weight distribution, and academic disclaimer.
6. **Settings (`/settings`):**
   - Demonstrate interactive adjustment of scoring rule weights and instant theme toggle (Dark / Light).

---

## 9. Academic Limitations & Epistemological Boundaries

1. **Analytical vs. Absolute Truth:** AITrustScore quantifies evidentiary alignment against configured knowledge bases and peer-reviewed consensus. It does not claim metaphysical certainty.
2. **Novel Discoveries:** Breaking scientific events published within hours may temporarily receive an `Insufficient Evidence` status until primary data repositories or peer-reviewed preprints are indexed.
3. **Context Dependency:** Sarcasm, satire, and rhetorical hyperbole in creative prose may be flagged as low linguistic reliability unless explicitly denoted.
