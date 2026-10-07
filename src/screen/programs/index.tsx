import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { PROGRAMS } from "@/data/laef";

export const metadata: Metadata = {
  title: "Our Work / Programmes — LAEF",
  description:
    "Omokunrinnimi, Heart Mender Series, FinFit Fellowship, Omosuyi Storytelling, Focus March, Bank 200 and Community Champions.",
  openGraph: {
    title: "Our Work / Programmes — LAEF",
    description: "Seven programmes delivering prevention, response and empowerment.",
  },
};

export default function ProgramsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Programmes"
        lead="Community-based projects, child empowerment programmes, health and wellness initiatives, and advocacy for social justice."
      />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {PROGRAMS.map((p) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className="surface-card group flex flex-col p-8 transition-transform hover:-translate-y-1"
            >
              <h2 className="text-xl text-primary">{p.name}</h2>
              <p className="mt-2 text-sm font-semibold text-accent">{p.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body[0]}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Explore programme <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}