"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { cn } from "@/lib/utils";
import { getAllDonateFunds, DonateFundItems } from "@/services/donate";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default function DonateSlugLayout({ children, params }: LayoutProps) {
  const { slug: activeSlug } = use(params);
  const [funds, setFunds] = useState<DonateFundItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFunds = async () => {
      try {
        setLoading(true);
        const res = await getAllDonateFunds();
        if (isMounted && res?.data) {
          setFunds(res.data);
        }
      } catch (err) {
        console.error("Failed to load donation funds:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFunds();
    return () => {
      isMounted = false;
    };
  }, []);

  // Safe reversal of funds array
  const displayFunds = [...funds].reverse();

  return (
    <>
      <PageHeader
        eyebrow="Give"
        title="Support Our Work"
        lead="Every contribution funds safe spaces, survivor support, and prevention work in communities across Nigeria."
      />

      <section className="container-page py-16">
        {/* Filter Pills Navigation with Skeleton Loader */}
        {loading ? (
          <div className="flex flex-wrap gap-2">
            <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
              <Skeleton height={42} width={100} borderRadius={9999} />
              <Skeleton height={42} width={130} borderRadius={9999} />
              <Skeleton height={42} width={110} borderRadius={9999} />
              <Skeleton height={42} width={120} borderRadius={9999} />
            </SkeletonTheme>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {displayFunds.map((f) => {
              const isActive = activeSlug === f.slug;
              return (
                <Link
                  key={f._id || f.slug}
                  href={`/donate/${f.slug}`}
                  scroll={false}
                  className={cn(
                    "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Dynamic Page Content & Impact Sidebar Container */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>{children}</div>

          {/* Impact Sidebar */}
          <aside className="surface-card rounded-2xl bg-primary p-7 text-primary-foreground md:p-9">
            <ShieldCheck className="h-8 w-8 text-accent" />
            <h2 className="mt-5 text-xl font-bold">Where your gift goes</h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-primary-foreground/80">
              <li>₦5,000 provides educational materials for a Heart Mender classroom session.</li>
              <li>₦25,000 supports a boy through a full Omokunrinnimi mentorship cycle.</li>
              <li>₦50,000 clothes several families through the Bank 200 Charity Cloth Bank.</li>
              <li>₦100,000 helps bring the #SayNoToRape Carnival to a new community.</li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}