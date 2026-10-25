import { Quote } from 'lucide-react'
import React from 'react'

const Founder = ({message}: {message: string}) => {
  return (
    <section className="bg-sage-soft py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          <Quote className="h-12 w-12 shrink-0 text-accent" />
          <div>
            <p className="eyebrow">Founder&apos;s message</p>
            <blockquote className="mt-4 font-display text-lg leading-relaxed text-primary md:text-2xl">
              “{message}”
            </blockquote>
            <p className="mt-6 text-sm font-semibold text-foreground">
              Miss Omotoyosi Omolade Fadayomi
              <span className="block font-normal text-muted-foreground">Founder, LAEF</span>
            </p>
          </div>
        </div>
      </section>
  )
}

export default Founder