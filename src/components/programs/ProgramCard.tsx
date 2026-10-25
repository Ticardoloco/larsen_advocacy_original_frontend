import { ProgramItem } from '@/services/program';
import { Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { buttonClass } from '../site/Button';

const ProgramCard = ({programData, imageSrc}:{programData: ProgramItem | null; imageSrc: string} ) => {
  return (
    <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          {programData?.body?.map((paragraph, index) => (
            <p key={index} className="mb-5 text-base leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}

          {programData?.callout && (
            <div className="surface-card mt-8 border-l-4 border-l-accent bg-sage-soft p-7">
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                <Users className="h-4 w-4 text-accent" />
                {programData.callout.title}
              </span>
              <p className="mt-3 leading-relaxed text-muted-foreground">{programData.callout.body}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {programData?.ctas?.map((cta, i) => {
              const donateQuery = programData?.slug === "bank-200-community-aid-project" ? "bank200" : programData?.slug === "omokunrinnimi-initiative" ? "omokunrinnimi" : programData?.slug === "focus-march-against-sexual-violence-saynotorape-carnival" ? "campaign" : "general";
              return (
                <Link
                  key={cta}
                  href={`/donate/${donateQuery}`}
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
          alt={programData?.name ?? "Programme Image"}
          width={1200}
          height={800}
          className="aspect-4/3 w-full rounded-[2rem] object-cover shadow-(--shadow-soft)"
        />
      </section>
  )
}

export default ProgramCard