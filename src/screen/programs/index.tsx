"use client";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { PROGRAMS } from "@/data/laef";
import { useEffect, useState } from "react";
import { getPrograms, ProgramItem } from "@/services/program";
import ProgramCard from "@/components/home/ProgramCard";
import ProgramCardSkeleton from "@/components/skeleton/ProgramCardSkeleton";

export const metadata: Metadata = {
  title: "Our Work / Programmes — LAEF",
  description:
    "Omokunrinnimi, Heart Mender Series, FinFit Fellowship, Omosuyi Storytelling, Focus March, Bank 200 and Community Champions.",
  openGraph: {
    title: "Our Work / Programmes — LAEF",
    description:
      "Seven programmes delivering prevention, response and empowerment.",
  },
};

export default function ProgramsIndex() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [programsLoading, setProgramsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setProgramsLoading(true);
        const res = await getPrograms();
        setPrograms(res);
      } catch (error: any) {
        console.error("Error fetching program", error.message);
      } finally {
        setProgramsLoading(false);
      }
    };

    fetchPrograms();
  }, []);
  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Programmes"
        lead="Community-based projects, child empowerment programmes, health and wellness initiatives, and advocacy for social justice."
      />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2">
          { programsLoading ? Array.from({length: 7}).map((_, i)=>(
            <ProgramCardSkeleton key={i}/>
          )): programs.toReversed().map((p) => (
            <ProgramCard key={p.slug} p={p} />
          )) }
        </div>
      </section>
    </>
  );
}
