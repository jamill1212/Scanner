from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== Models ====================

class Vehicle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vin: str
    make: str
    model: str
    year: int
    ecu_id: Optional[str] = None
    protocol: Optional[str] = "ISO 9141-2"
    battery_voltage: float = 12.4
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleCreate(BaseModel):
    vin: str
    make: str
    model: str
    year: int
    ecu_id: Optional[str] = None
    protocol: Optional[str] = "ISO 9141-2"

class DTC(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_id: str
    code: str
    severity: str  # success, warn, danger
    title: str
    description: str
    probable_causes: List[str] = []
    cleared: bool = False
    detected_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DTCCreate(BaseModel):
    vehicle_id: str
    code: str
    severity: str
    title: str
    description: str
    probable_causes: List[str] = []

class SensorData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_id: str
    rpm: int = 0
    speed: int = 0
    coolant_temp: float = 85.0
    oil_pressure: float = 2.5
    battery_voltage: float = 12.4
    engine_load: float = 35.0
    throttle_position: float = 15.0
    fuel_pressure: float = 3.2
    intake_temp: float = 25.0
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SensorDataCreate(BaseModel):
    vehicle_id: str
    rpm: Optional[int] = 0
    speed: Optional[int] = 0
    coolant_temp: Optional[float] = 85.0
    oil_pressure: Optional[float] = 2.5
    battery_voltage: Optional[float] = 12.4
    engine_load: Optional[float] = 35.0
    throttle_position: Optional[float] = 15.0
    fuel_pressure: Optional[float] = 3.2
    intake_temp: Optional[float] = 25.0

class ECUOperation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_id: str
    operation_type: str  # read, backup, program, verify, remap, key_program, module_code, firmware_update
    status: str  # pending, in_progress, completed, failed
    progress: int = 0
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    logs: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class ECUOperationCreate(BaseModel):
    vehicle_id: str
    operation_type: str
    file_name: Optional[str] = None
    file_size: Optional[int] = None

class ECUOperationUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    logs: Optional[List[str]] = None
    completed_at: Optional[datetime] = None

class OBDConnection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_name: str
    device_id: str
    protocol: str
    rssi: int = -65
    connected: bool = False
    last_seen: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OBDConnectionCreate(BaseModel):
    device_name: str
    device_id: str
    protocol: str
    rssi: Optional[int] = -65

# ==================== Routes ====================

@api_router.get("/")
async def root():
    return {"message": "TorqueProX API v1.0"}

# Vehicle endpoints
@api_router.post("/vehicle", response_model=Vehicle)
async def create_vehicle(input: VehicleCreate):
    vehicle = Vehicle(**input.model_dump())
    doc = vehicle.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.vehicles.insert_one(doc)
    return vehicle

@api_router.get("/vehicle", response_model=List[Vehicle])
async def get_vehicles():
    vehicles = await db.vehicles.find({}, {"_id": 0}).to_list(1000)
    for vehicle in vehicles:
        if isinstance(vehicle.get('created_at'), str):
            vehicle['created_at'] = datetime.fromisoformat(vehicle['created_at'])
    return vehicles

@api_router.get("/vehicle/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str):
    vehicle = await db.vehicles.find_one({"id": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if isinstance(vehicle.get('created_at'), str):
        vehicle['created_at'] = datetime.fromisoformat(vehicle['created_at'])
    return vehicle

# DTC endpoints
@api_router.post("/dtc", response_model=DTC)
async def create_dtc(input: DTCCreate):
    dtc = DTC(**input.model_dump())
    doc = dtc.model_dump()
    doc['detected_at'] = doc['detected_at'].isoformat()
    await db.dtcs.insert_one(doc)
    return dtc

@api_router.get("/dtc/{vehicle_id}", response_model=List[DTC])
async def get_dtcs(vehicle_id: str, cleared: Optional[bool] = None):
    query = {"vehicle_id": vehicle_id}
    if cleared is not None:
        query["cleared"] = cleared
    dtcs = await db.dtcs.find(query, {"_id": 0}).to_list(1000)
    for dtc in dtcs:
        if isinstance(dtc.get('detected_at'), str):
            dtc['detected_at'] = datetime.fromisoformat(dtc['detected_at'])
    return dtcs

@api_router.delete("/dtc/{dtc_id}")
async def clear_dtc(dtc_id: str):
    result = await db.dtcs.update_one(
        {"id": dtc_id},
        {"$set": {"cleared": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="DTC not found")
    return {"message": "DTC cleared successfully"}

@api_router.delete("/dtc/vehicle/{vehicle_id}")
async def clear_all_dtcs(vehicle_id: str):
    result = await db.dtcs.update_many(
        {"vehicle_id": vehicle_id, "cleared": False},
        {"$set": {"cleared": True}}
    )
    return {"message": f"Cleared {result.modified_count} DTCs"}

# Sensor data endpoints
@api_router.post("/sensors", response_model=SensorData)
async def create_sensor_data(input: SensorDataCreate):
    sensor_data = SensorData(**input.model_dump())
    doc = sensor_data.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.sensor_data.insert_one(doc)
    return sensor_data

@api_router.get("/sensors/{vehicle_id}", response_model=SensorData)
async def get_latest_sensor_data(vehicle_id: str):
    sensor_data = await db.sensor_data.find_one(
        {"vehicle_id": vehicle_id},
        {"_id": 0},
        sort=[("timestamp", -1)]
    )
    if not sensor_data:
        # Return default sensor data if none exists
        return SensorData(vehicle_id=vehicle_id)
    if isinstance(sensor_data.get('timestamp'), str):
        sensor_data['timestamp'] = datetime.fromisoformat(sensor_data['timestamp'])
    return sensor_data

# ECU operations endpoints
@api_router.post("/ecu", response_model=ECUOperation)
async def create_ecu_operation(input: ECUOperationCreate):
    operation = ECUOperation(**input.model_dump())
    doc = operation.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('completed_at'):
        doc['completed_at'] = doc['completed_at'].isoformat()
    await db.ecu_operations.insert_one(doc)
    return operation

@api_router.get("/ecu/{vehicle_id}", response_model=List[ECUOperation])
async def get_ecu_operations(vehicle_id: str):
    operations = await db.ecu_operations.find(
        {"vehicle_id": vehicle_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    for op in operations:
        if isinstance(op.get('created_at'), str):
            op['created_at'] = datetime.fromisoformat(op['created_at'])
        if op.get('completed_at') and isinstance(op['completed_at'], str):
            op['completed_at'] = datetime.fromisoformat(op['completed_at'])
    return operations

@api_router.patch("/ecu/{operation_id}", response_model=ECUOperation)
async def update_ecu_operation(operation_id: str, update: ECUOperationUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data.get('completed_at'):
        update_data['completed_at'] = update_data['completed_at'].isoformat()
    
    result = await db.ecu_operations.find_one_and_update(
        {"id": operation_id},
        {"$set": update_data},
        return_document=True,
        projection={"_id": 0}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Operation not found")
    if isinstance(result.get('created_at'), str):
        result['created_at'] = datetime.fromisoformat(result['created_at'])
    if result.get('completed_at') and isinstance(result['completed_at'], str):
        result['completed_at'] = datetime.fromisoformat(result['completed_at'])
    return result

# OBD connection endpoints
@api_router.post("/obd", response_model=OBDConnection)
async def create_obd_connection(input: OBDConnectionCreate):
    connection = OBDConnection(**input.model_dump())
    doc = connection.model_dump()
    doc['last_seen'] = doc['last_seen'].isoformat()
    await db.obd_connections.insert_one(doc)
    return connection

@api_router.get("/obd", response_model=List[OBDConnection])
async def get_obd_connections():
    connections = await db.obd_connections.find({}, {"_id": 0}).to_list(100)
    for conn in connections:
        if isinstance(conn.get('last_seen'), str):
            conn['last_seen'] = datetime.fromisoformat(conn['last_seen'])
    return connections

@api_router.patch("/obd/{connection_id}")
async def update_obd_connection(connection_id: str, connected: bool):
    result = await db.obd_connections.update_one(
        {"id": connection_id},
        {"$set": {"connected": connected, "last_seen": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Connection not found")
    return {"message": "Connection updated"}

# File upload endpoint
@api_router.post("/files/upload")
async def upload_ecu_file(file: UploadFile = File(...)):
    # In production, save to cloud storage
    # For MVP, just return file info
    contents = await file.read()
    return {
        "filename": file.filename,
        "size": len(contents),
        "content_type": file.content_type,
        "message": "File uploaded successfully"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()