import Image from "next/image";
import React from "react";
import { Button } from "../site/Button";
import Link from "next/link";
const Hero = ({
  displayImages,
  setCurrentImageIndex,
  currentImageIndex,
  mission
}: {
  displayImages: string[];
  setCurrentImageIndex: (index: number)=>void;
  currentImageIndex: number;
  mission: string;
}) => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">Larsen Advocacy and Empowerment Foundation</p>
          <h1 className="mt-4 text-3xl leading-[1.1] md:text-5xl">
            Safety, dignity, healing and justice for every survivor.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85">
            {mission}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/donate">Donate Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-white text-secondary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/donate/partner">Partner With Us</Link>
            </Button>
          </div>
        </div>

        {/* Hero Image Container with Cinematic Slow Cross-Fade Carousel */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-4xl shadow-(--shadow-lift)">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2.5rem] bg-accent/15 blur-2xl z-0"
          />

          {displayImages.map((src, idx) => {
            const isActive = idx === currentImageIndex;
            return (
              <div
                key={src + idx}
                className={`absolute inset-0 transition-all duration-2500 ease-in-out ${
                  isActive
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-110 pointer-events-none z-0"
                }`}
              >
                <Image
                  src={src}
                  alt="LAEF Community Empowerment"
                  fill
                  priority={idx === 0}
                  className={`object-cover transition-transform duration-20000 ease-linear ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
            );
          })}

          {/* Glassmorphic Slide Indicators */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 z-20 bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentImageIndex
                      ? "w-7 bg-accent"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
