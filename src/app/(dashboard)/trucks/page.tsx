"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Truck, MapPin, Calendar, Shield, X, Save, Eye, Phone, User } from "lucide-react";

const initialTrucks = [
  { id: "1", number: "MH12AB1234", type: "32 Feet", capacity: 15, status: "ON_TRIP", driver: "Rajesh Kumar", driverPhone: "+91 98765 43210", location: "Mumbai-Pune Highway", ownership: "OWNED", fitness: "2024-12-15", insurance: "2025-03-20", rc: "MH12-2019-0012345", gpsDevice: "GPS-001" },
  { id: "2", number: "MH04CD5678", type: "Trailer", capacity: 25, status: "ON_TRIP", driver: "Suresh Patil", driverPhone: "+91 87654 32109", location: "Near Delhi", ownership: "OWNED", fitness: "2024-11-30", insurance: "2025-01-15", rc: "MH04-2020-0067890", gpsDevice: "GPS-002" },
  { id: "3", number: "KA01EF9012", type: "20 Feet", capacity: 9, status: "AVAILABLE", driver: "Anil Singh", driverPhone: "+91 76543 21098", location: "Bangalore Depot", ownership: "LEASED", fitness: "2025-06-10", insurance: "2025-08-22", rc: "KA01-2021-0034567", gpsDevice: "GPS-003" },
  { id: "4", number: "TN02GH3456", type: "Container", capacity: 20, status: "ON_TRIP", driver: "Mohan Das", driverPhone: "+91 65432 10987", location: "Near Warangal", ownership: "OWNED", fitness: "2024-09-05", insurance: "2024-11-30", rc: "TN02-2018-0089012", gpsDevice: "GPS-004" },
  { id: "5", number: "DL03IJ7890", type: "Open Truck", capacity: 12, status: "ON_TRIP", driver: "Ravi Sharma", driverPhone: "+91 54321 09876", location: "West Bengal NH", ownership: "ATTACHED", fitness: "2025-02-28", insurance: "2025-05-15", rc: "DL03-2020-0045678", gpsDevice: "GPS-005" },
  { id: "6", number: "GJ05KL2345", type: "14 Feet", capacity: 7, status: "AVAILABLE", driver: "Vikram Yadav", driverPhone: "+91 43210 98765", location: "Ahmedabad Depot", ownership: "OWNED", fitness: "2025-04-18", insurance: "2025-07-01", rc: "GJ05-2022-0023456", gpsDevice: "GPS-006" },
  { id: "7", number: "RJ07MN6789", type: "Trailer", capacity: 30, status: "AVAILABLE", driver: "Deepak Meena", driverPhone: "+91 32109 87654", location: "Jaipur Depot", ownership: "LEASED", fitness: "2025-01-22", insurance: "2025-04-10", rc: "RJ07-2019-0078901", gpsDevice: "GPS-007" },
  { id: "8", number: "MH14OP0123", type: "Taurus", capacity: 18, status: "MAINTENANCE", driver: "—", driverPhone: "", location: "Workshop", ownership: "OWNED", fitness: "2024-08-15", insurance: "2024-10-30", rc: "MH14-2021-0056789", gpsDevice: "GPS-008" },
];

const statusColors: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  AVAILABLE: "success",
  ON_TRIP: "info",
  MAINTENANCE: "warning",
  INACTIVE: "destructive",
};

export default function TrucksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [trucks, setTrucks] = useState(initialTrucks);
  const [showForm, setShowForm] = useState(false);
  const [viewTruck, setViewTruck] = useState<string | null>(null);
  const [form, setForm] = useState({ number: "", type: "32 Feet", capacity: "", ownership: "OWNED", rc: "", fitness: "", insurance: "", gpsDevice: "" });

  const filtered = trucks.filter(
    (t) =>
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTruck = trucks.find((t) => t.id === viewTruck);

  const handleAddTruck = () => {
    if (!form.number || !form.capacity) { alert("Truck number and capacity are required"); return; }
    const newTruck = {
      id: String(trucks.length + 1),
      number: form.number,
      type: form.type,
      capacity: parseFloat(form.capacity),
      status: "AVAILABLE",
      driver: "—",
      driverPhone: "",
      location: "Depot",
      ownership: form.ownership,
      fitness: form.fitness || "—",
      insurance: form.insurance || "—",
      rc: form.rc,
      gpsDevice: form.gpsDevice,
    };
    setTrucks([...trucks, newTruck]);
    setForm({ number: "", type: "32 Feet", capacity: "", ownership: "OWNED", rc: "", fitness: "", insurance: "", gpsDevice: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Truck Fleet</h1>
          <p className="text-muted-foreground">Manage your truck fleet and assignments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? "Cancel" : "Add Truck"}
        </Button>
      </div>

      {/* Add Truck Form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Add New Truck</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Truck Number *</label>
                <Input placeholder="MH12AB1234" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Truck Type *</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="Trailer">Trailer</option>
                  <option value="32 Feet">32 Feet</option>
                  <option value="20 Feet">20 Feet</option>
                  <option value="14 Feet">14 Feet</option>
                  <option value="Taurus">Taurus</option>
                  <option value="Open Truck">Open Truck</option>
                  <option value="Container">Container</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity (Tons) *</label>
                <Input type="number" placeholder="15" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ownership</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.ownership} onChange={(e) => setForm({ ...form, ownership: e.target.value })}>
                  <option value="OWNED">Owned</option>
                  <option value="LEASED">Leased</option>
                  <option value="ATTACHED">Attached</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">RC Number</label>
                <Input placeholder="RC number" value={form.rc} onChange={(e) => setForm({ ...form, rc: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Expiry</label>
                <Input type="date" value={form.fitness} onChange={(e) => setForm({ ...form, fitness: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Insurance Expiry</label>
                <Input type="date" value={form.insurance} onChange={(e) => setForm({ ...form, insurance: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GPS Device ID</label>
                <Input placeholder="GPS-XXX" value={form.gpsDevice} onChange={(e) => setForm({ ...form, gpsDevice: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAddTruck}><Save className="mr-2 h-4 w-4" />Save Truck</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Fleet</p><p className="text-2xl font-bold">{trucks.length}</p></div><Truck className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Available</p><p className="text-2xl font-bold text-green-600">{trucks.filter(t => t.status === "AVAILABLE").length}</p></div><div className="h-3 w-3 rounded-full bg-green-500" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">On Trip</p><p className="text-2xl font-bold text-blue-600">{trucks.filter(t => t.status === "ON_TRIP").length}</p></div><div className="h-3 w-3 rounded-full bg-blue-500" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Maintenance</p><p className="text-2xl font-bold text-yellow-600">{trucks.filter(t => t.status === "MAINTENANCE").length}</p></div><div className="h-3 w-3 rounded-full bg-yellow-500" /></div></CardContent></Card>
      </div>

      {/* Truck List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search trucks..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((truck) => (
              <div key={truck.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold">{truck.number}</span>
                  <Badge variant={statusColors[truck.status]}>{truck.status.replace("_", " ")}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4" /><span>{truck.type} • {truck.capacity}T • {truck.ownership}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{truck.location}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Shield className="h-4 w-4" /><span>Insurance: {truck.insurance}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /><span>Fitness: {truck.fitness}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-sm">Driver: <strong>{truck.driver}</strong></span>
                  <Button variant="ghost" size="sm" onClick={() => setViewTruck(truck.id)}><Eye className="h-4 w-4 mr-1" />View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Truck Detail Modal */}
      {viewTruck && selectedTruck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewTruck(null)} />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedTruck.number}</h2>
              <Button variant="ghost" size="icon" onClick={() => setViewTruck(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Truck className="h-6 w-6 text-blue-600" /></div>
                <div>
                  <p className="font-mono font-bold text-lg">{selectedTruck.number}</p>
                  <Badge variant={statusColors[selectedTruck.status]}>{selectedTruck.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Type</p><p className="font-medium">{selectedTruck.type}</p></div>
                <div><p className="text-muted-foreground">Capacity</p><p className="font-medium">{selectedTruck.capacity} Tons</p></div>
                <div><p className="text-muted-foreground">Ownership</p><p className="font-medium">{selectedTruck.ownership}</p></div>
                <div><p className="text-muted-foreground">RC Number</p><p className="font-medium">{selectedTruck.rc || "—"}</p></div>
                <div><p className="text-muted-foreground">Fitness Expiry</p><p className="font-medium">{selectedTruck.fitness}</p></div>
                <div><p className="text-muted-foreground">Insurance Expiry</p><p className="font-medium">{selectedTruck.insurance}</p></div>
                <div><p className="text-muted-foreground">GPS Device</p><p className="font-medium">{selectedTruck.gpsDevice || "—"}</p></div>
                <div><p className="text-muted-foreground">Location</p><p className="font-medium">{selectedTruck.location}</p></div>
              </div>
              {selectedTruck.driver !== "—" && (
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground font-medium mb-2">ASSIGNED DRIVER</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><User className="h-4 w-4 text-green-600" /></div>
                    <div>
                      <p className="font-medium text-sm">{selectedTruck.driver}</p>
                      {selectedTruck.driverPhone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{selectedTruck.driverPhone}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
