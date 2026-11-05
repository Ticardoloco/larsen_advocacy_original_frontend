"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LifeBuoy,
  Eye,
  Loader2,
  X,
  Mail,
  Phone,
  UserX,
  UserCheck,
  Calendar,
  Flame,
  Zap,
  Clock,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getSupport,
  SupportItem,
} from "@/services/getSupport";

export default function AdminSupportPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SupportItem[]>([]);

  // Filter, Search & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // View Modal State
  const [viewingItem, setViewingItem] = useState<SupportItem | null>(null);

  // Fetch Support Requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getSupport();
      setRequests(res.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load support requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter Logic
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.fullName && req.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.email && req.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.phone && req.phone.includes(searchQuery));

      const matchesUrgency =
        selectedUrgency === "All" || req.urgency === selectedUrgency;

      const matchesCategory =
        selectedCategory === "All" || req.category === selectedCategory;

      return matchesSearch && matchesUrgency && matchesCategory;
    });
  }, [requests, searchQuery, selectedUrgency, selectedCategory]);

  // Reset to page 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedUrgency, selectedCategory]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // Unique Categories List for Filter Dropdown
  const categoriesList = useMemo(() => {
    const set = new Set(requests.map((r) => r.category));
    return ["All", ...Array.from(set)];
  }, [requests]);

  // Metric Stats
  const criticalCount = requests.filter((r) => r.urgency === "critical").length;
  const highCount = requests.filter((r) => r.urgency === "high").length;
  const anonymousCount = requests.filter((r) => r.isAnonymous).length;

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto w-full px-2 sm:px-0">
      {/* Header Banner */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
            <LifeBuoy className="h-3.5 w-3.5" /> Survivor Support & Incident Response
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Support Requests</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage incoming help requests, review incident reports, and evaluate urgency levels.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="surface-card p-4 sm:p-5 rounded-2xl border border-border bg-card">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Total Logged</span>
          <div className="text-2xl font-extrabold text-primary mt-1">{requests.length}</div>
        </div>
        <div className="surface-card p-4 sm:p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-rose-600" /> Critical Emergency
          </span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{criticalCount}</div>
        </div>
        <div className="surface-card p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-600" /> High Priority
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{highCount}</div>
        </div>
        <div className="surface-card p-4 sm:p-5 rounded-2xl border border-border bg-card">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
            <UserX className="h-3.5 w-3.5" /> Anonymous Reports
          </span>
          <div className="text-2xl font-extrabold text-primary mt-1">{anonymousCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="surface-card p-4 rounded-2xl border border-border bg-card grid gap-3 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages, names, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
          />
        </div>

        {/* Filter by Urgency */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
          >
            <option value="All">All Urgency Levels</option>
            <option value="critical">Critical Emergency</option>
            <option value="high">High Urgency</option>
            <option value="standard">Standard</option>
          </select>
        </div>

        {/* Filter by Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
          >
            <option value="All">All Categories ({categoriesList.length - 1})</option>
            {categoriesList.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      {filteredRequests.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl border border-border text-center space-y-3 bg-card">
          <LifeBuoy className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="font-bold text-primary text-base">No Support Requests Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {requests.length === 0
              ? "There are currently no support or intervention requests logged in the database."
              : "No support requests match your current search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="surface-card rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 sm:px-6">Category & Date</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Submitter Info</th>
                  <th className="p-4">Message Preview</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {paginatedRequests.map((req) => {
                  return (
                    <tr key={req._id} className="hover:bg-secondary/10 transition-colors">
                      {/* Category & Date */}
                      <td className="p-4 sm:px-6">
                        <div className="font-semibold text-primary text-xs sm:text-sm">{req.category}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(req.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Urgency Badge */}
                      <td className="p-4">
                        {req.urgency === "critical" && (
                          <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide border border-rose-500/20">
                            <Flame className="h-3 w-3 animate-pulse" /> Critical
                          </span>
                        )}
                        {req.urgency === "high" && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide border border-amber-500/20">
                            <Zap className="h-3 w-3" /> High
                          </span>
                        )}
                        {req.urgency === "standard" && (
                          <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide border border-slate-500/20">
                            <Clock className="h-3 w-3" /> Standard
                          </span>
                        )}
                      </td>

                      {/* Submitter Info */}
                      <td className="p-4 text-xs">
                        {req.isAnonymous ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                            <UserX className="h-3.5 w-3.5" /> Anonymous
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="font-bold text-primary flex items-center gap-1">
                              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                              {req.fullName || "Named Submitter"}
                            </div>
                            {req.phone && (
                              <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                <Phone className="h-3 w-3" /> {req.phone}
                              </div>
                            )}
                            {req.email && (
                              <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                <Mail className="h-3 w-3" /> {req.email}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Message Preview (Truncated) */}
                      <td className="p-4 text-xs max-w-xs">
                        <p className="line-clamp-2 text-foreground/80 leading-relaxed">
                          {req.message}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setViewingItem(req)}
                            title="View Full Message & Details"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" /> View Full Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredRequests.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-secondary/20">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-primary">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-primary">
                  {Math.min(currentPage * itemsPerPage, filteredRequests.length)}
                </span>{" "}
                of <span className="font-bold text-primary">{filteredRequests.length}</span> support requests
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="text-xs font-bold text-primary px-2">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Request View Modal (Shows Complete Message) */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/25">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-primary" /> Support Request Details
              </h3>
              <button
                onClick={() => setViewingItem(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
              {/* Category & Urgency Badge */}
              <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-xl border border-border/60">
                <div>
                  <span className="text-[11px] font-bold uppercase text-muted-foreground block">Category</span>
                  <span className="font-bold text-primary text-sm">{viewingItem.category}</span>
                </div>
                <div>
                  {viewingItem.urgency === "critical" && (
                    <span className="bg-rose-500/10 text-rose-600 text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-rose-500/30">
                      Critical Emergency
                    </span>
                  )}
                  {viewingItem.urgency === "high" && (
                    <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-amber-500/30">
                      High Urgency
                    </span>
                  )}
                  {viewingItem.urgency === "standard" && (
                    <span className="bg-slate-500/10 text-slate-700 dark:text-slate-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-slate-500/30">
                      Standard
                    </span>
                  )}
                </div>
              </div>

              {/* Submitter Details Block */}
              <div className="space-y-2 border-b border-border/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Submitter Information
                </span>
                {viewingItem.isAnonymous ? (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 font-semibold">
                    <UserX className="h-4 w-4 shrink-0" /> Submitted Anonymously (No personal contact details attached)
                  </div>
                ) : (
                  <div className="space-y-2 bg-secondary/10 p-3.5 rounded-xl border border-border/50 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Full Name</span>
                      <span className="font-bold text-primary">{viewingItem.fullName || "Not provided"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone Number</span>
                      <span className="font-bold text-primary">
                        {viewingItem.phone ? (
                          <a href={`tel:${viewingItem.phone}`} className="underline text-primary">
                            {viewingItem.phone}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email Address</span>
                      <span className="font-bold text-primary">
                        {viewingItem.email ? (
                          <a href={`mailto:${viewingItem.email}`} className="underline text-primary">
                            {viewingItem.email}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Message Details */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Full Situation / Request Message
                </span>
                <div className="bg-secondary/10 p-4 rounded-xl border border-border/60 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewingItem.message}
                </div>
              </div>

              {/* Meta info */}
              <div className="text-[11px] text-muted-foreground space-y-1 font-mono pt-2 border-t border-border/40">
                <div>Request ID: {viewingItem._id}</div>
                <div>
                  Received:{" "}
                  {new Date(viewingItem.createdAt).toLocaleString("en-GB", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t border-border bg-secondary/10">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-95 transition-opacity cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}