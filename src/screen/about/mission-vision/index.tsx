import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { MISSION, PILLARS, VISION } from "@/data/laef";

export const metadata: Metadata = {
  title: "Mission & Vision — LAEF",
  description: VISION,
  openGraph: {
    title: "Mission & Vision — LAEF",
    description: MISSION.slice(0, 155),
  },
};

export default function MissionVisionPage() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="Mission & Vision" />
      <section className="container-page py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="surface-card p-8 md:p-10">
            <p className="eyebrow">Mission</p>
            <p className="mt-4 text-lg leading-relaxed text-foreground/90">{MISSION}</p>
          </article>
          <article className="surface-card bg-primary p-8 text-primary-foreground md:p-10">
            <p className="eyebrow">Vision</p>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/85">{VISION}</p>
          </article>
        </div>

        <h2 className="mt-16 text-2xl md:text-3xl">The three pillars that carry the mission</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="surface-card p-7">
              <h3 className="text-lg text-primary">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}