import asyncio
import os # 1. Import os to read environment variables
from dotenv import load_dotenv # 2. Import dotenv to load your local .env keys
from mcp.server.fastmcp import FastMCP
from motor.motor_asyncio import AsyncIOMotorClient

# Load the local .env file variables securely
load_dotenv()

# Initialize FastMCP Server Protocol
mcp = FastMCP("BatteryQC-Pro-Storage-Server")

# 3. Pull the variables dynamically from your system configuration environments instead of hardcoding!
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "batteryqc")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
collection = db["inspections"]

VOLTAGE_MIN = 3.0
TEMP_MAX = 60.0
IMPEDANCE_MAX = 0.07

@mcp.tool()
async def save_battery_inspection(voltage: float, temperature: float, impedance: float, has_crack: bool, time_str: str = "Just Now") -> str:
    """
    Saves a new battery inspection record to the dashboard database.
    Use this tool automatically when the user provides battery numbers to log, store, or add.
    """
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
            "time": time_str
        }
        
        result = await collection.insert_one(document)
        return f"Successfully saved to MongoDB dashboard! ID: {result.inserted_id}. Status: {overall_result}."
    except Exception as e:
        return f"Failed to write record to MongoDB: {str(e)}"

@mcp.tool()
async def get_failed_inspections() -> str:
    """
    Queries the database and retrieves the list of recently failed battery logs.
    Use this tool when the user asks about failed, broken, or out-of-spec entries.
    """
    try:
        cursor = collection.find({"result": "FAIL"}).sort("_id", -1).limit(5)
        records = await cursor.to_list(length=5)
        if not records:
            return "No failed records found in the database logs."
            
        out = "Recent failures found in logs:\n"
        for r in records:
            out += f"- Time: {r.get('time')} | V: {r.get('voltage')}V | Temp: {r.get('temp')}°C | Result: FAIL\n"
        return out
    except Exception as e:
        return f"Query failed: {str(e)}"

@mcp.tool()
async def get_inspection_metrics() -> str:
    """
    Calculates summary pass/fail operational metrics from the database.
    Use this tool when the user asks for pass rates, totals, percentages, or high-level summaries.
    """
    try:
        total = await collection.count_documents({})
        if total == 0:
            return "Database analytics are empty."
        passed = await collection.count_documents({"result": "PASS"})
        failed = await collection.count_documents({"result": "FAIL"})
        rate = (passed / total) * 100
        return f"Operational Metrics: Total Entries={total}, Passed={passed}, Failed={failed}, Pass Rate={rate:.1f}%"
    except Exception as e:
        return f"Metrics calculation failed: {str(e)}"

if __name__ == "__main__":
    mcp.run(transport='stdio')