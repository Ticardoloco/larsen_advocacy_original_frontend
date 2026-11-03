"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ClipboardCheck,
  Search,
  Loader2,
  User,
  Calendar,
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { getAllFitTests, deleteFitTest, FitTestResultItem } from "@/services/fitTest";

export default function SuperAdminFitTestResultsPage() {
  const [results, setResults] = useState<FitTestResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedResult, setSelectedResult] = useState<FitTestResultItem | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete Confirmation States
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await getAllFitTests();
      setResults(res.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load fit test results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  // Compute key statistics for overview cards
  const metrics = useMemo(() => {
    const total = results.length;
    if (total === 0) return { total: 0, avgPercentage: 0, passed: 0, failed: 0 };

    let sumPercentage = 0;
    let passed = 0;
    let failed = 0;

    results.forEach((r) => {
      const pct = Number(r.percentage) || 0;
      sumPercentage += pct;

      const st = r.status?.toLowerCase() || "";
      if (st === "pass" || st === "passed" || st === "fit" || pct >= 70) {
        passed++;
      } else {
        failed++;
      }
    });

    return {
      total,
      avgPercentage: Math.round(sumPercentage / total),
      passed,
      failed,
    };
  }, [results]);

  // Extract status categories dynamically
  const availableStatuses = useMemo(() => {
    const statusSet = new Set(
      results.map((r) => r.status?.trim().toLowerCase() || "completed")
    );
    return Array.from(statusSet);
  }, [results]);

  // Filter results based on search query and status selection
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        r.fullName?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q);

      const rStatus = r.status?.trim().toLowerCase() || "completed";
      const matchesStatus = selectedStatus === "all" || rStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [results, searchQuery, selectedStatus]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage) || 1;

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResults, currentPage, itemsPerPage]);

  const startRecordIndex = filteredResults.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecordIndex = Math.min(currentPage * itemsPerPage, filteredResults.length);

  // Helper for score badge colors
  const getScoreBadge = (pct: number) => {
    if (pct >= 80) {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
    }
    if (pct >= 60) {
      return "bg-amber-500/10 text-amber-700 border-amber-200";
    }
    return "bg-rose-500/10 text-rose-700 border-rose-200";
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!testToDelete) return;

    try {
      setDeleting(true);
      await deleteFitTest(testToDelete);
      toast.success("Fit test result deleted successfully.");
      setResults((prev) => prev.filter((item) => item._id !== testToDelete));
      setTestToDelete(null);
      if (selectedResult?._id === testToDelete) {
        setSelectedResult(null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete fit test result.");
    } finally {
      setDeleting(false);
    }
  };

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
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <ClipboardCheck className="h-3.5 w-3.5" /> Super Admin Assessment Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Fit Test Results & Management</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Review candidate assessment submissions, manage scores, evaluate performance, and purge obsolete records.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Submissions */}
        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Assessments
            </span>
            <BarChart3 className="h-4 w-4 text-primary shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary">{metrics.total}</div>
          <p className="text-xs text-muted-foreground">Completed fit tests</p>
        </div>

        {/* Average Percentage */}
        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Average Score
            </span>
            <Award className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {metrics.avgPercentage}%
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 shrink-0" /> Overall mean score
          </p>
        </div>

        {/* Qualified / Passed */}
        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              High Performers
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600">{metrics.passed}</div>
          <p className="text-xs text-emerald-600/80 font-medium">Scored 70% or above</p>
        </div>

        {/* Below Benchmark */}
        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Needs Improvement
            </span>
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600">{metrics.failed}</div>
          <p className="text-xs text-rose-600/80 font-medium">Scored below 70% benchmark</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
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
            placeholder="Search candidate name or email..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filter & Items-Per-Page Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 md:flex-initial rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground focus:border-primary focus:outline-none capitalize"
          >
            <option value="all">All Statuses ({availableStatuses.length})</option>
            {availableStatuses.map((st) => (
              <option key={st} value={st} className="capitalize">
                {st}
              </option>
            ))}
          </select>

          {/* Page Limit Selector */}
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

          {(selectedStatus !== "all" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSelectedStatus("all");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-primary hover:underline whitespace-nowrap px-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Data Table */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary">Candidate Assessment Records</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {startRecordIndex}–{endRecordIndex} of {filteredResults.length} records
            </p>
          </div>
        </div>

        {paginatedResults.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No fit test results match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-semibold">Candidate Details</th>
                  <th className="pb-3 font-semibold">Raw Score</th>
                  <th className="pb-3 font-semibold">Percentage</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date Completed</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedResults.map((item) => {
                  const pct = Math.round(Number(item.percentage) || 0);

                  return (
                    <tr key={item._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 font-semibold text-primary">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate max-w-[160px] sm:max-w-xs">{item.fullName || "Anonymous Candidate"}</span>
                        </div>
                        <span className="block text-xs font-normal text-muted-foreground pl-6 truncate max-w-[160px] sm:max-w-xs">
                          {item.email}
                        </span>
                      </td>

                      <td className="py-4 font-semibold text-foreground whitespace-nowrap">
                        {item.score !== undefined ? item.score : "N/A"}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          / {item.totalQuestions || 0}
                        </span>
                      </td>

                      <td className="py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreBadge(
                            pct
                          )}`}
                        >
                          {pct}%
                        </span>
                      </td>

                      <td className="py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary capitalize">
                          {item.status || "Completed"}
                        </span>
                      </td>

                      <td className="py-4 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </div>
                      </td>

                      <td className="py-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setSelectedResult(item)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        <button
                          onClick={() => setTestToDelete(item._id)}
                          title="Delete Assessment"
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredResults.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-primary">{startRecordIndex}</span> to{" "}
              <span className="font-semibold text-primary">{endRecordIndex}</span> of{" "}
              <span className="font-semibold text-primary">{filteredResults.length}</span> results
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

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-lg rounded-2xl border border-border p-6 md:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Fit Test Evaluation Summary
                </span>
                <h3 className="text-xl font-bold text-primary mt-1">
                  {selectedResult.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score Visual Card */}
            <div className="surface-card p-5 sm:p-6 rounded-2xl border border-border/80 bg-secondary/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  Percentage Score
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                  {Math.round(Number(selectedResult.percentage) || 0)}%
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  Status
                </span>
                <div className="text-sm font-bold text-primary capitalize mt-0.5">
                  {selectedResult.status || "Completed"}
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  Email Address
                </span>
                <p className="font-bold text-primary truncate">{selectedResult.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  Raw Score
                </span>
                <p className="font-bold text-primary">
                  {selectedResult.score !== undefined ? selectedResult.score : "N/A"}{" "}
                  out of {selectedResult.totalQuestions || 0}
                </p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  Submitted On
                </span>
                <p className="font-bold text-primary">
                  {selectedResult.createdAt
                    ? new Date(selectedResult.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => setTestToDelete(selectedResult._id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600/10 text-rose-600 px-4 py-2 text-xs font-semibold hover:bg-rose-600/20 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Assessment
              </button>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {testToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-primary text-base">Delete Assessment Result</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to permanently delete this candidate's fit test submission? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTestToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}