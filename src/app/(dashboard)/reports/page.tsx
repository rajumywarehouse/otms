"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  BarChart3,
  TrendingUp,
  Truck,
  Users,
  IndianRupee,
  Calendar,
  FileText,
  PieChart,
} from "lucide-react";

const reportTypes = [
  { id: "trip-summary", name: "Trip Summary Report", description: "Overview of all trips with status, cost, and delivery metrics", icon: BarChart3, frequency: "Daily/Weekly" },
  { id: "revenue", name: "Revenue Report", description: "Client-wise and period-wise revenue breakdown", icon: IndianRupee, frequency: "Monthly" },
  { id: "fleet-utilization", name: "Fleet Utilization", description: "Truck-wise utilization rates, idle time, and km covered", icon: Truck, frequency: "Weekly" },
  { id: "driver-performance", name: "Driver Performance", description: "On-time delivery %, trips completed, and expense per trip", icon: Users, frequency: "Monthly" },
  { id: "expense-analysis", name: "Expense Analysis", description: "Category-wise expenses, trends, and budget vs actual", icon: TrendingUp, frequency: "Weekly" },
  { id: "client-report", name: "Client Wise Report", description: "Trips, revenue, and service metrics per client", icon: FileText, frequency: "Monthly" },
];

const recentReports = [
  { id: "1", name: "Trip Summary - March 2024", type: "trip-summary", generatedAt: "2024-03-15 14:30", size: "2.4 MB", format: "PDF" },
  { id: "2", name: "Revenue Report - Q1 2024", type: "revenue", generatedAt: "2024-03-15 09:00", size: "1.8 MB", format: "Excel" },
  { id: "3", name: "Fleet Utilization - Week 11", type: "fleet-utilization", generatedAt: "2024-03-14 18:00", size: "890 KB", format: "PDF" },
  { id: "4", name: "Driver KPIs - Feb 2024", type: "driver-performance", generatedAt: "2024-03-10 10:15", size: "1.2 MB", format: "PDF" },
  { id: "5", name: "Expense Report - March W1-W2", type: "expense-analysis", generatedAt: "2024-03-12 16:45", size: "3.1 MB", format: "Excel" },
];

const kpis = [
  { label: "Total Revenue", value: "₹24.5L", change: "+12.3%", positive: true },
  { label: "Total Trips", value: "156", change: "+8.5%", positive: true },
  { label: "On-Time Delivery", value: "87%", change: "-2.1%", positive: false },
  { label: "Avg Cost/Trip", value: "₹15,700", change: "-5.2%", positive: true },
  { label: "Fleet Utilization", value: "73%", change: "+4.1%", positive: true },
  { label: "Active Clients", value: "24", change: "+3", positive: true },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  return (
    <div className="space-y-3 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Business intelligence and operational insights</p>
        </div>
        <div className="flex gap-1.5">
          {[
            { id: "this-week", label: "This Week" },
            { id: "this-month", label: "This Month" },
            { id: "this-quarter", label: "Quarter" },
          ].map((period) => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedPeriod(period.id)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-3">
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              <p className="text-lg font-bold">{kpi.value}</p>
              <p className={`text-[10px] ${kpi.positive ? "text-green-600" : "text-red-600"}`}>
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm">Trip Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="h-[140px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm">Revenue by Client</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="h-[140px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Pie chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm">Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs truncate">{report.name}</p>
                      <Badge variant="secondary" className="text-[10px] h-4">{report.frequency}</Badge>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-2">{report.description}</p>
                  <Button variant="outline" size="sm" className="mt-2 w-full h-7 text-xs">
                    <Download className="h-3 w-3 mr-1.5" />Generate
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="space-y-1.5">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-2 border rounded-md hover:bg-muted/30 transition-colors">
                <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs truncate">{report.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Calendar className="h-2.5 w-2.5" />{report.generatedAt}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] h-5">{report.format}</Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
