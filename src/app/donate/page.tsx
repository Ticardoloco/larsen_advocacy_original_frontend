"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// @ts-expect-error CSS side-effect imports may not have declarations in this package.
import "react-loading-skeleton/dist/skeleton.css";

export default function DonateRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/donate/general");
  }, [router]);

  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      {/* Page Header Area */}
      <div className="bg-muted/30 py-12 border-b border-border">
        <div className="container-page max-w-4xl space-y-3">
          <Skeleton height={18} width={90} className="rounded-full" />
          <Skeleton height={38} width="55%" className="rounded-lg" />
          <Skeleton height={20} width="85%" className="rounded" />
        </div>
      </div>

      {/* Main Content Area matching [slug] layout */}
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          
          {/* Left Column: Slug Tabs & Donation Form */}
          <div className="space-y-6">
            
            {/* Fund Navigation Pills Skeleton */}
            <div className="flex flex-wrap gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={40} width={120} className="rounded-xl" />
              ))}
            </div>

            {/* Campaign Blurb Description Skeleton */}
            <div className="space-y-2 py-2">
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="75%" />
            </div>

            {/* Donation Form Card Skeleton */}
            <div className="surface-card p-7 md:p-9 rounded-2xl border border-border space-y-6">
              <Skeleton height={26} width="40%" />

              {/* Currency Selector Pills */}
              <div className="flex gap-3">
                <Skeleton height={34} width={65} className="rounded-xl" />
                <Skeleton height={34} width={65} className="rounded-xl" />
              </div>

              {/* Preset Amount Buttons Grid */}
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height={48} width={95} className="rounded-xl" />
                ))}
              </div>

              {/* Custom Amount Field */}
              <div className="space-y-2 pt-2">
                <Skeleton height={14} width={140} />
                <Skeleton height={48} className="w-full rounded-xl" />
              </div>

              {/* Donor Info Inputs (Name & Email) */}
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="space-y-2">
                  <Skeleton height={14} width={80} />
                  <Skeleton height={48} className="w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton height={14} width={90} />
                  <Skeleton height={48} className="w-full rounded-xl" />
                </div>
              </div>

              {/* Submit Button Skeleton */}
              <div className="pt-4">
                <Skeleton height={52} className="w-full rounded-xl" />
                <Skeleton height={14} width={200} className="mx-auto mt-3" />
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar / Impact Info Skeleton */}
          <div className="hidden lg:block space-y-6">
            <div className="surface-card p-6 rounded-2xl border border-border space-y-4">
              <Skeleton height={22} width="60%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="90%" />
              <Skeleton height={16} width="80%" />
            </div>
          </div>

        </div>
      </div>
    </SkeletonTheme>
  );
}