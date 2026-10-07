"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, HeartHandshake, Quote, ShieldCheck, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { FOUNDER_MESSAGE, HERO_MISSION, IMPACT, PILLARS, PROGRAMS } from "@/data/laef";
import { Button } from "@/components/site/Button";

const pillarIcons = [ShieldCheck, Sparkles, HeartHandshake];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-accent md:text-5xl">
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Larsen Advocacy and Empowerment Foundation</p>
            <h1 className="mt-4 text-3xl leading-[1.1] md:text-5xl">
              Safety, dignity, healing and justice for every survivor.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85">{HERO_MISSION}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 bg-white text-secondary-foreground hover:bg-primary-foreground/10">
                <Link href="/donate?tab=partner">Partner With Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-accent/15 blur-2xl" />
            <Image
              src="/hero-community.jpg"
              alt="Young people in a LAEF mentorship circle"
              width={1600}
              height={1008}
              priority
              className="relative aspect-4/3 w-full rounded-4xl object-cover shadow-(--shadow-lift)"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">Our three pillars</p>
        <h2 className="mt-3 text-2xl md:text-4xl">How we work</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => {
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

      <section className="bg-sage-soft py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          <Quote className="h-12 w-12 shrink-0 text-accent" />
          <div>
            <p className="eyebrow">Founder&apos;s message</p>
            <blockquote className="mt-4 font-display text-lg leading-relaxed text-primary md:text-2xl">
              “{FOUNDER_MESSAGE}”
            </blockquote>
            <p className="mt-6 text-sm font-semibold text-foreground">
              Miss Omotoyosi Omolade Fadayomi
              <span className="block font-normal text-muted-foreground">Founder, LAEF</span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary-deep py-20 text-primary-foreground">
        <div className="container-page">
          <p className="eyebrow">Our impact so far</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT.map((item) => (
              <div key={item.label} className="border-l-2 border-accent/40 pl-5">
                <Counter value={item.value} suffix={item.suffix} />
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Our work</p>
            <h2 className="mt-3 text-2xl md:text-4xl">Programmes changing communities</h2>
          </div>
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            View all programmes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className="surface-card group flex flex-col p-6 transition-transform hover:-translate-y-1"
            >
              <h3 className="text-lg text-primary">{p.name}</h3>
              <p className="mt-2 text-sm font-semibold text-accent">{p.tagline}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.body[0]}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}