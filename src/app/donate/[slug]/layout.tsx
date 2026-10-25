import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { cn } from "@/lib/utils";
import { getAllDonateFunds, DonateFundItems } from "@/services/donate";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DonateSlugLayout({ children, params }: LayoutProps) {
  const { slug: activeSlug } = await params;

  let funds: DonateFundItems[] = [];
  try {
    const res = await getAllDonateFunds();
    funds = res.data || [];

  } catch (err) {
    funds = [];
  }
  

  return (
    <>
      <PageHeader
        eyebrow="Give"
        title="Support Our Work"
        lead="Every contribution funds safe spaces, survivor support, and prevention work in communities across Nigeria."
      />

      <section className="container-page py-16">
        {/* Fixed Filter Pills Navigation */}
        <div className="flex flex-wrap gap-2">
          {funds.toReversed().map((f) => {
            const isActive = activeSlug === f.slug;
            return (
              <Link
                key={f._id}
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

        {/* Dynamic Page Content & Impact Sidebar Container */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>{children}</div>

          {/* Fixed Impact Sidebar */}
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


