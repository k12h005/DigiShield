from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    port: int = 8000
    node_env: str = "development"
    jwt_secret: str = "hackathon_secret_key"
    jwt_algorithm: str = "HS256"
    jwt_expire_days: int = 30
    client_url: str = "http://localhost:5173"
    hmac_secret: str = "digishield_hmac_pepper"
    database_url: str = "sqlite:///./digishield.db"
    hibp_api_url: str = "https://haveibeenpwned.com/api/v3/breaches"
    hibp_user_agent: str = "DigiShield-BreachMonitor/1.0"
    breach_sync_hours: int = 6
    fallback_breaches_path: str = "data/breaches.json"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
