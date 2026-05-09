"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Route,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  IndianRupee,
  Receipt,
  PiggyBank,
} from "lucide-react";

const stats = [
  {
    name: "Active Trips",
    value: "24",
    change: "+12%",
    icon: Route,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Completed Today",
    value: "8",
    change: "+5%",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "Delayed Trips",
    value: "3",
    change: "-2%",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  {
    name: "Available Trucks",
    value: "18",
    change: "+3",
    icon: Truck,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    name: "Drivers On Duty",
    value: "31",
    change: "85%",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    name: "GPS Offline",
    value: "2",
    change: "-1",
    icon: MapPin,
    color: "text-yellow-600",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    name: "Trucks Idle >12h",
    value: "5",
    change: "+1",
    icon: Clock,
    color: "text-gray-600",
    bg: "bg-gray-100 dark:bg-gray-900/30",
  },
  {
    name: "Revenue Today",
    value: "₹4.2L",
    change: "+18%",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
];

const recentTrips = [
  { id: "TRP-A1B2C3", client: "Tata Steel", truck: "MH12AB1234", driver: "Rajesh Kumar", status: "IN_TRANSIT", pickup: "Mumbai", drop: "Pune", eta: "2h 30m" },
  { id: "TRP-D4E5F6", client: "Reliance", truck: "MH04CD5678", driver: "Suresh Patil", status: "REACHED_PICKUP", pickup: "Delhi", drop: "Jaipur", eta: "5h 15m" },
  { id: "TRP-G7H8I9", client: "Infosys", truck: "KA01EF9012", driver: "Anil Singh", status: "COMPLETED", pickup: "Bangalore", drop: "Chennai", eta: "—" },
  { id: "TRP-J1K2L3", client: "Wipro", truck: "TN02GH3456", driver: "Mohan Das", status: "DELAYED", pickup: "Hyderabad", drop: "Vizag", eta: "8h 00m" },
  { id: "TRP-M4N5O6", client: "HCL Tech", truck: "DL03IJ7890", driver: "Ravi Sharma", status: "TRIP_STARTED", pickup: "Kolkata", drop: "Patna", eta: "4h 45m" },
];

const alerts = [
  { type: "critical", message: "Truck MH12AB1234 - Route deviation detected", time: "5 min ago" },
  { type: "warning", message: "Driver Mohan Das - Trip delayed by 2 hours", time: "15 min ago" },
  { type: "info", message: "Truck KA01EF9012 - Reached destination geo-fence", time: "30 min ago" },
  { type: "warning", message: "GPS offline - Truck DL03IJ7890", time: "1 hour ago" },
];

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" | "default" }> = {
    IN_TRANSIT: { label: "In Transit", variant: "info" },
    REACHED_PICKUP: { label: "At Pickup", variant: "warning" },
    COMPLETED: { label: "Completed", variant: "success" },
    DELAYED: { label: "Delayed", variant: "destructive" },
    TRIP_STARTED: { label: "Started", variant: "default" },
  };
  const item = map[status] || { label: status, variant: "default" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your transport operations</p>
      </div>

      {/* Financial MTD Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">MTD Billing Value</p>
                <p className="text-2xl font-bold mt-1">₹32.8L</p>
                <p className="text-xs text-green-600 mt-1">+14% vs last month</p>
              </div>
              <div className="h-11 w-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">MTD Expenses</p>
                <p className="text-2xl font-bold mt-1">₹18.4L</p>
                <p className="text-xs text-red-600 mt-1">+6% vs last month</p>
              </div>
              <div className="h-11 w-11 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">MTD Net Profit</p>
                <p className="text-2xl font-bold mt-1">₹14.4L</p>
                <p className="text-xs text-green-600 mt-1">+22% vs last month</p>
              </div>
              <div className="h-11 w-11 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change} from yesterday</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Trip ID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Route</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip) => (
                    <tr key={trip.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs">{trip.id}</td>
                      <td className="py-3 px-2">{trip.client}</td>
                      <td className="py-3 px-2 text-muted-foreground">{trip.pickup} → {trip.drop}</td>
                      <td className="py-3 px-2">{getStatusBadge(trip.status)}</td>
                      <td className="py-3 px-2">{trip.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                    alert.type === "critical" ? "bg-red-500" :
                    alert.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
