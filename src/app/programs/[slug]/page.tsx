import ProgramPageScreen from "@/screen/programs/details";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export { generateMetadata } from "@/screen/programs/details";

export default async function Page({ params }: PageProps) {
  return <ProgramPageScreen params={params} />;
}