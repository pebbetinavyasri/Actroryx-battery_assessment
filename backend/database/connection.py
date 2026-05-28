from motor.motor_asyncio import AsyncIOMotorClient
from utils.config import settings

client: AsyncIOMotorClient = None

async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.mongodb_url)
    print(f"Connected to MongoDB: {settings.mongodb_url}")

async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_db():
    return client[settings.database_name]

def get_collection(name: str):
    return get_db()[name]