import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LiveData = () => {
  const [sensorData, setSensorData] = useState({});
  const [pinnedSensors, setPinnedSensors] = useState(["rpm", "speed", "coolant_temp"]);
  const [vehicleId] = useState("demo-vehicle-001");

  useEffect(() => {
    loadSensorData();
    const interval = setInterval(loadSensorData, 1000);
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

  const togglePin = (sensorKey) => {
    setPinnedSensors((prev) =>
      prev.includes(sensorKey)
        ? prev.filter((s) => s !== sensorKey)
        : [...prev, sensorKey]
    );
  };

  const engineSensors = [
    { key: "rpm", label: "Engine RPM", unit: "RPM", category: "engine" },
    { key: "engine_load", label: "Engine Load", unit: "%", category: "engine" },
    { key: "throttle_position", label: "Throttle Position", unit: "%", category: "engine" },
    { key: "coolant_temp", label: "Coolant Temperature", unit: "°C", category: "engine" },
    { key: "intake_temp", label: "Intake Air Temp", unit: "°C", category: "engine" },
  ];

  const fuelSensors = [
    { key: "fuel_pressure", label: "Fuel Pressure", unit: "bar", category: "fuel" },
  ];

  const electricalSensors = [
    { key: "battery_voltage", label: "Battery Voltage", unit: "V", category: "electrical" },
  ];

  const otherSensors = [
    { key: "speed", label: "Vehicle Speed", unit: "km/h", category: "other" },
    { key: "oil_pressure", label: "Oil Pressure", unit: "bar", category: "other" },
  ];

  const renderSensorTable = (sensors) => {
    const pinnedRows = sensors.filter((s) => pinnedSensors.includes(s.key));
    const unpinnedRows = sensors.filter((s) => !pinnedSensors.includes(s.key));
    const allRows = [...pinnedRows, ...unpinnedRows];

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            <TableHead className="text-[hsl(210_10%_75%)]">Sensor</TableHead>
            <TableHead className="text-[hsl(210_10%_75%)] text-right">Value</TableHead>
            <TableHead className="text-[hsl(210_10%_75%)] text-right">Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allRows.map((sensor, idx) => {
            const value = sensorData[sensor.key];
            const isPinned = pinnedSensors.includes(sensor.key);
            return (
              <TableRow
                key={sensor.key}
                className={`border-border ${
                  isPinned ? "bg-[hsl(186_100%_53%/0.05)]" : ""
                } ${idx === pinnedRows.length && pinnedRows.length > 0 ? "border-t-2" : ""}`}
                data-testid={`live-sensor-row-${sensor.key}`}
              >
                <TableCell>
                  <Checkbox
                    checked={isPinned}
                    onCheckedChange={() => togglePin(sensor.key)}
                    data-testid={`pin-sensor-${sensor.key}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{sensor.label}</TableCell>
                <TableCell className="text-right tabular-nums font-semibold" data-testid={`sensor-value-${sensor.key}`}>
                  {typeof value === "number" ? value.toFixed(value < 10 ? 2 : 0) : value || "-"}
                </TableCell>
                <TableCell className="text-right text-[hsl(210_10%_75%)]">
                  {sensor.unit}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen pb-6" data-testid="live-data-page">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur bg-[hsl(215_37%_7%/0.8)] border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold">Live Sensor Data</h1>
          <p className="text-xs text-[hsl(210_10%_75%)]">
            Real-time vehicle parameters
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs defaultValue="engine" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full bg-[hsl(214_24%_12%)] border border-border">
            <TabsTrigger value="engine" data-testid="tab-engine">Engine</TabsTrigger>
            <TabsTrigger value="fuel" data-testid="tab-fuel">Fuel</TabsTrigger>
            <TabsTrigger value="electrical" data-testid="tab-electrical">Electrical</TabsTrigger>
            <TabsTrigger value="other" data-testid="tab-other">Other</TabsTrigger>
          </TabsList>

          <Card className="bg-[hsl(214_24%_12%)] border-border">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <TabsContent value="engine" className="m-0">
                {renderSensorTable(engineSensors)}
              </TabsContent>

              <TabsContent value="fuel" className="m-0">
                {renderSensorTable(fuelSensors)}
              </TabsContent>

              <TabsContent value="electrical" className="m-0">
                {renderSensorTable(electricalSensors)}
              </TabsContent>

              <TabsContent value="other" className="m-0">
                {renderSensorTable(otherSensors)}
              </TabsContent>
            </ScrollArea>
          </Card>
        </Tabs>

        <div className="mt-4 p-3 rounded-lg bg-[hsl(214_24%_12%)] border border-border">
          <p className="text-xs text-[hsl(210_10%_75%)]">
            <span className="font-medium text-[hsl(186_100%_53%)]">Tip:</span> Check
            the box to pin important sensors to the top of the list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveData;
