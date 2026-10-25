import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ProgramDetailSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        {/* Left Side: Paragraphs, Callout, and Buttons */}
        <div>
          {/* Paragraph Skeletons */}
          <div className="space-y-2 mb-6">
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="95%" />
            <Skeleton height={16} width="85%" />
          </div>
          <div className="space-y-2 mb-8">
            <Skeleton height={16} width="98%" />
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="60%" />
          </div>

          {/* Callout Box Skeleton */}
          <div className="surface-card mt-8 border-l-4 border-l-accent/40 bg-sage-soft p-7">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton circle height={16} width={16} />
              <Skeleton height={14} width="35%" />
            </div>
            <div className="space-y-2">
              <Skeleton height={14} width="100%" />
              <Skeleton height={14} width="75%" />
            </div>
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Skeleton height={48} width={150} borderRadius={9999} />
            <Skeleton height={48} width={120} borderRadius={9999} />
          </div>
        </div>

        {/* Right Side: Image Skeleton */}
        <div className="aspect-4/3 w-full rounded-[2rem] overflow-hidden">
          <Skeleton height="100%" width="100%" />
        </div>
      </section>
    </SkeletonTheme>
  );
};

export default ProgramDetailSkeleton;