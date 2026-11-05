"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  UserCheck,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  FileText,
  MessageSquareQuote,
  ClipboardCheck,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { getCurrentUser, User } from "@/services/auth";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Fetch current super-admin profile info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setCurrentUser(res.user || null);
      } catch (err) {
        // Handle unauthenticated state if needed
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
      toast.success("Logged out from Super-Admin session");
      router.push("/auth/login");
    }
  };

  const navSections = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/super-admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Content & Media",
      items: [
        {
          name: "Home Gallery",
          href: "/super-admin/home-gallery",
          icon: ImageIcon,
        },
        {
          name: "Story Management",
          href: "/super-admin/stories",
          icon: BookOpen,
        },
        {
          name: "Event Gallery",
          href: "/super-admin/events",
          icon: CalendarDays,
        },
      ],
    },
    {
      title: "Operations & Team",
      items: [
        {
          name: "User Management",
          href: "/super-admin/users",
          icon: Users,
        },
        {
          name: "Staff Management",
          href: "/super-admin/staff",
          icon: UserCheck,
        },
        {
          name: "Program Management",
          href: "/super-admin/programs",
          icon: FileText,
        },
      ],
    },
    {
      title: "Community & Funding",
      items: [
        {
          name: "Donations & Funds",
          href: "/super-admin/donations",
          icon: HeartHandshake,
        },
        {
          name: "Partnership Inquiries",
          href: "/super-admin/partners",
          icon: FileText,
        },
        {
          name: "Donor Remarks",
          href: "/super-admin/remarks",
          icon: MessageSquareQuote,
        },
        {
          name: "Fit Test Results",
          href: "/super-admin/fit-test",
          icon: ClipboardCheck,
        },
        {
          name: "Support & Reports",
          href: "/super-admin/support",
          icon: LifeBuoy,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          name: "Security & Settings",
          href: "/super-admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-border bg-background px-4 py-3.5 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 flex items-center justify-center shrink-0">
            {!imgError ? (
              <Image
                src="/laef-mark.png"
                alt="Larsen Advocacy Logo"
                fill
                sizes="32px"
                className="object-contain"
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xs font-extrabold text-primary">LA</span>
            )}
          </div>
          <div>
            <span className="font-bold text-primary text-sm block leading-none">Larsen Foundation</span>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5 block">Super Admin</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl p-2 text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-zinc-950/70 md:hidden"
        />
      )}

      {/* Fixed Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background md:bg-surface flex flex-col transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* NGO Corporate Brand Header */}
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0 bg-background md:bg-secondary/10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
              {!imgError ? (
                <Image
                  src="/laef-mark.png"
                  alt="Larsen Advocacy Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-sm font-extrabold text-primary">LA</span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-primary text-sm tracking-tight truncate">Larsen Foundation</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" /> Super Admin
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links with Hidden Scrollbar */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                {section.title}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary/80"}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-border bg-background md:bg-secondary/30 shrink-0">
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-background shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.fullName ? currentUser.fullName.substring(0, 2).toUpperCase() : "SA"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary truncate leading-tight">
                  {currentUser?.fullName || "Super Administrator"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {currentUser?.email || "admin@larsen.org"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Hidden Scrollbar */}
      <main className="flex-1 min-w-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}