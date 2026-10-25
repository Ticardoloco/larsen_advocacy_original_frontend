"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { BadgeCheck, Loader2, AlertCircle, HeartHandshake } from "lucide-react";
import { Button } from "@/components/site/Button";
import { verifyDonations } from "@/services/donate";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setErrorMsg("No transaction reference found.");
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        const res = await verifyDonations(reference);
        if (res.data) {
          setSuccessData(res.data);
          toast.success("Payment verified successfully!");
        }
      } catch (err: any) {
        setErrorMsg(
          err.response?.data?.message || "Payment verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [reference]);

  if (loading) {
    return (
      <div className="container-page py-24 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-bold text-primary">
          Verifying your payment...
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please hold on while we confirm your transaction.
        </p>
      </div>
    );
  }

  // Extract donor first name safely
  const donorFirstName = successData?.donorName
    ? successData.donorName.split(" ")[0]
    : successData?.name
    ? successData.name.split(" ")[0]
    : "";

  // Extract the specific fund or program name dynamically
  const fundTitle =
    successData?.fund

  // Determine currency symbol
  const currencySymbol =
    successData?.currency === "USD"
      ? "$"
      : successData?.currency === "GBP"
      ? "£"
      : "₦";

  return (
    <div className="container-page py-20 flex justify-center">
      <div className="surface-card w-full max-w-lg p-8 text-center rounded-2xl shadow-lg border border-border">
        {errorMsg ? (
          <>
            <AlertCircle className="mx-auto h-14 w-14 text-destructive" />
            <h2 className="mt-5 text-2xl font-bold text-primary">
              Verification Failed
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {errorMsg}
            </p>
            <Button
              className="mt-7 w-full"
              size="lg"
              onClick={() => router.push("/donate/general")}
            >
              Back to Donate
            </Button>
          </>
        ) : (
          <>
            <BadgeCheck className="mx-auto h-16 w-16 text-emerald-600" />

            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-primary">
              Thank You{donorFirstName ? `, ${donorFirstName}` : ""}!
            </h2>

            {/* Personalized Cause & Impact Message */}
            <div className="mt-4 rounded-xl bg-primary/5 p-4 text-center border border-primary/10">
              <p className="text-xs uppercase tracking-wider font-semibold text-primary/70">
                Your Impact
              </p>
              <p className="mt-1 text-base font-semibold text-primary flex items-center justify-center gap-1.5">
                <HeartHandshake className="h-5 w-5 text-accent inline" />
                Supporting <span className="underline decoration-accent">{fundTitle}</span>
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Your contribution of{" "}
              <span className="font-bold text-foreground">
                {currencySymbol}
                {successData?.amount?.toLocaleString()}
              </span>{" "}
              was verified successfully. Your generosity makes a direct difference in funding safe spaces and community support across Nigeria.
            </p>

            {/* Transaction Summary Box */}
            <div className="mt-6 text-left text-xs bg-muted/50 p-4 rounded-lg space-y-2 border border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fund:</span>
                <span className="font-medium text-foreground">{fundTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-medium text-foreground">
                  {currencySymbol}
                  {successData?.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-mono text-muted-foreground truncate max-w-45">
                  {reference}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              A digital receipt has been sent to your email address.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push("/donate/general")}
              >
                Explore Other Funds
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}