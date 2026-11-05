"use client";

import Link from "next/link";
import { 
  Mail, 
  MapPin, 
  PhoneCall, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube 
} from "lucide-react";
import { HELPLINE } from "@/data/laef";
import { useEffect, useState } from "react";
import { getPrograms, ProgramItem } from "@/services/program";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useRouter } from "next/navigation";

// Custom Icon for X (formerly Twitter)
function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Replace these placeholder URLs with your official social media profile links
const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/your-page", icon: Facebook },
  { name: "X", href: "https://x.com/your-handle", icon: XIcon },
  { name: "Instagram", href: "https://instagram.com/your-handle", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/company/your-company", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@your-channel", icon: Youtube },
];

export function Footer() {
  const router = useRouter();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [programsLoading, setProgramsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPrograms = async () => {
      try {
        setProgramsLoading(true);
        const res = await getPrograms();
        if (isMounted) {
          setPrograms(res);
        }
      } catch (error: any) {
        console.error("Error fetching programs", error.message);
      } finally {
        if (isMounted) {
          setProgramsLoading(false);
        }
      }
    };
    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smart handler for the Staff Dashboard link
  const handleStaffDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (typeof window === "undefined") {
      router.push("/auth/login");
      return;
    }

    const token = sessionStorage.getItem("laef_admin_token") || localStorage.getItem("laef_admin_token");
    const storedUser = sessionStorage.getItem("laef_admin_user") || localStorage.getItem("laef_admin_user");

    // If not authenticated, redirect to login
    if (!token || !storedUser) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const role = user.role?.toLowerCase() || "";

      // Route based on role
      if (role === "superadmin" || role === "super-admin") {
        router.push("/super-admin");
      } else {
        router.push("/admin");
      }
    } catch {
      router.push("/auth/login");
    }
  };

  return (
    <footer className="mt-24 bg-primary-deep text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        {/* Column 1: Info & Social Icons */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/laef-mark.png" alt="LAEF" loading="lazy" width={816} height={816} className="h-12 w-12" />
            <span className="font-display text-xl font-bold">LAEF</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            Larsen Advocacy and Empowerment Foundation — committed to ending sexual violence and child trafficking.
          </p>

          {/* Social Media Links */}
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all hover:bg-accent hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: About Us */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">About Us</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            <li><Link href="/about" className="hover:text-accent">About LAEF</Link></li>
            <li><Link href="/about/story" className="hover:text-accent">Our Story</Link></li>
            <li><Link href="/about/mission-vision" className="hover:text-accent">Mission & Vision</Link></li>
            <li><Link href="/about/values" className="hover:text-accent">Core Values</Link></li>
            <li><Link href="/about/staff" className="hover:text-accent">Staff Directory</Link></li>
          </ul>
        </div>

        {/* Column 3: Our Work */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Our Work</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            {programsLoading ? (
              <SkeletonTheme baseColor="#16852A" highlightColor="#334155">
                <div className="space-y-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <li key={i}>
                      <Skeleton height={14} width={i % 2 === 0 ? "80%" : "65%"} />
                    </li>
                  ))}
                </div>
              </SkeletonTheme>
            ) : (
              [...programs].reverse().map((p) => (
                <li key={p.slug}>
                  <Link href={`/programs/${p.slug}`} className="hover:text-accent">
                    {p.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Column 4: Reach Us */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Reach Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex items-start gap-2">
              <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                24-Hour Confidential Helpline
                <a href={`tel:${HELPLINE}`} className="block font-semibold text-primary-foreground">
                  {HELPLINE}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>hello@laef.org</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Lagos, Nigeria</span>
            </li>
            <li>
              <Link href="/donate" className="font-semibold text-accent hover:underline">
                Donate / Partner With Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Larsen Advocacy and Empowerment Foundation. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <a href="/auth/login" onClick={handleStaffDashboardClick} className="hover:text-accent cursor-pointer">
              Staff Dashboard
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}