import logging
import threading
from functools import lru_cache
from .config import get_settings
logger = logging.getLogger(__name__)
_initialization_lock = threading.Lock()
@lru_cache
def initialize_gee():
    with _initialization_lock:
        settings = get_settings()
        if settings.use_mock_data: logger.info('[GEE] mock mode enabled'); return None
        try:
            import ee
            if settings.gee_service_account_email and settings.gee_private_key:
                credentials = ee.ServiceAccountCredentials(settings.gee_service_account_email, key_data=settings.gee_private_key.replace('\\n', '\n')); ee.Initialize(credentials, project=settings.gee_project_id)
            elif settings.gee_project_id: ee.Initialize(project=settings.gee_project_id)
            else: raise RuntimeError('GEE_PROJECT_ID is required when USE_MOCK_DATA=false')
            logger.info('[GEE] Earth Engine initialized'); return ee
        except Exception as exc:
            logger.exception('[GEE] initialization failed'); raise RuntimeError('Google Earth Engine initialization failed') from exc
