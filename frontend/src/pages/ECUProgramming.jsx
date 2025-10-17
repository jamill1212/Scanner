import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ECUProgramming = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [operationType, setOperationType] = useState("read");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [vehicleId] = useState("demo-vehicle-001");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/octet-stream": [".bin", ".hex", ".ori"] },
    multiple: false,
    onDrop: (files) => {
      if (files.length > 0) {
        setSelectedFile(files[0]);
        toast.success(`File selected: ${files[0].name}`);
      }
    },
  });

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => `${prev}[${timestamp}] ${message}\n`);
  };

  const startOperation = () => {
    if (operationType === "program" || operationType === "remap") {
      setShowConfirmDialog(true);
    } else {
      executeOperation();
    }
  };

  const executeOperation = async () => {
    setIsProcessing(true);
    setProgress(0);
    setLogs("");
    addLog(`Starting ${operationType} operation...`);

    try {
      // Create operation record
      const operation = await axios.post(`${API}/ecu`, {
        vehicle_id: vehicleId,
        operation_type: operationType,
        file_name: selectedFile?.name,
        file_size: selectedFile?.size,
      });

      // Upload file if present
      if (selectedFile) {
        addLog(`Uploading file: ${selectedFile.name}`);
        const formData = new FormData();
        formData.append("file", selectedFile);
        await axios.post(`${API}/files/upload`, formData);
        addLog("File uploaded successfully");
      }

      // Simulate operation progress
      const steps = [
        { progress: 20, message: "Connecting to ECU..." },
        { progress: 40, message: "Reading ECU data..." },
        { progress: 60, message: "Processing data..." },
        { progress: 80, message: "Writing to ECU..." },
        { progress: 100, message: "Verifying..." },
      ];

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setProgress(step.progress);
        addLog(step.message);

        // Update operation status
        await axios.patch(`${API}/ecu/${operation.data.id}`, {
          progress: step.progress,
          status: step.progress === 100 ? "completed" : "in_progress",
          logs: [step.message],
        });
      }

      addLog("Operation completed successfully!");
      toast.success("ECU operation completed");
    } catch (error) {
      console.error("Error during ECU operation:", error);
      addLog(`Error: ${error.message}`);
      toast.error("ECU operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pb-6" data-testid="ecu-page">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur bg-[hsl(215_37%_7%/0.8)] border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold">ECU Programming</h1>
          <p className="text-xs text-[hsl(210_10%_75%)]">
            Advanced ECU operations and tuning
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Warning Alert */}
        <Alert className="bg-[hsl(38_97%_55%/0.1)] border-[hsl(38_97%_55%)]">
          <AlertCircle className="h-4 w-4 text-[hsl(38_97%_55%)]" />
          <AlertDescription className="text-[hsl(38_97%_55%)]">
            ECU programming can affect vehicle performance. Always backup your ECU
            before making changes.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="operations" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full bg-[hsl(214_24%_12%)] border border-border">
            <TabsTrigger value="operations" data-testid="tab-operations">Operations</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-4">
            {/* Operation Type */}
            <Card className="p-4 bg-[hsl(214_24%_12%)] border-border space-y-4">
              <div className="space-y-2">
                <Label htmlFor="operation-type" className="text-sm font-medium">
                  Operation Type
                </Label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger
                    id="operation-type"
                    className="bg-[hsl(215_37%_7%)] border-border"
                    data-testid="operation-type-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(213_22%_14%)] border-border">
                    <SelectItem value="read">Read ECU</SelectItem>
                    <SelectItem value="backup">Backup ECU</SelectItem>
                    <SelectItem value="program">Program/Flash ECU</SelectItem>
                    <SelectItem value="remap">ECU Remapping</SelectItem>
                    <SelectItem value="key_program">Key Programming</SelectItem>
                    <SelectItem value="module_code">Module Coding</SelectItem>
                    <SelectItem value="firmware_update">Firmware Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              {(operationType === "program" ||
                operationType === "remap" ||
                operationType === "firmware_update") && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Upload File</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-[hsl(186_100%_53%)] bg-[hsl(186_100%_53%/0.1)]"
                        : "border-border bg-[hsl(214_24%_12%)] hover:bg-[hsl(214_20%_15%)]"
                    }`}
                    data-testid="ecu-file-drop"
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-[hsl(210_10%_75%)]" />
                    <p className="text-sm text-[hsl(210_10%_75%)]">
                      {isDragActive
                        ? "Drop file to upload"
                        : "Drop ECU file here or tap to select"}
                    </p>
                    <p className="text-xs text-[hsl(210_10%_75%)] mt-1">
                      Supported: .bin, .hex, .ori
                    </p>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(186_100%_53%/0.1)] border border-[hsl(186_100%_53%)]">
                      <FileText className="h-4 w-4 text-[hsl(186_100%_53%)]" />
                      <span className="text-sm font-mono text-[hsl(186_100%_53%)]" data-testid="selected-file-name">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-[hsl(210_10%_75%)] ml-auto">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Start Button */}
              <Button
                onClick={startOperation}
                disabled={isProcessing}
                className="w-full bg-[hsl(186_100%_53%)] text-black hover:brightness-105"
                data-testid="ecu-start-operation-button"
              >
                {isProcessing ? "Processing..." : `Start ${operationType}`}
              </Button>
            </Card>

            {/* Progress */}
            {isProcessing && (
              <Card className="p-4 bg-[hsl(214_24%_12%)] border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm tabular-nums" data-testid="operation-progress">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </Card>
            )}

            {/* Logs */}
            {logs && (
              <Card className="p-4 bg-[hsl(214_24%_12%)] border-border space-y-2">
                <Label className="text-sm font-medium">Operation Logs</Label>
                <Textarea
                  value={logs}
                  readOnly
                  className="font-mono text-xs bg-[hsl(215_37%_7%)] border-border min-h-[200px] resize-none"
                  data-testid="operation-logs"
                />
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-4 bg-[hsl(214_24%_12%)] border-border">
              <p className="text-sm text-[hsl(210_10%_75%)] text-center py-8">
                Operation history will appear here
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-[hsl(213_22%_14%)] border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm ECU Programming</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(210_10%_75%)]">
              You are about to modify the ECU. This operation cannot be undone. Make
              sure you have backed up your ECU and understand the risks involved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[hsl(215_14%_22%)] text-white border-border" data-testid="cancel-ecu-operation">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                executeOperation();
              }}
              className="bg-[hsl(2_85%_58%)] text-black hover:brightness-110"
              data-testid="confirm-ecu-operation"
            >
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ECUProgramming;
