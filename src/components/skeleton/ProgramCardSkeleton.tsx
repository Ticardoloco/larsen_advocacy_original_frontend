import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export const ProgramCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="surface-card flex flex-col p-6">
        {/* Title Skeleton */}
        <Skeleton height={24} width="70%" />

        {/* Tagline Skeleton */}
        <div className="mt-2">
          <Skeleton height={18} width="45%" />
        </div>

        {/* Body Skeleton (3 lines to match line-clamp-3) */}
        <div className="mt-3 space-y-1.5">
          <Skeleton height={14} width="100%" />
          <Skeleton height={14} width="95%" />
          <Skeleton height={14} width="60%" />
        </div>

        {/* CTA "Learn more" Skeleton */}
        <div className="mt-5">
          <Skeleton height={20} width={110} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProgramCardSkeleton;