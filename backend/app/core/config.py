from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    gee_project_id: str = ''; gee_service_account_email: str = ''; gee_private_key: str = ''; frontend_url: str = 'http://localhost:5173'; use_mock_data: bool = True; gee_nightlight_start_date: str = '2024-01-01'; gee_nightlight_end_date: str = '2024-12-31'; low_light_threshold: float = 2.0
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')
@lru_cache
def get_settings() -> Settings: return Settings()
