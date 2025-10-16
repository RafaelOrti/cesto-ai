from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, date

class DemandForecastRequest(BaseModel):
    product_id: str
    start_date: date
    end_date: date
    forecast_days: int = 30

class PredictionData(BaseModel):
    date: str
    predicted_demand: float

class DemandForecastResponse(BaseModel):
    product_id: str
    forecast_period: int
    predictions: List[PredictionData]
    confidence_score: float
    model_used: str
    ai_insights: Optional[str] = None

class InventoryOptimizationRequest(BaseModel):
    buyer_id: str
    optimization_goals: Optional[List[str]] = ["minimize_costs", "avoid_stockouts"]

class InventoryRecommendation(BaseModel):
    product_id: str
    product_name: str
    current_stock: int
    recommended_stock: int
    recommended_order_quantity: int
    estimated_cost: float
    reason: str

class InventoryOptimizationResponse(BaseModel):
    buyer_id: str
    recommendations: List[InventoryRecommendation]
    total_cost_savings: float
    optimization_score: float

class PriceRecommendationRequest(BaseModel):
    product_id: str
    market_analysis_depth: Optional[str] = "standard"

class PriceRecommendation(BaseModel):
    type: str
    description: str
    impact: str

class PriceRecommendationResponse(BaseModel):
    product_id: str
    current_price: float
    recommended_price: float
    market_analysis: Dict[str, Any]
    recommendations: List[PriceRecommendation]

class AIServiceHealth(BaseModel):
    status: str
    timestamp: str
    models_loaded: bool
    cache_status: str
