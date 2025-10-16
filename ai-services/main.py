from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from config.settings import settings
from core.database import db_manager
from core.redis_client import redis_manager
from core.logging_config import setup_logging, get_logger
from services.ai_service import ai_service
from services.ml_service import ml_service

from models import (
    DemandForecastRequest, 
    DemandForecastResponse,
    InventoryOptimizationRequest,
    InventoryOptimizationResponse,
    PriceRecommendationRequest,
    PriceRecommendationResponse
)

setup_logging()
logger = get_logger(__name__)

app = FastAPI(
    title=settings.app_name,
    description="AI-powered services for demand forecasting, inventory optimization, and price recommendations",
    version=settings.app_version,
    debug=settings.debug
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    return db_manager.get_session_dependency()

def get_redis():
    return redis_manager

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.debug else "An unexpected error occurred",
            "timestamp": datetime.now().isoformat()
        }
    )

@app.get("/")
async def root():
    return {"message": "Cesto AI Services API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/ai/demand-forecast", response_model=DemandForecastResponse)
async def predict_demand(request: DemandForecastRequest, db: Session = Depends(get_db)):
    """
    Predict future demand for products based on historical data
    """
    logger.info(f"Generating demand forecast for product {request.product_id}")
    
    try:
        from sqlalchemy import text
        result = db.execute(text("""
            SELECT 
                oi.product_id,
                p.name as product_name,
                p.category,
                o.created_at,
                oi.quantity
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.created_at >= :start_date
            AND o.created_at <= :end_date
            AND oi.product_id = :product_id
            ORDER BY o.created_at
        """), {
            "start_date": request.start_date,
            "end_date": request.end_date,
            "product_id": request.product_id
        })
        
        data = result.fetchall()
        
        if not data:
            logger.warning(f"No historical data found for product {request.product_id}")
            return DemandForecastResponse(
                product_id=request.product_id,
                forecast_period=request.forecast_days,
                predictions=ml_service._generate_default_predictions(request.forecast_days),
                confidence_score=0.5,
                model_used="default"
            )
        
        import pandas as pd
        df = pd.DataFrame([row._asdict() for row in data])
        
        predictions, confidence_score, model_used = await ml_service.predict_demand(
            df, request.forecast_days
        )
        
        historical_demand = df['quantity'].tolist()
        ai_insights = await ai_service.get_demand_forecast_insights(historical_demand, predictions)
        
        cache_key = f"demand_insights:{request.product_id}"
        redis_manager.set(cache_key, ai_insights, ttl=settings.ai_model_cache_ttl)
        
        logger.info(f"Demand forecast generated with confidence {confidence_score:.2f}")
        
        return DemandForecastResponse(
            product_id=request.product_id,
            forecast_period=request.forecast_days,
            predictions=predictions,
            confidence_score=confidence_score,
            model_used=model_used,
            ai_insights=ai_insights
        )
        
    except Exception as e:
        logger.error(f"Error generating demand forecast: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating demand forecast: {str(e)}")

@app.post("/ai/inventory-optimization", response_model=InventoryOptimizationResponse)
async def optimize_inventory(request: InventoryOptimizationRequest, db: Session = Depends(get_db)):
    """
    Optimize inventory levels based on demand patterns and cost factors
    """
    logger.info(f"Optimizing inventory for buyer {request.buyer_id}")
    
    try:
        from sqlalchemy import text
        result = db.execute(text("""
            SELECT 
                i.product_id,
                p.name as product_name,
                p.category,
                i.current_stock,
                i.min_stock_threshold,
                p.price,
                p.lead_time_days
            FROM inventory i
            JOIN products p ON i.product_id = p.id
            WHERE i.buyer_id = :buyer_id
        """), {"buyer_id": request.buyer_id})
        
        inventory_data = [row._asdict() for row in result.fetchall()]
        
        if not inventory_data:
            logger.warning(f"No inventory data found for buyer {request.buyer_id}")
            return InventoryOptimizationResponse(
                buyer_id=request.buyer_id,
                recommendations=[],
                total_cost_savings=0,
                optimization_score=0
            )
        
        optimization_result = ml_service.optimize_inventory(inventory_data)
        
        logger.info(f"Inventory optimization completed with score {optimization_result['optimization_score']:.2f}")
        
        return InventoryOptimizationResponse(
            buyer_id=request.buyer_id,
            recommendations=optimization_result['recommendations'],
            total_cost_savings=optimization_result['total_cost_savings'],
            optimization_score=optimization_result['optimization_score']
        )
        
    except Exception as e:
        logger.error(f"Error optimizing inventory: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error optimizing inventory: {str(e)}")

@app.post("/ai/price-recommendations", response_model=PriceRecommendationResponse)
async def get_price_recommendations(request: PriceRecommendationRequest, db: Session = Depends(get_db)):
    """
    Provide price recommendations for suppliers based on market analysis
    """
    logger.info(f"Generating price recommendations for product {request.product_id}")
    
    try:
        from sqlalchemy import text
        result = db.execute(text("""
            SELECT 
                p.id,
                p.name,
                p.category,
                p.price,
                AVG(oi.quantity) as avg_quantity_sold,
                COUNT(oi.id) as order_count
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            WHERE p.category = (
                SELECT category FROM products WHERE id = :product_id
            )
            AND p.id != :product_id
            GROUP BY p.id, p.name, p.category, p.price
            HAVING COUNT(oi.id) > 0
            ORDER BY AVG(oi.quantity) DESC
            LIMIT 10
        """), {"product_id": request.product_id})
        
        market_data = [row._asdict() for row in result.fetchall()]
        
        current_product_result = db.execute(text("""
            SELECT price FROM products WHERE id = :product_id
        """), {"product_id": request.product_id})
        
        current_price_row = current_product_result.fetchone()
        current_price = float(current_price_row.price) if current_price_row else 0
        
        recommendation_result = ml_service.get_price_recommendations(market_data, current_price)
        
        logger.info(f"Price recommendations generated for product {request.product_id}")
        
        return PriceRecommendationResponse(
            product_id=request.product_id,
            current_price=recommendation_result['current_price'],
            recommended_price=recommendation_result['recommended_price'],
            market_analysis=recommendation_result['market_analysis'],
            recommendations=recommendation_result['recommendations']
        )
        
    except Exception as e:
        logger.error(f"Error generating price recommendations: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating price recommendations: {str(e)}")

@app.get("/ai/cache/clear")
async def clear_cache():
    """Clear AI model cache"""
    logger.info("Clearing AI model cache")
    
    try:
        success = redis_manager.flush_db()
        if success:
            return {"message": "Cache cleared successfully", "timestamp": datetime.now().isoformat()}
        else:
            raise HTTPException(status_code=500, detail="Failed to clear cache")
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")

@app.post("/ai/groq-insights")
async def get_groq_business_insights(request: dict):
    """Get AI-powered business insights using Groq"""
    prompt = request.get("prompt", "")
    context = request.get("context", {})
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    logger.info(f"Generating AI insights for prompt: {prompt[:100]}...")
    
    try:
        insights = await ai_service.get_business_insights(prompt, context)
        
        return {
            "insights": insights,
            "timestamp": datetime.now().isoformat(),
            "model_used": "llama-3.3-70b-versatile",
            "ai_service_available": ai_service.is_available()
        }
        
    except Exception as e:
        logger.error(f"Error getting AI insights: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error getting AI insights: {str(e)}")

@app.get("/ai/status")
async def get_ai_service_status():
    """Check AI service status"""
    return {
        "ai_service_available": ai_service.is_available(),
        "redis_available": redis_manager.health_check(),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": settings.app_version,
        "services": {
            "database": "connected",
            "redis": "connected" if redis_manager.health_check() else "disconnected",
            "ai_service": "available" if ai_service.is_available() else "unavailable"
        }
    }

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting {settings.app_name} on {settings.host}:{settings.port}")
    uvicorn.run(
        app, 
        host=settings.host, 
        port=settings.port,
        log_level=settings.log_level.lower()
    )
