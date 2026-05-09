"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Download,
  MapPin,
  Eye,
  Truck,
  X,
  CheckCircle,
  Navigation,
} from "lucide-react";

const trips = [
  { id: "TRP-2024-001", client: "Tata Steel", truck: "MH12AB1234", driver: "Rajesh Kumar", status: "IN_TRANSIT", pickup: "Mumbai", drop: "Pune", pickupLat: 19.076, pickupLng: 72.8777, dropLat: 18.5204, dropLng: 73.8567, truckLat: 19.0522, truckLng: 73.1152, eta: "2h 30m", cost: 45000, createdAt: "2024-03-15" },
  { id: "TRP-2024-002", client: "Reliance Industries", truck: "MH04CD5678", driver: "Suresh Patil", status: "REACHED_PICKUP", pickup: "Delhi", drop: "Jaipur", pickupLat: 28.7041, pickupLng: 77.1025, dropLat: 26.9124, dropLng: 75.7873, truckLat: 28.7041, truckLng: 77.1025, eta: "5h 15m", cost: 72000, createdAt: "2024-03-15" },
  { id: "TRP-2024-003", client: "Infosys", truck: "KA01EF9012", driver: "Anil Singh", status: "COMPLETED", pickup: "Bangalore", drop: "Chennai", pickupLat: 12.9716, pickupLng: 77.5946, dropLat: 13.0827, dropLng: 80.2707, truckLat: 13.0827, truckLng: 80.2707, eta: "—", cost: 38000, createdAt: "2024-03-14" },
  { id: "TRP-2024-004", client: "Wipro", truck: "TN02GH3456", driver: "Mohan Das", status: "DELAYED", pickup: "Hyderabad", drop: "Vizag", pickupLat: 17.385, pickupLng: 78.4867, dropLat: 17.6868, dropLng: 83.2185, truckLat: 17.52, truckLng: 80.12, eta: "8h 00m", cost: 55000, createdAt: "2024-03-14" },
  { id: "TRP-2024-005", client: "HCL Tech", truck: "DL03IJ7890", driver: "Ravi Sharma", status: "TRIP_STARTED", pickup: "Kolkata", drop: "Patna", pickupLat: 22.5726, pickupLng: 88.3639, dropLat: 25.6093, dropLng: 85.1376, truckLat: 22.5726, truckLng: 88.3639, eta: "4h 45m", cost: 32000, createdAt: "2024-03-14" },
  { id: "TRP-2024-006", client: "Mahindra Logistics", truck: "", driver: "", status: "CREATED", pickup: "Ahmedabad", drop: "Surat", pickupLat: 23.0225, pickupLng: 72.5714, dropLat: 21.1702, dropLng: 72.8311, truckLat: 0, truckLng: 0, eta: "—", cost: 28000, createdAt: "2024-03-13" },
  { id: "TRP-2024-007", client: "Adani Ports", truck: "RJ07MN6789", driver: "Deepak Meena", status: "ASSIGNED", pickup: "Mundra", drop: "Delhi", pickupLat: 22.8394, pickupLng: 69.7251, dropLat: 28.7041, dropLng: 77.1025, truckLat: 22.8394, truckLng: 69.7251, eta: "14h 00m", cost: 95000, createdAt: "2024-03-13" },
  { id: "TRP-2024-008", client: "JSW Steel", truck: "MH14OP0123", driver: "Santosh Kamble", status: "IN_TRANSIT", pickup: "Bellary", drop: "Mumbai", pickupLat: 15.1394, pickupLng: 76.9214, dropLat: 19.076, dropLng: 72.8777, truckLat: 17.42, truckLng: 74.68, eta: "6h 20m", cost: 62000, createdAt: "2024-03-12" },
];

const availableTrucks = [
  { id: "t3", number: "KA01EF9012", type: "20 Feet", capacity: "9T", driver: "Anil Singh", location: "Bangalore Depot" },
  { id: "t6", number: "GJ05KL2345", type: "14 Feet", capacity: "7T", driver: "Vikram Yadav", location: "Ahmedabad Depot" },
  { id: "t7", number: "RJ07MN6789", type: "Trailer", capacity: "30T", driver: "Deepak Meena", location: "Jaipur Depot" },
];

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" | "default" | "secondary" }> = {
  CREATED: { label: "Created", variant: "secondary" },
  ASSIGNED: { label: "Assigned", variant: "default" },
  DRIVER_ACCEPTED: { label: "Accepted", variant: "info" },
  ENROUTE_PICKUP: { label: "Enroute Pickup", variant: "info" },
  REACHED_PICKUP: { label: "At Pickup", variant: "warning" },
  TRIP_STARTED: { label: "Started", variant: "info" },
  IN_TRANSIT: { label: "In Transit", variant: "info" },
  NEAR_DESTINATION: { label: "Near Drop", variant: "warning" },
  REACHED_DESTINATION: { label: "At Drop", variant: "success" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  DELAYED: { label: "Delayed", variant: "destructive" },
};

export default function TripsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showMapModal, setShowMapModal] = useState<string | null>(null);
  const [showAllocate, setShowAllocate] = useState<string | null>(null);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.truck.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const mapTrip = trips.find((t) => t.id === showMapModal);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trip Management</h1>
          <p className="text-muted-foreground">Create, manage, and track all trips</p>
        </div>
        <Link href="/trips/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Trip
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="CREATED">Created</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="COMPLETED">Completed</option>
                <option value="DELAYED">Delayed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-3 font-medium">Trip ID</th>
                  <th className="text-left py-3 px-3 font-medium">Client</th>
                  <th className="text-left py-3 px-3 font-medium">Truck</th>
                  <th className="text-left py-3 px-3 font-medium">Driver</th>
                  <th className="text-left py-3 px-3 font-medium">Route</th>
                  <th className="text-left py-3 px-3 font-medium">Status</th>
                  <th className="text-left py-3 px-3 font-medium">ETA</th>
                  <th className="text-left py-3 px-3 font-medium">Cost</th>
                  <th className="text-left py-3 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => {
                  const status = statusConfig[trip.status] || { label: trip.status, variant: "default" as const };
                  return (
                    <tr key={trip.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs font-medium">{trip.id}</td>
                      <td className="py-3 px-3">{trip.client}</td>
                      <td className="py-3 px-3 font-mono text-xs">
                        {trip.truck || (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => setShowAllocate(trip.id)}
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Allocate
                          </Button>
                        )}
                      </td>
                      <td className="py-3 px-3">{trip.driver || <span className="text-muted-foreground">—</span>}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{trip.pickup}</span>
                          <span>→</span>
                          <span>{trip.drop}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="py-3 px-3">{trip.eta}</td>
                      <td className="py-3 px-3">₹{trip.cost.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="View Trip"
                            onClick={() => router.push(`/trips/${trip.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Map Location"
                            onClick={() => setShowMapModal(trip.id)}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTrips.length} of {trips.length} trips
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Modal */}
      {showMapModal && mapTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMapModal(null)} />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Trip Route: {mapTrip.id}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMapModal(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 space-y-4">
              {/* Map showing truck current location */}
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={mapTrip.truckLat ? `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(mapTrip.pickupLng, mapTrip.dropLng, mapTrip.truckLng) - 0.5},${Math.min(mapTrip.pickupLat, mapTrip.dropLat, mapTrip.truckLat) - 0.5},${Math.max(mapTrip.pickupLng, mapTrip.dropLng, mapTrip.truckLng) + 0.5},${Math.max(mapTrip.pickupLat, mapTrip.dropLat, mapTrip.truckLat) + 0.5}&layer=mapnik&marker=${mapTrip.truckLat},${mapTrip.truckLng}` : `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(mapTrip.pickupLng, mapTrip.dropLng) - 1},${Math.min(mapTrip.pickupLat, mapTrip.dropLat) - 1},${Math.max(mapTrip.pickupLng, mapTrip.dropLng) + 1},${Math.max(mapTrip.pickupLat, mapTrip.dropLat) + 1}&layer=mapnik`}
                  style={{ border: 0 }}
                />
              </div>
              {/* Truck current location indicator */}
              {mapTrip.truckLat > 0 && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-medium text-blue-600">CURRENT TRUCK LOCATION ({mapTrip.truck})</p>
                  </div>
                  <p className="text-sm mt-1">{mapTrip.truckLat.toFixed(4)}, {mapTrip.truckLng.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">Driver: {mapTrip.driver} • Status: {statusConfig[mapTrip.status]?.label}</p>
                </div>
              )}
              <div className="flex gap-4">
                <div className="flex-1 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-xs font-medium text-green-600">PICKUP</p>
                  <p className="font-medium text-sm">{mapTrip.pickup}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mapTrip.pickupLat.toFixed(4)}, {mapTrip.pickupLng.toFixed(4)}</p>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs font-medium text-red-600">DROP</p>
                  <p className="font-medium text-sm">{mapTrip.drop}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mapTrip.dropLat.toFixed(4)}, {mapTrip.dropLng.toFixed(4)}</p>
                </div>
              </div>
              <a
                href={mapTrip.truckLat ? `https://www.google.com/maps?q=${mapTrip.truckLat},${mapTrip.truckLng}` : `https://www.google.com/maps/dir/${mapTrip.pickupLat},${mapTrip.pickupLng}/${mapTrip.dropLat},${mapTrip.dropLng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full">
                  <Navigation className="mr-2 h-4 w-4" />
                  {mapTrip.truckLat ? "View Truck in Google Maps" : "Open Route in Google Maps"}
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Truck Allocation Modal */}
      {showAllocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAllocate(null)} />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Allocate Truck — {showAllocate}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAllocate(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">Available trucks for allocation:</p>
              {availableTrucks.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-mono font-semibold text-sm">{t.number}</p>
                      <p className="text-xs text-muted-foreground">{t.type} • {t.capacity} • {t.driver}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      alert(`Truck ${t.number} allocated to trip ${showAllocate} with driver ${t.driver}`);
                      setShowAllocate(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                </div>
              ))}
              {availableTrucks.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-8">No trucks available for allocation</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
