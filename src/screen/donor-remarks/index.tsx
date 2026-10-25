"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Heart,
  MessageSquareQuote,
  Lightbulb,
  User,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import {
  getAllDonorMessages,
  DonorMessageItems,
} from "@/services/donate";

export default function DonorRemarksPage() {
  const [remarks, setRemarks] = useState<DonorMessageItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all messages on mount
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getAllDonorMessages();
      setRemarks(res.data || []);
    } catch (err: any) {
      toast.error("Failed to load donor remarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Community Voice"
        title="Words of Encouragement & Donor Remarks"
        lead="Read warm messages, words of support, and advice shared by our donors, advocates, and community partners."
      />

      <section className="container-page py-16">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <MessageSquareQuote className="h-6 w-6 text-accent" />
            Donor Messages ({remarks.length})
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Inspiring thoughts from individuals funding our vision.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="surface-card animate-pulse rounded-2xl p-6 border border-border"
              >
                <div className="h-5 w-1/3 bg-muted rounded mb-4" />
                <div className="h-4 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-4/5 bg-muted rounded mb-6" />
                <div className="h-16 bg-muted/50 rounded-xl p-3" />
              </div>
            ))}
          </div>
        ) : remarks.length === 0 ? (
          /* Empty State */
          <div className="surface-card rounded-2xl p-12 text-center max-w-lg mx-auto border border-border">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-bold text-primary">No Remarks Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for inspiring messages and notes of hope from our community supporters!
            </p>
          </div>
        ) : (
          /* Remarks Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...remarks].map((item) => (
              <div
                key={item._id}
                className="surface-card rounded-2xl p-7 flex flex-col justify-between border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Donor Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {item.donorName ? (
                        item.donorName.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary text-base line-clamp-1">
                        {item.donorName || "Anonymous Donor"}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Message Body */}
                  <blockquote className="text-sm text-foreground/90 italic leading-relaxed mb-4">
                    "{item.message}"
                  </blockquote>
                </div>

                {/* Optional Advice / Recommendation Box */}
                {item.advise && (
                  <div className="mt-4 pt-4 border-t border-border/60 bg-secondary/50 -mx-7 -mb-7 p-5 rounded-b-2xl">
                    <p className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-1">
                      <Lightbulb className="h-3.5 w-3.5 text-accent shrink-0" />
                      Advice for LAEF:
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.advise}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}