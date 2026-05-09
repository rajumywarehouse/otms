"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Package,
  Save,
  Crosshair,
  Plus,
  Trash2,
  Upload,
  FileText,
  X,
  Image as ImageIcon,
  Search,
  Loader2,
} from "lucide-react";

interface DropLocation {
  id: string;
  address: string;
  city: string;
  landmark: string;
  contact: string;
  phone: string;
  lat: string;
  lng: string;
}

interface DocFile {
  id: string;
  name: string;
  type: string;
  size: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function CreateTripPage() {
  const router = useRouter();

  const [tripType, setTripType] = useState("oneway");
  const [clientId, setClientId] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [pickupContact, setPickupContact] = useState("");
  const [pickupPhone, setPickupPhone] = useState("");
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [pickupSearchQuery, setPickupSearchQuery] = useState("");
  const [pickupResults, setPickupResults] = useState<SearchResult[]>([]);
  const [pickupSearching, setPickupSearching] = useState(false);

  const [drops, setDrops] = useState<DropLocation[]>([
    { id: "d1", address: "", city: "", landmark: "", contact: "", phone: "", lat: "", lng: "" },
  ]);
  const [dropSearchQuery, setDropSearchQuery] = useState<Record<string, string>>({});
  const [dropResults, setDropResults] = useState<Record<string, SearchResult[]>>({});
  const [dropSearching, setDropSearching] = useState<string | null>(null);

  const [loadType, setLoadType] = useState("");
  const [truckType, setTruckType] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("MT");
  const [units, setUnits] = useState("");
  const [unitType, setUnitType] = useState("");
  const [volume, setVolume] = useState("");
  const [tripCost, setTripCost] = useState("");
  const [notes, setNotes] = useState("");
  const [docs, setDocs] = useState<DocFile[]>([]);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const addDrop = () =>
    setDrops((prev) => [...prev, { id: `d${Date.now()}`, address: "", city: "", landmark: "", contact: "", phone: "", lat: "", lng: "" }]);
  const removeDrop = (id: string) => setDrops((prev) => prev.filter((d) => d.id !== id));
  const updateDrop = (id: string, field: keyof DropLocation, value: string) =>
    setDrops((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));

  // Location search using Nominatim
  const searchLocation = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (query.length < 3) return [];
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", India")}&format=json&limit=5&addressdetails=1`);
      return await res.json();
    } catch { return []; }
  }, []);

  const handlePickupSearch = (query: string) => {
    setPickupSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length < 3) { setPickupResults([]); return; }
    setPickupSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchLocation(query);
      setPickupResults(results);
      setPickupSearching(false);
    }, 400);
  };

  const selectPickupResult = (result: SearchResult) => {
    const parts = result.display_name.split(", ");
    setPickupAddress(parts.slice(0, 3).join(", "));
    setPickupCity(parts.length > 3 ? parts[3] : parts[1] || "");
    setPickupLat(parseFloat(result.lat).toFixed(6));
    setPickupLng(parseFloat(result.lon).toFixed(6));
    setPickupSearchQuery("");
    setPickupResults([]);
  };

  const handleDropSearch = (dropId: string, query: string) => {
    setDropSearchQuery((prev) => ({ ...prev, [dropId]: query }));
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length < 3) { setDropResults((prev) => ({ ...prev, [dropId]: [] })); return; }
    setDropSearching(dropId);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchLocation(query);
      setDropResults((prev) => ({ ...prev, [dropId]: results }));
      setDropSearching(null);
    }, 400);
  };

  const selectDropResult = (dropId: string, result: SearchResult) => {
    const parts = result.display_name.split(", ");
    updateDrop(dropId, "address", parts.slice(0, 3).join(", "));
    updateDrop(dropId, "city", parts.length > 3 ? parts[3] : parts[1] || "");
    updateDrop(dropId, "lat", parseFloat(result.lat).toFixed(6));
    updateDrop(dropId, "lng", parseFloat(result.lon).toFixed(6));
    setDropSearchQuery((prev) => ({ ...prev, [dropId]: "" }));
    setDropResults((prev) => ({ ...prev, [dropId]: [] }));
  };

  const browserGeo = (setLat: (v: string) => void, setLng: (v: string) => void) => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)); },
      () => alert("Unable to get location"),
      { enableHighAccuracy: true }
    );
  };

  const handleFilePick = () => {
    const input = document.createElement("input");
    input.type = "file"; input.multiple = true; input.accept = "image/*,.pdf,.doc,.docx";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      const newDocs: DocFile[] = Array.from(files).map((f) => ({
        id: `f${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: f.name,
        type: f.type.startsWith("image/") ? "image" : "document",
        size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      }));
      setDocs((prev) => [...prev, ...newDocs]);
    };
    input.click();
  };

  const handleCreate = () => {
    if (!clientId) { alert("Please select a client"); return; }
    if (!pickupAddress) { alert("Pickup address is required"); return; }
    if (!drops[0].address) { alert("At least one drop address is required"); return; }
    alert("Trip created successfully!");
    router.push("/trips");
  };

  const SEL = "w-full h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-3 border-b -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-xl font-bold">Create New Trip</h1>
            <p className="text-xs text-muted-foreground">Fill details and submit</p>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 shadow-sm" onClick={handleCreate}>
          <Save className="mr-2 h-4 w-4" />Create Trip
        </Button>
      </div>

      {/* Client & Trip Type */}
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client *</label>
              <select className={SEL} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Select Client</option>
                <option value="1">Tata Steel</option>
                <option value="2">Reliance Industries</option>
                <option value="3">Infosys</option>
                <option value="4">Wipro</option>
                <option value="5">HCL Technologies</option>
                <option value="6">Mahindra Logistics</option>
                <option value="7">Adani Ports</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trip Type *</label>
              <select className={SEL} value={tripType} onChange={(e) => setTripType(e.target.value)}>
                <option value="oneway">One Way</option>
                <option value="roundtrip">Round Trip</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trip Cost (₹) *</label>
              <Input type="number" placeholder="Enter amount" value={tripCost} onChange={(e) => setTripCost(e.target.value)} className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Location */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 px-5 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center"><MapPin className="h-3 w-3 text-green-600" /></div>
            Pickup Location
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {pickupSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
            <Input
              placeholder="Search location (e.g. Mumbai, Andheri West)"
              className="pl-9 h-10"
              value={pickupSearchQuery}
              onChange={(e) => handlePickupSearch(e.target.value)}
            />
            {pickupResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {pickupResults.map((r, i) => (
                  <button key={i} className="w-full text-left px-3 py-2 text-sm hover:bg-muted/70 border-b last:border-0 flex items-start gap-2" onClick={() => selectPickupResult(r)}>
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-green-500 shrink-0" />
                    <span className="line-clamp-2">{r.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-muted-foreground">Address</label>
              <Input placeholder="Full address" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">City</label>
              <Input placeholder="City" value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="flex items-end">
              <Button variant="outline" size="sm" className="w-full h-9 text-xs" onClick={() => browserGeo(setPickupLat, setPickupLng)}>
                <Crosshair className="h-3 w-3 mr-1" />Use GPS
              </Button>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Contact</label>
              <Input placeholder="Name" value={pickupContact} onChange={(e) => setPickupContact(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Phone</label>
              <Input placeholder="+91 XXXXX" value={pickupPhone} onChange={(e) => setPickupPhone(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Lat</label>
              <Input placeholder="19.076" value={pickupLat} onChange={(e) => setPickupLat(e.target.value)} className="h-9 text-sm font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Lng</label>
              <Input placeholder="72.877" value={pickupLng} onChange={(e) => setPickupLng(e.target.value)} className="h-9 text-sm font-mono" />
            </div>
          </div>
          {pickupLat && pickupLng && (
            <div className="rounded-lg overflow-hidden border h-32">
              <iframe className="w-full h-full" style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(pickupLng) - 0.01},${parseFloat(pickupLat) - 0.01},${parseFloat(pickupLng) + 0.01},${parseFloat(pickupLat) + 0.01}&layer=mapnik&marker=${pickupLat},${pickupLng}`}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drop Locations */}
      {drops.map((drop, idx) => (
        <Card key={drop.id} className="shadow-sm">
          <CardHeader className="pb-2 px-5 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center"><MapPin className="h-3 w-3 text-red-600" /></div>
                {drops.length > 1 ? `Drop #${idx + 1}` : "Drop / Destination"}
              </CardTitle>
              {drops.length > 1 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-700" onClick={() => removeDrop(drop.id)}>
                  <Trash2 className="h-3 w-3 mr-1" />Remove
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {dropSearching === drop.id && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
              <Input
                placeholder="Search drop location..."
                className="pl-9 h-10"
                value={dropSearchQuery[drop.id] || ""}
                onChange={(e) => handleDropSearch(drop.id, e.target.value)}
              />
              {(dropResults[drop.id] || []).length > 0 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {dropResults[drop.id].map((r, i) => (
                    <button key={i} className="w-full text-left px-3 py-2 text-sm hover:bg-muted/70 border-b last:border-0 flex items-start gap-2" onClick={() => selectDropResult(drop.id, r)}>
                      <MapPin className="h-3.5 w-3.5 mt-0.5 text-red-500 shrink-0" />
                      <span className="line-clamp-2">{r.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-muted-foreground">Address</label>
                <Input placeholder="Full address" value={drop.address} onChange={(e) => updateDrop(drop.id, "address", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">City</label>
                <Input placeholder="City" value={drop.city} onChange={(e) => updateDrop(drop.id, "city", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Landmark</label>
                <Input placeholder="Near..." value={drop.landmark} onChange={(e) => updateDrop(drop.id, "landmark", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Contact</label>
                <Input placeholder="Name" value={drop.contact} onChange={(e) => updateDrop(drop.id, "contact", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Phone</label>
                <Input placeholder="+91 XXXXX" value={drop.phone} onChange={(e) => updateDrop(drop.id, "phone", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Lat</label>
                <Input placeholder="22.804" value={drop.lat} onChange={(e) => updateDrop(drop.id, "lat", e.target.value)} className="h-9 text-sm font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Lng</label>
                <Input placeholder="86.202" value={drop.lng} onChange={(e) => updateDrop(drop.id, "lng", e.target.value)} className="h-9 text-sm font-mono" />
              </div>
            </div>
            {drop.lat && drop.lng && (
              <div className="rounded-lg overflow-hidden border h-32">
                <iframe className="w-full h-full" style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(drop.lng) - 0.01},${parseFloat(drop.lat) - 0.01},${parseFloat(drop.lng) + 0.01},${parseFloat(drop.lat) + 0.01}&layer=mapnik&marker=${drop.lat},${drop.lng}`}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" className="w-full border-dashed h-10" onClick={addDrop}>
        <Plus className="h-4 w-4 mr-2" />Add Another Drop Location
      </Button>

      {/* Load & Cost */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 px-5 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center"><Package className="h-3 w-3 text-blue-600" /></div>
            Load & Shipment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Load Type *</label>
              <select className={SEL} value={loadType} onChange={(e) => setLoadType(e.target.value)}>
                <option value="">Select</option>
                <option value="containerized">Containerized</option>
                <option value="non-containerized">Non-Containerized</option>
                <option value="raw-material">Raw Material</option>
                <option value="finished-goods">Finished Goods</option>
                <option value="machinery">Machinery</option>
                <option value="chemicals">Chemicals</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Truck Type</label>
              <select className={SEL} value={truckType} onChange={(e) => setTruckType(e.target.value)}>
                <option value="">Select</option>
                <option value="trailer">Trailer</option>
                <option value="32-feet">32 Feet</option>
                <option value="20-feet">20 Feet</option>
                <option value="14-feet">14 Feet</option>
                <option value="taurus">Taurus</option>
                <option value="open-truck">Open Truck</option>
                <option value="container">Container</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Weight</label>
              <div className="flex gap-1">
                <Input type="number" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-9 text-sm flex-1" />
                <select className="h-9 w-16 rounded-md border border-input bg-background px-1 text-xs" value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                  <option value="MT">MT</option>
                  <option value="KG">KG</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Volume (CBM)</label>
              <Input type="number" placeholder="0" value={volume} onChange={(e) => setVolume(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Units</label>
              <div className="flex gap-1">
                <Input type="number" placeholder="0" value={units} onChange={(e) => setUnits(e.target.value)} className="h-9 text-sm flex-1" />
                <select className="h-9 w-20 rounded-md border border-input bg-background px-1 text-xs" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                  <option value="">Type</option>
                  <option value="boxes">Boxes</option>
                  <option value="pallets">Pallets</option>
                  <option value="bags">Bags</option>
                  <option value="pieces">Pcs</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs text-muted-foreground">Special Instructions</label>
              <Input placeholder="Handling notes, delivery windows, etc." value={notes} onChange={(e) => setNotes(e.target.value)} className="h-9 text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 px-5 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center"><FileText className="h-3 w-3 text-orange-600" /></div>
              Documents & Photos
            </CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleFilePick}><Upload className="h-3 w-3 mr-1" />Upload</Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {docs.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer hover:bg-muted/40 transition-colors" onClick={handleFilePick}>
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Click to upload (PDF, DOC, JPG, PNG)</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 px-2.5 py-1.5 border rounded-md bg-muted/30 text-xs">
                  {doc.type === "image" ? <ImageIcon className="h-3.5 w-3.5 text-blue-500" /> : <FileText className="h-3.5 w-3.5 text-orange-500" />}
                  <span className="max-w-[120px] truncate">{doc.name}</span>
                  <button onClick={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}><X className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button>
                </div>
              ))}
              <button className="flex items-center gap-1 px-2.5 py-1.5 border border-dashed rounded-md text-xs text-muted-foreground hover:bg-muted/40" onClick={handleFilePick}>
                <Plus className="h-3 w-3" />More
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Action */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button className="bg-green-600 hover:bg-green-700 shadow" size="lg" onClick={handleCreate}>
          <Save className="mr-2 h-4 w-4" />Create Trip
        </Button>
      </div>
    </div>
  );
}
