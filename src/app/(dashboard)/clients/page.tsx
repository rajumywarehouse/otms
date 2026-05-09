"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Building2,
  Phone,
  MapPin,
  Edit,
  Eye,
  X,
  Save,
  Navigation,
  Crosshair,
} from "lucide-react";

const initialClients = [
  { id: "1", name: "Tata Steel", address: "Jamshedpur, Jharkhand", city: "Jamshedpur", state: "Jharkhand", contact: "Rahul Mehta", phone: "+91 98765 00001", email: "logistics@tatasteel.com", gst: "27AAACT1234F1ZQ", trips: 45, revenue: 2250000, status: "active", lat: 22.8046, lng: 86.2029 },
  { id: "2", name: "Reliance Industries", address: "Navi Mumbai, Maharashtra", city: "Navi Mumbai", state: "Maharashtra", contact: "Priya Shah", phone: "+91 98765 00002", email: "transport@ril.com", gst: "27AABCR1234F1Z5", trips: 62, revenue: 4650000, status: "active", lat: 19.033, lng: 73.0297 },
  { id: "3", name: "Infosys", address: "Electronic City, Bangalore", city: "Bangalore", state: "Karnataka", contact: "Vijay Kumar", phone: "+91 98765 00003", email: "facilities@infosys.com", gst: "29AABCI1234F1ZP", trips: 28, revenue: 980000, status: "active", lat: 12.8399, lng: 77.6770 },
  { id: "4", name: "Wipro", address: "Sarjapur Road, Bangalore", city: "Bangalore", state: "Karnataka", contact: "Anita Desai", phone: "+91 98765 00004", email: "logistics@wipro.com", gst: "29AABCW1234F1Z7", trips: 34, revenue: 1520000, status: "active", lat: 12.9105, lng: 77.6830 },
  { id: "5", name: "HCL Technologies", address: "Sector 126, Noida", city: "Noida", state: "Uttar Pradesh", contact: "Amit Verma", phone: "+91 98765 00005", email: "transport@hcl.com", gst: "09AABCH1234F1ZX", trips: 19, revenue: 760000, status: "active", lat: 28.5447, lng: 77.3910 },
  { id: "6", name: "Mahindra Logistics", address: "Lower Parel, Mumbai", city: "Mumbai", state: "Maharashtra", contact: "Sanjay Gupta", phone: "+91 98765 00006", email: "ops@mahindralogistics.com", gst: "27AABCM5678F1Z2", trips: 56, revenue: 3920000, status: "active", lat: 18.9945, lng: 72.8310 },
  { id: "7", name: "Adani Ports", address: "Mundra, Gujarat", city: "Mundra", state: "Gujarat", contact: "Kiran Patel", phone: "+91 98765 00007", email: "logistics@adani.com", gst: "24AABCA1234F1Z8", trips: 41, revenue: 5740000, status: "active", lat: 22.8394, lng: 69.7251 },
  { id: "8", name: "JSW Steel", address: "Bellary, Karnataka", city: "Bellary", state: "Karnataka", contact: "Deepak Joshi", phone: "+91 98765 00008", email: "transport@jsw.in", gst: "29AABCJ1234F1Z3", trips: 23, revenue: 1840000, status: "inactive", lat: 15.1394, lng: 76.9214 },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [viewClient, setViewClient] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", contact: "", phone: "", email: "", gst: "", city: "", state: "", address: "", lat: "", lng: "",
  });

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gst.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClient = clients.find((c) => c.id === viewClient);

  const handleGetLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation is not supported by your browser"); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      () => { alert("Unable to get location. Please enter coordinates manually."); setGeoLoading(false); },
      { enableHighAccuracy: true }
    );
  };

  const handleSearchAddress = async () => {
    if (!form.address && !form.city) { alert("Please enter an address or city first"); return; }
    setGeoLoading(true);
    try {
      const query = encodeURIComponent(`${form.address}, ${form.city}, ${form.state}, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        setForm((prev) => ({ ...prev, lat: parseFloat(data[0].lat).toFixed(6), lng: parseFloat(data[0].lon).toFixed(6) }));
      } else {
        alert("Could not find coordinates for this address. Try being more specific.");
      }
    } catch { alert("Geocoding failed. Please enter coordinates manually."); }
    setGeoLoading(false);
  };

  const handleSaveClient = () => {
    if (!form.name || !form.phone) { alert("Client name and phone are required"); return; }
    const newClient = {
      id: String(clients.length + 1),
      name: form.name,
      contact: form.contact,
      phone: form.phone,
      email: form.email,
      gst: form.gst,
      city: form.city,
      state: form.state,
      address: `${form.address}${form.city ? ", " + form.city : ""}${form.state ? ", " + form.state : ""}`,
      trips: 0,
      revenue: 0,
      status: "active",
      lat: form.lat ? parseFloat(form.lat) : 0,
      lng: form.lng ? parseFloat(form.lng) : 0,
    };
    setClients([...clients, newClient]);
    setForm({ name: "", contact: "", phone: "", email: "", gst: "", city: "", state: "", address: "", lat: "", lng: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? "Cancel" : "Add Client"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">New Client</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Name *</label>
                <Input placeholder="Enter company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Person *</label>
                <Input placeholder="Contact name" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone *</label>
                <Input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="email@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GST Number</label>
                <Input placeholder="22AAAAA0000A1Z5" value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <Input placeholder="Full address of client premises" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>

            {/* Geo Location Section */}
            <div className="mt-4 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Premises Geo Location</p>
                <span className="text-xs text-muted-foreground">(Auto-shown to driver during trip)</span>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Latitude</label>
                  <Input placeholder="e.g. 19.0760" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Longitude</label>
                  <Input placeholder="e.g. 72.8777" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" onClick={handleGetLocation} disabled={geoLoading} className="w-full">
                    <Crosshair className="h-4 w-4 mr-1" />
                    {geoLoading ? "Getting..." : "Use My Location"}
                  </Button>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" onClick={handleSearchAddress} disabled={geoLoading} className="w-full">
                    <MapPin className="h-4 w-4 mr-1" />
                    {geoLoading ? "Searching..." : "Lookup from Address"}
                  </Button>
                </div>
              </div>
              {form.lat && form.lng && (
                <div className="mt-3 rounded-lg overflow-hidden border h-40">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(form.lng) - 0.01},${parseFloat(form.lat) - 0.01},${parseFloat(form.lng) + 0.01},${parseFloat(form.lat) + 0.01}&layer=mapnik&marker=${form.lat},${form.lng}`}
                    style={{ border: 0 }}
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={handleSaveClient}><Save className="mr-2 h-4 w-4" />Save Client</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search clients..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Badge variant="secondary">{filtered.length} clients</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-3 font-medium">Client</th>
                  <th className="text-left py-3 px-3 font-medium">Contact</th>
                  <th className="text-left py-3 px-3 font-medium">GST</th>
                  <th className="text-left py-3 px-3 font-medium">Trips</th>
                  <th className="text-left py-3 px-3 font-medium">Revenue</th>
                  <th className="text-left py-3 px-3 font-medium">Location</th>
                  <th className="text-left py-3 px-3 font-medium">Status</th>
                  <th className="text-left py-3 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="h-4 w-4 text-primary" /></div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{client.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium">{client.contact}</p>
                      <p className="text-xs text-muted-foreground">{client.phone}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs">{client.gst}</td>
                    <td className="py-3 px-3 font-semibold">{client.trips}</td>
                    <td className="py-3 px-3">₹{(client.revenue / 100000).toFixed(1)}L</td>
                    <td className="py-3 px-3">
                      {client.lat ? (
                        <a
                          href={`https://www.google.com/maps?q=${client.lat},${client.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Navigation className="h-3 w-3" />
                          {client.lat.toFixed(4)}, {client.lng.toFixed(4)}
                        </a>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={client.status === "active" ? "success" : "secondary"}>{client.status}</Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewClient(client.id)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Client Modal */}
      {viewClient && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewClient(null)} />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedClient.name}</h2>
              <Button variant="ghost" size="icon" onClick={() => setViewClient(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="h-6 w-6 text-primary" /></div>
                <div>
                  <p className="font-bold text-lg">{selectedClient.name}</p>
                  <Badge variant={selectedClient.status === "active" ? "success" : "secondary"}>{selectedClient.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Contact Person</p><p className="font-medium">{selectedClient.contact}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedClient.phone}</p></div>
                <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selectedClient.email}</p></div>
                <div><p className="text-muted-foreground">GST Number</p><p className="font-medium font-mono">{selectedClient.gst}</p></div>
                <div><p className="text-muted-foreground">Total Trips</p><p className="font-medium">{selectedClient.trips}</p></div>
                <div><p className="text-muted-foreground">Total Revenue</p><p className="font-medium">₹{(selectedClient.revenue / 100000).toFixed(1)}L</p></div>
              </div>
              <div><p className="text-muted-foreground text-sm">Address</p><p className="font-medium text-sm">{selectedClient.address}</p></div>
              {selectedClient.lat !== 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Premises Location</p>
                  <div className="rounded-lg overflow-hidden border h-48">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedClient.lng - 0.01},${selectedClient.lat - 0.01},${selectedClient.lng + 0.01},${selectedClient.lat + 0.01}&layer=mapnik&marker=${selectedClient.lat},${selectedClient.lng}`}
                      style={{ border: 0 }}
                    />
                  </div>
                  <a href={`https://www.google.com/maps?q=${selectedClient.lat},${selectedClient.lng}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full"><Navigation className="h-4 w-4 mr-1" />Open in Google Maps</Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
