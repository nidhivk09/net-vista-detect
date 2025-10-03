import { useState, useCallback } from "react";
// --- UI Imports ---
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
// --- Custom Component Imports ---
import { ScannerInput } from "@/components/ScannerInput";
import { DeviceTable } from "@/components/DeviceTable";
import { NetworkTopology } from "@/components/NetworkTopology";
import { AnomalyDetection } from "@/components/AnomalyDetection";
import { Summary } from "@/components/Summary";
// import { useToast } from "@/hooks/use-toast"; // NOTE: Removing if not used in this file


// --- Data Structure Definitions ---
// Define the structure returned by FastAPI, mapped from ScanResult
interface ScanResult {
    ip: string;
    mac: string;
    vendor: string;
    risk: string;
    port_count: number;
    ot_services: [number, string][];
}

// Define the simplified structure expected by display components (e.g., DeviceTable)
interface Device {
    id: string; // Used as unique React key (IP address)
    ip: string;
    name: string; // Mapped from 'vendor'
    manufacturer: string;
    mac: string;
    protocol: string; // Primary OT Protocol
    ports: number[]; // List of open ports
    risk: string; // Risk level from API
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<string>("Ready to start network scan.");
  // const { toast } = useToast(); // Removed since toast is used in ScannerInput

  // --- HANDLERS PASSED TO ScannerInput ---

  // 1. START: Called when the user clicks 'Scan'
  const handleScanStart = useCallback(() => {
    setIsScanning(true);
    setDevices([]); // Clear previous results
    setScanStatus("Scan initiated...");
  }, []);

  // 2. COMPLETE: Called when API polling successfully returns final results
  const handleScanComplete = useCallback((results: ScanResult[], scanTime: string) => {
    setIsScanning(false);
    setLastScanTime(scanTime);

    // Map the complex API result structure to the simpler Device structure
    const mappedDevices: Device[] = results.map(r => ({
        id: r.ip,
        ip: r.ip,
        name: r.vendor === 'Unknown' ? `Device @${r.ip}` : `${r.vendor} Device`,
        manufacturer: r.vendor,
        mac: r.mac,
        protocol: r.ot_services.length > 0 ? r.ot_services[0][1] : 'None Detected',
        ports: r.ot_services.map(([port]) => port),
        risk: r.risk,
    }));

    setDevices(mappedDevices);
  }, []);

  // 3. STATUS: Updates the status message in the main UI
  const handleStatusUpdate = useCallback((status: string) => {
      setScanStatus(status);
  }, []);

  // --- DERIVED STATE ---
  const anomaliesCount = devices.filter(d => d.risk !== 'Low').length;
  const uniqueProtocols = [...new Set(devices.map((d) => d.protocol))];

  return (
    // 🚨 Critical Check: Ensure this root element is rendering visually
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-glow">OT Device Discovery</h1>
          </div>
          <p className="text-muted-foreground">
            Advanced network scanning and anomaly detection for operational technology devices
          </p>
          {/* Status Display */}
          <p className="text-sm text-gray-500 mt-2">Current Activity: <strong>{scanStatus}</strong></p>
        </div>

        {/* Scanner Input (API Integration Point) */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Network Scanner</CardTitle>
            <CardDescription>
              Enter target network in CIDR format (e.g., 192.168.1.0/24) to scan and discover OT devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Connect the handlers to ScannerInput */}
            <ScannerInput
              isScanning={isScanning}
              onScanStart={handleScanStart}
              onScanComplete={handleScanComplete}
              onStatusUpdate={handleStatusUpdate}
            />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="devices">Devices ({devices.length})</TabsTrigger>
            <TabsTrigger value="topology">Topology</TabsTrigger>
            <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Discovered Devices</CardTitle>
                <CardDescription>
                  List of all OT devices found during network scan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceTable devices={devices} isScanning={isScanning} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topology" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Topology</CardTitle>
                <CardDescription>
                  Visual representation of discovered devices and their connections
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <NetworkTopology devices={devices} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anomaly" className="space-y-4">
            <AnomalyDetection devices={devices} />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Summary
              totalDevices={devices.length}
              anomaliesDetected={anomaliesCount}
              protocolsUsed={uniqueProtocols}
              lastScanTime={lastScanTime}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
