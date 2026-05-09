"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Upload,
  FileText,
  Download,
  Eye,
  Image,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Doc {
  id: string;
  tripId: string;
  type: string;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  mimeType: string;
}

const documents: Doc[] = [
  { id: "1", tripId: "TRP-2024-001", type: "INVOICE", name: "Invoice_001.pdf", size: "245 KB", uploadedBy: "Rajesh Kumar", date: "2024-03-15", mimeType: "application/pdf" },
  { id: "2", tripId: "TRP-2024-001", type: "EWAY_BILL", name: "EWayBill_MH12AB1234.pdf", size: "180 KB", uploadedBy: "Rajesh Kumar", date: "2024-03-15", mimeType: "application/pdf" },
  { id: "3", tripId: "TRP-2024-001", type: "VEHICLE_PHOTO", name: "truck_photo_start.jpg", size: "1.2 MB", uploadedBy: "Rajesh Kumar", date: "2024-03-15", mimeType: "image/jpeg" },
  { id: "4", tripId: "TRP-2024-001", type: "LR_COPY", name: "LR_Copy_001.pdf", size: "320 KB", uploadedBy: "Rajesh Kumar", date: "2024-03-15", mimeType: "application/pdf" },
  { id: "5", tripId: "TRP-2024-002", type: "LR_COPY", name: "LR_Copy_002.pdf", size: "320 KB", uploadedBy: "Suresh Patil", date: "2024-03-15", mimeType: "application/pdf" },
  { id: "6", tripId: "TRP-2024-002", type: "INVOICE", name: "Invoice_002.pdf", size: "198 KB", uploadedBy: "Suresh Patil", date: "2024-03-15", mimeType: "application/pdf" },
  { id: "7", tripId: "TRP-2024-002", type: "EWAY_BILL", name: "EWayBill_MH04CD.pdf", size: "210 KB", uploadedBy: "Suresh Patil", date: "2024-03-15", mimeType: "application/pdf" },
  { id: "8", tripId: "TRP-2024-003", type: "POD", name: "POD_Delivery_003.pdf", size: "450 KB", uploadedBy: "Anil Singh", date: "2024-03-14", mimeType: "application/pdf" },
  { id: "9", tripId: "TRP-2024-003", type: "VEHICLE_PHOTO", name: "delivery_photo.jpg", size: "980 KB", uploadedBy: "Anil Singh", date: "2024-03-14", mimeType: "image/jpeg" },
  { id: "10", tripId: "TRP-2024-004", type: "EWAY_BILL", name: "EWayBill_TN02GH.pdf", size: "210 KB", uploadedBy: "Mohan Das", date: "2024-03-14", mimeType: "application/pdf" },
  { id: "11", tripId: "TRP-2024-005", type: "INVOICE", name: "Invoice_005.pdf", size: "275 KB", uploadedBy: "Ravi Sharma", date: "2024-03-14", mimeType: "application/pdf" },
  { id: "12", tripId: "TRP-2024-005", type: "OTHER", name: "weight_slip.pdf", size: "150 KB", uploadedBy: "Ravi Sharma", date: "2024-03-14", mimeType: "application/pdf" },
  { id: "13", tripId: "TRP-2024-005", type: "VEHICLE_PHOTO", name: "unloading_photo.jpg", size: "1.1 MB", uploadedBy: "Ravi Sharma", date: "2024-03-14", mimeType: "image/jpeg" },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  INVOICE: { label: "Invoice", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" },
  EWAY_BILL: { label: "E-Way Bill", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200" },
  LR_COPY: { label: "LR Copy", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" },
  POD: { label: "POD", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200" },
  VEHICLE_PHOTO: { label: "Photo", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200" },
  OTHER: { label: "Other", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200" },
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [viewDoc, setViewDoc] = useState<Doc | null>(null);

  // Group by trip
  const tripGroups = documents.reduce<Record<string, Doc[]>>((acc, doc) => {
    if (!acc[doc.tripId]) acc[doc.tripId] = [];
    acc[doc.tripId].push(doc);
    return acc;
  }, {});

  const filteredTripIds = Object.keys(tripGroups).filter((tripId) => {
    const tripDocs = tripGroups[tripId];
    const matchesSearch =
      tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tripDocs.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || tripDocs.some((d) => d.type === filterType);
    return matchesSearch && matchesType;
  });

  const handleView = (doc: Doc) => setViewDoc(doc);

  const handleDownload = (doc: Doc) => {
    // Simulate download
    const link = document.createElement("a");
    link.href = "#";
    link.download = doc.name;
    // In real app, this would be an actual file URL
    alert(`Downloading: ${doc.name} (${doc.size})\nIn production, this would download the actual file.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Trip documents grouped by Trip ID — View and Download</p>
        </div>
        <Button><Upload className="mr-2 h-4 w-4" />Upload Document</Button>
      </div>

      {/* Type filters */}
      <div className="grid gap-3 md:grid-cols-6">
        {Object.entries(typeLabels).map(([key, val]) => (
          <Card
            key={key}
            className={`cursor-pointer hover:shadow-md transition-shadow ${filterType === key ? "ring-2 ring-primary" : ""}`}
            onClick={() => setFilterType(key === filterType ? "all" : key)}
          >
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold">{documents.filter((d) => d.type === key).length}</p>
              <p className="text-xs text-muted-foreground">{val.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by Trip ID, file name, or uploader..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {filterType !== "all" && (
              <Button variant="outline" size="sm" onClick={() => setFilterType("all")}>Clear: {typeLabels[filterType]?.label}</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredTripIds.map((tripId) => {
            const tripDocs = tripGroups[tripId];
            const displayDocs = filterType === "all" ? tripDocs : tripDocs.filter((d) => d.type === filterType);
            const isExpanded = expandedTrip === tripId;

            return (
              <div key={tripId} className="border rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => setExpandedTrip(isExpanded ? null : tripId)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <div>
                      <p className="font-mono font-bold text-sm">{tripId}</p>
                      <p className="text-xs text-muted-foreground">{tripDocs[0].uploadedBy} • {tripDocs[0].date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from(new Set(tripDocs.map((d) => d.type))).map((t) => (
                        <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${typeLabels[t]?.color || ""}`}>
                          {typeLabels[t]?.label || t}
                        </span>
                      ))}
                    </div>
                    <Badge variant="secondary">{tripDocs.length} docs</Badge>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t bg-muted/20 px-4 py-3 space-y-2">
                    {displayDocs.map((doc) => {
                      const typeInfo = typeLabels[doc.type] || typeLabels.OTHER;
                      const isImage = doc.mimeType.startsWith("image/");
                      return (
                        <div key={doc.id} className="flex items-center gap-3 p-2.5 bg-background rounded-md border">
                          <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                            {isImage ? <Image className="h-4 w-4 text-pink-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size} • {doc.date}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); handleView(doc); }}>
                              <Eye className="h-3 w-3 mr-1" />View
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}>
                              <Download className="h-3 w-3 mr-1" />Download
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* View Document Modal */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewDoc(null)}>
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-semibold">{viewDoc.name}</h3>
                <p className="text-xs text-muted-foreground">{viewDoc.tripId} • {viewDoc.size} • {viewDoc.uploadedBy}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(viewDoc)}>
                  <Download className="h-3 w-3 mr-1" />Download
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewDoc(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 flex items-center justify-center min-h-[300px] bg-muted/30">
              {viewDoc.mimeType.startsWith("image/") ? (
                <div className="text-center">
                  <Image className="h-16 w-16 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Image Preview</p>
                  <p className="text-xs text-muted-foreground mt-1">{viewDoc.name}</p>
                  <div className="mt-4 w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center border">
                    <p className="text-xs text-muted-foreground">[Image would render here in production]</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">PDF Document</p>
                  <p className="text-xs text-muted-foreground mt-1">{viewDoc.name}</p>
                  <div className="mt-4 w-full h-48 bg-white border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">[PDF would render here in production]</p>
                      <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => handleDownload(viewDoc)}>
                        <Download className="h-3 w-3 mr-1" />Download to view
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
