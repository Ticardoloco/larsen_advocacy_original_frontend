"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, X, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { cn } from "@/lib/utils";
import { getPrograms, ProgramItem } from "@/services/program";
import { GalleryItems, getAllGallerys } from "@/services/gallery";
import Image from "next/image";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import GalleryCard from "@/components/gallery/GalleryCard";

// Generate years dynamically from current year down to 2014, with "All" ALWAYS first
const currentYear = new Date().getFullYear();
const dynamicYears = [
  "All",
  ...Array.from({ length: currentYear - 2014 + 1 }, (_, i) => String(currentYear - i)),
];

export default function GalleryPage() {
  const [category, setCategory] = useState<string>("All");
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [programsLoading, setProgramsLoading] = useState<boolean>(true);
  const [galleries, setGalleries] = useState<GalleryItems[]>([]);
  const [galleriesLoading, setGalleriesLoading] = useState<boolean>(true);
  const [year, setYear] = useState<string>("All");
  const [active, setActive] = useState<GalleryItems | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPrograms = async () => {
      try {
        setProgramsLoading(true);
        const res = await getPrograms();
        if (isMounted) {
          setPrograms(res);
        }
      } catch (error: any) {
        console.error("Error fetching programs", error.message);
      } finally {
        if (isMounted) {
          setProgramsLoading(false);
        }
      }
    };
    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchGalleries = async () => {
      try {
        setGalleriesLoading(true);
        const res = await getAllGallerys();
        if (isMounted) {
          setGalleries(res.data);
        }
      } catch (error: any) {
        console.error("Error fetching Gallery", error.message);
      } finally {
        if (isMounted) {
          setGalleriesLoading(false);
        }
      }
    };
    fetchGalleries();

    return () => {
      isMounted = false;
    };
  }, []);

  const items = useMemo(
    () =>
      galleries.filter(
        (g) =>
          (category === "All" || g.category.toLowerCase() === category.toLowerCase()) &&
          (year === "All" || g.year === year),
      ),
    [galleries, category, year],
  );

  return (
    <>
      <PageHeader
        eyebrow="Gallery / Events"
        title="Moments from our work"
        lead="Community outreaches, marches, school sessions and clothing distributions across Nigeria."
      />

      <section className="container-page py-14">
        {/* Responsive Filter Container */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* ================= CATEGORY FILTER ================= */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Filter by Programme</p>
            {programsLoading ? (
              <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
                <Skeleton height={40} borderRadius={12} width="100%" />
              </SkeletonTheme>
            ) : (
              <>
                {/* Mobile Dropdown Select */}
                <div className="relative block sm:hidden">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Filter by Programme"
                    className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="All">All Programmes</option>
                    {[...programs].reverse().map((c) => (
                      <option key={c._id} value={c.category}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                {/* Tablet / Desktop Pill Buttons */}
                <div className="hidden flex-wrap gap-2 sm:flex">
                  <button
                    onClick={() => setCategory("All")}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                      category === "All"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    All
                  </button>
                  {[...programs].reverse().map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setCategory(c.category)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                        category === c.category
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ================= YEAR FILTER ================= */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Filter by Year</p>
            
            {/* Mobile Dropdown Select */}
            <div className="relative block sm:hidden">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                aria-label="Filter by Year"
                className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {dynamicYears.map((y) => (
                  <option key={y} value={y}>
                    {y === "All" ? "All Years" : y}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Tablet / Desktop Pill Buttons */}
            <div className="hidden flex-wrap gap-2 sm:flex">
              {dynamicYears.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                    year === y
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Gallery Grid or Skeletons */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleriesLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonTheme key={i} baseColor="#e5e7eb" highlightColor="#f3f4f6">
                <div className="surface-card overflow-hidden rounded-2xl">
                  <div className="aspect-4/3 w-full">
                    <Skeleton height="100%" width="100%" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton height={14} width="60%" />
                  </div>
                </div>
              </SkeletonTheme>
            ))
          ) : (
            items.map((item) => <GalleryCard key={item._id} item={item} onClick={() => setActive(item)} />)
          )}
        </div>

        {!galleriesLoading && items.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">No photos match this filter yet.</p>
        )}
      </section>

      {/* Lightbox Modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-primary-deep/80 p-5 backdrop-blur-sm"
        >
          <div className="surface-card w-full max-w-3xl overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video w-full bg-secondary">
              {active.image ? (
                <Image
                  fill
                  src={active.image}
                  alt={active.caption || "Gallery Preview"}
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <h2 className="text-lg font-bold text-primary">{active.caption}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {active.category} · {active.year}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="rounded-full border border-border p-2 text-primary hover:bg-secondary transition-colors"
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