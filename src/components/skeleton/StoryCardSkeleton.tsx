import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const StoryCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <li className="relative pb-12 last:pb-0">
        {/* Timeline bullet placeholder matching the original node */}
        <span className="absolute -left-10.25 mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted bg-background" />
        
        {/* Year / Eyebrow skeleton */}
        <div className="mb-2">
          <Skeleton height={14} width={60} />
        </div>

        {/* Title skeleton */}
        <div className="mt-2">
          <Skeleton height={24} width="70%" />
        </div>

        {/* Body paragraph skeleton (2 lines) */}
        <div className="mt-3 max-w-2xl space-y-2">
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="85%" />
        </div>
      </li>
    </SkeletonTheme>
  );
};

export default StoryCardSkeleton;