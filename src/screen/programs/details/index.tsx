import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Users } from "lucide-react";
import { buttonClass } from "@/components/site/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { PROGRAMS } from "@/data/laef";

const images = { 
  march: "/program-march.jpg", 
  women: "/program-women.jpg", 
  community: "/hero-community.jpg" 
} as const;

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);

  if (!program) {
    return {
      title: "Programme unavailable — LAEF",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${program.name} — LAEF`,
    description: (program.body[0] ?? "").slice(0, 155),
    openGraph: {
      title: `${program.name} — LAEF`,
      description: program.tagline,
    },
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);

  if (!program) {
    notFound();
  }

  const others = PROGRAMS.filter((p) => p.slug !== program.slug).slice(0, 3);
  const imageSrc = images[program.image as keyof typeof images];

  return (
    <>
      <PageHeader eyebrow="Our Work" title={program.name} lead={program.tagline} />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          {program.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 text-base leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}

          {program.callout && (
            <div className="surface-card mt-8 border-l-4 border-l-accent bg-sage-soft p-7">
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                <Users className="h-4 w-4 text-accent" />
                {program.callout.title}
              </span>
              <p className="mt-3 leading-relaxed text-muted-foreground">{program.callout.body}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {program.ctas.map((cta, i) => {
              const donateQuery = program.slug === "bank-200" ? "bank200" : "general";
              return (
                <Link
                  key={cta}
                  href={`/donate?tab=${donateQuery}`}
                  className={buttonClass(i === 0 ? "primary" : "outline", "lg")}
                >
                  {cta}
                </Link>
              );
            })}
          </div>
        </div>

        <Image
          src={imageSrc}
          alt={program.name}
          width={1200}
          height={800}
          className="aspect-4/3 w-full rounded-[2rem] object-cover shadow-(--shadow-soft)"
        />
      </section>

      <section className="container-page pb-20">
        <h2 className="text-2xl">Other programmes</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className="surface-card group p-6 transition-transform hover:-translate-y-1"
            >
              <h3 className="text-lg text-primary">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
              <ArrowRight className="mt-4 h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}