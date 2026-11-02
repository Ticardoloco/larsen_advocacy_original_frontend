"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  Sparkles,
  AlertTriangle,
  Calendar,
  Eye,
  History,
} from "lucide-react";
import {
  getStories,
  postStory,
  updateStory,
  deleteStory,
  StoryItems,
  StoriesPayload,
} from "@/services/stories";

export default function SuperAdminStoriesPage() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<StoryItems[]>([]);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryItems | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Read Story Modal State
  const [selectedStory, setSelectedStory] = useState<StoryItems | null>(null);

  // Delete Modal State
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<StoriesPayload>({
    year: new Date().getFullYear().toString(),
    title: "",
    body: "",
  });

  // Fetch All Stories
  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getStories();

      // Normalize array response whether returned directly or inside `res.data`
      if (Array.isArray(res.data)) {
        setStories(res.data);
      } else if (Array.isArray(res)) {
        setStories(res as unknown as StoryItems[]);
      } else {
        setStories([]);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load stories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingStory(null);
    setFormData({
      year: new Date().getFullYear().toString(),
      title: "",
      body: "",
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: StoryItems) => {
    setEditingStory(item);
    setFormData({
      year: item.year || "",
      title: item.title || "",
      body: item.body || "",
    });
    setIsFormModalOpen(true);
  };

  // Handle Create / Update Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingStory?._id) {
        await updateStory(editingStory._id, formData);
        toast.success("Story updated successfully!");
      } else {
        await postStory(formData);
        toast.success("Story posted successfully!");
      }

      setIsFormModalOpen(false);
      fetchStories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save story.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Confirmed Deletion
  const confirmDelete = async () => {
    if (!storyToDelete) return;

    try {
      setDeleting(true);
      await deleteStory(storyToDelete);

      toast.success("Story deleted successfully.");
      setStories((prev) => prev.filter((item) => item._id !== storyToDelete));
      setStoryToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete story.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto w-full px-2 sm:px-0">
      {/* Page Header */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 mb-2">
            <History className="h-3.5 w-3.5" /> Story Management
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Foundation Stories</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            View, add, update, and manage all foundation impact stories and milestone narratives.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto shrink-0 text-xs sm:text-sm"
        >
          <Plus className="h-4 w-4" /> Add New Story
        </button>
      </div>

      {/* Stories List */}
      {stories.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl border border-border text-center space-y-3 bg-card">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="font-bold text-primary text-base">No Stories Found</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Get started by posting your first foundation story or milestone.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs mt-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Post First Story
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((item) => (
            <div
              key={item._id}
              className="surface-card p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    <Calendar className="h-3 w-3" /> {item.year || "N/A"}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-primary truncate">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {item.body}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60 w-full md:w-auto justify-end">
                <button
                  onClick={() => setSelectedStory(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>

                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>

                <button
                  onClick={() => setStoryToDelete(item._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/20 shrink-0">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {editingStory ? "Edit Story" : "Post New Story"}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Year *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Story Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter story title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Story Body Narrative *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write full story content..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Story"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/20 shrink-0">
              <span className="text-xs font-bold text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Year: {selectedStory.year}
              </span>
              <button
                onClick={() => setSelectedStory(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <h2 className="text-xl font-bold text-primary">{selectedStory.title}</h2>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedStory.body}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-primary text-base">Delete Story</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to delete this story? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStoryToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50"
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