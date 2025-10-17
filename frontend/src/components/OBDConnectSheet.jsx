import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OBDConnectSheet = ({ open, onClose, onConnect }) => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (open) {
      scanDevices();
    }
  }, [open]);

  const scanDevices = async () => {
    setScanning(true);
    toast.info("Scanning for OBD-II devices...");
    
    // Simulate device scanning
    setTimeout(async () => {
      const mockDevices = [
        {
          id: "obd-001",
          device_name: "ELM327 Bluetooth",
          device_id: "00:1A:7D:DA:71:13",
          protocol: "ISO 9141-2",
          rssi: -65,
        },
        {
          id: "obd-002",
          device_name: "OBDII Scanner Pro",
          device_id: "00:1B:DC:0F:44:85",
          protocol: "CAN 11/500",
          rssi: -72,
        },
      ];
      
      try {
        // Save devices to backend
        for (const device of mockDevices) {
          await axios.post(`${API}/obd`, device);
        }
        setDevices(mockDevices);
        toast.success("Found " + mockDevices.length + " devices");
      } catch (error) {
        console.error("Error saving devices:", error);
      }
      setScanning(false);
    }, 2000);
  };

  const handleConnect = async (device) => {
    try {
      await axios.patch(`${API}/obd/${device.id}`, null, {
        params: { connected: true },
      });
      toast.success(`Connected to ${device.device_name}`);
      onConnect(true);
      onClose();
    } catch (error) {
      console.error("Error connecting:", error);
      toast.error("Failed to connect");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
      data-testid="obd-connect-sheet-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 bg-[hsl(213_22%_14%)] border-t border-border rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-testid="obd-connect-sheet"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">OBD-II Devices</h3>
          <div className="flex gap-2">
            <Button
              onClick={scanDevices}
              disabled={scanning}
              variant="secondary"
              size="sm"
              data-testid="obd-scan-button"
            >
              {scanning ? "Scanning..." : "Scan"}
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              data-testid="obd-close-button"
            >
              Close
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {devices.length === 0 ? (
            <div className="text-center py-8 text-[hsl(210_10%_75%)]">
              {scanning ? "Scanning for devices..." : "No devices found. Tap Scan to search."}
            </div>
          ) : (
            devices.map((d) => (
              <button
                key={d.id}
                onClick={() => handleConnect(d)}
                className="w-full text-left p-3 rounded-lg bg-black/20 hover:bg-black/30 border border-border transition-colors"
                data-testid="obd-device-item"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{d.device_name}</div>
                    <div className="text-xs text-[hsl(210_10%_75%)] font-mono">
                      {d.device_id}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {d.protocol}
                    </Badge>
                    <div className="text-xs text-[hsl(210_10%_75%)]">
                      {d.rssi} dBm
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OBDConnectSheet;
