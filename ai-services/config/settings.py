"""Application configuration settings."""
import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    app_name: str = "Cesto AI Services"
    app_version: str = "1.0.0"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8001
    
    # Database
    database_url: str = "postgresql://cesto_user:cesto_password@localhost:5432/cesto_ai"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    redis_db: int = 0
    redis_password: Optional[str] = None
    
    # AI Services
    groq_api_key: Optional[str] = None
    ai_model_cache_ttl: int = 3600
    ai_prediction_confidence_threshold: float = 0.7
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:4400",
        "http://localhost:3400",
    ]
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # ML Models
    model_cache_size: int = 100
    max_prediction_days: int = 365
    min_training_data_points: int = 10
    
    @validator('cors_origins', pre=True)
    def parse_cors_origins(cls, v):
        if v is None or v == '':
            return [
                "http://localhost:4400",
                "http://localhost:3400",
            ]
        if isinstance(v, str):
            if not v or v.strip() == '':
                return [
                    "http://localhost:4400",
                    "http://localhost:3400",
                ]
            try:
                # Try to parse as JSON first
                import json
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                # If not JSON, split by comma
                return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    @validator('log_level')
    def validate_log_level(cls, v):
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if v.upper() not in valid_levels:
            raise ValueError(f'log_level must be one of {valid_levels}')
        return v.upper()
    
    class Config:
        env_file_encoding = "utf-8"
        case_sensitive = False
        protected_namespaces = ('settings_',)
        env_ignore_empty = True

settings = Settings()

