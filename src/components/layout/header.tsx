"use client";

import { Bell, Moon, Sun, Menu, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button className="lg:hidden p-2 -m-2.5">
        <Menu className="h-6 w-6" />
      </button>

      <div className="h-6 w-px bg-border lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h2 className="text-lg font-semibold">
            Welcome back, {user?.name || "Admin"}
          </h2>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />

          <div className="flex items-center gap-x-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground">{user?.role || "SUPER_ADMIN"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
