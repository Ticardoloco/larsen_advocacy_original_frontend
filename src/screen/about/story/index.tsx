"use client"
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { STORY_TIMELINE } from "@/data/laef";
import { useEffect, useState } from "react";
import { getStories, StoryItems } from "@/services/stories";
import StoryCard from "@/components/stories/StoryCard";
import StoryCardSkeleton from "@/components/skeleton/StoryCardSkeleton";

export const metadata: Metadata = {
  title: "Our Story — LAEF",
  description:
    "Established on March 29, 2014 as Victorious Foundation and officially established as Larsen Advocacy and Empowerment Foundation in 2018.",
  openGraph: {
    title: "Our Story — LAEF",
    description: "How LAEF grew from a single home visit into a national movement.",
  },
};

export default function StoryPage() {
  const [stories, setStories] = useState<StoryItems[]>([]);
  const [storiesLoading, setStoriesLoading] = useState<boolean>(true);

  useEffect(()=>{
    const fetchStories = async ()=>{
      try {
        setStoriesLoading(true);
        const res = await getStories();
        setStories(res.data);
      } catch (error: any) {
        console.error("Error fetching stories", error.message);
      }finally{
        setStoriesLoading(false);
      }
    }
    fetchStories();
  },[]);

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Our Story"
        lead="From a first home visit in 2014 to a survivor-centred foundation working across Nigeria."
      />
      <section className="container-page py-16">
        <ol className="relative border-l border-border pl-8">
          {storiesLoading ? Array.from({length: 4}).map((_, i)=>(
            <StoryCardSkeleton key={i}/>
          )): stories.toReversed().map((item) => (
            <StoryCard
              key={item.year}
              item={item}
            />
          ))}
        </ol>

        <div className="surface-card mt-8 bg-sage-soft p-8">
          <h2 className="text-xl text-primary">Founder</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            LAEF was founded by Miss Omotoyosi Omolade Fadayomi, whose lived experience shapes the foundation&apos;s
            survivor-centred approach, and whose leadership anchors the work of LAEF Care Plus Clinic.
          </p>
        </div>
      </section>
    </>
  );
}