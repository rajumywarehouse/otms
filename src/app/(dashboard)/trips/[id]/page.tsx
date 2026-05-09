"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Truck,
  User,
  Phone,
  Clock,
  Navigation,
  FileText,
  Receipt,
  Edit,
  Share2,
  Download,
} from "lucide-react";
import Link from "next/link";

const tripData = {
  id: "TRP-2024-001",
  status: "IN_TRANSIT",
  client: "Tata Steel",
  pickup: { address: "JNPT Port, Nhava Sheva", city: "Mumbai", contact: "Rahul Mehta", phone: "+91 98765 00001" },
  drop: { address: "Tata Steel Plant, Gamharia", city: "Jamshedpur", contact: "Sunil Das", phone: "+91 87654 00001", landmark: "Near Sakchi Market" },
  truck: { number: "MH12AB1234", type: "32 Feet", driver: "Rajesh Kumar", driverPhone: "+91 98765 43210", currentLat: 19.0522, currentLng: 73.1152 },
  load: { type: "Containerized", weight: "12 MT", units: "2", unitType: "20 Feet Containers", volume: "33 CBM" },
  cost: 45000,
  createdAt: "2024-03-15 09:30 AM",
  startedAt: "2024-03-15 11:00 AM",
  eta: "2024-03-16 05:00 PM",
  distance: "1,450 km",
  currentSpeed: "65 km/h",
  notes: "Handle with care. Do not stack. Delivery window: 9 AM - 6 PM.",
};

const timeline = [
  { time: "09:30 AM", date: "Mar 15", event: "Trip Created", desc: "Trip created by Dispatcher Ramesh", status: "completed" },
  { time: "09:45 AM", date: "Mar 15", event: "Truck Assigned", desc: "MH12AB1234 assigned, driver Rajesh Kumar notified", status: "completed" },
  { time: "10:00 AM", date: "Mar 15", event: "Driver Accepted", desc: "Rajesh Kumar accepted the trip", status: "completed" },
  { time: "10:30 AM", date: "Mar 15", event: "Enroute to Pickup", desc: "Driver started moving towards pickup location", status: "completed" },
  { time: "11:00 AM", date: "Mar 15", event: "Reached Pickup", desc: "Vehicle reached JNPT Port, Nhava Sheva", status: "completed" },
  { time: "11:45 AM", date: "Mar 15", event: "Loading Complete", desc: "2 containers loaded, LR generated", status: "completed" },
  { time: "12:00 PM", date: "Mar 15", event: "Trip Started", desc: "Vehicle departed from pickup", status: "completed" },
  { time: "—", date: "—", event: "In Transit", desc: "Currently on Mumbai-Pune Expressway, 65 km/h", status: "active" },
  { time: "—", date: "Mar 16", event: "Near Destination", desc: "Expected arrival", status: "pending" },
  { time: "—", date: "Mar 16", event: "Delivered", desc: "Pending completion", status: "pending" },
];

export default function TripDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/trips">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{tripData.id}</h1>
              <Badge variant="info">In Transit</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Created {tripData.createdAt}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            alert(`Downloading Trip Sheet for ${tripData.id}...\n\nTrip: ${tripData.id}\nClient: ${tripData.client}\nRoute: ${tripData.pickup.city} → ${tripData.drop.city}\nTruck: ${tripData.truck.number}\nDriver: ${tripData.truck.driver}\nCost: ₹${tripData.cost.toLocaleString()}\n\nIn production, this generates a PDF.`);
          }}><Download className="h-4 w-4 mr-2" />Trip Sheet</Button>
          <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" />Share</Button>
          <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" />Edit</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Route Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="w-0.5 flex-1 bg-muted my-1" />
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-xs font-medium text-green-600">PICKUP</p>
                    <p className="font-medium">{tripData.pickup.address}</p>
                    <p className="text-sm text-muted-foreground">{tripData.pickup.city}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tripData.pickup.contact} • {tripData.pickup.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-600">DROP</p>
                    <p className="font-medium">{tripData.drop.address}</p>
                    <p className="text-sm text-muted-foreground">{tripData.drop.city} • {tripData.drop.landmark}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tripData.drop.contact} • {tripData.drop.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm">
                <span className="flex items-center gap-1"><Navigation className="h-4 w-4 text-muted-foreground" />{tripData.distance}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-muted-foreground" />ETA: {tripData.eta}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-muted-foreground" />{tripData.currentSpeed}</span>
              </div>
            </CardContent>
          </Card>

          {/* Live Map - Current Truck Location */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Live Truck Location</CardTitle>
                <Badge variant="info" className="text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border h-48">
                <iframe
                  className="w-full h-full"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${tripData.truck.currentLng - 0.05},${tripData.truck.currentLat - 0.05},${tripData.truck.currentLng + 0.05},${tripData.truck.currentLat + 0.05}&layer=mapnik&marker=${tripData.truck.currentLat},${tripData.truck.currentLng}`}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>📍 Current: {tripData.truck.currentLat}, {tripData.truck.currentLng}</span>
                <a
                  href={`https://www.google.com/maps?q=${tripData.truck.currentLat},${tripData.truck.currentLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Load & Cost */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Load Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Load Type</span><span>{tripData.load.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Weight</span><span>{tripData.load.weight}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Units</span><span>{tripData.load.units} × {tripData.load.unitType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Volume</span><span>{tripData.load.volume}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Vehicle & Driver</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-mono font-semibold text-sm">{tripData.truck.number}</p>
                    <p className="text-xs text-muted-foreground">{tripData.truck.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tripData.truck.driver}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />{tripData.truck.driverPhone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents & Expenses */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Documents</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Invoice", "E-Way Bill", "LR Copy"].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Badge variant="success" className="text-xs">Uploaded</Badge>
                  </div>
                ))}
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">POD</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Pending</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Expenses</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { type: "Fuel", amount: 8500, status: "approved" },
                  { type: "Toll", amount: 1250, status: "approved" },
                  { type: "Food", amount: 350, status: "pending" },
                ].map((exp) => (
                  <div key={exp.type} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{exp.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">₹{exp.amount.toLocaleString()}</span>
                      <Badge variant={exp.status === "approved" ? "success" : "warning"} className="text-xs">{exp.status}</Badge>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">₹10,100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Timeline + Cost */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Trip Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{tripData.cost.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Client: {tripData.client}</p>
              {tripData.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{tripData.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Trip Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        event.status === "completed" ? "bg-green-500" :
                        event.status === "active" ? "bg-blue-500 animate-pulse" :
                        "bg-muted-foreground/30"
                      }`} />
                      {i < timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-1 ${
                          event.status === "completed" ? "bg-green-200 dark:bg-green-900" : "bg-muted"
                        }`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${event.status === "pending" ? "text-muted-foreground" : ""}`}>
                        {event.event}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.desc}</p>
                      <p className="text-xs text-muted-foreground">{event.time} • {event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
