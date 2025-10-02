import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Loader2, FileSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnomalyResult {
  deviceId: string;
  deviceName: string;
  status: "normal" | "anomaly";
  confidence: number;
  logs: string[];
  anomalyType?: string;
}

interface AnomalyDetectionProps {
  devices: Array<{ id: string; name: string; ip: string }>;
}

export const AnomalyDetection = ({ devices }: AnomalyDetectionProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnomalyResult[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (devices.length === 0) {
      toast({
        title: "No Devices",
        description: "Please scan the network first to discover devices",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call to Python backend
    setTimeout(() => {
      // Mock results - replace with actual API call
      const mockResults: AnomalyResult[] = devices.map((device, idx) => ({
        deviceId: device.id,
        deviceName: device.name,
        status: idx % 3 === 0 ? "anomaly" : "normal",
        confidence: Math.random() * 30 + 70,
        logs: [
          `[${new Date().toISOString()}] Device initialized`,
          `[${new Date().toISOString()}] Connection established`,
          idx % 3 === 0 ? `[${new Date().toISOString()}] Unusual traffic pattern detected` : `[${new Date().toISOString()}] Normal operation`,
        ],
        anomalyType: idx % 3 === 0 ? "Unusual Traffic Pattern" : undefined,
      }));
      
      setResults(mockResults);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${devices.length} devices`,
      });
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">ML-Based Anomaly Detection</h3>
          <p className="text-sm text-muted-foreground">
            Extract logs and analyze device behavior patterns
          </p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || devices.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FileSearch className="mr-2 h-4 w-4" />
              Analyze Devices
            </>
          )}
        </Button>
      </div>

      {results.length === 0 && !isAnalyzing && (
        <Card className="p-8 text-center text-muted-foreground">
          <FileSearch className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Click "Analyze Devices" to extract logs and detect anomalies</p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result) => (
          <Card key={result.deviceId} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{result.deviceName}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Device ID: {result.deviceId}
                  </p>
                </div>
                <Badge
                  variant={result.status === "anomaly" ? "destructive" : "default"}
                  className={
                    result.status === "anomaly"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-success text-success-foreground"
                  }
                >
                  {result.status === "anomaly" ? (
                    <AlertTriangle className="mr-1 h-3 w-3" />
                  ) : (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  )}
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono font-semibold">{result.confidence.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      result.status === "anomaly" ? "bg-destructive" : "bg-success"
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              {result.anomalyType && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span className="text-destructive font-medium">{result.anomalyType}</span>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Recent Logs:</p>
                <div className="bg-background rounded p-2 space-y-1 max-h-32 overflow-y-auto">
                  {result.logs.map((log, idx) => (
                    <p key={idx} className="text-xs font-mono text-muted-foreground">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
