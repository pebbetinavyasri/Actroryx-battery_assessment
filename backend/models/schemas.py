from pydantic import BaseModel, Field
from typing import Optional, Literal, Dict, List
from datetime import datetime

# ── Inspection ──────────────────────────────────────────────

class ChecksModel(BaseModel):
    voltage: Literal["pass", "fail"]
    temperature: Literal["pass", "fail"]
    impedance: Literal["pass", "fail"]
    crack: Literal["pass", "fail"]

class InspectionCreate(BaseModel):
    voltage: float = Field(..., ge=0, le=10, description="Measured voltage in V")
    temperature: float = Field(..., ge=-50, le=200, description="Temperature in °C")
    impedance: float = Field(..., ge=0, le=10, description="Internal impedance in Ω")
    hasCrack: bool = Field(..., description="Whether physical damage was found")
    checks: ChecksModel
    overall: Literal["pass", "fail"]

class InspectionResponse(InspectionCreate):
    id: str = Field(alias="_id")
    createdAt: datetime

    class Config:
        populate_by_name = True

# ── Chat ────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str
