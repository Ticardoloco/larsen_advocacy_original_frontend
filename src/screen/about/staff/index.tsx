"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { getAllStaff, StaffItems } from "@/services/staff";
import Image from "next/image";
import StaffCardSkeleton from "@/components/skeleton/StaffCardSkeleton";

function initials(name: string) {
  return name
    .replace(/^Miss\s+/, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}

export default function StaffScreen() {
  const [staffs, setStaff] = useState<StaffItems[]>([]);
  const [staffsLoading, setStaffLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStaffs = async () => {
      try {
        setStaffLoading(true);
        const res = await getAllStaff();
        if (isMounted) {
          setStaff(res.data);
        }
      } catch (error: any) {
        console.error("Error fetching staffs", error.message);
      } finally {
        if (isMounted) {
          setStaffLoading(false);
        }
      }
    };

    fetchStaffs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader 
        eyebrow="About Us" 
        title="Staff Directory" 
        lead="The people leading our programmes, care and advocacy." 
      />
      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staffsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <StaffCardSkeleton key={i} />
            ))
          ) : (
            staffs.toReversed().map((s) => (
              <article key={s._id} className="surface-card overflow-hidden">
                <div className="relative flex h-72 w-full items-center justify-center bg-secondary overflow-hidden">
                  {s.image ? (
                    <Image
                      fill
                      alt={s.name || "avatar"}
                      src={s.image}
                      className="object-cover object-top"
                    />
                  ) : (
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">
                      {initials(s.name)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-lg text-primary">{s.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-accent">{s.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.bio}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}