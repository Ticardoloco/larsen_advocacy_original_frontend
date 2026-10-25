"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FOUNDER_MESSAGE, HERO_MISSION, PILLARS } from "@/data/laef";
import { getHomeImage, HomeImageItem } from "@/services/gallery";
import Hero from "@/components/home/Hero";
import Pillars from "@/components/home/Pillars";
import Founder from "@/components/home/Founder";
import { getImpacts, ImpactItem } from "@/services/impact";
import Impact from "@/components/home/Impact";
import { getPrograms, ProgramItem } from "@/services/program";
import ProgramCard from "@/components/home/ProgramCard";
import ProgramCardSkeleton from "@/components/skeleton/ProgramCardSkeleton";

export default function HomePage() {
  const [homeImages, setHomeImages] = useState<HomeImageItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [impact, setImpact] = useState<ImpactItem[]>([]);
  const [impactLoading, setImpactLoading] = useState<boolean>(true);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [programsLoading, setProgramsLoading] = useState<boolean>(true);

  // Consolidated data fetch executed EXACTLY ONCE on component mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setImpactLoading(true);

      const [imagesResult, impactResult] = await Promise.allSettled([
        getHomeImage(),
        getImpacts(),
      ]);

      if (!isMounted) return;

      // Handle Home Images response
      if (
        imagesResult.status === "fulfilled" &&
        imagesResult.value?.length > 0
      ) {
        setHomeImages(imagesResult.value);
      }

      // Handle Impacts response
      if (
        impactResult.status === "fulfilled" &&
        impactResult.value?.length > 0
      ) {
        setImpact(impactResult.value);
      }

      setImpactLoading(false);
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setProgramsLoading(true);
        const res = await getPrograms();
        setPrograms(res);
      } catch (error: any) {
        console.error("Error fetching programs", error.message);
      } finally {
        setProgramsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Hero Carousel rotation timer (every 20s)
  useEffect(() => {
    if (homeImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % homeImages.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [homeImages]);

  // Fallback hero images if API returns empty
  const displayImages =
    homeImages.length > 0
      ? homeImages.map(
          (item) =>
            item?.data?.url || (item as any)?.url || "/hero-community.jpg",
        )
      : ["/hero-community.jpg"];

  return (
    <>
      <Hero
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        displayImages={displayImages}
        mission={HERO_MISSION}
      />

      <Pillars pillars={PILLARS} />

      <Founder message={FOUNDER_MESSAGE} />

      <Impact impacts={impact} loading={impactLoading} />

      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Our work</p>
            <h2 className="mt-3 text-2xl md:text-4xl">
              Programmes changing communities
            </h2>
          </div>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View all programmes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ProgramCardSkeleton key={i} />
              ))
            : programs.toReversed().slice(0,3).map((p) => <ProgramCard key={p._id || p.slug} p={p} />)}
        </div>
      </section>
    </>
  );
}
