"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Phone, CreditCard, Truck, UserCircle, X, Save, Eye, AlertTriangle, Calendar } from "lucide-react";

const initialDrivers = [
  { id: "1", name: "Rajesh Kumar", phone: "+91 98765 43210", license: "MH12-2020-0012345", licenseExpiry: "2026-05-15", status: "ON_TRIP", truck: "MH12AB1234", trips: 156, aadhaar: "XXXX-XXXX-1234", emergencyContact: "Sunita Kumar", emergencyPhone: "+91 98765 00011", joinDate: "2019-06-10" },
  { id: "2", name: "Suresh Patil", phone: "+91 87654 32109", license: "MH04-2019-0067890", licenseExpiry: "2025-08-22", status: "ON_TRIP", truck: "MH04CD5678", trips: 203, aadhaar: "XXXX-XXXX-2345", emergencyContact: "Meena Patil", emergencyPhone: "+91 87654 00012", joinDate: "2018-03-15" },
  { id: "3", name: "Anil Singh", phone: "+91 76543 21098", license: "KA01-2021-0034567", licenseExpiry: "2027-01-10", status: "AVAILABLE", truck: "KA01EF9012", trips: 89, aadhaar: "XXXX-XXXX-3456", emergencyContact: "Priya Singh", emergencyPhone: "+91 76543 00013", joinDate: "2021-01-20" },
  { id: "4", name: "Mohan Das", phone: "+91 65432 10987", license: "TN02-2018-0089012", licenseExpiry: "2024-12-30", status: "ON_TRIP", truck: "TN02GH3456", trips: 312, aadhaar: "XXXX-XXXX-4567", emergencyContact: "Lakshmi Das", emergencyPhone: "+91 65432 00014", joinDate: "2016-09-05" },
  { id: "5", name: "Ravi Sharma", phone: "+91 54321 09876", license: "DL03-2020-0045678", licenseExpiry: "2026-03-18", status: "ON_TRIP", truck: "DL03IJ7890", trips: 178, aadhaar: "XXXX-XXXX-5678", emergencyContact: "Anita Sharma", emergencyPhone: "+91 54321 00015", joinDate: "2020-02-14" },
  { id: "6", name: "Vikram Yadav", phone: "+91 43210 98765", license: "GJ05-2022-0023456", licenseExpiry: "2028-07-25", status: "AVAILABLE", truck: "GJ05KL2345", trips: 45, aadhaar: "XXXX-XXXX-6789", emergencyContact: "Rekha Yadav", emergencyPhone: "+91 43210 00016", joinDate: "2022-05-01" },
  { id: "7", name: "Deepak Meena", phone: "+91 32109 87654", license: "RJ07-2019-0078901", licenseExpiry: "2025-11-05", status: "AVAILABLE", truck: "RJ07MN6789", trips: 234, aadhaar: "XXXX-XXXX-7890", emergencyContact: "Sita Meena", emergencyPhone: "+91 32109 00017", joinDate: "2019-11-11" },
  { id: "8", name: "Santosh Kamble", phone: "+91 21098 76543", license: "MH14-2021-0056789", licenseExpiry: "2027-04-12", status: "OFF_DUTY", truck: "—", trips: 167, aadhaar: "XXXX-XXXX-8901", emergencyContact: "Pooja Kamble", emergencyPhone: "+91 21098 00018", joinDate: "2021-08-20" },
];

const statusColors: Record<string, "success" | "info" | "warning" | "secondary"> = {
  AVAILABLE: "success",
  ON_TRIP: "info",
  OFF_DUTY: "warning",
  INACTIVE: "secondary",
};

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState(initialDrivers);
  const [showForm, setShowForm] = useState(false);
  const [viewDriver, setViewDriver] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", license: "", licenseExpiry: "", aadhaar: "", emergencyContact: "", emergencyPhone: "" });

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.truck.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDriver = drivers.find((d) => d.id === viewDriver);

  const handleAddDriver = () => {
    if (!form.name || !form.phone) { alert("Name and phone are required"); return; }
    const newDriver = {
      id: String(drivers.length + 1),
      name: form.name,
      phone: form.phone,
      license: form.license || "—",
      licenseExpiry: form.licenseExpiry || "—",
      status: "AVAILABLE",
      truck: "—",
      trips: 0,
      aadhaar: form.aadhaar || "—",
      emergencyContact: form.emergencyContact || "—",
      emergencyPhone: form.emergencyPhone || "—",
      joinDate: new Date().toISOString().split("T")[0],
    };
    setDrivers([...drivers, newDriver]);
    setForm({ name: "", phone: "", license: "", licenseExpiry: "", aadhaar: "", emergencyContact: "", emergencyPhone: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground">Manage your driver workforce</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? "Cancel" : "Add Driver"}
        </Button>
      </div>

      {/* Add Driver Form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Add New Driver</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input placeholder="Driver full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number *</label>
                <Input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">License Number</label>
                <Input placeholder="MH12-2020-XXXXXXX" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">License Expiry</label>
                <Input type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Aadhaar Number</label>
                <Input placeholder="XXXX-XXXX-XXXX" value={form.aadhaar} onChange={(e) => setForm({ ...form, aadhaar: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Contact</label>
                <Input placeholder="Name" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Phone</label>
                <Input placeholder="+91 XXXXX XXXXX" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAddDriver}><Save className="mr-2 h-4 w-4" />Save Driver</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><UserCircle className="h-8 w-8 text-muted-foreground" /><div><p className="text-2xl font-bold">{drivers.length}</p><p className="text-xs text-muted-foreground">Total Drivers</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-green-500" /><div><p className="text-2xl font-bold">{drivers.filter(d => d.status === "AVAILABLE").length}</p><p className="text-xs text-muted-foreground">Available</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-blue-500" /><div><p className="text-2xl font-bold">{drivers.filter(d => d.status === "ON_TRIP").length}</p><p className="text-xs text-muted-foreground">On Trip</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-yellow-500" /><div><p className="text-2xl font-bold">{drivers.filter(d => d.status === "OFF_DUTY").length}</p><p className="text-xs text-muted-foreground">Off Duty</p></div></CardContent></Card>
      </div>

      {/* Driver Grid */}
      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search drivers..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((driver) => (
              <div key={driver.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{driver.name}</p>
                    <Badge variant={statusColors[driver.status]} className="mt-1">{driver.status.replace("_", " ")}</Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /><span>{driver.phone}</span></div>
                  <div className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5" /><span className="truncate">{driver.license}</span></div>
                  <div className="flex items-center gap-2"><Truck className="h-3.5 w-3.5" /><span>{driver.truck}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{driver.trips} trips completed</span>
                  <Button variant="ghost" size="sm" onClick={() => setViewDriver(driver.id)}><Eye className="h-4 w-4 mr-1" />View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Driver Detail Modal */}
      {viewDriver && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewDriver(null)} />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Driver Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setViewDriver(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center"><UserCircle className="h-8 w-8 text-primary" /></div>
                <div>
                  <p className="font-bold text-lg">{selectedDriver.name}</p>
                  <Badge variant={statusColors[selectedDriver.status]}>{selectedDriver.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedDriver.phone}</p></div>
                <div><p className="text-muted-foreground">Assigned Truck</p><p className="font-medium font-mono">{selectedDriver.truck}</p></div>
                <div><p className="text-muted-foreground">License Number</p><p className="font-medium">{selectedDriver.license}</p></div>
                <div>
                  <p className="text-muted-foreground">License Expiry</p>
                  <p className="font-medium flex items-center gap-1">
                    {selectedDriver.licenseExpiry}
                    {new Date(selectedDriver.licenseExpiry) < new Date(Date.now() + 90 * 86400000) && selectedDriver.licenseExpiry !== "—" && (
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                    )}
                  </p>
                </div>
                <div><p className="text-muted-foreground">Aadhaar</p><p className="font-medium">{selectedDriver.aadhaar}</p></div>
                <div><p className="text-muted-foreground">Trips Completed</p><p className="font-medium">{selectedDriver.trips}</p></div>
                <div><p className="text-muted-foreground">Join Date</p><p className="font-medium">{selectedDriver.joinDate}</p></div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs text-muted-foreground font-medium mb-2">EMERGENCY CONTACT</p>
                <p className="font-medium text-sm">{selectedDriver.emergencyContact}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Phone className="h-3 w-3" />{selectedDriver.emergencyPhone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
