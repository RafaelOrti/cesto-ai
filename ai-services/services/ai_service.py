"""AI service for business intelligence and insights."""
import logging
from typing import Dict, Any, Optional
import json

from config.settings import settings
from core.redis_client import redis_manager

logger = logging.getLogger(__name__)


class AIService:
    """AI service for generating business insights."""
    
    def __init__(self):
        self.groq_client = None
        self._initialize_groq()
    
    def _initialize_groq(self):
        """Initialize Groq AI client."""
        if not settings.groq_api_key:
            logger.warning("Groq API key not configured")
            return
        
        try:
            from groq import Groq
            self.groq_client = Groq(api_key=settings.groq_api_key)
            logger.info("Groq AI client initialized successfully")
        except ImportError:
            logger.error("Groq library not available. Install with: pip install groq")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
    
    async def get_business_insights(
        self, 
        prompt: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Get AI-powered business insights."""
        if not self.groq_client:
            return "AI service not available"
        
        try:
            # Check cache first
            cache_key = f"ai_insights:{hash(prompt)}"
            cached_result = redis_manager.get(cache_key)
            if cached_result:
                logger.debug("Returning cached AI insights")
                return cached_result
            
            # Generate insights
            full_prompt = self._build_prompt(prompt, context)
            
            response = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": full_prompt}],
                temperature=0.7,
                max_tokens=500
            )
            
            insights = response.choices[0].message.content
            
            # Cache the result
            redis_manager.set(
                cache_key, 
                insights, 
                ttl=settings.ai_model_cache_ttl
            )
            
            logger.info("Generated new AI insights")
            return insights
            
        except Exception as e:
            logger.error(f"Error generating AI insights: {e}")
            return f"Error generating insights: {str(e)}"
    
    def _build_prompt(self, prompt: str, context: Optional[Dict[str, Any]]) -> str:
        """Build the full prompt with context."""
        base_prompt = f"""
        You are an AI business analyst for Cesto AI, a food & beverage B2B platform.
        
        Context: {json.dumps(context, indent=2) if context else "No additional context"}
        
        Question/Analysis: {prompt}
        
        Please provide:
        1. Key insights
        2. Recommendations
        3. Potential risks or opportunities
        
        Keep the response concise and actionable.
        """
        return base_prompt
    
    async def get_demand_forecast_insights(
        self, 
        historical_data: list, 
        predictions: list
    ) -> str:
        """Get AI insights for demand forecasting."""
        context = {
            "historical_demand": historical_data[-30:] if len(historical_data) > 30 else historical_data,
            "predictions": predictions,
            "data_points": len(historical_data)
        }
        
        prompt = """
        Analyze this demand forecasting data and provide insights:
        - What patterns do you see in the historical data?
        - Are the predictions realistic based on the historical trends?
        - What factors might influence future demand?
        - Any recommendations for inventory management?
        """
        
        return await self.get_business_insights(prompt, context)
    
    async def get_inventory_optimization_insights(
        self, 
        inventory_data: Dict[str, Any]
    ) -> str:
        """Get AI insights for inventory optimization."""
        prompt = """
        Analyze this inventory data and provide optimization recommendations:
        - Which products need immediate attention?
        - What are the optimal stock levels?
        - How can we reduce waste and improve efficiency?
        - What are the financial implications?
        """
        
        return await self.get_business_insights(prompt, inventory_data)
    
    def is_available(self) -> bool:
        """Check if AI service is available."""
        return self.groq_client is not None


# Global AI service instance
ai_service = AIService()

