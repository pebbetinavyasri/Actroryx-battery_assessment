from fastapi import APIRouter, HTTPException
import httpx
from models.schemas import ChatRequest, ChatResponse
from utils.config import settings

router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are an expert battery inspection AI assistant for a professional battery quality control system.

Battery being inspected: 3.7V Li-ion, 2.6 Ah capacity.

Inspection thresholds:
- Voltage: must be > 3.0 V
- Temperature: must be < 60 °C
- Internal impedance: must be < 0.07 Ω
- Physical: no cracks or leaks allowed

You have deep expertise in:
- Li-ion battery electrochemistry and failure modes
- Battery safety standards (IEC 62133, UN 38.3, UL 2054)
- Internal impedance and its relationship to battery health
- Thermal runaway prevention
- Quality control and inspection procedures

Provide concise, technically accurate answers. Be professional and precise.
If asked about specific measured values, assess them against the thresholds above."""

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not settings.gemini_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured in .env")

    # Build Gemini contents array (user/model turns only)
    contents = []
    for m in request.messages:
        if m.role == "user":
            contents.append({"role": "user", "parts": [{"text": m.content}]})
        elif m.role == "assistant":
            contents.append({"role": "model", "parts": [{"text": m.content}]})

    # Remove leading assistant messages (Gemini requires user first)
    while contents and contents[0]["role"] == "model":
        contents.pop(0)

    if not contents:
        raise HTTPException(status_code=400, detail="No valid messages provided")

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
    )

    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)

        if response.status_code == 400:
            raise HTTPException(status_code=400, detail="Bad request to Gemini API")
        if response.status_code == 403:
            raise HTTPException(status_code=401, detail="Invalid Gemini API key")
        if response.status_code == 429:
            raise HTTPException(status_code=429, detail="Gemini rate limit reached. Please wait and retry.")
        response.raise_for_status()

        data = response.json()
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
        return ChatResponse(reply=reply)

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Gemini API timed out. Please try again.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")