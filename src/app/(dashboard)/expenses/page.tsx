"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Fuel,
  Utensils,
  Wrench,
  Car,
  CircleDot,
} from "lucide-react";

interface Expense {
  id: string;
  tripId: string;
  type: string;
  amount: number;
  driver: string;
  truck: string;
  date: string;
  status: string;
  receipt: boolean;
  remarks: string;
}

const initialExpenses: Expense[] = [
  { id: "1", tripId: "TRP-2024-001", type: "Fuel", amount: 8500, driver: "Rajesh Kumar", truck: "MH12AB1234", date: "2024-03-15", status: "APPROVED", receipt: true, remarks: "Diesel fill at HP Pump, Pune" },
  { id: "2", tripId: "TRP-2024-001", type: "Toll", amount: 1250, driver: "Rajesh Kumar", truck: "MH12AB1234", date: "2024-03-15", status: "APPROVED", receipt: true, remarks: "Mumbai-Pune Expressway toll" },
  { id: "3", tripId: "TRP-2024-001", type: "Food", amount: 350, driver: "Rajesh Kumar", truck: "MH12AB1234", date: "2024-03-15", status: "APPROVED", receipt: false, remarks: "Lunch" },
  { id: "4", tripId: "TRP-2024-002", type: "Fuel", amount: 12000, driver: "Suresh Patil", truck: "MH04CD5678", date: "2024-03-15", status: "PENDING", receipt: true, remarks: "Delhi to Jaipur fuel" },
  { id: "5", tripId: "TRP-2024-002", type: "Toll", amount: 1800, driver: "Suresh Patil", truck: "MH04CD5678", date: "2024-03-15", status: "PENDING", receipt: true, remarks: "NH-48 toll" },
  { id: "6", tripId: "TRP-2024-002", type: "Food", amount: 450, driver: "Suresh Patil", truck: "MH04CD5678", date: "2024-03-15", status: "PENDING", receipt: false, remarks: "Lunch at dhaba" },
  { id: "7", tripId: "TRP-2024-003", type: "Fuel", amount: 6200, driver: "Anil Singh", truck: "KA01EF9012", date: "2024-03-14", status: "APPROVED", receipt: true, remarks: "Fuel on route" },
  { id: "8", tripId: "TRP-2024-003", type: "Repair", amount: 3500, driver: "Anil Singh", truck: "KA01EF9012", date: "2024-03-14", status: "APPROVED", receipt: true, remarks: "Tire puncture repair" },
  { id: "9", tripId: "TRP-2024-004", type: "Toll", amount: 2100, driver: "Mohan Das", truck: "TN02GH3456", date: "2024-03-14", status: "REJECTED", receipt: true, remarks: "Duplicate entry - already claimed" },
  { id: "10", tripId: "TRP-2024-005", type: "Fuel", amount: 9800, driver: "Ravi Sharma", truck: "DL03IJ7890", date: "2024-03-14", status: "PENDING", receipt: true, remarks: "IOC Fuel station, NH" },
  { id: "11", tripId: "TRP-2024-005", type: "Parking", amount: 200, driver: "Ravi Sharma", truck: "DL03IJ7890", date: "2024-03-14", status: "PENDING", receipt: false, remarks: "Overnight parking" },
  { id: "12", tripId: "TRP-2024-005", type: "Food", amount: 380, driver: "Ravi Sharma", truck: "DL03IJ7890", date: "2024-03-14", status: "PENDING", receipt: false, remarks: "Dinner" },
  { id: "13", tripId: "TRP-2024-006", type: "Fuel", amount: 15000, driver: "Deepak Meena", truck: "RJ07MN6789", date: "2024-03-13", status: "APPROVED", receipt: true, remarks: "Full tank for long haul" },
  { id: "14", tripId: "TRP-2024-006", type: "Toll", amount: 3200, driver: "Deepak Meena", truck: "RJ07MN6789", date: "2024-03-13", status: "APPROVED", receipt: true, remarks: "Multi-toll charges" },
  { id: "15", tripId: "TRP-2024-006", type: "Food", amount: 600, driver: "Deepak Meena", truck: "RJ07MN6789", date: "2024-03-13", status: "APPROVED", receipt: false, remarks: "Meals on route" },
];

const typeIcons: Record<string, typeof Fuel> = {
  Fuel: Fuel,
  Toll: Car,
  Food: Utensils,
  Repair: Wrench,
  Parking: CircleDot,
  Miscellaneous: Receipt,
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

  // Group expenses by trip
  const tripGroups = expenses.reduce<Record<string, Expense[]>>((acc, exp) => {
    if (!acc[exp.tripId]) acc[exp.tripId] = [];
    acc[exp.tripId].push(exp);
    return acc;
  }, {});

  const filteredTripIds = Object.keys(tripGroups).filter((tripId) => {
    const tripExpenses = tripGroups[tripId];
    const matchesSearch =
      tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tripExpenses[0].driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || tripExpenses.some((e) => e.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = expenses.filter((e) => e.status === "PENDING").reduce((sum, e) => sum + e.amount, 0);
  const approvedAmount = expenses.filter((e) => e.status === "APPROVED").reduce((sum, e) => sum + e.amount, 0);

  const handleApprove = (tripId: string, expenseId?: string) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (expenseId) return e.id === expenseId ? { ...e, status: "APPROVED" } : e;
        return e.tripId === tripId && e.status === "PENDING" ? { ...e, status: "APPROVED" } : e;
      })
    );
  };

  const handleReject = (tripId: string, expenseId?: string) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (expenseId) return e.id === expenseId ? { ...e, status: "REJECTED" } : e;
        return e.tripId === tripId && e.status === "PENDING" ? { ...e, status: "REJECTED" } : e;
      })
    );
  };

  const getTripStatus = (tripExpenses: Expense[]) => {
    if (tripExpenses.every((e) => e.status === "APPROVED")) return "APPROVED";
    if (tripExpenses.some((e) => e.status === "PENDING")) return "PENDING";
    if (tripExpenses.every((e) => e.status === "REJECTED")) return "REJECTED";
    return "MIXED";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
          <p className="text-muted-foreground">Expenses grouped by Trip ID — expand to see breakdown</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Report</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><IndianRupee className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-xl font-bold">₹{totalAmount.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-sm text-muted-foreground">Pending Approval</p><p className="text-xl font-bold">₹{pendingAmount.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-sm text-muted-foreground">Approved</p><p className="text-xl font-bold">₹{approvedAmount.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-sm text-muted-foreground">Avg per Trip</p><p className="text-xl font-bold">₹{Math.round(totalAmount / Object.keys(tripGroups).length).toLocaleString()}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by Trip ID or Driver..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {["all", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                <Button key={s} variant={filterStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(s)}>
                  {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredTripIds.map((tripId) => {
            const tripExpenses = tripGroups[tripId];
            const tripTotal = tripExpenses.reduce((s, e) => s + e.amount, 0);
            const tripStatus = getTripStatus(tripExpenses);
            const isExpanded = expandedTrip === tripId;
            const hasPending = tripExpenses.some((e) => e.status === "PENDING");

            return (
              <div key={tripId} className="border rounded-lg overflow-hidden">
                {/* Trip Row (collapsed) */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => setExpandedTrip(isExpanded ? null : tripId)}
                >
                  <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    <div>
                      <p className="font-mono font-bold text-sm">{tripId}</p>
                      <p className="text-xs text-muted-foreground">{tripExpenses[0].driver} • {tripExpenses[0].truck}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">₹{tripTotal.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{tripExpenses.length} items</p>
                    </div>
                    <Badge variant={tripStatus === "APPROVED" ? "success" : tripStatus === "PENDING" ? "warning" : tripStatus === "REJECTED" ? "destructive" : "secondary"}>
                      {tripStatus === "MIXED" ? "Partial" : tripStatus.charAt(0) + tripStatus.slice(1).toLowerCase()}
                    </Badge>
                    {hasPending && (
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApprove(tripId)}>
                          <CheckCircle className="h-3 w-3 mr-1" />Approve All
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(tripId)}>
                          <XCircle className="h-3 w-3 mr-1" />Reject All
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t bg-muted/20 px-4 py-3">
                    <div className="grid gap-2">
                      {tripExpenses.map((exp) => {
                        const Icon = typeIcons[exp.type] || Receipt;
                        return (
                          <div key={exp.id} className="flex items-center justify-between py-2 px-3 bg-background rounded-md border">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{exp.type}</p>
                                <p className="text-xs text-muted-foreground">{exp.remarks}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-semibold text-sm">₹{exp.amount.toLocaleString()}</p>
                              <Badge variant={exp.status === "APPROVED" ? "success" : exp.status === "PENDING" ? "warning" : "destructive"} className="text-[10px]">
                                {exp.status}
                              </Badge>
                              {exp.receipt && <span className="text-[10px] text-blue-600 border border-blue-200 rounded px-1">Receipt</span>}
                              {exp.status === "PENDING" && (
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600" onClick={() => handleApprove(tripId, exp.id)}>
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600" onClick={() => handleReject(tripId, exp.id)}>
                                    <XCircle className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Trip expense summary */}
                    <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs">
                      {Object.entries(tripExpenses.reduce<Record<string, number>>((acc, e) => { acc[e.type] = (acc[e.type] || 0) + e.amount; return acc; }, {})).map(([type, amt]) => (
                        <span key={type} className="text-muted-foreground"><strong className="text-foreground">{type}:</strong> ₹{amt.toLocaleString()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
