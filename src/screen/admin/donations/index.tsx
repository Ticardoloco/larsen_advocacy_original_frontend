"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  HeartHandshake,
  Search,
  CheckCircle2,
  Loader2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllDonationTransactions, DonationTransactionItems } from "@/services/donate";

export default function DonationsAdminPage() {
  const [transactions, setTransactions] = useState<DonationTransactionItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFund, setSelectedFund] = useState("all");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await getAllDonationTransactions();
        setTransactions(res.data || []);
      } catch (err) {
        toast.error("Failed to load donation transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Reset to page 1 when search or fund filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFund]);

  // Helper to normalize fund names (merging "omokunrinimi" into "omokunrinnimi")
  const normalizeFundName = (fundRaw?: string) => {
    const fund = fundRaw?.trim().toLowerCase() || "general";
    if (fund === "omokunrinimi") {
      return "omokunrinnimi";
    }
    return fund;
  };

  // Filter out ONLY successful transactions globally
  const successfulTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const status = tx.status?.toLowerCase() || "";
      return status === "success" || status === "successful";
    });
  }, [transactions]);

  // Extract unique fund categories dynamically from successful transactions
  const availableFunds = useMemo(() => {
    const fundsSet = new Set(
      successfulTransactions.map((tx) => normalizeFundName(tx.fund))
    );
    return Array.from(fundsSet);
  }, [successfulTransactions]);

  // Overall successful totals split by currency
  const overallTotals = useMemo(() => {
    let NGN = 0;
    let USD = 0;

    successfulTransactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const currency = tx.currency?.toUpperCase() || "NGN";

      if (currency === "USD") {
        USD += amount;
      } else {
        NGN += amount;
      }
    });

    return { NGN, USD };
  }, [successfulTransactions]);

  // Calculate totals per fund split by currency (successful only)
  const fundMetrics = useMemo(() => {
    const metrics: Record<string, { NGN: number; USD: number; count: number }> = {};

    successfulTransactions.forEach((tx) => {
      const fund = normalizeFundName(tx.fund);
      const amount = Number(tx.amount) || 0;
      const currency = tx.currency?.toUpperCase() || "NGN";

      if (!metrics[fund]) {
        metrics[fund] = { NGN: 0, USD: 0, count: 0 };
      }

      metrics[fund].count += 1;
      if (currency === "USD") {
        metrics[fund].USD += amount;
      } else {
        metrics[fund].NGN += amount;
      }
    });

    return metrics;
  }, [successfulTransactions]);

  // Filtered successful transactions based on search and fund
  const filteredTransactions = useMemo(() => {
    return successfulTransactions.filter((tx) => {
      const matchesSearch =
        tx.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference?.toLowerCase().includes(searchQuery.toLowerCase());

      const txFund = normalizeFundName(tx.fund);
      const matchesFund = selectedFund === "all" || txFund === selectedFund;

      return matchesSearch && matchesFund;
    });
  }, [successfulTransactions, searchQuery, selectedFund]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const startRecordIndex = filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecordIndex = Math.min(currentPage * itemsPerPage, filteredTransactions.length);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">
      {/* Page Header */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border bg-linear-to-r from-primary/5 via-primary/10 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <HeartHandshake className="h-3.5 w-3.5" /> Financial Management
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Successful Donations & Funds</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Monitor verified contributions, filter by specific campaigns, and track split currency totals.
            </p>
          </div>
        </div>
      </div>

      {/* Global Currency Totals */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {/* NGN Global Total Card */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total NGN Raised (Successful)
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
              NGN Gateway
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary truncate">
            ₦{overallTotals.NGN.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 shrink-0" /> Verified NGN donations
          </p>
        </div>

        {/* USD Global Total Card */}
        <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total USD Raised (Successful)
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-500/10 px-2.5 py-1 rounded-full shrink-0">
              International
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary truncate">
            ${overallTotals.USD.toLocaleString()} USD
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 shrink-0" /> Verified USD gifts
          </p>
        </div>
      </div>

      {/* Fund Breakdown Cards */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Campaign Breakdown (Successful Gifts Only)
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableFunds.map((fundName) => {
            const metrics = fundMetrics[fundName] || { NGN: 0, USD: 0, count: 0 };
            const isSelected = selectedFund === fundName;

            return (
              <div
                key={fundName}
                onClick={() => setSelectedFund(fundName)}
                className={`surface-card p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary truncate max-w-[150px]">
                    {fundName} Fund
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground shrink-0">
                    {metrics.count} Gifts
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-border/60">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-xs text-muted-foreground font-medium">NGN Total:</span>
                    <span className="font-bold text-primary">₦{metrics.NGN.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-xs text-muted-foreground font-medium">USD Total:</span>
                    <span className="font-bold text-primary">${metrics.USD.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="surface-card p-4 md:p-6 rounded-2xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by donor, email, reference..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filters & Page Limit Toolbar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="flex-1 md:flex-initial rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Funds ({availableFunds.length})</option>
            {availableFunds.map((f) => (
              <option key={f} value={f} className="capitalize">
                {f} Fund
              </option>
            ))}
          </select>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>

          {selectedFund !== "all" || searchQuery !== "" ? (
            <button
              onClick={() => {
                setSelectedFund("all");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-primary hover:underline px-2 whitespace-nowrap"
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary">Successful Transaction Logs</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {startRecordIndex}–{endRecordIndex} of {filteredTransactions.length} successful records
              {selectedFund !== "all" && ` (${selectedFund} Fund)`}
            </p>
          </div>
        </div>

        {paginatedTransactions.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No successful donation transactions match your selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-semibold">Donor Details</th>
                  <th className="pb-3 font-semibold">Fund / Campaign</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Gateway Ref</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedTransactions.map((tx) => {
                  const fundDisplay = normalizeFundName(tx.fund);

                  return (
                    <tr key={tx._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 font-semibold text-primary">
                        <span className="block truncate max-w-[160px] sm:max-w-xs">
                          {tx.donorName || "Anonymous Donor"}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground truncate max-w-[160px] sm:max-w-xs">
                          {tx.email}
                        </span>
                      </td>
                      <td className="py-4 text-foreground/90 capitalize font-medium">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-secondary text-xs font-semibold text-primary truncate max-w-[130px]">
                          {fundDisplay}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-primary whitespace-nowrap">
                        {tx.currency === "USD" ? "$" : "₦"}
                        {Number(tx.amount).toLocaleString()}
                        <span className="ml-1 text-[10px] font-medium text-muted-foreground uppercase">
                          {tx.currency || "NGN"}
                        </span>
                      </td>
                      <td className="py-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {tx.reference || "N/A"}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredTransactions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-primary">{startRecordIndex}</span> to{" "}
              <span className="font-semibold text-primary">{endRecordIndex}</span> of{" "}
              <span className="font-semibold text-primary">{filteredTransactions.length}</span> results
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-background cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    const isGap = index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className="flex items-center">
                        {isGap && <span className="px-1 text-xs text-muted-foreground">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-background cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}