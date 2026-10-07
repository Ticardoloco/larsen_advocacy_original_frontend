import DonatePageScreen from "@/screen/donate";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return <DonatePageScreen searchParams={searchParams} />;
}