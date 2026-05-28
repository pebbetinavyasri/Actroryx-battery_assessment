from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime, timezone
from database.connection import get_collection
from models.schemas import InspectionCreate

router = APIRouter(prefix="/api/inspections", tags=["inspections"])

def serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("createdAt"), datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    return doc

@router.get("")
async def list_inspections():
    """Return all inspections, newest first."""
    col = get_collection("inspections")
    docs = await col.find().sort("createdAt", -1).to_list(length=500)
    return [serialize(d) for d in docs]

@router.post("", status_code=201)
async def create_inspection(payload: InspectionCreate):
    """Save a new inspection record."""
    col = get_collection("inspections")
    doc = payload.model_dump()
    doc["createdAt"] = datetime.now(timezone.utc)
    result = await col.insert_one(doc)
    saved = await col.find_one({"_id": result.inserted_id})
    return serialize(saved)

@router.get("/{inspection_id}")
async def get_inspection(inspection_id: str):
    """Fetch a single inspection by ID."""
    col = get_collection("inspections")
    if not ObjectId.is_valid(inspection_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    doc = await col.find_one({"_id": ObjectId(inspection_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return serialize(doc)

@router.delete("/{inspection_id}")
async def delete_inspection(inspection_id: str):
    """Delete an inspection by ID."""
    col = get_collection("inspections")
    if not ObjectId.is_valid(inspection_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    result = await col.delete_one({"_id": ObjectId(inspection_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return {"message": "Deleted successfully"}

@router.get("/stats/summary")
async def inspection_stats():
    """Return aggregate statistics."""
    col = get_collection("inspections")
    total = await col.count_documents({})
    passed = await col.count_documents({"overall": "pass"})
    failed = await col.count_documents({"overall": "fail"})
    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "passRate": round(passed / total * 100, 1) if total else None,
    }
