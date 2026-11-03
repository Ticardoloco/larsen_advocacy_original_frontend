import ProgramPageScreen from "@/screen/programs/details";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  return <ProgramPageScreen params={params} />;
}