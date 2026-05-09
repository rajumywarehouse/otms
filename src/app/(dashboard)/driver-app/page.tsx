"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Smartphone,
  MapPin,
  Navigation,
  Camera,
  CheckCircle,
  Clock,
  Truck,
  Phone,
  AlertTriangle,
  FileText,
  IndianRupee,
  ArrowRight,
  User,
  Fuel,
  X,
  Send,
} from "lucide-react";

// Simulated driver's current trip
const currentTrip = {
  id: "TRP-2024-001",
  client: "Tata Steel",
  clientContact: "Rahul Mehta",
  clientPhone: "+91 98765 00001",
  status: "IN_TRANSIT",
  pickup: { address: "Warehouse 3, Thane West, Mumbai", city: "Mumbai", lat: 19.2183, lng: 72.9781 },
  drop: { address: "Tata Steel Plant Gate 2, Jamshedpur", city: "Jamshedpur", lat: 22.8046, lng: 86.2029, landmark: "Near Gate 2, Main Road" },
  truck: "MH12AB1234",
  loadType: "Steel Coils",
  weight: "12 Tons",
  tripCost: 45000,
  notes: "Handle with care. Report to security gate first.",
  timeline: [
    { status: "CREATED", time: "Mar 15, 09:00 AM", done: true },
    { status: "ASSIGNED", time: "Mar 15, 09:30 AM", done: true },
    { status: "ACCEPTED", time: "Mar 15, 09:35 AM", done: true },
    { status: "ENROUTE PICKUP", time: "Mar 15, 10:00 AM", done: true },
    { status: "AT PICKUP", time: "Mar 15, 11:30 AM", done: true },
    { status: "TRIP STARTED", time: "Mar 15, 12:15 PM", done: true },
    { status: "IN TRANSIT", time: "Mar 15, 12:20 PM", done: true },
    { status: "NEAR DROP", time: "", done: false },
    { status: "AT DROP", time: "", done: false },
    { status: "COMPLETED", time: "", done: false },
  ],
};

const pendingTrips = [
  { id: "TRP-2024-009", client: "Reliance Industries", pickup: "Delhi", drop: "Jaipur", cost: 35000, status: "ASSIGNED" },
];

const expenses = [
  { id: "1", type: "Diesel", amount: 5200, date: "Mar 15", status: "APPROVED" },
  { id: "2", type: "Toll", amount: 1450, date: "Mar 15", status: "APPROVED" },
  { id: "3", type: "Food", amount: 350, date: "Mar 15", status: "PENDING" },
];

const statusSteps = ["ASSIGNED", "ENROUTE_PICKUP", "REACHED_PICKUP", "TRIP_STARTED", "IN_TRANSIT", "NEAR_DESTINATION", "REACHED_DESTINATION", "COMPLETED"];

export default function DriverAppPage() {
  const [activeTab, setActiveTab] = useState<"trip" | "pending" | "expenses" | "documents">("trip");
  const [tripStatus, setTripStatus] = useState("IN_TRANSIT");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ type: "Diesel", amount: "", remarks: "" });
  const [showDocUpload, setShowDocUpload] = useState(false);

  const currentStepIndex = statusSteps.indexOf(tripStatus);

  const nextStatus = currentStepIndex < statusSteps.length - 1 ? statusSteps[currentStepIndex + 1] : null;
  const nextStatusLabel: Record<string, string> = {
    ENROUTE_PICKUP: "Start Heading to Pickup",
    REACHED_PICKUP: "Arrived at Pickup",
    TRIP_STARTED: "Start Trip (Loading Done)",
    IN_TRANSIT: "On the Way",
    NEAR_DESTINATION: "Near Destination",
    REACHED_DESTINATION: "Arrived at Drop",
    COMPLETED: "Mark Trip Complete",
  };

  const handleUpdateStatus = () => {
    if (nextStatus) {
      setTripStatus(nextStatus);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver App</h1>
          <p className="text-muted-foreground">Mobile driver interface simulation</p>
        </div>
        <Badge variant="info" className="flex items-center gap-1">
          <Smartphone className="h-3 w-3" /> Driver View
        </Badge>
      </div>

      {/* Mobile Frame */}
      <div className="max-w-md mx-auto">
        <div className="border-4 border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl bg-background">
          {/* Status Bar */}
          <div className="bg-gray-800 text-white px-6 py-2 flex justify-between text-xs">
            <span>OTMS Driver</span>
            <span>Rajesh Kumar</span>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b bg-muted/30">
            {(["trip", "pending", "expenses", "documents"] as const).map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "trip" ? "Current" : tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="h-[600px] overflow-y-auto">

            {/* Current Trip Tab */}
            {activeTab === "trip" && (
              <div className="p-4 space-y-4">
                {/* Trip Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-bold text-sm">{currentTrip.id}</p>
                    <p className="text-xs text-muted-foreground">{currentTrip.client}</p>
                  </div>
                  <Badge variant="info">{tripStatus.replace(/_/g, " ")}</Badge>
                </div>

                {/* Route Card */}
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <div className="w-0.5 h-8 bg-gray-300" />
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-green-600">PICKUP</p>
                          <p className="text-sm font-medium">{currentTrip.pickup.city}</p>
                          <p className="text-xs text-muted-foreground">{currentTrip.pickup.address}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-red-600">DROP</p>
                          <p className="text-sm font-medium">{currentTrip.drop.city}</p>
                          <p className="text-xs text-muted-foreground">{currentTrip.drop.address}</p>
                          {currentTrip.drop.landmark && (
                            <p className="text-xs text-blue-600 mt-0.5">Landmark: {currentTrip.drop.landmark}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/${currentTrip.pickup.lat},${currentTrip.pickup.lng}/${currentTrip.drop.lat},${currentTrip.drop.lng}`}
                        target="_blank" rel="noopener noreferrer" className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Navigation className="h-3 w-3 mr-1" />Navigate
                        </Button>
                      </a>
                      <a href={`tel:${currentTrip.clientPhone}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Phone className="h-3 w-3 mr-1" />Call Client
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Load Info */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <Truck className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-xs mt-1 font-medium">{currentTrip.truck}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <FileText className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-xs mt-1 font-medium">{currentTrip.loadType}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <IndianRupee className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-xs mt-1 font-medium">₹{currentTrip.tripCost.toLocaleString()}</p>
                  </div>
                </div>

                {currentTrip.notes && (
                  <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-yellow-500" /><strong>Note:</strong> {currentTrip.notes}</p>
                  </div>
                )}

                {/* Status Update Button */}
                {nextStatus && tripStatus !== "COMPLETED" && (
                  <Button className="w-full" size="lg" onClick={handleUpdateStatus}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {nextStatusLabel[nextStatus] || nextStatus}
                  </Button>
                )}
                {tripStatus === "COMPLETED" && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700 dark:text-green-400">Trip Completed!</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">TRIP TIMELINE</p>
                  {currentTrip.timeline.map((step, i) => {
                    const isActive = statusSteps[i] === tripStatus || (i < statusSteps.indexOf(tripStatus) + 1);
                    return (
                      <div key={i} className="flex items-center gap-2 py-1">
                        <div className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={`text-xs flex-1 ${isActive ? "font-medium" : "text-muted-foreground"}`}>{step.status}</span>
                        <span className="text-xs text-muted-foreground">{step.time || "—"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pending Trips Tab */}
            {activeTab === "pending" && (
              <div className="p-4 space-y-3">
                <p className="text-sm font-medium">Pending Trips</p>
                {pendingTrips.length > 0 ? pendingTrips.map((trip) => (
                  <Card key={trip.id}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono font-bold text-sm">{trip.id}</p>
                          <p className="text-xs text-muted-foreground">{trip.client}</p>
                        </div>
                        <Badge variant="default">{trip.status}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />{trip.pickup} <ArrowRight className="h-3 w-3" /> {trip.drop}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 text-xs" onClick={() => { setActiveTab("trip"); }}>
                          <CheckCircle className="h-3 w-3 mr-1" />Accept
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1 text-xs">
                          <X className="h-3 w-3 mr-1" />Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No pending trips</p>
                  </div>
                )}
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === "expenses" && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Trip Expenses</p>
                  <Button size="sm" variant="outline" onClick={() => setShowExpenseForm(!showExpenseForm)}>
                    {showExpenseForm ? <X className="h-3 w-3 mr-1" /> : <IndianRupee className="h-3 w-3 mr-1" />}
                    {showExpenseForm ? "Cancel" : "Add"}
                  </Button>
                </div>

                {showExpenseForm && (
                  <Card>
                    <CardContent className="p-3 space-y-2">
                      <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}>
                        <option value="Diesel">Diesel</option>
                        <option value="Toll">Toll</option>
                        <option value="Food">Food</option>
                        <option value="Repair">Repair</option>
                        <option value="Parking">Parking</option>
                        <option value="Other">Other</option>
                      </select>
                      <Input placeholder="Amount (₹)" type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
                      <Input placeholder="Remarks" value={expenseForm.remarks} onChange={(e) => setExpenseForm({ ...expenseForm, remarks: e.target.value })} />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs"><Camera className="h-3 w-3 mr-1" />Photo</Button>
                        <Button size="sm" className="flex-1 text-xs" onClick={() => { setShowExpenseForm(false); setExpenseForm({ type: "Diesel", amount: "", remarks: "" }); }}>
                          <Send className="h-3 w-3 mr-1" />Submit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {expenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        {exp.type === "Diesel" ? <Fuel className="h-4 w-4" /> : <IndianRupee className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{exp.type}</p>
                        <p className="text-xs text-muted-foreground">{exp.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{exp.amount.toLocaleString()}</p>
                      <Badge variant={exp.status === "APPROVED" ? "success" : "warning"} className="text-[10px]">{exp.status}</Badge>
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Total Expenses</p>
                  <p className="text-lg font-bold">₹{expenses.reduce((a, e) => a + e.amount, 0).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Trip Documents</p>
                  <Button size="sm" variant="outline" onClick={() => setShowDocUpload(!showDocUpload)}>
                    {showDocUpload ? <X className="h-3 w-3 mr-1" /> : <Camera className="h-3 w-3 mr-1" />}
                    {showDocUpload ? "Cancel" : "Upload"}
                  </Button>
                </div>

                {showDocUpload && (
                  <Card>
                    <CardContent className="p-3 space-y-2">
                      <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                        <option>Consignment Note (LR)</option>
                        <option>Bill / Invoice</option>
                        <option>Weighbridge Slip</option>
                        <option>Delivery Challan</option>
                        <option>POD (Proof of Delivery)</option>
                        <option>Damage Photo</option>
                        <option>Other</option>
                      </select>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50">
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">Tap to capture or upload</p>
                      </div>
                      <Button size="sm" className="w-full" onClick={() => setShowDocUpload(false)}>
                        <Send className="h-3 w-3 mr-1" />Upload Document
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {[
                  { name: "Consignment Note", type: "LR", uploaded: "Mar 15, 12:10 PM" },
                  { name: "Weighbridge Slip", type: "WB", uploaded: "Mar 15, 12:05 PM" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.uploaded}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px]">Uploaded</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="bg-gray-800 text-white px-6 py-2 flex justify-between text-xs">
            <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> GPS Active</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
