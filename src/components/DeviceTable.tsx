import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";

interface Device {
  id: string;
  ip: string;
  name: string;
  manufacturer: string;
  mac: string;
  protocol: string;
  ports: number[];
}

interface DeviceTableProps {
  devices: Device[];
}

export const DeviceTable = ({ devices }: DeviceTableProps) => {
  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Network className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg">No devices discovered yet</p>
        <p className="text-sm">Start a network scan to discover OT devices</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card/50">
            <TableHead className="font-semibold">IP Address</TableHead>
            <TableHead className="font-semibold">Device Name</TableHead>
            <TableHead className="font-semibold">Manufacturer</TableHead>
            <TableHead className="font-semibold">MAC Address</TableHead>
            <TableHead className="font-semibold">OT Protocol</TableHead>
            <TableHead className="font-semibold">Open Ports</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id} className="hover:bg-card/50 transition-colors">
              <TableCell className="font-mono text-primary">{device.ip}</TableCell>
              <TableCell className="font-medium">{device.name}</TableCell>
              <TableCell className="text-muted-foreground">{device.manufacturer}</TableCell>
              <TableCell className="font-mono text-sm">{device.mac}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {device.protocol}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {device.ports.map((port) => (
                    <Badge key={port} variant="secondary" className="font-mono text-xs">
                      {port}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
