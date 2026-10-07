"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Banknote, CreditCard, Handshake, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/site/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { cn } from "@/lib/utils";

type Tab = "general" | "omokunrinnimi" | "bank200" | "campaign" | "partner";

const tabs: { id: Tab; label: string; blurb: string }[] = [
  { id: "general", label: "General Donation", blurb: "Support the full breadth of LAEF's prevention, response and empowerment work." },
  { id: "omokunrinnimi", label: "Sponsor Omokunrinnimi", blurb: "Sponsor safe spaces and mentorship for boys aged 8–18." },
  { id: "bank200", label: "Support Bank 200 / Team Card", blurb: "A team card is a pooled donation by a group of people, church, mosque, business, school, or organization to support Bank 200 Charity Cloth Bank." },
  { id: "campaign", label: "Support Campaign", blurb: "Fund the Focus March Against Sexual Violence (#SayNoToRape Carnival)." },
  { id: "partner", label: "Partner With Us", blurb: "Bring a LAEF programme to your school, community or organisation." },
];

const presets = [5000, 10000, 25000, 50000, 100000];

interface DonatePageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default function DonatePage({ searchParams }: DonatePageProps) {
  const resolvedSearchParams = use(searchParams);
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  
  // Support both server searchParams and client searchParams hook
  const rawTab = searchParamsHook.get("tab") || resolvedSearchParams?.tab;
  const validTabs = tabs.map((t) => t.id);
  const active: Tab = validTabs.includes(rawTab as Tab) ? (rawTab as Tab) : "general";

  const [amount, setAmount] = useState(10000);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"card" | "transfer">("card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [done, setDone] = useState(false);

  const current = tabs.find((t) => t.id === active)!;
  const finalAmount = custom ? Number(custom.replace(/\D/g, "")) || 0 : amount;

  const handleTabChange = (tabId: Tab) => {
    router.push(`/donate?tab=${tabId}`, { scroll: false });
  };

  return (
    <>
      <PageHeader
        eyebrow="Give"
        title="Donate"
        lead="Every contribution funds safe spaces, survivor support, and prevention work in communities across Nigeria."
      />

      <section className="container-page py-16">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                active === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-secondary",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{current.blurb}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <form
            className="surface-card p-7 md:p-9"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            {active === "partner" ? (
              <>
                <h2 className="text-xl text-primary">Partner With Us</h2>
                <div className="mt-6 grid gap-4">
                  <Field label="Organisation name" value={teamName} onChange={setTeamName} placeholder="Your organisation" />
                  <Field label="Contact person" value={name} onChange={setName} placeholder="Full name" />
                  <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">How would you like to partner?</span>
                    <textarea
                      rows={4}
                      required
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      placeholder="Tell us about your school, community or organisation"
                    />
                  </label>
                </div>
                <Button type="submit" size="lg" className="mt-7 w-full">
                  <Handshake className="h-4 w-4" /> Send partnership request
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl text-primary">Choose an amount</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setAmount(p);
                        setCustom("");
                      }}
                      className={cn(
                        "rounded-xl border px-5 py-3 text-sm font-bold transition-colors",
                        !custom && amount === p
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-primary hover:bg-secondary",
                      )}
                    >
                      ₦{p.toLocaleString()}
                    </button>
                  ))}
                  <input
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="Other amount"
                    inputMode="numeric"
                    className="w-36 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                {active === "bank200" && (
                  <div className="mt-6 rounded-xl bg-sage-soft p-5">
                    <Field label="Team card group (optional)" value={teamName} onChange={setTeamName} placeholder="Church, school, business or group name" required={false} />
                  </div>
                )}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" value={name} onChange={setName} placeholder="Your name" />
                  <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
                </div>

                <div className="mt-8">
                  <span className="text-sm font-semibold text-foreground">Payment method</span>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {([
                      { id: "card", label: "Card payment", icon: CreditCard },
                      { id: "transfer", label: "Bank transfer", icon: Banknote },
                    ] as const).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                          method === m.id ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground",
                        )}
                      >
                        <m.icon className="h-4 w-4" /> {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {method === "card" ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Card number" value="" onChange={() => {}} placeholder="4242 4242 4242 4242" uncontrolled />
                    </div>
                    <Field label="Expiry" value="" onChange={() => {}} placeholder="MM/YY" uncontrolled />
                    <Field label="CVV" value="" onChange={() => {}} placeholder="123" uncontrolled />
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-primary">Bank transfer details</p>
                    <p className="mt-2">Account name: Larsen Advocacy and Empowerment Foundation</p>
                    <p>Account number: 0123456789</p>
                    <p>Bank: LAEF Partner Bank</p>
                    <p className="mt-2">Use your full name as the transfer reference, then confirm below.</p>
                  </div>
                )}

                <Button type="submit" size="lg" className="mt-8 w-full">
                  <Lock className="h-4 w-4" /> Give ₦{finalAmount.toLocaleString()}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  This is a demonstration payment form. No real transaction is processed.
                </p>
              </>
            )}
          </form>

          <aside className="surface-card bg-primary p-7 text-primary-foreground md:p-9">
            <ShieldCheck className="h-8 w-8 text-accent" />
            <h2 className="mt-5 text-xl">Where your gift goes</h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-primary-foreground/80">
              <li>₦5,000 provides educational materials for a Heart Mender classroom session.</li>
              <li>₦25,000 supports a boy through a full Omokunrinnimi mentorship cycle.</li>
              <li>₦50,000 clothes several families through the Bank 200 Charity Cloth Bank.</li>
              <li>₦100,000 helps bring the #SayNoToRape Carnival to a new community.</li>
            </ul>
          </aside>
        </div>
      </section>

      {done && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-primary-deep/80 p-5 backdrop-blur-sm">
          <div className="surface-card w-full max-w-md p-8 text-center">
            <BadgeCheck className="mx-auto h-14 w-14 text-success" />
            <h2 className="mt-5 text-2xl text-primary">Thank you{name ? `, ${name.split(" ")[0]}` : ""}!</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {active === "partner"
                ? "Your partnership request has been received. Our team will reach out to you shortly."
                : `Your ₦${finalAmount.toLocaleString()} contribution to ${current.label} was successful. A receipt is on its way to ${email || "your email"}.`}
            </p>
            <Button className="mt-7 w-full" size="lg" onClick={() => setDone(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
  uncontrolled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  uncontrolled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        {...(uncontrolled ? {} : { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value) })}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}