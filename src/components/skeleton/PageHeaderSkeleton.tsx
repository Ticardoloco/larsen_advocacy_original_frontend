import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export const PageHeaderSkeleton = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Decorative background blur element to match original header */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />
      
      {/* Skeleton Theme adapted for dark backgrounds */}
      <SkeletonTheme 
        baseColor="rgba(255, 255, 255, 0.1)" 
        highlightColor="rgba(255, 255, 255, 0.2)"
      >
        <div className="container-page relative py-16 md:py-20">
          {/* Eyebrow placeholder */}
          <div className="mb-2">
            <Skeleton height={14} width={90} />
          </div>

          {/* Title placeholder (matches 3xl to 5xl scaling) */}
          <div className="mt-3 max-w-3xl">
            <Skeleton height={42} width="75%" />
          </div>

          {/* Lead text placeholder (2 lines) */}
          <div className="mt-5 max-w-2xl space-y-2">
            <Skeleton height={18} width="95%" />
            <Skeleton height={18} width="60%" />
          </div>

          {/* Action buttons/children placeholder */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Skeleton height={44} width={140} borderRadius={9999} />
          </div>
        </div>
      </SkeletonTheme>
    </section>
  );
};

export default PageHeaderSkeleton;