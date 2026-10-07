import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { STAFF } from "@/data/laef";

export const metadata: Metadata = {
  title: "Staff Directory — LAEF",
  description: "Meet the staff and management team leading Larsen Advocacy and Empowerment Foundation.",
  openGraph: {
    title: "Staff Directory — LAEF",
    description: "The leadership and programme team behind LAEF.",
  },
};

function initials(name: string) {
  return name
    .replace(/^Miss\s+/, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}

export default function StaffPage() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="Staff Directory" lead="The people leading our programmes, care and advocacy." />
      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAFF.map((s) => (
            <article key={s.id} className="surface-card overflow-hidden">
              <div className="flex h-44 items-center justify-center bg-secondary">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">
                  {initials(s.name)}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-lg text-primary">{s.name}</h2>
                <p className="mt-1 text-sm font-semibold text-accent">{s.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}