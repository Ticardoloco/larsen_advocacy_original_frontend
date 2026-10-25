"use client";

import Link from "next/link";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { HELPLINE } from "@/data/laef";
import { useEffect, useState } from "react";
import { getPrograms, ProgramItem } from "@/services/program";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export function Footer() {
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

  return (
    <footer className="mt-24 bg-primary-deep text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/laef-mark.png" alt="LAEF" loading="lazy" width={816} height={816} className="h-12 w-12" />
            <span className="font-display text-xl font-bold">LAEF</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            Larsen Advocacy and Empowerment Foundation — committed to ending sexual violence and child trafficking.
          </p>
        </div>

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
      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Larsen Advocacy and Empowerment Foundation. All rights reserved.</p>
          <Link href="/auth/login" className="hover:text-accent">
            Staff Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}