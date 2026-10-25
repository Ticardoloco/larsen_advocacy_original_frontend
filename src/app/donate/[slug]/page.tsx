import DonateSlugPage from "@/screen/donate/details";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function page({ params }: PageProps) {
  return <DonateSlugPage params={params} />;
}