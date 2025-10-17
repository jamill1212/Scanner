import { useState, useEffect } from "react";
import axios from "axios";
import { Bluetooth, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import GaugeCard from "@/components/GaugeCard";
import StatCard from "@/components/StatCard";
import OBDConnectSheet from "@/components/OBDConnectSheet";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [obdConnected, setObdConnected] = useState(false);
  const [showObdSheet, setShowObdSheet] = useState(false);
  const [sensorData, setSensorData] = useState({
    rpm: 0,
    speed: 0,
    coolant_temp: 85,
    oil_pressure: 2.5,
    battery_voltage: 12.4,
    engine_load: 35,
  });
  const [vehicleId] = useState("demo-vehicle-001");

  useEffect(() => {
    loadSensorData();
    const interval = setInterval(simulateSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadSensorData = async () => {
    try {
      const response = await axios.get(`${API}/sensors/${vehicleId}`);
      setSensorData(response.data);
    } catch (error) {
      console.error("Error loading sensor data:", error);
    }
  };

  const simulateSensorData = async () => {
    const newData = {
      vehicle_id: vehicleId,
      rpm: Math.floor(Math.random() * 3000) + 800,
      speed: Math.floor(Math.random() * 120),
      coolant_temp: 85 + Math.random() * 10,
      oil_pressure: 2.0 + Math.random() * 1.5,
      battery_voltage: 12.2 + Math.random() * 0.6,
      engine_load: 30 + Math.random() * 40,
    };
    setSensorData(newData);
    try {
      await axios.post(`${API}/sensors`, newData);
    } catch (error) {
      console.error("Error saving sensor data:", error);
    }
  };

  return (
    <div className="min-h-screen" data-testid="dashboard-page">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur bg-[hsl(215_37%_7%/0.8)] border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">TorqueProX</h1>
              <p className="text-xs text-[hsl(210_10%_75%)]">
                2024 Honda Accord Sport
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${
                  obdConnected
                    ? "bg-[hsl(146_64%_52%/0.2)] text-[hsl(146_64%_52%)] border-[hsl(146_64%_52%)]"
                    : "bg-[hsl(38_97%_55%/0.2)] text-[hsl(38_97%_55%)] border-[hsl(38_97%_55%)]"
                }`}
                data-testid="obd-status-badge"
              >
                {obdConnected ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {obdConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowObdSheet(true)}
                data-testid="obd-connect-trigger"
              >
                <Bluetooth className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GaugeCard
            label="Engine RPM"
            value={sensorData.rpm}
            max={8000}
            unit="RPM"
          />
          <GaugeCard
            label="Speed"
            value={sensorData.speed}
            max={200}
            unit="km/h"
          />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Coolant Temp"
            value={sensorData.coolant_temp.toFixed(1)}
            unit="°C"
            status={
              sensorData.coolant_temp > 115
                ? "danger"
                : sensorData.coolant_temp > 105
                ? "warn"
                : "ok"
            }
          />
          <StatCard
            label="Oil Pressure"
            value={sensorData.oil_pressure.toFixed(2)}
            unit="bar"
            status={
              sensorData.oil_pressure < 0.6
                ? "danger"
                : sensorData.oil_pressure < 1.2
                ? "warn"
                : "ok"
            }
          />
          <StatCard
            label="Battery"
            value={sensorData.battery_voltage.toFixed(1)}
            unit="V"
            status={
              sensorData.battery_voltage < 11.3
                ? "danger"
                : sensorData.battery_voltage < 11.8
                ? "warn"
                : "ok"
            }
          />
        </div>

        {/* Engine Load */}
        <Card className="p-4 bg-[hsl(214_24%_12%)] border-border" data-testid="engine-load-card">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[hsl(210_10%_75%)]">Engine Load</span>
              <span className="text-lg font-semibold tabular-nums" data-testid="engine-load-value">
                {sensorData.engine_load.toFixed(0)}%
              </span>
            </div>
            <Progress value={sensorData.engine_load} className="h-2" />
          </div>
        </Card>
      </div>

      <OBDConnectSheet
        open={showObdSheet}
        onClose={() => setShowObdSheet(false)}
        onConnect={(connected) => {
          setObdConnected(connected);
          if (connected) {
            toast.success("OBD-II device connected");
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
