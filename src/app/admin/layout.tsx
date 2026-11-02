"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  HeartHandshake,
  MessageSquareQuote,
  FileText,
  ClipboardCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/auth";
import { toast } from "sonner";

interface AdminUser {
  _id?: string;
  fullName?: string;
  email?: string;
  role?: string;
}

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/donations", label: "Donations & Funds", icon: HeartHandshake },
  { href: "/admin/partners", label: "Partnerships", icon: FileText },
  { href: "/admin/remarks", label: "Donor Remarks", icon: MessageSquareQuote },
  { href: "/admin/fit-test-results", label: "Fit Test Results", icon: ClipboardCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("laef_admin_token");

      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      const storedUser = sessionStorage.getItem("laef_admin_user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        } catch {
          setCurrentUser(null);
        }
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("laef_admin_token");
        sessionStorage.removeItem("laef_admin_user");
        localStorage.removeItem("laef_admin_token");
        localStorage.removeItem("laef_admin_user");
      }
      toast.success("Signed out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  // Helper to generate initials (e.g. "Taiwo Egbeleke" -> "TE")
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "AD";
  };

  return (
    <div className="min-h-screen bg-secondary/35">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Fixed Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/laef-mark.png"
              alt="LAEF Logo"
              width={816}
              height={816}
              className="h-9 w-9"
            />
            <div>
              <span className="block font-display text-base font-bold text-primary">
                LAEF Admin
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Management Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Core Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/80 hover:bg-secondary hover:text-primary"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Active Admin Profile & Logout */}
        <div className="border-t border-border p-4 space-y-3">
          {currentUser && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/50 border border-border/60">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  {getInitials(currentUser.fullName, currentUser.email)}
                </div>
                {/* Active Indicator Dot */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-primary truncate">
                  {currentUser.fullName || "Staff Member"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 lg:ml-72">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-primary lg:hidden hover:bg-secondary"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-primary capitalize">
                {pathname === "/admin"
                  ? "Dashboard Overview"
                  : pathname.split("/").pop()?.replace(/-/g, " ")}
              </h1>
            </div>
          </div>

          {/* Active Admin Details in Header */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <span className="block text-xs font-bold text-primary">
                {currentUser?.fullName || "Staff Administrator"}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                Active Session
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
              {getInitials(currentUser?.fullName, currentUser?.email)}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}