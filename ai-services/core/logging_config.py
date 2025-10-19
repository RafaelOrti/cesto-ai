"""Logging configuration for the AI services."""
import logging
import logging.config
import sys
from pathlib import Path

from config.settings import settings


def setup_logging():
    """Setup logging configuration."""
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    try:
        log_dir.mkdir(exist_ok=True)
    except PermissionError:
        # Fallback to a writable directory
        log_dir = Path("/tmp/logs")
        log_dir.mkdir(exist_ok=True)
    
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": settings.log_format,
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(lineno)d - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "json": {
                "format": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s", "module": "%(module)s", "function": "%(funcName)s", "line": %(lineno)d}',
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "level": settings.log_level,
                "class": "logging.StreamHandler",
                "formatter": "standard",
                "stream": sys.stdout,
            },
            "file": {
                "level": settings.log_level,
                "class": "logging.StreamHandler",
                "formatter": "detailed",
                "stream": sys.stdout,
            },
            "error_file": {
                "level": "ERROR",
                "class": "logging.StreamHandler",
                "formatter": "detailed",
                "stream": sys.stderr,
            },
        },
        "loggers": {
            "": {  # Root logger
                "handlers": ["console", "file"],
                "level": settings.log_level,
                "propagate": False,
            },
            "uvicorn": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "fastapi": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "sqlalchemy": {
                "handlers": ["file"],
                "level": "WARNING",
                "propagate": False,
            },
        },
    }
    
    logging.config.dictConfig(logging_config)
    
    # Set specific logger levels
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    
    logger = logging.getLogger(__name__)
    logger.info("Logging configuration initialized")


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance."""
    return logging.getLogger(name)

