import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CORE_VALUES } from "@/data/laef";

export const metadata: Metadata = {
  title: "Core Values — LAEF",
  description:
    "Transparency, Compassion, Support, Social Justice & Equality, Partnership, and Sustainable Impact guide everything LAEF does.",
  openGraph: {
    title: "Core Values — LAEF",
    description: "The six commitments that guide the work of LAEF.",
  },
};

export default function ValuesPage() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="Core Values" lead="Six commitments that shape how we serve." />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((v, i) => (
            <article key={v.title} className="surface-card p-7">
              <span className="font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 text-lg text-primary">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}