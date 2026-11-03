"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Loader2,
  Building2,
  Mail,
  User,
  Eye,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  getAllPartners,
  deletePartner,
  PartnerItems,
} from "@/services/partner";

export default function SuperAdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<PartnerItems | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete Confirmation States
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await getAllPartners();
      setPartners(res.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load partnership requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter requests based on search query
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.organisationName?.toLowerCase().includes(q) ||
        p.contactPerson?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.howWouldYouLikeToPartner?.toLowerCase().includes(q)
      );
    });
  }, [partners, searchQuery]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage) || 1;

  const paginatedPartners = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPartners.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPartners, currentPage, itemsPerPage]);

  const startRecordIndex = filteredPartners.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecordIndex = Math.min(currentPage * itemsPerPage, filteredPartners.length);

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!partnerToDelete) return;

    try {
      setDeleting(true);
      await deletePartner(partnerToDelete);
      toast.success("Partnership request deleted successfully.");
      setPartners((prev) => prev.filter((item) => item._id !== partnerToDelete));
      setPartnerToDelete(null);
      if (selectedPartner?._id === partnerToDelete) {
        setSelectedPartner(null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete partnership request.");
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
              <FileText className="h-3.5 w-3.5" /> Super Admin Stakeholder Relations
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Partnership Inquiries & Requests</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Audit collaboration proposals submitted by organizations, inspect proposals, and purge obsolete records.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Inquiries
          </span>
          <div className="text-xl sm:text-2xl font-bold text-primary">{partners.length}</div>
          <p className="text-xs text-muted-foreground">All submitted partnership requests</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Filtered Submissions
          </span>
          <div className="text-xl sm:text-2xl font-bold text-primary">{filteredPartners.length}</div>
          <p className="text-xs text-muted-foreground">Matching active search query</p>
        </div>
      </div>

      {/* Search Bar & Page Limit Toolbar */}
      <div className="surface-card p-4 md:p-6 rounded-2xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organization, contact name, or email..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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

          {searchQuery !== "" && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-primary hover:underline px-2 whitespace-nowrap cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary">Inquiry Submissions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {startRecordIndex}–{endRecordIndex} of {filteredPartners.length} total records
            </p>
          </div>
        </div>

        {paginatedPartners.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No partnership inquiries found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-semibold">Organisation</th>
                  <th className="pb-3 font-semibold">Contact Person</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Date Submitted</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedPartners.map((p) => (
                  <tr key={p._id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate max-w-[160px] sm:max-w-xs">{p.organisationName || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[130px] sm:max-w-none">{p.contactPerson || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[150px] sm:max-w-none">{p.email}</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </td>
                    <td className="py-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedPartner(p)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button
                        onClick={() => setPartnerToDelete(p._id)}
                        title="Delete Request"
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredPartners.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-primary">{startRecordIndex}</span> to{" "}
              <span className="font-semibold text-primary">{endRecordIndex}</span> of{" "}
              <span className="font-semibold text-primary">{filteredPartners.length}</span> results
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

      {/* Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-2xl rounded-2xl border border-border p-6 md:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Partnership Proposal
                </span>
                <h3 className="text-xl font-bold text-primary mt-1">
                  {selectedPartner.organisationName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  Contact Person
                </span>
                <p className="font-bold text-primary">{selectedPartner.contactPerson || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  Email Address
                </span>
                <p className="font-bold text-primary truncate">{selectedPartner.email}</p>
              </div>
            </div>

            {/* Proposal Message */}
            {selectedPartner.howWouldYouLikeToPartner && (
              <div className="space-y-1 pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground font-semibold uppercase">
                  How They Would Like To Partner
                </span>
                <div className="rounded-xl bg-secondary/50 p-4 text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap border border-border/60">
                  {selectedPartner.howWouldYouLikeToPartner}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => setPartnerToDelete(selectedPartner._id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600/10 text-rose-600 px-4 py-2 text-xs font-semibold hover:bg-rose-600/20 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Request
              </button>
              <button
                onClick={() => setSelectedPartner(null)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {partnerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-primary text-base">Delete Partnership Request</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to permanently delete this partnership proposal? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPartnerToDelete(null)}
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