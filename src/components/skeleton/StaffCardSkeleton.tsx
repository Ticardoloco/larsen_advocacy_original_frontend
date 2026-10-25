import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const StaffCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <article className="surface-card overflow-hidden">
        {/* Updated image container height to match the new h-72 card layout */}
        <div className="h-72 w-full bg-secondary">
          <Skeleton height="100%" width="100%" />
        </div>
        
        {/* Content placeholder */}
        <div className="p-6">
          <Skeleton height={20} width="70%" className="mb-2" />
          <Skeleton height={16} width="45%" className="mb-4" />
          <div className="space-y-2">
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="85%" />
          </div>
        </div>
      </article>
    </SkeletonTheme>
  );
};

export default StaffCardSkeleton;