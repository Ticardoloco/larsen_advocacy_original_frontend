import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { MISSION, OVERVIEW, VISION } from "@/data/laef";

export const metadata: Metadata = {
  title: "About Us — Larsen Advocacy and Empowerment Foundation",
  description: OVERVIEW.slice(0, 155),
  openGraph: {
    title: "About Us — Larsen Advocacy and Empowerment Foundation",
    description: "Who we are, what we believe, and the work we are committed to.",
  },
};

const links = [
  { href: "/about/story", label: "Our Story", body: "From Victorious Foundation in 2014 to LAEF today." },
  { href: "/about/mission-vision", label: "Mission & Vision", body: "The future we are working towards." },
  { href: "/about/values", label: "Core Values", body: "The six commitments that guide our work." },
  { href: "/about/staff", label: "Staff Directory", body: "Meet the team and management leading LAEF." },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="Every child and every survivor deserves safety, justice, and the opportunity to heal and thrive." />

      <section className="container-page py-16">
        <p className="max-w-3xl text-lg leading-relaxed text-foreground/90">{OVERVIEW}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="surface-card p-8">
            <p className="eyebrow">Mission</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">{MISSION}</p>
          </div>
          <div className="surface-card bg-primary p-8 text-primary-foreground">
            <p className="eyebrow">Vision</p>
            <p className="mt-4 leading-relaxed text-primary-foreground/85">{VISION}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="surface-card group p-6 transition-transform hover:-translate-y-1">
              <h2 className="text-lg text-primary">{l.label}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{l.body}</p>
              <ArrowRight className="mt-4 h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}