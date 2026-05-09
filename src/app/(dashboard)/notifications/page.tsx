"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  Truck,
  MapPin,
  Clock,
  XCircle,
  CheckCircle,
  Filter,
} from "lucide-react";

const notifications = [
  { id: "1", type: "ALERT", title: "GPS Signal Lost", message: "Vehicle TN02GH3456 has lost GPS signal for 45 minutes near Warangal.", time: "5 min ago", read: false, tripId: "TRP-2024-004" },
  { id: "2", type: "TRIP_UPDATE", title: "Trip Started", message: "Trip TRP-2024-005 has started. Driver Ravi Sharma is enroute from Kolkata.", time: "15 min ago", read: false, tripId: "TRP-2024-005" },
  { id: "3", type: "DELAY", title: "Estimated Delay", message: "Trip TRP-2024-004 is delayed by approximately 2 hours due to traffic congestion.", time: "30 min ago", read: false, tripId: "TRP-2024-004" },
  { id: "4", type: "GEOFENCE", title: "Geofence Alert", message: "Vehicle MH12AB1234 has entered the destination geofence zone (Pune).", time: "1 hour ago", read: true, tripId: "TRP-2024-001" },
  { id: "5", type: "EXPENSE", title: "Expense Submitted", message: "Driver Suresh Patil has submitted ₹12,450 in expenses for approval.", time: "2 hours ago", read: true, tripId: "TRP-2024-002" },
  { id: "6", type: "TRIP_UPDATE", title: "Trip Completed", message: "Trip TRP-2024-003 has been delivered and marked as complete by driver Anil Singh.", time: "3 hours ago", read: true, tripId: "TRP-2024-003" },
  { id: "7", type: "DOCUMENT", title: "POD Uploaded", message: "Proof of Delivery has been uploaded for Trip TRP-2024-003.", time: "3 hours ago", read: true, tripId: "TRP-2024-003" },
  { id: "8", type: "MAINTENANCE", title: "Insurance Expiring", message: "Vehicle MH14OP0123 insurance expires in 7 days. Please renew.", time: "5 hours ago", read: true, tripId: null },
  { id: "9", type: "ALERT", title: "Overspeed Alert", message: "Vehicle DL03IJ7890 exceeded 80 km/h speed limit on NH-19.", time: "6 hours ago", read: true, tripId: "TRP-2024-005" },
  { id: "10", type: "SYSTEM", title: "Daily Report Generated", message: "Yesterday's trip summary report is ready for download.", time: "8 hours ago", read: true, tripId: null },
];

const typeConfig: Record<string, { icon: any; color: string }> = {
  ALERT: { icon: AlertTriangle, color: "text-red-500" },
  TRIP_UPDATE: { icon: Truck, color: "text-blue-500" },
  DELAY: { icon: Clock, color: "text-orange-500" },
  GEOFENCE: { icon: MapPin, color: "text-purple-500" },
  EXPENSE: { icon: Info, color: "text-green-500" },
  DOCUMENT: { icon: CheckCircle, color: "text-teal-500" },
  MAINTENANCE: { icon: AlertTriangle, color: "text-yellow-500" },
  SYSTEM: { icon: Bell, color: "text-gray-500" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "alerts") return n.type === "ALERT" || n.type === "DELAY";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "alerts", label: "Alerts" },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={filter === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Notification List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((notification) => {
              const config = typeConfig[notification.type] || typeConfig.SYSTEM;
              const Icon = config.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    !notification.read ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {notification.tripId && (
                        <Badge variant="secondary" className="text-xs">{notification.tripId}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
