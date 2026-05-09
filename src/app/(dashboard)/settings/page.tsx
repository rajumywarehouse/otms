"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Shield,
  Bell,
  MapPin,
  Palette,
  Database,
  Globe,
  Save,
} from "lucide-react";

const settingsSections = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "users", label: "User Management", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "geofence", label: "Geofence Settings", icon: MapPin },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "data", label: "Data & Backup", icon: Database },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("organization");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "organization" && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Update your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input defaultValue="OTMS Logistics Pvt Ltd" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Code</label>
                    <Input defaultValue="OTMS-001" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="admin@otms.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input defaultValue="+91 22 1234 5678" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GST Number</label>
                    <Input defaultValue="27AABCT1234F1ZK" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">PAN Number</label>
                    <Input defaultValue="AABCT1234F" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input defaultValue="Mumbai, Maharashtra, India" />
                  </div>
                </div>
                <Button><Save className="mr-2 h-4 w-4" />Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "users" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users and their access</CardDescription>
                  </div>
                  <Button size="sm">Add User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "System Admin", email: "admin@otms.com", role: "SUPER_ADMIN", status: "active" },
                    { name: "Ramesh Dispatcher", email: "dispatch@otms.com", role: "DISPATCHER", status: "active" },
                    { name: "Rajesh Kumar", email: "rajesh.kumar@otms.com", role: "DRIVER", status: "active" },
                    { name: "Suresh Patil", email: "suresh.patil@otms.com", role: "DRIVER", status: "active" },
                    { name: "Priya Shah", email: "priya@otms.com", role: "ACCOUNTS", status: "active" },
                  ].map((user) => (
                    <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge variant="success">{user.status}</Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "roles" && (
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Configure role-based access control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { role: "SUPER_ADMIN", label: "Super Admin", perms: ["All Access"] },
                    { role: "TRANSPORTER_ADMIN", label: "Transporter Admin", perms: ["Manage trips", "Manage fleet", "View reports", "Manage users"] },
                    { role: "DISPATCHER", label: "Dispatcher", perms: ["Create trips", "Assign trucks", "Track vehicles", "Manage expenses"] },
                    { role: "DRIVER", label: "Driver", perms: ["View assigned trips", "Update status", "Upload documents", "Submit expenses"] },
                    { role: "CLIENT", label: "Client", perms: ["View own trips", "Track shipments", "Download documents"] },
                    { role: "ACCOUNTS", label: "Accounts", perms: ["Manage expenses", "Generate invoices", "View reports", "Approve payments"] },
                  ].map((role) => (
                    <div key={role.role} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-medium">{role.label}</span>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.perms.map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-xs">{perm}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Trip Status Changes", desc: "Notify when trip status is updated", channels: ["Push", "Email", "SMS"] },
                  { title: "GPS Alerts", desc: "Alert on GPS signal loss or geofence breach", channels: ["Push", "Email"] },
                  { title: "Expense Submissions", desc: "Notify when new expenses are submitted", channels: ["Push", "Email"] },
                  { title: "Document Uploads", desc: "Notify when POD/documents are uploaded", channels: ["Push"] },
                  { title: "Vehicle Maintenance", desc: "Alert before insurance/fitness expiry", channels: ["Push", "Email"] },
                  { title: "Delay Alerts", desc: "Notify on estimated delivery delays", channels: ["Push", "Email", "SMS"] },
                ].map((setting) => (
                  <div key={setting.title} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{setting.title}</p>
                      <p className="text-xs text-muted-foreground">{setting.desc}</p>
                    </div>
                    <div className="flex gap-1">
                      {setting.channels.map((ch) => (
                        <Badge key={ch} variant="secondary" className="text-xs">{ch}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <Button><Save className="mr-2 h-4 w-4" />Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "geofence" && (
            <Card>
              <CardHeader>
                <CardTitle>Geofence Settings</CardTitle>
                <CardDescription>Configure pickup/drop radius and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Pickup Radius (meters)</label>
                    <Input type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Drop Radius (meters)</label>
                    <Input type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Overspeed Limit (km/h)</label>
                    <Input type="number" defaultValue="80" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Idle Alert Threshold (minutes)</label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GPS Signal Loss Alert (minutes)</label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Route Deviation Tolerance (km)</label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
                <Button><Save className="mr-2 h-4 w-4" />Save Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Google Maps API", status: "connected", desc: "Maps, geocoding, and directions" },
                  { name: "AWS S3", status: "connected", desc: "Document and image storage" },
                  { name: "Redis", status: "connected", desc: "Caching and real-time data" },
                  { name: "SMS Gateway (Msg91)", status: "not-configured", desc: "SMS notifications to drivers" },
                  { name: "Email (SMTP)", status: "not-configured", desc: "Email notifications and reports" },
                  { name: "WhatsApp Business", status: "not-configured", desc: "WhatsApp notifications" },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={integration.status === "connected" ? "success" : "secondary"}>
                        {integration.status === "connected" ? "Connected" : "Not Configured"}
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Light</Button>
                    <Button variant="outline" size="sm">Dark</Button>
                    <Button variant="default" size="sm">System</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sidebar</label>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Expanded</Button>
                    <Button variant="outline" size="sm">Collapsed</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Format</label>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">DD/MM/YYYY</Button>
                    <Button variant="outline" size="sm">MM/DD/YYYY</Button>
                    <Button variant="outline" size="sm">YYYY-MM-DD</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "data" && (
            <Card>
              <CardHeader>
                <CardTitle>Data & Backup</CardTitle>
                <CardDescription>Manage your data and backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-sm">Database Backup</p>
                  <p className="text-xs text-muted-foreground mt-1">Last backup: 2024-03-15 02:00 AM</p>
                  <Button variant="outline" size="sm" className="mt-3">Run Backup Now</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-sm">Export Data</p>
                  <p className="text-xs text-muted-foreground mt-1">Export all data as CSV/Excel</p>
                  <Button variant="outline" size="sm" className="mt-3">Export All Data</Button>
                </div>
                <div className="p-4 border rounded-lg border-red-200 dark:border-red-900">
                  <p className="font-medium text-sm text-red-600">Danger Zone</p>
                  <p className="text-xs text-muted-foreground mt-1">Permanently delete all data. This action cannot be undone.</p>
                  <Button variant="destructive" size="sm" className="mt-3">Delete All Data</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
