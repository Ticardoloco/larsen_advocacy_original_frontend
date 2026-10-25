import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import React from 'react'

export interface PillarItem {
  title: string;
  body: string;
}
const pillarIcons = [ShieldCheck, Sparkles, HeartHandshake];
const Pillars = ({pillars}: {pillars: PillarItem[]}) => {
  return (
    <section className="container-page py-20">
        <p className="eyebrow">Our three pillars</p>
        <h2 className="mt-3 text-2xl md:text-4xl">How we work</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = pillarIcons[i] ?? ShieldCheck;
            return (
              <article key={pillar.title} className="surface-card p-7 transition-transform hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl text-primary">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </section>
)
}

export default Pillars