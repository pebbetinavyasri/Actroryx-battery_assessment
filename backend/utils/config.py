from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # 1. Your original system variables
    frontend_url: str = Field(default="http://localhost:3000")
    
    # 2. MongoDB variables (Supporting both db_name and database_name mapping)
    mongo_url: str = Field(default="")
    mongodb_url: str = Field(default="") 
    db_name: str = Field(default="batteryqc")
    database_name: str = Field(default="batteryqc")
    
    # 3. Chatbot Engine configurations
    ollama_url: str = Field(default="http://localhost:11434/api/chat")
    model_name: str = Field(default="llama3:latest")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Automatically synchronize matching variable fallbacks if left blank
    def __init__(self, **values):
        super().__init__(**values)
        # Sync MongoDB connection strings
        if self.mongo_url and not self.mongodb_url:
            self.mongodb_url = self.mongo_url
        elif self.mongodb_url and not self.mongo_url:
            self.mongo_url = self.mongodb_url
            
        # Sync Database string names
        if self.db_name and not self.database_name:
            self.database_name = self.db_name
        elif self.database_name and not self.db_name:
            self.db_name = self.database_name

settings = Settings()