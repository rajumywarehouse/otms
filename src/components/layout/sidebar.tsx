"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  Route,
  Users,
  MapPin,
  Receipt,
  FileText,
  BarChart3,
  Settings,
  Building2,
  Package,
  UserCircle,
  Bell,
  Smartphone,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Trips", href: "/trips", icon: Route },
  { name: "Live Tracking", href: "/tracking", icon: MapPin },
  { name: "Trucks", href: "/trucks", icon: Truck },
  { name: "Drivers", href: "/drivers", icon: UserCircle },
  { name: "Clients", href: "/clients", icon: Building2 },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Masters", href: "/masters", icon: Package },
  { name: "Driver App", href: "/driver-app", icon: Smartphone },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">OTMS</span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex gap-x-3 rounded-md p-2.5 text-sm font-medium leading-6 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
