"use client";

import { useMemo, useState } from "react";
import { Camera, X } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { GALLERY, type GalleryItem } from "@/data/laef";
import { cn } from "@/lib/utils";

const categories = ["All", "Focus March", "Bank 200", "Omokunrinnimi", "Heart Mender", "Community Champions"] as const;
const years = ["All", "2026", "2025", "2024"] as const;

function Tile({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const hue = 150 + (item.tone % 6) * 12;
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl text-left shadow-(--shadow-soft)"
    >
      <div
        className="flex aspect-4/3 items-end p-5"
        style={{
          background: `linear-gradient(145deg, oklch(0.42 0.06 ${hue}), oklch(0.74 0.04 ${hue + 10}))`,
        }}
      >
        <Camera className="absolute right-4 top-4 h-5 w-5 text-white/70" />
        <span className="relative z-10 text-sm font-semibold text-white drop-shadow">{item.caption}</span>
      </div>
      <div className="flex items-center justify-between bg-card px-5 py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-primary">{item.category}</span>
        <span>{item.year}</span>
      </div>
    </button>
  );
}

export default function GalleryPage() {
  const [category, setCategory] = useState<string>("All");
  const [year, setYear] = useState<string>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const items = useMemo(
    () =>
      GALLERY.filter(
        (g) => (category === "All" || g.category === category) && (year === "All" || g.year === year),
      ),
    [category, year],
  );

  return (
    <>
      <PageHeader
        eyebrow="Gallery / Events"
        title="Moments from our work"
        lead="Community outreaches, marches, school sessions and clothing distributions across Nigeria."
      />

      <section className="container-page py-14">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                  year === y ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground",
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Tile key={item.id} item={item} onClick={() => setActive(item)} />
          ))}
        </div>
        {items.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">No photos match this filter yet.</p>
        )}
      </section>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-primary-deep/80 p-5 backdrop-blur-sm"
        >
          <div className="surface-card w-full max-w-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div
              className="aspect-video w-full"
              style={{
                background: `linear-gradient(145deg, oklch(0.42 0.06 ${150 + (active.tone % 6) * 12}), oklch(0.74 0.04 ${160 + (active.tone % 6) * 12}))`,
              }}
            />
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <h2 className="text-lg text-primary">{active.caption}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {active.category} · {active.year}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="rounded-full border border-border p-2 text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}