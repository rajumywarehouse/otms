"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Truck,
  Navigation,
  Clock,
  Signal,
  Search,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const trackedVehicles = [
  {
    id: "1",
    truckNumber: "MH12AB1234",
    driver: "Rajesh Kumar",
    tripId: "TRP-2024-001",
    status: "IN_TRANSIT",
    speed: 65,
    lastUpdate: "2 min ago",
    lat: 19.076,
    lng: 72.8777,
    route: "Mumbai → Pune",
    eta: "2h 30m",
    distance: "148 km",
    gpsStatus: "online",
  },
  {
    id: "2",
    truckNumber: "MH04CD5678",
    driver: "Suresh Patil",
    tripId: "TRP-2024-002",
    status: "ENROUTE_PICKUP",
    speed: 45,
    lastUpdate: "1 min ago",
    lat: 28.7041,
    lng: 77.1025,
    route: "Delhi → Jaipur",
    eta: "5h 15m",
    distance: "281 km",
    gpsStatus: "online",
  },
  {
    id: "3",
    truckNumber: "DL03IJ7890",
    driver: "Ravi Sharma",
    tripId: "TRP-2024-005",
    status: "IN_TRANSIT",
    speed: 72,
    lastUpdate: "30 sec ago",
    lat: 22.5726,
    lng: 88.3639,
    route: "Kolkata → Patna",
    eta: "4h 45m",
    distance: "570 km",
    gpsStatus: "online",
  },
  {
    id: "4",
    truckNumber: "TN02GH3456",
    driver: "Mohan Das",
    tripId: "TRP-2024-004",
    status: "DELAYED",
    speed: 0,
    lastUpdate: "15 min ago",
    lat: 17.385,
    lng: 78.4867,
    route: "Hyderabad → Vizag",
    eta: "8h 00m",
    distance: "625 km",
    gpsStatus: "idle",
  },
  {
    id: "5",
    truckNumber: "GJ05KL2345",
    driver: "Vikram Yadav",
    tripId: "TRP-2024-006",
    status: "GPS_OFFLINE",
    speed: 0,
    lastUpdate: "45 min ago",
    lat: 23.0225,
    lng: 72.5714,
    route: "Ahmedabad → Surat",
    eta: "—",
    distance: "—",
    gpsStatus: "offline",
  },
];

function getGpsStatusBadge(status: string) {
  switch (status) {
    case "online": return <Badge variant="success">Online</Badge>;
    case "idle": return <Badge variant="warning">Idle</Badge>;
    case "offline": return <Badge variant="destructive">Offline</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function TrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(trackedVehicles[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVehicles = trackedVehicles.filter(
    (v) =>
      v.truckNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Tracking</h1>
          <p className="text-muted-foreground">Real-time GPS tracking of all active vehicles</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vehicle List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Vehicles ({filteredVehicles.length})</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  selectedVehicle?.id === vehicle.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-semibold">{vehicle.truckNumber}</span>
                  {getGpsStatusBadge(vehicle.gpsStatus)}
                </div>
                <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3" />
                  <span>{vehicle.route}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vehicle.lastUpdate}
                  </span>
                  <span className="text-xs font-medium">{vehicle.speed} km/h</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="relative h-[600px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium">Google Maps Integration</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your Google Maps API key in .env to enable live map view
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
                  </p>
                </div>
              </div>

              {/* Vehicle Info Overlay */}
              {selectedVehicle && (
                <div className="absolute bottom-4 left-4 right-4 bg-card border rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{selectedVehicle.truckNumber}</p>
                        <p className="text-sm text-muted-foreground">{selectedVehicle.driver}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">ETA: {selectedVehicle.eta}</p>
                      <p className="text-xs text-muted-foreground">{selectedVehicle.distance} remaining</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm">
                      <Signal className="h-4 w-4 text-green-500" />
                      <span>{selectedVehicle.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Navigation className="h-4 w-4 text-blue-500" />
                      <span>{selectedVehicle.route}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedVehicle.lastUpdate}</span>
                    </div>
                    {selectedVehicle.gpsStatus === "idle" && (
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Vehicle idle</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
