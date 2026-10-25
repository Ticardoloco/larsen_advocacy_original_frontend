"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BadgeCheck, Handshake, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/site/Button";
import { cn } from "@/lib/utils";
import {
  getDonateFundBySlug,
  initializeDonation,
  verifyDonations,
  DonateFundItems,
  DonationTransactionPayload,
} from "@/services/donate";
import { postPartner } from "@/services/partner";

const presets = {
  NGN: [5000, 10000, 25000, 50000, 100000],
  USD: [10, 50, 100, 500, 1000, 5000],
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DonateSlugPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [fundData, setFundData] = useState<DonateFundItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState<any>(null);

  // Form fields
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [amount, setAmount] = useState<number | null>(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

  // Partner message state
  const [partnerMessage, setPartnerMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Helper function to reset form inputs
  const resetForm = () => {
    setDonorName("");
    setEmail("");
    setOrganisationName("");
    setPartnerMessage("");
    setCustomAmount("");
    setAmount(10000);
  };

  // 1. Verify payment automatically if a reference is present in the URL query
  useEffect(() => {
    if (!reference) return;

    let isMounted = true;
    const verifyTransaction = async () => {
      try {
        setVerifying(true);
        const res = await verifyDonations(reference);
        if (isMounted && res.data) {
          setVerifiedData(res.data);
          setDone(true);
          toast.success("Payment verified successfully!");
        }
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Payment verification failed."
        );
      } finally {
        if (isMounted) setVerifying(false);
      }
    };

    verifyTransaction();
    return () => {
      isMounted = false;
    };
  }, [reference]);

  // 2. Fetch fund details
  useEffect(() => {
    let isMounted = true;
    const fetchFund = async () => {
      try {
        setLoading(true);
        const res = await getDonateFundBySlug(slug);
        if (isMounted && res.data) {
          setFundData(res.data);
        }
      } catch (err: any) {
        toast.error("Failed to load campaign details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFund();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Calculate the final numerical amount safely
  const parsedCustom = Number(customAmount.replace(/\D/g, ""));
  const finalAmount = customAmount ? parsedCustom : amount || 0;
  const isPartner = slug === "partner";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPartner) {
      if (finalAmount <= 0) {
        toast.error("Please select or enter a valid donation amount.");
        return;
      }
    }

    if (!donorName.trim() || !email.trim()) {
      toast.error("Please fill in your full name and email address.");
      return;
    }

    setSubmitting(true);
    try {
      if (!isPartner) {
        if (currency === "USD" && finalAmount > 5000) {
          toast.error(
            "USD donations are currently limited to a maximum of $5,000 per transaction."
          );
          setSubmitting(false);
          return;
        }

        const payload: DonationTransactionPayload = {
          donorName,
          email,
          amount: finalAmount,
          fund: slug,
          currency,
        };

        const res = await initializeDonation(payload);
        toast.success(res.message || "Donation initialized successfully!");

        const checkoutUrl =
          (res.data as any)?.checkoutUrl ||
          (res.data as any)?.checkout_url ||
          (res.data as any)?.link;

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        } else {
          toast.error("Payment gateway link was not returned.");
        }
      } else {
        const partnerPayload = {
          organisationName: organisationName.trim() || "Independent Partner",
          contactPerson: donorName,
          email,
          howWouldYouLikeToPartner: partnerMessage,
        };

        const res = await postPartner(partnerPayload);
        toast.success(res.message || "Partnership request sent successfully!");
        setDone(true);
        resetForm(); // Clears all partner form fields instantly upon success
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Error processing your request. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="container-page py-24 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-bold text-primary">
          Verifying your payment...
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we confirm your transaction status.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="max-w-2xl text-muted-foreground leading-relaxed mb-6">
        {fundData?.blurb ||
          "Support LAEF's community impact and protection work."}
      </p>

      <form className="surface-card p-7 md:p-9" onSubmit={handleSubmit}>
        {isPartner ? (
          <>
            <h2 className="text-xl text-primary font-bold">Partner With Us</h2>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={donorName}
                  onChange={setDonorName}
                  placeholder="Full name"
                />
                <Field
                  label="Organisation / Company Name"
                  value={organisationName}
                  onChange={setOrganisationName}
                  placeholder="Organization name (Optional)"
                  required={false}
                />
              </div>
              <Field
                label="Email address"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />
              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  How would you like to partner?
                </span>
                <textarea
                  rows={4}
                  required
                  value={partnerMessage}
                  onChange={(e) => setPartnerMessage(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Tell us about your school, community or organisation"
                />
              </label>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-7 w-full"
              disabled={submitting}
            >
              <Handshake className="h-4 w-4 mr-2" />{" "}
              {submitting ? "Sending..." : "Send partnership request"}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl text-primary font-bold">Choose an amount</h2>

            {/* Currency Selector */}
            <div className="mt-4 flex gap-3">
              {(["NGN", "USD"] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => {
                    setCurrency(curr);
                    setAmount(presets[curr][1]);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-xs font-bold transition-colors",
                    currency === curr
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Preset Amounts */}
            <div className="mt-4 flex flex-wrap gap-3">
              {presets[currency].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setAmount(p);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-xl border px-5 py-3 text-sm font-bold transition-colors",
                    !customAmount && amount === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-primary hover:bg-secondary"
                  )}
                >
                  {currency === "NGN" ? "₦" : "$"}
                  {p.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Other / Custom Amount Input */}
            <div className="mt-5">
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">
                  Or enter amount ({currency})
                </span>
                <div className="relative mt-2 flex items-center">
                  <span className="absolute left-4 text-sm font-bold text-muted-foreground">
                    {currency === "NGN" ? "₦" : "$"}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    value={
                      customAmount
                        ? Number(customAmount).toLocaleString()
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setCustomAmount(rawValue);
                      setAmount(null);
                    }}
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-3 text-sm font-semibold outline-none focus:border-primary"
                  />
                </div>
              </label>
            </div>

            {/* Donor Information Fields */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={donorName}
                onChange={setDonorName}
                placeholder="John Doe"
              />
              <Field
                label="Email address"
                value={email}
                onChange={setEmail}
                placeholder="johndoe@example.com"
                type="email"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-8 w-full"
              disabled={submitting || finalAmount <= 0}
            >
              <Lock className="h-4 w-4 mr-2" />
              {submitting
                ? "Redirecting to Payment..."
                : `Donate ${
                    currency === "NGN" ? "₦" : "$"
                  }${finalAmount.toLocaleString()}`}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Encrypted & secure payment redirection.
            </p>
          </>
        )}
      </form>

      {/* Success Modal */}
      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
          <div className="surface-card w-full max-w-md p-8 text-center rounded-2xl">
            <BadgeCheck className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 className="mt-5 text-2xl font-bold text-primary">
              Thank you!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {isPartner
                ? `Your partnership request has been received. Our team will reach out to you shortly.`
                : `Your contribution was successfully verified.`}
            </p>
            <Button
              className="mt-7 w-full"
              size="lg"
              onClick={() => {
                setDone(false);
                router.push(`/donate/${slug}`);
              }}
            >
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}