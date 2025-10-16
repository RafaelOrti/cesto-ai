"""Machine Learning service for predictions and optimization."""
import logging
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Tuple
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

from config.settings import settings
from core.redis_client import redis_manager

logger = logging.getLogger(__name__)


class MLService:
    """Machine Learning service for demand forecasting and optimization."""
    
    def __init__(self):
        self.model_cache = {}
        self.scaler_cache = {}
        self.cache_dir = "models_cache"
        os.makedirs(self.cache_dir, exist_ok=True)
    
    async def predict_demand(
        self, 
        historical_data: pd.DataFrame, 
        forecast_days: int
    ) -> Tuple[List[Dict[str, Any]], float, str]:
        """Predict future demand using machine learning."""
        try:
            if len(historical_data) < settings.min_training_data_points:
                return self._generate_default_predictions(forecast_days), 0.3, "insufficient_data"
            
            # Prepare features
            features, targets = self._prepare_features(historical_data)
            
            if len(features) < 10:
                return self._generate_default_predictions(forecast_days), 0.3, "insufficient_data"
            
            # Train model
            model, scaler, confidence = self._train_model(features, targets)
            
            # Generate predictions
            predictions = self._generate_predictions(
                model, scaler, features, forecast_days
            )
            
            model_name = "random_forest"
            return predictions, confidence, model_name
            
        except Exception as e:
            logger.error(f"Error in demand prediction: {e}")
            return self._generate_default_predictions(forecast_days), 0.1, "error"
    
    def _prepare_features(self, data: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features for machine learning."""
        # Ensure we have the required columns
        if 'created_at' not in data.columns or 'quantity' not in data.columns:
            raise ValueError("Required columns 'created_at' and 'quantity' not found")
        
        # Convert to datetime and set index
        data['created_at'] = pd.to_datetime(data['created_at'])
        data = data.set_index('created_at')
        
        # Feature engineering
        data['month'] = data.index.month
        data['day_of_week'] = data.index.dayofweek
        data['is_weekend'] = (data['day_of_week'] >= 5).astype(int)
        
        # Aggregate daily demand
        daily_demand = data.groupby(data.index.date)['quantity'].sum().reset_index()
        daily_demand.columns = ['date', 'demand']
        
        # Create features using sliding window
        features = []
        targets = []
        window_size = 7
        
        for i in range(window_size, len(daily_demand)):
            feature_row = daily_demand['demand'].iloc[i-window_size:i].values
            target = daily_demand['demand'].iloc[i]
            features.append(feature_row)
            targets.append(target)
        
        return np.array(features), np.array(targets)
    
    def _train_model(
        self, 
        features: np.ndarray, 
        targets: np.ndarray
    ) -> Tuple[RandomForestRegressor, StandardScaler, float]:
        """Train machine learning model."""
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(features)
        
        # Train model
        model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2
        )
        model.fit(X_scaled, targets)
        
        # Calculate confidence score
        train_predictions = model.predict(X_scaled)
        mse = mean_squared_error(targets, train_predictions)
        r2 = r2_score(targets, train_predictions)
        confidence = max(0.1, min(0.9, r2))
        
        logger.info(f"Model trained - MSE: {mse:.4f}, R²: {r2:.4f}, Confidence: {confidence:.4f}")
        
        return model, scaler, confidence
    
    def _generate_predictions(
        self, 
        model: RandomForestRegressor, 
        scaler: StandardScaler, 
        features: np.ndarray, 
        forecast_days: int
    ) -> List[Dict[str, Any]]:
        """Generate future predictions."""
        predictions = []
        
        # Use last window_size days as starting point
        last_week_demand = features[-1] if len(features) > 0 else np.zeros(7)
        
        for i in range(forecast_days):
            # Predict next day
            input_data = scaler.transform([last_week_demand])
            predicted_demand = model.predict(input_data)[0]
            
            # Ensure non-negative predictions
            predicted_demand = max(0, predicted_demand)
            
            predictions.append({
                "date": (datetime.now() + timedelta(days=i+1)).isoformat(),
                "predicted_demand": round(predicted_demand, 2)
            })
            
            # Update sliding window for next prediction
            last_week_demand = np.roll(last_week_demand, -1)
            last_week_demand[-1] = predicted_demand
        
        return predictions
    
    def _generate_default_predictions(self, forecast_days: int) -> List[Dict[str, Any]]:
        """Generate default predictions when insufficient data."""
        return [
            {"date": (datetime.now() + timedelta(days=i+1)).isoformat(), "predicted_demand": 10}
            for i in range(forecast_days)
        ]
    
    def optimize_inventory(self, inventory_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Optimize inventory levels based on data."""
        try:
            recommendations = []
            total_savings = 0
            
            for item in inventory_data:
                current_stock = item.get('current_stock', 0)
                min_threshold = item.get('min_stock_threshold', 0)
                price = float(item.get('price', 0))
                lead_time = item.get('lead_time_days', 0)
                
                # Calculate optimal stock level
                optimal_stock = max(min_threshold * 2, lead_time * 5)
                
                if current_stock < optimal_stock:
                    recommended_order = optimal_stock - current_stock
                    cost_impact = recommended_order * price
                    
                    recommendations.append({
                        "product_id": item.get('product_id'),
                        "product_name": item.get('product_name'),
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
                        "product_id": item.get('product_id'),
                        "product_name": item.get('product_name'),
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
            
            return {
                "recommendations": recommendations,
                "total_cost_savings": total_savings,
                "optimization_score": optimization_score
            }
            
        except Exception as e:
            logger.error(f"Error in inventory optimization: {e}")
            return {
                "recommendations": [],
                "total_cost_savings": 0,
                "optimization_score": 0
            }
    
    def get_price_recommendations(self, market_data: List[Dict[str, Any]], current_price: float) -> Dict[str, Any]:
        """Generate price recommendations based on market analysis."""
        try:
            if not market_data:
                return {
                    "current_price": current_price,
                    "recommended_price": current_price,
                    "market_analysis": {},
                    "recommendations": []
                }
            
            # Calculate market statistics
            prices = [float(item.get('price', 0)) for item in market_data if item.get('price')]
            quantities = [float(item.get('avg_quantity_sold', 0)) for item in market_data if item.get('avg_quantity_sold')]
            
            if not prices:
                return {
                    "current_price": current_price,
                    "recommended_price": current_price,
                    "market_analysis": {},
                    "recommendations": []
                }
            
            market_avg_price = np.mean(prices)
            market_median_price = np.median(prices)
            market_std_price = np.std(prices)
            
            # Generate price recommendation
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
            
            return {
                "current_price": current_price,
                "recommended_price": recommended_price,
                "market_analysis": {
                    "average_market_price": market_avg_price,
                    "median_market_price": market_median_price,
                    "price_standard_deviation": market_std_price,
                    "competitor_count": len(market_data)
                },
                "recommendations": recommendations
            }
            
        except Exception as e:
            logger.error(f"Error in price recommendations: {e}")
            return {
                "current_price": current_price,
                "recommended_price": current_price,
                "market_analysis": {},
                "recommendations": []
            }


# Global ML service instance
ml_service = MLService()

