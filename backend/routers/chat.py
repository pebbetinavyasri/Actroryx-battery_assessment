from fastapi import APIRouter, HTTPException
import httpx
import re
import json
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/api/chat", tags=["chat"])

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "llama3:latest"

MONGO_URL = "mongodb+srv://student:Newnav@cluster0.799fu7o.mongodb.net/?appName=Cluster0"
DB_NAME = "batteryqc"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
collection = db["inspections"]

VOLTAGE_MIN = 3.0
TEMP_MAX = 60.0
IMPEDANCE_MAX = 0.07

# --- Database Core Tool Workers ---
async def save_battery_inspection(voltage: float, temperature: float, impedance: float, has_crack: bool) -> str:
    try:
        checks = {
            "voltage": "pass" if voltage > VOLTAGE_MIN else "fail",
            "temperature": "pass" if temperature < TEMP_MAX else "fail",
            "impedance": "pass" if impedance < IMPEDANCE_MAX else "fail",
            "crack": "pass" if not has_crack else "fail",
        }
        overall_result = "PASS" if all(v == "pass" for v in checks.values()) else "FAIL"
        
        document = {
            "voltage": voltage,
            "temp": temperature,
            "impedance": impedance,
            "physical": "Damage Found" if has_crack else "Clear",
            "result": overall_result,
            "time": "Just Now"
        }
        result = await collection.insert_one(document)
        return f"Successfully saved to dashboard! Status calculated: {overall_result}."
    except Exception as e:
        return f"Database insertion failure: {str(e)}"

async def get_failed_inspections() -> str:
    try:
        cursor = collection.find({"result": "FAIL"}).sort("_id", -1).limit(5)
        records = await cursor.to_list(length=5)
        if not records:
            return "No failed battery logs found."
        out = "Recent failed records from database:\n"
        for r in records:
            out += f"- V: {r.get('voltage')}V | Temp: {r.get('temp')}°C | Impedance: {r.get('impedance')} | Result: FAIL\n"
        return out
    except Exception as e:
        return f"Failed to retrieve records: {str(e)}"

async def get_inspection_metrics() -> str:
    try:
        total = await collection.count_documents({})
        if total == 0:
            return "The database cluster has no logged records."
        passed = await collection.count_documents({"result": "PASS"})
        failed = await collection.count_documents({"result": "FAIL"})
        rate = (passed / total) * 100
        return f"Database Metrics: Total Entries={total}, Passed={passed}, Failed={failed}, Pass Rate={rate:.1f}%"
    except Exception as e:
        return f"Failed to calculate metrics: {str(e)}"

def check_for_greeting(text: str) -> str:
    cleaned = text.strip().lower()
    pure_greetings = {"hi", "hello", "hey", "good morning", "good afternoon", "sup"}
    cleansed_text = re.sub(r'[^\w\s]', '', cleaned)
    if cleansed_text in pure_greetings:
        return (
            "Hello! I am your BatteryQC Pro AI Assistant. 🔋 "
            "How can I help you with your battery inspections or dashboard data today?"
        )
    return ""

# --- Main API Endpoint Endpoint ---
@router.post("")
async def chat(request: dict):
    messages = request.get("messages", [])
    last_user_msg = next((m.get("content", "") for m in reversed(messages) if m.get("role") == "user"), "")
    
    if not last_user_msg:
        raise HTTPException(status_code=400, detail="No prompt provided.")

    # 1. Short-circuit Greeting Check
    greeting_reply = check_for_greeting(last_user_msg)
    if greeting_reply:
        return {"reply": greeting_reply}

    # 2. Build explicit system layout text instructions that Llama 3 understands perfectly
    system_instruction = (
        "You are the BatteryQC Pro Operations Assistant. You have access to three internal database functions.\n\n"
        "CRITICAL: If the user wants to fetch statistics, look up failures, or save data, you must reply with a direct tool call command line from the options below and nothing else.\n"
        "Options:\n"
        "- CALL:get_inspection_metrics\n"
        "- CALL:get_failed_inspections\n"
        "- CALL:save_battery_inspection(voltage=X, temperature=Y, impedance=Z, has_crack=True/False)\n\n"
        "If the user is asking a general technical question (like explaining voltage, safety, ranges, or code), "
        "do NOT use a tool command. Just answer their question naturally like a normal chatbot."
    )

    try:
        payload = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": last_user_msg}
            ],
            "stream": False
        }

        async with httpx.AsyncClient(timeout=60.0) as http_client:
            response = await http_client.post(OLLAMA_URL, json=payload)
            response.raise_for_status()
            res_json = response.json()
            
        ai_response_text = res_json.get("message", {}).get("content", "").strip()

        # 3. Check if Llama 3 issued a tool command text block
        if "CALL:" in ai_response_text:
            db_output = ""
            
            if "get_inspection_metrics" in ai_response_text:
                db_output = await get_inspection_metrics()
            elif "get_failed_inspections" in ai_response_text:
                db_output = await get_failed_inspections()
            elif "save_battery_inspection" in ai_response_text:
                # Safely parse arguments out using regex matching patterns
                try:
                    v = float(re.search(r"voltage\s*=\s*([\d\.]+)", ai_response_text).group(1))
                    t = float(re.search(r"temperature\s*=\s*([\d\.]+)", ai_response_text).group(1))
                    i = float(re.search(r"impedance\s*=\s*([\d\.]+)", ai_response_text).group(1))
                    c = "true" in re.search(r"has_crack\s*=\s*(\w+)", ai_response_text).group(1).lower()
                    db_output = await save_battery_inspection(voltage=v, temperature=t, impedance=i, has_crack=c)
                except Exception:
                    db_output = "Error: Failed to record details due to misformatted entry arguments."

            # Feed database outputs back to Llama to synthesize a natural text response
            synthesis_payload = {
                "model": MODEL_NAME,
                "messages": [
                    {"role": "system", "content": "You are a battery inspector. Convert this database text response into a nice confirmation message to the user."},
                    {"role": "user", "content": f"User query: {last_user_msg}\nDatabase outcome: {db_output}"}
                ],
                "stream": False
            }
            async with httpx.AsyncClient(timeout=60.0) as http_client:
                synthesis_res = await http_client.post(OLLAMA_URL, json=synthesis_payload)
                final_reply = synthesis_res.json().get("message", {}).get("content", "")
                return {"reply": final_reply}

        # 4. Return general conversational response directly
        return {"reply": ai_response_text}

    except Exception as e:
        return {"reply": f"Error interacting with local AI system: {str(e)}"}