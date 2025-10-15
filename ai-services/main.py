from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import redis
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
from datetime import datetime, timedelta
import json

from models import (
    DemandForecastRequest, 
    DemandForecastResponse,
    InventoryOptimizationRequest,
    InventoryOptimizationResponse,
    PriceRecommendationRequest,
    PriceRecommendationResponse
)

load_dotenv()

app = FastAPI(
    title="Cesto AI Services",
    description="AI-powered services for demand forecasting, inventory optimization, and price recommendations",
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

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://cesto_user:cesto_password@localhost:5432/cesto_ai")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Redis connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
    return redis_client

@app.get("/")
async def root():
    return {"message": "Cesto AI Services API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/ai/demand-forecast", response_model=DemandForecastResponse)
async def predict_demand(request: DemandForecastRequest):
    """
    Predict future demand for products based on historical data
    """
    try:
        # Get historical data from database
        with engine.connect() as conn:
            query = text("""
                SELECT 
                    oi.product_id,
                    p.name as product_name,
                    p.category,
                    o.created_at,
                    oi.quantity,
                    EXTRACT(month FROM o.created_at) as month,
                    EXTRACT(dayofweek FROM o.created_at) as day_of_week
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                JOIN products p ON oi.product_id = p.id
                WHERE o.created_at >= :start_date
                AND o.created_at <= :end_date
                AND oi.product_id = :product_id
                ORDER BY o.created_at
            """)
            
            result = conn.execute(query, {
                "start_date": request.start_date,
                "end_date": request.end_date,
                "product_id": request.product_id
            })
            
            data = result.fetchall()
        
        if not data:
            # Return default forecast if no data available
            return DemandForecastResponse(
                product_id=request.product_id,
                forecast_period=request.forecast_days,
                predictions=[
                    {"date": (datetime.now() + timedelta(days=i)).isoformat(), "predicted_demand": 10}
                    for i in range(1, request.forecast_days + 1)
                ],
                confidence_score=0.5,
                model_used="default"
            )
        
        # Prepare data for ML model
        df = pd.DataFrame(data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        df = df.set_index('created_at')
        
        # Feature engineering
        df['month'] = df.index.month
        df['day_of_week'] = df.index.dayofweek
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        
        # Aggregate daily demand
        daily_demand = df.groupby(df.index.date)['quantity'].sum().reset_index()
        daily_demand.columns = ['date', 'demand']
        
        # Create features
        features = []
        targets = []
        
        for i in range(7, len(daily_demand)):
            # Use last 7 days as features
            feature_row = daily_demand['demand'].iloc[i-7:i].values
            target = daily_demand['demand'].iloc[i]
            features.append(feature_row)
            targets.append(target)
        
        if len(features) < 10:
            # Not enough data for reliable prediction
            return DemandForecastResponse(
                product_id=request.product_id,
                forecast_period=request.forecast_days,
                predictions=[
                    {"date": (datetime.now() + timedelta(days=i)).isoformat(), "predicted_demand": 10}
                    for i in range(1, request.forecast_days + 1)
                ],
                confidence_score=0.3,
                model_used="insufficient_data"
            )
        
        # Train model
        X = np.array(features)
        y = np.array(targets)
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Generate predictions
        predictions = []
        last_week_demand = daily_demand['demand'].tail(7).values
        
        for i in range(request.forecast_days):
            # Use recent demand as input
            input_data = scaler.transform([last_week_demand])
            predicted_demand = model.predict(input_data)[0]
            
            # Ensure non-negative predictions
            predicted_demand = max(0, predicted_demand)
            
            predictions.append({
                "date": (datetime.now() + timedelta(days=i+1)).isoformat(),
                "predicted_demand": round(predicted_demand, 2)
            })
            
            # Update last week demand for next prediction
            last_week_demand = np.roll(last_week_demand, -1)
            last_week_demand[-1] = predicted_demand
        
        # Calculate confidence score based on model performance
        train_predictions = model.predict(X_scaled)
        mse = np.mean((y - train_predictions) ** 2)
        confidence_score = max(0.1, min(0.9, 1 - (mse / np.var(y))))
        
        return DemandForecastResponse(
            product_id=request.product_id,
            forecast_period=request.forecast_days,
            predictions=predictions,
            confidence_score=confidence_score,
            model_used="random_forest"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating demand forecast: {str(e)}")

@app.post("/ai/inventory-optimization", response_model=InventoryOptimizationResponse)
async def optimize_inventory(request: InventoryOptimizationRequest):
    """
    Optimize inventory levels based on demand patterns and cost factors
    """
    try:
        # Get current inventory data
        with engine.connect() as conn:
            query = text("""
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
            """)
            
            result = conn.execute(query, {"buyer_id": request.buyer_id})
            inventory_data = result.fetchall()
        
        if not inventory_data:
            return InventoryOptimizationResponse(
                buyer_id=request.buyer_id,
                recommendations=[],
                total_cost_savings=0,
                optimization_score=0
            )
        
        recommendations = []
        total_savings = 0
        
        for item in inventory_data:
            # Simple inventory optimization logic
            current_stock = item.current_stock
            min_threshold = item.min_stock_threshold
            price = float(item.price)
            lead_time = item.lead_time_days
            
            # Calculate optimal stock level based on lead time and demand patterns
            optimal_stock = max(min_threshold * 2, lead_time * 5)
            
            if current_stock < optimal_stock:
                recommended_order = optimal_stock - current_stock
                cost_impact = recommended_order * price
                
                recommendations.append({
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "current_stock": current_stock,
                    "recommended_stock": optimal_stock,
                    "recommended_order_quantity": recommended_order,
                    "estimated_cost": cost_impact,
                    "reason": "Below optimal level"
                })
            elif current_stock > optimal_stock * 1.5:
                excess_stock = current_stock - optimal_stock
                cost_savings = excess_stock * price * 0.1  # 10% carrying cost
                total_savings += cost_savings
                
                recommendations.append({
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "current_stock": current_stock,
                    "recommended_stock": optimal_stock,
                    "recommended_order_quantity": -excess_stock,
                    "estimated_cost": -cost_savings,
                    "reason": "Overstocked - reduce ordering"
                })
        
        # Calculate optimization score
        total_items = len(inventory_data)
        optimized_items = len(recommendations)
        optimization_score = optimized_items / total_items if total_items > 0 else 0
        
        return InventoryOptimizationResponse(
            buyer_id=request.buyer_id,
            recommendations=recommendations,
            total_cost_savings=total_savings,
            optimization_score=optimization_score
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error optimizing inventory: {str(e)}")

@app.post("/ai/price-recommendations", response_model=PriceRecommendationResponse)
async def get_price_recommendations(request: PriceRecommendationRequest):
    """
    Provide price recommendations for suppliers based on market analysis
    """
    try:
        # Get market data for similar products
        with engine.connect() as conn:
            query = text("""
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
            """)
            
            result = conn.execute(query, {"product_id": request.product_id})
            market_data = result.fetchall()
        
        if not market_data:
            return PriceRecommendationResponse(
                product_id=request.product_id,
                current_price=0,
                recommended_price=0,
                market_analysis={},
                recommendations=[]
            )
        
        # Calculate market statistics
        prices = [float(item.price) for item in market_data]
        quantities = [float(item.avg_quantity_sold) for item in market_data]
        
        market_avg_price = np.mean(prices)
        market_median_price = np.median(prices)
        market_std_price = np.std(prices)
        
        # Get current product price
        current_price = 0
        for item in market_data:
            if item.id == request.product_id:
                current_price = float(item.price)
                break
        
        # Simple price recommendation based on market position
        if current_price < market_avg_price * 0.9:
            recommended_price = market_avg_price * 0.95
            recommendation = "Increase price to be more competitive"
        elif current_price > market_avg_price * 1.1:
            recommended_price = market_avg_price * 1.05
            recommendation = "Consider reducing price to increase sales"
        else:
            recommended_price = current_price
            recommendation = "Price is well positioned in market"
        
        recommendations = [
            {
                "type": "market_positioning",
                "description": recommendation,
                "impact": "medium"
            },
            {
                "type": "competitive_analysis",
                "description": f"Your price is {((current_price - market_avg_price) / market_avg_price * 100):.1f}% {'above' if current_price > market_avg_price else 'below'} market average",
                "impact": "high"
            }
        ]
        
        return PriceRecommendationResponse(
            product_id=request.product_id,
            current_price=current_price,
            recommended_price=recommended_price,
            market_analysis={
                "average_market_price": market_avg_price,
                "median_market_price": market_median_price,
                "price_standard_deviation": market_std_price,
                "competitor_count": len(market_data)
            },
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating price recommendations: {str(e)}")

@app.get("/ai/cache/clear")
async def clear_cache():
    """
    Clear AI model cache
    """
    try:
        redis_client.flushdb()
        return {"message": "Cache cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
