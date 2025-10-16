"""Redis client configuration and management."""
import redis
import logging
from typing import Optional, Any, Union
import json

from config.settings import settings

logger = logging.getLogger(__name__)


class RedisManager:
    """Redis connection manager with caching utilities."""
    
    def __init__(self):
        self.client = redis.from_url(
            settings.redis_url,
            db=settings.redis_db,
            password=settings.redis_password,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
            health_check_interval=30,
        )
    
    def get(self, key: str) -> Optional[str]:
        """Get value from Redis."""
        try:
            return self.client.get(key)
        except redis.RedisError as e:
            logger.error(f"Redis GET error for key {key}: {e}")
            return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in Redis with optional TTL."""
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            if ttl:
                return self.client.setex(key, ttl, value)
            else:
                return self.client.set(key, value)
        except redis.RedisError as e:
            logger.error(f"Redis SET error for key {key}: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from Redis."""
        try:
            return bool(self.client.delete(key))
        except redis.RedisError as e:
            logger.error(f"Redis DELETE error for key {key}: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in Redis."""
        try:
            return bool(self.client.exists(key))
        except redis.RedisError as e:
            logger.error(f"Redis EXISTS error for key {key}: {e}")
            return False
    
    def flush_db(self) -> bool:
        """Flush current database."""
        try:
            self.client.flushdb()
            return True
        except redis.RedisError as e:
            logger.error(f"Redis FLUSHDB error: {e}")
            return False
    
    def health_check(self) -> bool:
        """Check Redis connection health."""
        try:
            self.client.ping()
            return True
        except redis.RedisError as e:
            logger.error(f"Redis health check failed: {e}")
            return False


# Global Redis manager instance
redis_manager = RedisManager()

