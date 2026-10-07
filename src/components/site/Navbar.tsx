"use client";

import Link from "next/link";
import { Key, useState } from "react";
import { ChevronDown, Menu, PhoneCall, X } from "lucide-react";
import { HELPLINE, PROGRAMS } from "@/data/laef";
import { ButtonLink } from "./Button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const aboutLinks = [
  { href: "/about/story", label: "Our Story" },
  { href: "/about/mission-vision", label: "Mission & Vision" },
  { href: "/about/values", label: "Core Values" },
  { href: "/about/staff", label: "Staff Directory" },
] as const;

export function HelplineBanner() {
  return (
    <div className="bg-primary-deep text-primary-foreground">
      <div className="container-page flex flex-col items-center justify-center gap-1 py-2 text-center text-xs sm:flex-row sm:gap-3 sm:text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <PhoneCall className="h-4 w-4 shrink-0 text-accent" />
          24-Hour Confidential Helpline
        </span>
        <a href={`tel:${HELPLINE}`} className="font-bold text-accent underline-offset-4 hover:underline">
          {HELPLINE}
        </a>
      </div>
    </div>
  );
}

function DesktopDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary">
        {label}
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="surface-card mt-1 overflow-hidden p-2">{children}</div>
      </div>
    </div>
  );
}

function DropItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50">
      <HelplineBanner />
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image src="/laef-mark.png" alt="LAEF" width={816} height={816} className="h-11 w-11 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-bold text-primary">LAEF</span>
              <span className="hidden truncate text-[11px] text-muted-foreground sm:block">
                Larsen Advocacy and Empowerment Foundation
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary"
            >
              Home
            </Link>
            <DesktopDropdown label="About Us">
              <DropItem href="/about" label="About LAEF" />
              {aboutLinks.map((l) => (
                <DropItem key={l.href} href={l.href} label={l.label} />
              ))}
            </DesktopDropdown>
            <DesktopDropdown label="Our Work">
              <DropItem href="/programs" label="All Programmes" />
              {PROGRAMS.map((p: { slug: Key | null | undefined; name: string; }) => (
                <DropItem key={p.slug} href={`/programs/${String(p.slug)}`} label={p.name} />
              ))}
            </DesktopDropdown>
            <Link
              href="/gallery"
              className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary"
            >
              Gallery / Events
            </Link>
            <ButtonLink href="/donate" size="sm" className="ml-2">
              Donate
            </ButtonLink>
          </nav>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-primary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="container-page flex flex-col gap-1 py-4">
              <Link href="/" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-semibold">
                Home
              </Link>
              {[
                { key: "about", label: "About Us", items: [{ href: "/about", label: "About LAEF" }, ...aboutLinks] },
                {
                  key: "work",
                  label: "Our Work / Programs",
                  items: [
                    { href: "/programs", label: "All Programmes" },
                    ...PROGRAMS.map((p: { slug: string; name: string; }) => ({ href: `/programs/${p.slug}`, label: p.name })),
                  ],
                },
              ].map((group) => (
                <div key={group.key}>
                  <button
                    onClick={() => setSection(section === group.key ? null : group.key)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-semibold"
                  >
                    {group.label}
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", section === group.key && "rotate-180")}
                    />
                  </button>
                  {section === group.key && (
                    <div className="ml-3 border-l border-border pl-3">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/gallery" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-semibold">
                Gallery / Events
              </Link>
              <ButtonLink href="/donate" onClick={() => setOpen(false)} className="mt-2" size="lg">
                Donate
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}