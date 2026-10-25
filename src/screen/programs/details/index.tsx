"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { getProgramBySlug, getPrograms, ProgramItem } from "@/services/program";
import ProgramCard from "@/components/programs/ProgramCard";
import ProgramDetailSkeleton from "@/components/skeleton/ProgramDetailSkeleton";
import PageHeaderSkeleton from "@/components/skeleton/PageHeaderSkeleton";
import OtherProgramCard from "@/components/programs/OtherProgramCard";
import OtherProgramCardSkeleton from "@/components/skeleton/OtherProgramCardSkeleton";

interface ProgramScreenProps {
  params: Promise<{ slug: string }>;
}

export default function ProgramDetailsScreen({ params }: ProgramScreenProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [programData, setProgramData] = useState<ProgramItem | null>(null);
  const [programDataLoading, setProgramDataLoading] = useState<boolean>(true);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [programsLoading, setProgramsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    const fetchProgramData = async () => {
      try {
        setProgramDataLoading(true);
        const res = await getProgramBySlug(slug);
        
        if (isMounted) {
          setProgramData(res);
        }
      } catch (error: any) {
        console.error("Error fetching program data", error.message);
      } finally {
        if (isMounted) {
          setProgramDataLoading(false);
        }
      }
    };

    fetchProgramData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

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

  const others = [...programs]
    .reverse()
    .filter((p) => p.slug !== slug)
    .slice(0, 3);
  const imageSrc = programData?.image || "";

  return (
    <>
      {/* Header Skeleton vs Real Header */}
      {programDataLoading ? (
        <PageHeaderSkeleton />
      ) : (
        <PageHeader
          eyebrow="Our Work"
          title={programData?.name ?? "Programme"}
          lead={programData?.taglines ?? ""}
        />
      )}

      {/* Body Skeleton vs Real Content */}
      {programDataLoading ? (
        <ProgramDetailSkeleton />
      ) : (
        <ProgramCard programData={programData} imageSrc={imageSrc} />
      )}

      {/* Other Programmes Section - Now uses its own programsLoading state */}
      <section className="container-page pb-20 mt-10">
        <h2 className="text-2xl mb-6">Other programmes</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {programsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <OtherProgramCardSkeleton key={i} />
            ))
          ) : (
            others.map((p) => (
              <OtherProgramCard key={p.slug} p={p} />
            ))
          )}
        </div>
      </section>
    </>
  );
}