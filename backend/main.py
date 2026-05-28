from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database.connection import connect_db, close_db
from routers import inspections, chat
from utils.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="BatteryQC Pro API",
    description="Professional Li-ion Battery Inspection System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inspections.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"status": "ok", "service": "BatteryQC Pro API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
