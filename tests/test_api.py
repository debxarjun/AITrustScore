import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db

@pytest.fixture(scope="module")
def client():
    init_db()
    with TestClient(app) as c:
        yield c

def test_root_endpoint(client):
    res = client.get("/api")
    assert res.status_code == 200
    data = res.json()
    assert data["project"] == "AITrustScore"
    assert data["student"] == "Tamohar Das"
    assert data["reg_no"] == "24BPS1016"

def test_auth_and_analysis_flow(client):
    # 1. Register
    email = "tamohar.tester@vit.ac.in"
    reg_payload = {
        "name": "Tamohar Das",
        "email": email,
        "password": "SecurePassword123!"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    if reg_res.status_code == 400:  # already exists from prior run
        login_res = client.post("/api/auth/login", json={"email": email, "password": "SecurePassword123!"})
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
    else:
        assert reg_res.status_code == 201
        token = reg_res.json()["access_token"]
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get Me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email
    
    # 3. Submit Content Analysis
    analysis_payload = {
        "title": "Automated Test Planetary Formation",
        "body": "The Earth formed approximately 4.54 billion years ago from the accretion of the solar nebula.",
        "source_url": "https://science.nasa.gov",
        "is_demo": False
    }
    analyze_res = client.post("/api/analyze", json=analysis_payload, headers=headers)
    assert analyze_res.status_code == 201
    analysis_data = analyze_res.json()
    
    content_id = analysis_data["content_id"]
    assert analysis_data["overall_score"] >= 80.0
    assert analysis_data["tier"] in ["Highly Trustworthy", "Mostly Trustworthy"]
    assert len(analysis_data["claims"]) > 0
    assert "summary" in analysis_data
    assert "recommendation" in analysis_data
    
    # 4. Get Analysis by ID
    detail_res = client.get(f"/api/analyses/{content_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["title"] == analysis_payload["title"]
    
    # 5. Get Dashboard Stats
    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    stats_data = stats_res.json()
    assert stats_data["total_analyses"] > 0
    
    # 6. Delete Analysis
    del_res = client.delete(f"/api/analyses/{content_id}", headers=headers)
    assert del_res.status_code == 200
    
    # Verify deletion
    verify_del = client.get(f"/api/analyses/{content_id}")
    assert verify_del.status_code == 404
