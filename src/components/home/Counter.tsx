"use client"
import { useEffect, useRef, useState } from "react";

export function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Force count back to 0 immediately when target value changes
    setShown(0);

    let animationFrameId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        
        // Disconnect observer so it only triggers once per value update
        observer.disconnect();

        const duration = 1600; // Animation duration in ms
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic formula to count smoothly from 0 to value
          const current = Math.round(value * (1 - Math.pow(1 - progress, 3)));
          setShown(current);

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(tick);
          }
        };

        animationFrameId = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value]); // Trigger animation restart whenever target value arrives from API

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-accent md:text-5xl">
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
}