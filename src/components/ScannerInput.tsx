import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScannerInputProps {
  onScan: (ipAddress: string) => void;
  isScanning: boolean;
}

export const ScannerInput = ({ onScan, isScanning }: ScannerInputProps) => {
  const [ipAddress, setIpAddress] = useState("");
  const { toast } = useToast();

  const handleScan = () => {
    if (!ipAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid IP address",
        variant: "destructive",
      });
      return;
    }
    onScan(ipAddress);
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <label htmlFor="ip-input" className="text-sm font-medium text-muted-foreground block mb-2">
          Target IP Address
        </label>
        <Input
          id="ip-input"
          type="text"
          placeholder="192.168.1.1"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          disabled={isScanning}
          className="font-mono bg-card border-border focus:border-primary transition-colors"
        />
      </div>
      <Button
        onClick={handleScan}
        disabled={isScanning}
        className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Scan Network
          </>
        )}
      </Button>
    </div>
  );
};
