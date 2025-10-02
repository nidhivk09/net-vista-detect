import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScannerInput } from "@/components/ScannerInput";
import { DeviceTable } from "@/components/DeviceTable";
import { NetworkTopology } from "@/components/NetworkTopology";
import { AnomalyDetection } from "@/components/AnomalyDetection";
import { Summary } from "@/components/Summary";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock device data structure - replace with actual API calls
interface Device {
  id: string;
  ip: string;
  name: string;
  manufacturer: string;
  mac: string;
  protocol: string;
  ports: number[];
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string>("");
  const { toast } = useToast();

  const handleScan = async (ipAddress: string) => {
    setIsScanning(true);
    
    toast({
      title: "Scanning Network",
      description: `Initiating scan for ${ipAddress}...`,
    });

    // Simulate API call to Python backend
    setTimeout(() => {
      // Mock data - replace with actual API response
      const mockDevices: Device[] = [
        {
          id: "dev-001",
          ip: "192.168.1.10",
          name: "PLC Controller",
          manufacturer: "Siemens",
          mac: "00:1B:44:11:3A:B7",
          protocol: "Modbus TCP",
          ports: [502, 80],
        },
        {
          id: "dev-002",
          ip: "192.168.1.15",
          name: "SCADA Gateway",
          manufacturer: "Schneider Electric",
          mac: "00:1C:23:45:67:89",
          protocol: "DNP3",
          ports: [20000, 443],
        },
        {
          id: "dev-003",
          ip: "192.168.1.20",
          name: "Industrial Switch",
          manufacturer: "Cisco",
          mac: "00:1D:7E:12:34:56",
          protocol: "EtherNet/IP",
          ports: [44818, 2222],
        },
        {
          id: "dev-004",
          ip: "192.168.1.25",
          name: "HMI Panel",
          manufacturer: "Rockwell",
          mac: "00:1E:BD:98:76:54",
          protocol: "OPC UA",
          ports: [4840, 80],
        },
      ];

      setDevices(mockDevices);
      setLastScanTime(new Date().toISOString());
      setIsScanning(false);

      toast({
        title: "Scan Complete",
        description: `Discovered ${mockDevices.length} OT devices`,
      });
    }, 3000);
  };

  const anomaliesCount = Math.floor(devices.length / 3); // Mock calculation
  const uniqueProtocols = [...new Set(devices.map((d) => d.protocol))];

  return (
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
        </div>

        {/* Scanner Input */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Network Scanner</CardTitle>
            <CardDescription>
              Enter target IP address to scan and discover OT devices on the network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScannerInput onScan={handleScan} isScanning={isScanning} />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="devices">Devices</TabsTrigger>
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
                <DeviceTable devices={devices} />
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
