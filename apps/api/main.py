from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="What Are The Odds API",
    description="Odds ingestion, caching, and parlay math microservice",
    version="0.1.0"
)

# Enable CORS for Next.js frontend local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "what-are-the-odds-api"}