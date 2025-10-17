# TorqueProX - Car Diagnostic Software & Programmer

A professional automotive diagnostic tool for reading error codes, monitoring live sensor data, ECU programming, and vehicle information display.

## Features

### 1. Dashboard
- Real-time gauges for RPM and Speed with radial visualization
- Live stat cards for Coolant Temperature, Oil Pressure, and Battery Voltage
- Color-coded status indicators (OK/Warning/Danger)
- Engine load progress indicator
- OBD-II connection status with quick connect button

### 2. DTC Scanner
- Scan for Diagnostic Trouble Codes (DTCs)
- Filter by severity: All, Danger, Warn, OK
- Search functionality for codes and descriptions
- Detailed code information with:
  - Error code (e.g., P0300)
  - Severity badges with color coding
  - Full description
  - Probable causes list
- Clear individual codes or all codes at once
- Confirmation dialogs for critical actions

### 3. Live Sensor Data
- Real-time monitoring of vehicle parameters
- Organized by category:
  - **Engine**: RPM, Load, Throttle Position, Coolant Temp, Intake Temp
  - **Fuel**: Fuel Pressure
  - **Electrical**: Battery Voltage
  - **Other**: Vehicle Speed, Oil Pressure
- Pin important sensors to top of list
- Auto-updating values (1-second interval)
- Tabular display with units

### 4. ECU Programming
- Multiple operation types:
  - Read ECU
  - Backup ECU
  - Program/Flash ECU
  - ECU Remapping
  - Key Programming
  - Module Coding
  - Firmware Update
- File upload support (.bin, .hex, .ori formats)
- Drag-and-drop file interface
- Real-time progress tracking
- Operation logs with timestamps
- Confirmation dialogs for destructive operations
- Warning alerts for ECU modifications

### 5. Vehicle Information
- Store and display vehicle details:
  - VIN Number
  - Make, Model, Year
  - ECU ID
  - Protocol (e.g., ISO 9141-2)
  - Battery voltage and status
- Edit mode with form validation
- Status badges for vehicle health
- Technical specifications display

### 6. OBD-II Connection
- Scan for OBD-II devices (ELM327 compatible)
- Display available devices with:
  - Device name
  - Bluetooth address
  - Protocol support
  - Signal strength (RSSI)
- Connect/disconnect functionality
- Connection status indicator in header

## Technical Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **API Endpoints**:
  - `/api/vehicle` - Vehicle management
  - `/api/dtc` - Diagnostic trouble codes
  - `/api/sensors` - Live sensor data
  - `/api/ecu` - ECU operations
  - `/api/obd` - OBD connection management
  - `/api/files/upload` - File upload for ECU programming

### Frontend
- **Framework**: React 19
- **UI Library**: Shadcn/ui components
- **Styling**: Tailwind CSS with custom automotive theme
- **Charts**: Recharts for gauges and visualizations
- **File Upload**: react-dropzone
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Notifications**: Sonner for toasts

### Design System
- **Theme**: Dark workshop-optimized interface
- **Colors**:
  - Primary accent: Cyan (hsl(186 100% 53%))
  - Success: Green (hsl(146 64% 52%))
  - Warning: Amber (hsl(38 97% 55%))
  - Danger: Red (hsl(2 85% 58%))
- **Typography**:
  - Headings/Numerics: Space Grotesk
  - Body text: Inter
  - Monospace: Roboto Mono
- **Mobile-first**: Responsive design for Android tablets and phones

## API Examples

### Create Sensor Data
```bash
curl -X POST https://auto-programmer-1.preview.emergentagent.com/api/sensors \\
  -H "Content-Type: application/json" \\
  -d '{
    "vehicle_id": "demo-vehicle-001",
    "rpm": 2500,
    "speed": 80,
    "coolant_temp": 92.5,
    "oil_pressure": 2.8,
    "battery_voltage": 12.6
  }'
```

### Get Latest Sensor Data
```bash
curl https://auto-programmer-1.preview.emergentagent.com/api/sensors/demo-vehicle-001
```

### Scan for DTCs
```bash
curl -X POST https://auto-programmer-1.preview.emergentagent.com/api/dtc \\
  -H "Content-Type: application/json" \\
  -d '{
    "vehicle_id": "demo-vehicle-001",
    "code": "P0300",
    "severity": "danger",
    "title": "Random/Multiple Cylinder Misfire Detected",
    "description": "Engine misfiring on one or more cylinders",
    "probable_causes": ["Faulty spark plugs", "Vacuum leak"]
  }'
```

### Get Vehicle DTCs
```bash
curl https://auto-programmer-1.preview.emergentagent.com/api/dtc/demo-vehicle-001?cleared=false
```

## Built with ❤️ for automotive technicians and enthusiasts
