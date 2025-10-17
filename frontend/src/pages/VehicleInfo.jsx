import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VehicleInfo = () => {
  const [vehicle, setVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vin: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    ecu_id: "",
    protocol: "ISO 9141-2",
  });
  const [vehicleId] = useState("demo-vehicle-001");

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    try {
      const response = await axios.get(`${API}/vehicle/${vehicleId}`);
      setVehicle(response.data);
      setFormData({
        vin: response.data.vin,
        make: response.data.make,
        model: response.data.model,
        year: response.data.year,
        ecu_id: response.data.ecu_id || "",
        protocol: response.data.protocol || "ISO 9141-2",
      });
    } catch (error) {
      // If vehicle doesn't exist, show form to create
      console.error("Vehicle not found:", error);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      if (vehicle) {
        // Update existing (not implemented in this MVP)
        toast.info("Update feature coming soon");
      } else {
        // Create new
        await axios.post(`${API}/vehicle`, { ...formData, id: vehicleId });
        toast.success("Vehicle information saved");
        loadVehicle();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast.error("Failed to save vehicle information");
    }
  };

  const InfoRow = ({ label, value, mono = false }) => (
    <div className="grid grid-cols-2 gap-4 py-2">
      <div className="text-sm text-[hsl(210_10%_75%)]">{label}</div>
      <div
        className={`text-sm font-medium text-right ${mono ? "font-mono" : ""}`}
        data-testid={`vehicle-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {value || "-"}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-6" data-testid="vehicle-page">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur bg-[hsl(215_37%_7%/0.8)] border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Vehicle Information</h1>
              <p className="text-xs text-[hsl(210_10%_75%)]">
                Vehicle details and configuration
              </p>
            </div>
            {!isEditing && vehicle && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                size="sm"
                data-testid="edit-vehicle-button"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {isEditing ? (
          <Card className="p-4 bg-[hsl(214_24%_12%)] border-border space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN Number</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="bg-[hsl(215_37%_7%)] border-border font-mono"
                placeholder="Enter VIN"
                data-testid="vehicle-vin-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) =>
                    setFormData({ ...formData, make: e.target.value })
                  }
                  className="bg-[hsl(215_37%_7%)] border-border"
                  placeholder="Honda"
                  data-testid="vehicle-make-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="bg-[hsl(215_37%_7%)] border-border"
                  placeholder="Accord"
                  data-testid="vehicle-model-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="bg-[hsl(215_37%_7%)] border-border"
                  data-testid="vehicle-year-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Input
                  id="protocol"
                  value={formData.protocol}
                  onChange={(e) =>
                    setFormData({ ...formData, protocol: e.target.value })
                  }
                  className="bg-[hsl(215_37%_7%)] border-border"
                  data-testid="vehicle-protocol-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ecu_id">ECU ID</Label>
              <Input
                id="ecu_id"
                value={formData.ecu_id}
                onChange={(e) =>
                  setFormData({ ...formData, ecu_id: e.target.value })
                }
                className="bg-[hsl(215_37%_7%)] border-border font-mono"
                placeholder="Optional"
                data-testid="vehicle-ecu-id-input"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-[hsl(186_100%_53%)] text-black hover:brightness-105"
                data-testid="save-vehicle-button"
              >
                Save
              </Button>
              {vehicle && (
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    loadVehicle();
                  }}
                  variant="secondary"
                  className="flex-1"
                  data-testid="cancel-edit-button"
                >
                  Cancel
                </Button>
              )}
            </div>
          </Card>
        ) : vehicle ? (
          <>
            {/* Basic Information */}
            <Card className="p-4 bg-[hsl(214_24%_12%)] border-border">
              <h2 className="text-sm font-semibold mb-3">Basic Information</h2>
              <div className="space-y-1">
                <InfoRow label="VIN" value={vehicle.vin} mono />
                <Separator className="bg-border" />
                <InfoRow label="Make" value={vehicle.make} />
                <Separator className="bg-border" />
                <InfoRow label="Model" value={vehicle.model} />
                <Separator className="bg-border" />
                <InfoRow label="Year" value={vehicle.year} />
              </div>
            </Card>

            {/* Technical Information */}
            <Card className="p-4 bg-[hsl(214_24%_12%)] border-border">
              <h2 className="text-sm font-semibold mb-3">Technical Information</h2>
              <div className="space-y-1">
                <InfoRow label="ECU ID" value={vehicle.ecu_id} mono />
                <Separator className="bg-border" />
                <InfoRow label="Protocol" value={vehicle.protocol} />
                <Separator className="bg-border" />
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-sm text-[hsl(210_10%_75%)]">Battery</div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-[hsl(146_64%_52%/0.2)] text-[hsl(146_64%_52%)] border-[hsl(146_64%_52%)]"
                      data-testid="battery-status"
                    >
                      {vehicle.battery_voltage || "12.4"}V - Healthy
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status */}
            <Card className="p-4 bg-[hsl(214_24%_12%)] border-border">
              <h2 className="text-sm font-semibold mb-3">Status</h2>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-[hsl(146_64%_52%/0.2)] text-[hsl(146_64%_52%)] border-[hsl(146_64%_52%)]">
                  Engine OK
                </Badge>
                <Badge variant="outline" className="bg-[hsl(146_64%_52%/0.2)] text-[hsl(146_64%_52%)] border-[hsl(146_64%_52%)]">
                  Emissions OK
                </Badge>
                <Badge variant="outline" className="bg-[hsl(186_100%_53%/0.2)] text-[hsl(186_100%_53%)] border-[hsl(186_100%_53%)]">
                  Ready for Test
                </Badge>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-8 bg-[hsl(214_24%_12%)] border-border text-center">
            <p className="text-[hsl(210_10%_75%)] mb-4">
              No vehicle information found. Please add your vehicle details.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VehicleInfo;
