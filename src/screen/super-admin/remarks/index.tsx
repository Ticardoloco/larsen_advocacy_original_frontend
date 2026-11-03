"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  MessageSquareQuote,
  Search,
  Plus,
  Loader2,
  User,
  Trash2,
  Pencil,
  X,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getAllDonorMessages,
  postDonorMessage,
  updateDonorMessage,
  deleteDonorMessage,
  DonorMessageItems,
  DonorMessagePayload,
} from "@/services/donate";

export default function SuperAdminDonorRemarksPage() {
  const [remarks, setRemarks] = useState<DonorMessageItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRemark, setEditingRemark] = useState<DonorMessageItems | null>(null);
  const [formData, setFormData] = useState<DonorMessagePayload>({
    donorName: "",
    message: "",
    advise: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Custom Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [remarkToDelete, setRemarkToDelete] = useState<DonorMessageItems | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRemarks = async () => {
    try {
      setLoading(true);
      const res = await getAllDonorMessages();
      setRemarks(res.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load donor remarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemarks();
  }, []);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter remarks based on search query
  const filteredRemarks = useMemo(() => {
    return remarks.filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        r.donorName?.toLowerCase().includes(q) ||
        r.message?.toLowerCase().includes(q) ||
        r.advise?.toLowerCase().includes(q)
      );
    });
  }, [remarks, searchQuery]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredRemarks.length / itemsPerPage) || 1;

  const paginatedRemarks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRemarks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRemarks, currentPage, itemsPerPage]);

  const startRecordIndex = filteredRemarks.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecordIndex = Math.min(currentPage * itemsPerPage, filteredRemarks.length);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingRemark(null);
    setFormData({ donorName: "", message: "", advise: "" });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: DonorMessageItems) => {
    setEditingRemark(item);
    setFormData({
      donorName: item.donorName || "",
      message: item.message || "",
      advise: item.advise || "",
    });
    setIsModalOpen(true);
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingRemark) {
        // Update
        const res = await updateDonorMessage(editingRemark._id, formData);
        toast.success("Donor remark updated successfully");
        setRemarks((prev) =>
          prev.map((r) => (r._id === editingRemark._id ? res.data : r))
        );
      } else {
        // Create
        const res = await postDonorMessage(formData);
        toast.success("Donor remark posted successfully");
        setRemarks((prev) => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save donor remark");
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger custom delete modal
  const handleOpenDeleteModal = (item: DonorMessageItems) => {
    setRemarkToDelete(item);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!remarkToDelete) return;

    try {
      setDeleting(true);
      await deleteDonorMessage(remarkToDelete._id);
      toast.success("Donor remark deleted successfully");
      setRemarks((prev) => prev.filter((r) => r._id !== remarkToDelete._id));
      setDeleteModalOpen(false);
      setRemarkToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete donor remark");
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
              <MessageSquareQuote className="h-3.5 w-3.5" /> Super Admin Community Engagement
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Donor Remarks & Testimonials</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage curated community notes, donor testimonials, and foundation feedback.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:opacity-95 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" /> Post New Remark
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Remarks
          </span>
          <div className="text-xl sm:text-2xl font-bold text-primary">{remarks.length}</div>
          <p className="text-xs text-muted-foreground">All published donor statements</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Search Results
          </span>
          <div className="text-xl sm:text-2xl font-bold text-primary">{filteredRemarks.length}</div>
          <p className="text-xs text-muted-foreground">Matching active query</p>
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
            placeholder="Search by donor name, message, advice..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
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

      {/* Remarks Grid */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary">Published Remarks</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {startRecordIndex}–{endRecordIndex} of {filteredRemarks.length} records
            </p>
          </div>
        </div>

        {paginatedRemarks.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No donor remarks found. Click &quot;Post New Remark&quot; to add one.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedRemarks.map((item) => (
              <div
                key={item._id}
                className="surface-card p-6 rounded-2xl border border-border flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {item.donorName ? item.donorName.substring(0, 2).toUpperCase() : "DN"}
                      </div>
                      <span className="font-bold text-primary text-sm truncate max-w-40">
                        {item.donorName || "Anonymous"}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-foreground/90 italic leading-relaxed bg-secondary/40 p-3 rounded-xl border border-border/60">
                      &ldquo;{item.message}&rdquo;
                    </p>

                    {item.advise && (
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <span className="font-semibold text-primary uppercase text-[10px]">
                          Advice / Note:
                        </span>
                        <p>{item.advise}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {filteredRemarks.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-primary">{startRecordIndex}</span> to{" "}
              <span className="font-semibold text-primary">{endRecordIndex}</span> of{" "}
              <span className="font-semibold text-primary">{filteredRemarks.length}</span> results
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-lg rounded-2xl border border-border p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {editingRemark ? "Modify Remark" : "New Community Note"}
                </span>
                <h3 className="text-xl font-bold text-primary mt-1">
                  {editingRemark ? "Edit Donor Remark" : "Post Donor Remark"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Donor Name / Supporter *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.donorName}
                    onChange={(e) =>
                      setFormData({ ...formData, donorName: e.target.value })
                    }
                    placeholder="e.g. Dr. Alero Adeleke"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Donor Message / Testimonial *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Enter the donor's remark or statement..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Advice or Note
                </label>
                <input
                  type="text"
                  value={formData.advise}
                  onChange={(e) =>
                    setFormData({ ...formData, advise: e.target.value })
                  }
                  placeholder="Any additional advice or guidance..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingRemark ? "Save Changes" : "Publish Remark"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && remarkToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-md rounded-2xl border border-border p-6 md:p-8 space-y-6 shadow-xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-primary">Delete Donor Remark?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to delete the remark by <span className="font-semibold text-foreground">{remarkToDelete.donorName || "Anonymous"}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setRemarkToDelete(null);
                }}
                className="flex-1 rounded-xl border border-border bg-background py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}