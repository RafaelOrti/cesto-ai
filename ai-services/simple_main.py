#!/usr/bin/env python3
"""
Simplified AI Services for Cesto Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="Cesto AI Services",
    description="AI-powered services for demand forecasting and recommendations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4400", "http://localhost:3400"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Cesto AI Services are running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "cesto-ai"}

@app.get("/predict/demand")
async def predict_demand():
    """Simple demand prediction endpoint"""
    return {
        "prediction": "High demand expected for next week",
        "confidence": 0.85,
        "recommendations": [
            "Increase stock for popular items",
            "Prepare for 20% increase in orders"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)


