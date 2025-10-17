import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DTCScanner = () => {
  const [dtcs, setDtcs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [scanning, setScanning] = useState(false);
  const [showClearAll, setShowClearAll] = useState(false);
  const [vehicleId] = useState("demo-vehicle-001");

  useEffect(() => {
    loadDTCs();
  }, []);

  const loadDTCs = async () => {
    try {
      const response = await axios.get(`${API}/dtc/${vehicleId}`, {
        params: { cleared: false },
      });
      setDtcs(response.data);
    } catch (error) {
      console.error("Error loading DTCs:", error);
    }
  };

  const scanForDTCs = async () => {
    setScanning(true);
    toast.info("Scanning for diagnostic codes...");

    // Simulate scanning with mock data
    setTimeout(async () => {
      const mockDTCs = [
        {
          vehicle_id: vehicleId,
          code: "P0300",
          severity: "danger",
          title: "Random/Multiple Cylinder Misfire Detected",
          description: "Engine misfiring on one or more cylinders",
          probable_causes: [
            "Faulty spark plugs or coils",
            "Vacuum leak",
            "Low fuel pressure",
            "Faulty fuel injectors",
          ],
        },
        {
          vehicle_id: vehicleId,
          code: "P0171",
          severity: "warn",
          title: "System Too Lean (Bank 1)",
          description: "Air-fuel mixture is too lean",
          probable_causes: [
            "Vacuum leak",
            "Dirty MAF sensor",
            "Weak fuel pump",
            "Clogged fuel filter",
          ],
        },
        {
          vehicle_id: vehicleId,
          code: "P0420",
          severity: "warn",
          title: "Catalyst System Efficiency Below Threshold",
          description: "Catalytic converter not working efficiently",
          probable_causes: [
            "Failing catalytic converter",
            "Exhaust leak",
            "Faulty oxygen sensors",
          ],
        },
      ];

      try {
        for (const dtc of mockDTCs) {
          await axios.post(`${API}/dtc`, dtc);
        }
        await loadDTCs();
        toast.success(`Found ${mockDTCs.length} diagnostic codes`);
      } catch (error) {
        console.error("Error saving DTCs:", error);
        toast.error("Failed to scan for codes");
      }
      setScanning(false);
    }, 3000);
  };

  const clearDTC = async (dtcId) => {
    try {
      await axios.delete(`${API}/dtc/${dtcId}`);
      toast.success("Code cleared");
      loadDTCs();
    } catch (error) {
      console.error("Error clearing DTC:", error);
      toast.error("Failed to clear code");
    }
  };

  const clearAllDTCs = async () => {
    try {
      await axios.delete(`${API}/dtc/vehicle/${vehicleId}`);
      toast.success("All codes cleared");
      loadDTCs();
      setShowClearAll(false);
    } catch (error) {
      console.error("Error clearing all DTCs:", error);
      toast.error("Failed to clear codes");
    }
  };

  const filteredDTCs = dtcs.filter((dtc) => {
    const matchesSearch =
      dtc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dtc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || dtc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity) => {
    const colors = {
      ok: "hsl(146 64% 52%)",
      warn: "hsl(38 97% 55%)",
      danger: "hsl(2 85% 58%)",
    };
    return colors[severity] || colors.warn;
  };

  return (
    <div className="min-h-screen pb-6" data-testid="dtc-page">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur bg-[hsl(215_37%_7%/0.8)] border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold mb-3">DTC Scanner</h1>
          
          {/* Search and Filter */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(210_10%_75%)]" />
              <Input
                placeholder="Search codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[hsl(214_24%_12%)] border-border"
                data-testid="dtc-search-input"
              />
            </div>
            <Button
              onClick={scanForDTCs}
              disabled={scanning}
              className="bg-[hsl(186_100%_53%)] text-black hover:brightness-105"
              data-testid="dtc-scan-button"
            >
              {scanning ? "Scanning..." : "Scan"}
            </Button>
          </div>

          {/* Severity Filter */}
          <div className="flex gap-2">
            {["all", "danger", "warn", "ok"].map((severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  severityFilter === severity
                    ? "bg-[hsl(186_100%_53%)] text-black"
                    : "bg-[hsl(215_14%_22%)] text-[hsl(210_10%_75%)] hover:bg-[hsl(215_14%_26%)]"
                }`}
                data-testid={`severity-filter-${severity}`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-3">
        {filteredDTCs.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-[hsl(146_64%_52%)]" />
            <p className="text-[hsl(210_10%_75%)]">
              {dtcs.length === 0
                ? "No diagnostic codes found. Tap Scan to check."
                : "No codes match your search."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[hsl(210_10%_75%)]">
                {filteredDTCs.length} code(s) found
              </p>
              {filteredDTCs.length > 0 && (
                <Button
                  onClick={() => setShowClearAll(true)}
                  variant="destructive"
                  size="sm"
                  data-testid="clear-all-button"
                >
                  Clear All
                </Button>
              )}
            </div>

            {filteredDTCs.map((dtc) => (
              <div
                key={dtc.id}
                className="rounded-lg border border-border p-4 bg-[hsl(214_24%_12%)] space-y-3"
                data-testid="dtc-row"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className="px-2 py-1 rounded-md text-xs font-medium font-mono bg-[hsl(215_14%_90%)] text-black"
                      data-testid="dtc-code"
                    >
                      {dtc.code}
                    </span>
                    <Badge
                      style={{
                        backgroundColor: getSeverityColor(dtc.severity),
                        color: "black",
                      }}
                      data-testid="dtc-severity"
                    >
                      {dtc.severity}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => clearDTC(dtc.id)}
                    size="sm"
                    variant="destructive"
                    data-testid="dtc-clear-button"
                  >
                    Clear
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-1" data-testid="dtc-title">
                    {dtc.title}
                  </h3>
                  <p className="text-sm text-[hsl(210_10%_75%)]">
                    {dtc.description}
                  </p>
                </div>

                {dtc.probable_causes && dtc.probable_causes.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[hsl(210_10%_75%)] mb-1">
                      Probable Causes:
                    </p>
                    <ul className="text-xs text-[hsl(210_10%_75%)] space-y-1">
                      {dtc.probable_causes.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-[hsl(186_100%_53%)]">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearAll} onOpenChange={setShowClearAll}>
        <AlertDialogContent className="bg-[hsl(213_22%_14%)] border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Diagnostic Codes?</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(210_10%_75%)]">
              This will clear all diagnostic trouble codes. Make sure you have
              noted them down or resolved the underlying issues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[hsl(215_14%_22%)] text-white border-border" data-testid="cancel-clear-all">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllDTCs}
              className="bg-[hsl(2_85%_58%)] text-black hover:brightness-110"
              data-testid="confirm-clear-all"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DTCScanner;
