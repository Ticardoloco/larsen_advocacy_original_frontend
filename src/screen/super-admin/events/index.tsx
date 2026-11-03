"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { getPrograms, ProgramItem } from "@/services/program";
import {
  ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  X,
  Sparkles,
  AlertTriangle,
  Calendar,
  Upload,
} from "lucide-react";
import {
  getAllGallerys,
  postGallery,
  updateGallery,
  deleteGallery,
  GalleryItems,
  GalleryPayload,
} from "@/services/gallery";

export default function SuperAdminEventGalleryPage() {
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItems[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItems | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    caption: "",
    category: "",
    year: new Date().getFullYear().toString(),
  });

  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Gallery Items
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await getAllGallerys();

      let items: GalleryItems[] = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res)) {
        items = res as unknown as GalleryItems[];
      }
      setGalleryItems(items);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load event gallery.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Programs for Category Dropdown
  const fetchPrograms = async () => {
    try {
      const res = await getPrograms();
      const programList = Array.isArray(res) ? res : (res as any)?.data || [];
      setPrograms(programList);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchPrograms();
  }, []);

  // Extract unique categories from program list
  const categoryOptions = Array.from(
    new Set(
      programs
        .map((p) => p.category)
        .filter((cat): cat is string => Boolean(cat && cat.trim()))
    )
  );

  // Handle Local File Selection with 10MB client-side check
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File is too large");
        setSelectedFile(null);
        setPreviewUrl(null);
        e.target.value = ""; // Clear file input
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    const initialCategory = categoryOptions.length > 0 ? categoryOptions[0] : "General";
    setFormData({
      caption: "",
      category: initialCategory,
      year: new Date().getFullYear().toString(),
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: GalleryItems) => {
    setEditingItem(item);
    setSelectedFile(null);
    setPreviewUrl(item.image ? (typeof item.image === "string" ? item.image : "") : null);
    setFormData({
      caption: item.caption || "",
      category: item.category || (categoryOptions.length > 0 ? categoryOptions[0] : "General"),
      year: item.year || new Date().getFullYear().toString(),
    });
    setIsFormModalOpen(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.caption.trim()) {
      toast.error("Caption is required.");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Please select or enter a category.");
      return;
    }

    if (!editingItem && !selectedFile) {
      toast.error("Please select an image file to upload.");
      return;
    }

    // Final check before sending request
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large");
      return;
    }

    try {
      setSubmitting(true);

      const payload: GalleryPayload = {
        caption: formData.caption,
        category: formData.category,
        year: formData.year,
        tone: 0,
        image: selectedFile ? selectedFile : (editingItem?.image || ""),
      };

      if (editingItem?._id) {
        await updateGallery(editingItem._id, payload);
        toast.success("Event photo updated successfully!");
      } else {
        await postGallery(payload);
        toast.success("Event photo posted successfully!");
      }

      setIsFormModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchGallery();
    } catch (err: any) {
      console.error("Gallery Submission Error:", err);

      // If server returns 500 or 413 (Payload Too Large), catch it and show "File is too large"
      if (err?.response?.status === 500 || err?.response?.status === 413) {
        toast.error("File is too large");
        return;
      }

      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save event photo.";
      toast.error(typeof serverMessage === "string" ? serverMessage : JSON.stringify(serverMessage));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteGallery(itemToDelete);

      toast.success("Event photo deleted successfully.");
      setGalleryItems((prev) => prev.filter((item) => item._id !== itemToDelete));
      setItemToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete event photo.");
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
            <Sparkles className="h-3.5 w-3.5" /> Gallery Showcase
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Event Gallery</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage photo archives, event highlights, and outreach activity galleries.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto shrink-0 text-xs sm:text-sm"
        >
          <Plus className="h-4 w-4" /> Add Event Photo
        </button>
      </div>

      {/* Gallery Grid */}
      {galleryItems.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl border border-border text-center space-y-3 bg-card">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="font-bold text-primary text-base">No Event Photos Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Get started by posting photos from foundation programs and events.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs mt-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Post First Photo
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <div
              key={item._id}
              className="surface-card rounded-2xl border border-border/80 bg-card overflow-hidden group shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-52 w-full bg-secondary/40 overflow-hidden">
                  <Image
                    src={typeof item.image === "string" ? item.image : ""}
                    alt={item.caption || "Event Photo"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.category && (
                    <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-2">
                  <p className="font-semibold text-primary text-sm line-clamp-2">
                    {item.caption}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {item.year || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-border/60 bg-secondary/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  title="Edit Photo"
                  className="rounded-xl p-2 text-primary hover:bg-secondary transition-colors cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setItemToDelete(item._id)}
                  title="Delete Photo"
                  className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/20">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                {editingItem ? "Edit Event Photo" : "Add New Event Photo"}
              </h3>
              <button
                onClick={() => {
                  setIsFormModalOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary block">
                  {editingItem ? "Update Image File (Optional)" : "Upload Image File *"}
                </label>

                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-border shadow-xs bg-secondary/20">
                      <Image
                        src={previewUrl}
                        alt="Event Photo Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    {/* Explicit Button to Trigger File Picker */}
                    <label className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-border bg-secondary/30 text-primary text-xs font-semibold hover:bg-secondary/50 transition-colors cursor-pointer">
                      <Upload className="h-4 w-4" /> Choose Different Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center bg-secondary/10 hover:bg-secondary/20 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required={!editingItem}
                    />
                    <div className="space-y-2 py-4">
                      <Upload className="h-8 w-8 text-primary mx-auto opacity-60" />
                      <p className="text-xs font-semibold text-primary">
                        Click to browse or drag & drop image file
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Supports PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Caption Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Caption / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Describe the event photo..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Category Dropdown & Year Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary block">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {categoryOptions.length > 0 ? (
                      categoryOptions.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="General">General</option>
                        <option value="Event">Event</option>
                        <option value="Outreach">Outreach</option>
                        <option value="Workshop">Workshop</option>
                      </>
                    )}
                  </select>
                </div>

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
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
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
                    "Save Photo"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-primary text-base">Delete Event Photo</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to remove this photo from the event gallery?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
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