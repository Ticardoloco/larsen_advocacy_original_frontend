import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const OtherProgramCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="surface-card p-6">
        {/* Title Skeleton */}
        <Skeleton height={20} width="65%" />

        {/* Tagline Skeleton */}
        <div className="mt-2">
          <Skeleton height={14} width="85%" />
        </div>

        {/* Action/Arrow link placeholder skeleton */}
        <div className="mt-4">
          <Skeleton height={16} width={80} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default OtherProgramCardSkeleton;