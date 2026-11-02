"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  HeartHandshake,
  Users,
  MessageSquareQuote,
  TrendingUp,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  CircleDollarSign,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getAllDonationTransactions, DonationTransactionItems } from "@/services/donate";
import { getAllPartners } from "@/services/partner";
import { getAllDonorMessages } from "@/services/donate";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalNgnAmount: 0,
    totalUsdAmount: 0,
    totalPartners: 0,
    totalRemarks: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<DonationTransactionItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("laef_admin_user") || localStorage.getItem("laef_admin_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserName(parsed.fullName || "");
        } catch {}
      }
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [donationsRes, partnersRes, remarksRes] = await Promise.all([
          getAllDonationTransactions().catch(() => ({
            data: [],
            totals: { NGN: "0", USD: "0" },
          })),
          getAllPartners().catch(() => ({ data: [], count: 0 })),
          getAllDonorMessages().catch(() => ({ data: [], count: 0 })),
        ]);

        const allTransactions = donationsRes.data || [];
        const successfulTransactions = allTransactions.filter(
          (tx) => tx.status?.toLowerCase() === "success" || tx.status?.toLowerCase() === "successful"
        );

        setStats({
          totalNgnAmount: Number(donationsRes.totals?.NGN || 0),
          totalUsdAmount: Number(donationsRes.totals?.USD || 0),
          totalPartners: partnersRes.count || partnersRes.data?.length || 0,
          totalRemarks: remarksRes.count || remarksRes.data?.length || 0,
        });

        // Grabs the last 5 transactions and reverses them to display newest first
        setRecentTransactions(successfulTransactions.slice(0, 5));
      } catch (err) {
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">
      {/* Header Banner */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border bg-linear-to-r from-primary/5 via-primary/10 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Staff Operations Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary truncate max-w-full">
              Welcome back{userName ? `, ${userName}` : " to Executive Overview"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Live metrics for foundation donations, partnership submissions, and donor engagements.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* NGN Raised */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              NGN Contributions
            </span>
            <CircleDollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary truncate">
            ₦{stats.totalNgnAmount.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 shrink-0" /> Verified gateway totals
          </p>
        </div>

        {/* USD Raised */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              USD Contributions
            </span>
            <CircleDollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary truncate">
            ${stats.totalUsdAmount.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 shrink-0" /> International gifts
          </p>
        </div>

        {/* Partnership Submissions */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Partnership Requests
            </span>
            <Users className="h-4 w-4 text-primary shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {stats.totalPartners}
          </div>
          <p className="text-xs text-muted-foreground">
            Organizations & schools registered
          </p>
        </div>

        {/* Published Remarks */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Donor Remarks
            </span>
            <MessageSquareQuote className="h-4 w-4 text-primary shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {stats.totalRemarks}
          </div>
          <p className="text-xs text-muted-foreground">
            Curated community notes
          </p>
        </div>
      </div>

      {/* Recent Successful Donations Section */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary shrink-0" />
              Recent Successful Donations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest verified financial contributions received from donors
            </p>
          </div>
          <Link
            href="/admin/donations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
          >
            View All Transactions <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No successful donation transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-semibold">Donor Name</th>
                  <th className="pb-3 font-semibold">Fund / Campaign</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 font-semibold text-primary">
                      <span className="block truncate max-w-[180px] sm:max-w-xs">
                        {tx.donorName || "Anonymous"}
                      </span>
                      <span className="block text-xs font-normal text-muted-foreground truncate max-w-[180px] sm:max-w-xs">
                        {tx.email}
                      </span>
                    </td>
                    <td className="py-4 text-foreground/90 capitalize">
                      <span className="inline-block truncate max-w-[140px] sm:max-w-none">
                        {tx.fund || "General"}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-primary whitespace-nowrap">
                      {tx.currency === "USD" ? "$" : "₦"}
                      {Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3 shrink-0" /> Successful
                      </span>
                    </td>
                    <td className="py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}