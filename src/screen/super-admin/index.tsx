"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  TrendingUp,
  HeartHandshake,
  Loader2,
  PieChart as PieChartIcon,
  BarChart3,
  Globe,
  Coins,
  ArrowUpRight,
  FolderHeart,
  Table as TableIcon,
} from "lucide-react";
import {
  getAllDonationTransactions,
  getAllDonateFunds,
  DonationTransactionItems,
  DonateFundItems,
} from "@/services/donate";

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<DonationTransactionItems[]>([]);
  const [funds, setFunds] = useState<DonateFundItems[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<"NGN" | "USD" | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"table" | "bar">("table");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [donationsRes, fundsRes] = await Promise.all([
          getAllDonationTransactions(),
          getAllDonateFunds(),
        ]);

        setTransactions(donationsRes.data || []);

        // Filter out any fund containing "partner"
        const filteredFunds = (fundsRes.data || []).filter((f) => {
          const text = `${f.label || ""} ${f.slug || ""}`.toLowerCase();
          return !text.includes("partner");
        });

        setFunds(filteredFunds);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute Financial Aggregations & Monthly Trends Strictly for Successful Transactions
  const metrics = useMemo(() => {
    // Helper to normalize fund names and unify aliases (e.g. omokunrinnimi vs omokunrinimi)
    const normalizeFundName = (rawName: string = "") => {
      let clean = rawName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.includes("omokunrin")) {
        return "omokunrinimi";
      }
      return clean;
    };

    // Filter strictly for successful transactions
    const successfulTxs = transactions.filter((tx) => {
      const status = tx.status?.toLowerCase().trim() || "";
      const isPartner = `${tx.fund || ""}`.toLowerCase().includes("partner");
      const isSuccessful =
        status === "success" || status === "successful" || status === "completed";
      return isSuccessful && !isPartner;
    });

    let totalNgn = 0;
    let totalUsd = 0;

    const fundMap: Record<string, { label: string; ngn: number; usd: number; count: number }> = {};

    // 1. Initialize map strictly with filtered registered funds
    funds.forEach((f) => {
      const displayLabel = (f.label || f.slug || "Fund").trim();
      const normKey = normalizeFundName(f.label || f.slug || f._id);

      if (!fundMap[normKey]) {
        fundMap[normKey] = {
          label: displayLabel,
          ngn: 0,
          usd: 0,
          count: 0,
        };
      }
    });

    const uncategorizedKey = "other_uncategorized";

    // 2. Map every successful transaction to its respective fund
    successfulTxs.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const currency = tx.currency?.toUpperCase() || "NGN";
      const rawTxFund = (tx.fund || "").trim();
      const txNormKey = normalizeFundName(rawTxFund);

      // Accumulate overall successful totals
      if (currency === "USD") {
        totalUsd += amount;
      } else {
        totalNgn += amount;
      }

      // Match against registered funds using ID, slug, or normalized name
      const matchedFund = funds.find((f) => {
        return (
          f._id === rawTxFund ||
          normalizeFundName(f.slug) === txNormKey ||
          normalizeFundName(f.label) === txNormKey
        );
      });

      const targetKey = matchedFund
        ? normalizeFundName(matchedFund.label || matchedFund.slug || matchedFund._id)
        : fundMap[txNormKey]
        ? txNormKey
        : uncategorizedKey;

      if (!fundMap[targetKey]) {
        fundMap[targetKey] = {
          label: rawTxFund ? rawTxFund : "General Donation",
          ngn: 0,
          usd: 0,
          count: 0,
        };
      }

      if (currency === "USD") {
        fundMap[targetKey].usd += amount;
      } else {
        fundMap[targetKey].ngn += amount;
      }
      fundMap[targetKey].count += 1;
    });

    // Clean up empty uncategorized bucket if no transactions fell into it
    if (fundMap[uncategorizedKey] && fundMap[uncategorizedKey].count === 0) {
      delete fundMap[uncategorizedKey];
    }

    // 3. Aggregate Monthly Inflow Trends from successful transactions
    const monthlyMap: Record<string, { ngn: number; usd: number }> = {};
    successfulTxs.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const currency = tx.currency?.toUpperCase() || "NGN";
      const dateObj = tx.createdAt ? new Date(tx.createdAt) : new Date();
      const monthKey = dateObj.toLocaleString("en-US", { month: "short", year: "numeric" });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { ngn: 0, usd: 0 };
      }
      if (currency === "USD") {
        monthlyMap[monthKey].usd += amount;
      } else {
        monthlyMap[monthKey].ngn += amount;
      }
    });

    return {
      totalNgn,
      totalUsd,
      totalCount: successfulTxs.length,
      fundBreakdown: fundMap,
      monthlyData: monthlyMap,
    };
  }, [transactions, funds]);

  // Compute maximum monthly values for scaling bar chart heights
  const monthlyEntries = Object.entries(metrics.monthlyData);

  const maxMonthlyVal = useMemo(() => {
    let max = 0;
    monthlyEntries.forEach(([_, vals]) => {
      if (selectedCurrency === "ALL" || selectedCurrency === "NGN") {
        if (vals.ngn > max) max = vals.ngn;
      }
      if (selectedCurrency === "ALL" || selectedCurrency === "USD") {
        if (vals.usd > max) max = vals.usd;
      }
    });
    return max || 1;
  }, [monthlyEntries, selectedCurrency]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto w-full px-2 sm:px-0">
      {/* Executive Welcome Header */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 mb-2">
            <Coins className="h-3.5 w-3.5" /> Root Executive Console
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Financial & System Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Monitor successful donation transactions, multi-currency revenue streams, and fund performance metrics.
          </p>
        </div>

        {/* Currency Filter Dropdown */}
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-xl border border-border self-start sm:self-center shrink-0">
          <Globe className="h-4 w-4 text-muted-foreground ml-2" />
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-primary focus:outline-none pr-2 py-1 cursor-pointer"
          >
            <option value="ALL">All Currencies</option>
            <option value="NGN">NGN Only (₦)</option>
            <option value="USD">USD Only ($)</option>
          </select>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total NGN Contribution */}
        {(selectedCurrency === "ALL" || selectedCurrency === "NGN") && (
          <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2 bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                Successful Contributions (NGN)
              </span>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                ₦
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary truncate">
              ₦{metrics.totalNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" /> Verified successful local revenue
            </p>
          </div>
        )}

        {/* Total USD Contribution */}
        {(selectedCurrency === "ALL" || selectedCurrency === "USD") && (
          <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2 bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                Successful Contributions (USD)
              </span>
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
                $
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary truncate">
              ${metrics.totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" /> Verified successful foreign revenue
            </p>
          </div>
        )}

        {/* Total Successful Transaction Count */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2 bg-card shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
              Successful Transactions
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">
            {metrics.totalCount}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Completed payment records
          </p>
        </div>
      </div>

      {/* Fund Breakdown Section */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary shrink-0" /> Contributions by Specific Fund
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Financial breakdown across registered foundation campaigns and causes based on successful donations.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 shrink-0">
            <FolderHeart className="h-4 w-4 text-primary" /> {Object.keys(metrics.fundBreakdown).length} Registered Funds
          </span>
        </div>

        {Object.keys(metrics.fundBreakdown).length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No successful fund contribution records available yet.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(metrics.fundBreakdown).map(([key, data]) => (
              <div
                key={key}
                className="surface-card p-4 sm:p-5 rounded-2xl border border-border/80 bg-secondary/20 space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-primary text-sm truncate" title={data.label}>
                    {data.label}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary shrink-0">
                    {data.count} {data.count === 1 ? "Donation" : "Donations"}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  {(selectedCurrency === "ALL" || selectedCurrency === "NGN") && (
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="text-muted-foreground shrink-0">NGN Total:</span>
                      <span className="font-bold text-primary truncate">
                        ₦{data.ngn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {(selectedCurrency === "ALL" || selectedCurrency === "USD") && (
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="text-muted-foreground shrink-0">USD Total:</span>
                      <span className="font-bold text-primary truncate">
                        ${data.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Financial Performance with Table/Bar View Switcher */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary shrink-0" /> Monthly Financial Performance
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chronological breakdown of successful money contributed month by month.
            </p>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border self-start sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" /> Table View
            </button>
            <button
              onClick={() => setViewMode("bar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "bar"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Bar Chart View
            </button>
          </div>
        </div>

        {monthlyEntries.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No monthly financial inflow data recorded.
          </div>
        ) : (
          <>
            {/* VIEW 1: TABLE VIEW */}
            {viewMode === "table" && (
              <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
                <table className="w-full text-left text-sm min-w-[550px]">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-semibold">Month & Year</th>
                      <th className="pb-3 font-semibold">NGN Inflow (₦)</th>
                      <th className="pb-3 font-semibold">USD Inflow ($)</th>
                      <th className="pb-3 font-semibold text-right">Inflow Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {monthlyEntries.map(([month, vals]) => (
                      <tr key={month} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-4 font-bold text-primary whitespace-nowrap">
                          {month}
                        </td>
                        <td className="py-4 font-semibold text-foreground whitespace-nowrap">
                          ₦{vals.ngn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 font-semibold text-foreground whitespace-nowrap">
                          ${vals.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
                            <ArrowUpRight className="h-3.5 w-3.5" /> Verified Success
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 2: RESPONSIVE VERTICAL COLUMN BAR CHART */}
            {viewMode === "bar" && (
              <div className="space-y-6 pt-4">
                {/* Legend */}
                <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold justify-end flex-wrap">
                  {(selectedCurrency === "ALL" || selectedCurrency === "NGN") && (
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-sm bg-emerald-600 inline-block shadow-xs" /> NGN Inflow (₦)
                    </div>
                  )}
                  {(selectedCurrency === "ALL" || selectedCurrency === "USD") && (
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-sm bg-blue-600 inline-block shadow-xs" /> USD Inflow ($)
                    </div>
                  )}
                </div>

                {/* Vertical Bar Columns Container */}
                <div className="w-full overflow-x-auto pb-4 pt-2 -mx-5 sm:mx-0 px-5 sm:px-0">
                  <div className="min-w-[500px] sm:min-w-[650px] h-72 sm:h-80 flex items-end justify-between gap-4 sm:gap-6 border-b border-border px-2 sm:px-4 relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-b border-border w-full" />
                      <div className="border-b border-border w-full" />
                      <div className="border-b border-border w-full" />
                      <div className="border-b border-border w-full" />
                    </div>

                    {monthlyEntries.map(([month, vals]) => {
                      const ngnHeightPct = Math.max(8, Math.round((vals.ngn / maxMonthlyVal) * 100));
                      const usdHeightPct = Math.max(8, Math.round((vals.usd / maxMonthlyVal) * 100));

                      return (
                        <div key={month} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                          {/* Columns Group */}
                          <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-56 sm:h-64 px-0.5">
                            {/* NGN Pillar */}
                            {(selectedCurrency === "ALL" || selectedCurrency === "NGN") && (
                              <div
                                style={{ height: `${ngnHeightPct}%` }}
                                className="w-full max-w-[32px] sm:max-w-[36px] bg-emerald-600 rounded-t-lg transition-all duration-500 relative group-hover:brightness-110 shadow-sm flex flex-col items-center justify-start pt-1.5"
                              >
                                <span className="text-[8px] sm:text-[9px] font-bold text-white [writing-mode:vertical-lr] rotate-180 tracking-tighter opacity-90">
                                  ₦{vals.ngn > 0 ? vals.ngn.toLocaleString() : 0}
                                </span>
                              </div>
                            )}

                            {/* USD Pillar */}
                            {(selectedCurrency === "ALL" || selectedCurrency === "USD") && (
                              <div
                                style={{ height: `${usdHeightPct}%` }}
                                className="w-full max-w-[32px] sm:max-w-[36px] bg-blue-600 rounded-t-lg transition-all duration-500 relative group-hover:brightness-110 shadow-sm flex flex-col items-center justify-start pt-1.5"
                              >
                                <span className="text-[8px] sm:text-[9px] font-bold text-white [writing-mode:vertical-lr] rotate-180 tracking-tighter opacity-90">
                                  ${vals.usd > 0 ? vals.usd.toLocaleString() : 0}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Month Label */}
                          <div className="mt-3 text-[11px] sm:text-xs font-bold text-primary whitespace-nowrap">
                            {month}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}