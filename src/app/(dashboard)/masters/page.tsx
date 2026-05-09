"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Truck,
  Package,
  Fuel,
  Ruler,
  Save,
  X,
} from "lucide-react";

type MasterCategory = "truckTypes" | "loadTypes" | "expenseTypes" | "unitTypes";

const masterData: Record<MasterCategory, { id: string; name: string; description?: string; isActive: boolean }[]> = {
  truckTypes: [
    { id: "1", name: "Trailer", description: "Heavy-duty trailer truck", isActive: true },
    { id: "2", name: "32 Feet", description: "32 feet closed body", isActive: true },
    { id: "3", name: "20 Feet", description: "20 feet closed body", isActive: true },
    { id: "4", name: "14 Feet", description: "14 feet closed body", isActive: true },
    { id: "5", name: "Taurus", description: "Multi-axle truck", isActive: true },
    { id: "6", name: "Open Truck", description: "Open body truck", isActive: true },
    { id: "7", name: "Containerized Truck", description: "Container carrier", isActive: true },
    { id: "8", name: "Tanker", description: "Liquid carrier tanker", isActive: false },
  ],
  loadTypes: [
    { id: "1", name: "Containerized", description: "Goods in containers", isActive: true },
    { id: "2", name: "Non-Containerized", description: "Loose goods", isActive: true },
    { id: "3", name: "Raw Material", description: "Industrial raw materials", isActive: true },
    { id: "4", name: "Finished Goods", description: "Manufactured products", isActive: true },
    { id: "5", name: "Machinery", description: "Heavy machinery/equipment", isActive: true },
    { id: "6", name: "Chemicals", description: "Chemical substances (hazmat)", isActive: true },
    { id: "7", name: "Perishables", description: "Temperature-sensitive goods", isActive: true },
    { id: "8", name: "Electronics", description: "Electronic items", isActive: true },
  ],
  expenseTypes: [
    { id: "1", name: "Fuel", description: "Diesel/Petrol", isActive: true },
    { id: "2", name: "Toll", description: "Highway toll charges", isActive: true },
    { id: "3", name: "Food", description: "Driver food & refreshments", isActive: true },
    { id: "4", name: "Rental", description: "Crane/equipment rental", isActive: true },
    { id: "5", name: "Repair", description: "Vehicle repairs", isActive: true },
    { id: "6", name: "Parking", description: "Parking charges", isActive: true },
    { id: "7", name: "Loading/Unloading", description: "Labour charges", isActive: true },
    { id: "8", name: "Miscellaneous", description: "Other expenses", isActive: true },
  ],
  unitTypes: [
    { id: "1", name: "20 Feet", description: "20-feet container", isActive: true },
    { id: "2", name: "40 Feet", description: "40-feet container", isActive: true },
    { id: "3", name: "Boxes", description: "Standard boxes", isActive: true },
    { id: "4", name: "Pieces", description: "Individual pieces", isActive: true },
    { id: "5", name: "Bags", description: "Bags/sacks", isActive: true },
    { id: "6", name: "Pallets", description: "Standard pallets", isActive: true },
    { id: "7", name: "Drums", description: "Barrels/drums", isActive: true },
    { id: "8", name: "Rolls", description: "Paper/fabric rolls", isActive: true },
  ],
};

const categories: { id: MasterCategory; label: string; icon: any }[] = [
  { id: "truckTypes", label: "Truck Types", icon: Truck },
  { id: "loadTypes", label: "Load Types", icon: Package },
  { id: "expenseTypes", label: "Expense Types", icon: Fuel },
  { id: "unitTypes", label: "Unit Types", icon: Ruler },
];

export default function MastersPage() {
  const [activeCategory, setActiveCategory] = useState<MasterCategory>("truckTypes");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const items = masterData[activeCategory];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Data</h1>
          <p className="text-muted-foreground">Manage system-wide master configurations</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              onClick={() => { setActiveCategory(cat.id); setShowAddForm(false); }}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {cat.label}
              <Badge variant="secondary" className="ml-1">{masterData[cat.id].length}</Badge>
            </Button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{categories.find(c => c.id === activeCategory)?.label}</CardTitle>
              <CardDescription>Manage {categories.find(c => c.id === activeCategory)?.label.toLowerCase()} used across the system</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {showAddForm ? "Cancel" : "Add New"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="flex items-end gap-4 p-4 mb-4 bg-muted/50 rounded-lg">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input placeholder="Enter name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Short description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
              <Button className="shrink-0">
                <Save className="h-4 w-4 mr-2" />Save
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.isActive ? "success" : "secondary"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
