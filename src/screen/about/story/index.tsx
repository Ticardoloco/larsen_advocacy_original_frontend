import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { STORY_TIMELINE } from "@/data/laef";

export const metadata: Metadata = {
  title: "Our Story — LAEF",
  description:
    "Established on March 29, 2014 as Victorious Foundation and officially established as Larsen Advocacy and Empowerment Foundation in 2018.",
  openGraph: {
    title: "Our Story — LAEF",
    description: "How LAEF grew from a single home visit into a national movement.",
  },
};

export default function StoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Our Story"
        lead="From a first home visit in 2014 to a survivor-centred foundation working across Nigeria."
      />
      <section className="container-page py-16">
        <ol className="relative border-l border-border pl-8">
          {STORY_TIMELINE.map((item) => (
            <li key={item.year} className="relative pb-12 last:pb-0">
              <span className="absolute -left-10.25 mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent bg-background" />
              <p className="eyebrow">{item.year}</p>
              <h2 className="mt-2 text-xl text-primary md:text-2xl">{item.title}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>

        <div className="surface-card mt-8 bg-sage-soft p-8">
          <h2 className="text-xl text-primary">Founder</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            LAEF was founded by Miss Omotoyosi Omolade Fadayomi, whose lived experience shapes the foundation&apos;s
            survivor-centred approach, and whose leadership anchors the work of LAEF Care Plus Clinic.
          </p>
        </div>
      </section>
    </>
  );
}