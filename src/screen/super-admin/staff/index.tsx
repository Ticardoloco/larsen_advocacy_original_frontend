"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Trash2,
  Edit3,
  Loader2,
  X,
  AlertTriangle,
  Briefcase,
  Upload,
} from "lucide-react";
import {
  getAllStaff,
  postStaff,
  updateStaff,
  deleteStaff,
  StaffItems,
  StaffPayload,
} from "@/services/staff";

export default function SuperAdminStaffPage() {
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState<StaffItems[]>([]);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StaffItems | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState<Omit<StaffPayload, "image">>({
    name: "",
    title: "",
    bio: "",
  });

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Staff List
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await getAllStaff();
      setStaffList(res.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load staff records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle Local File Selection with 10MB size validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File is too large");
        setSelectedFile(null);
        setPreviewUrl(null);
        e.target.value = ""; // Reset input
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
    setFormData({
      name: "",
      title: "",
      bio: "",
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: StaffItems) => {
    setEditingItem(item);
    setSelectedFile(null);
    setPreviewUrl(item.image || null);
    setFormData({
      name: item.name || "",
      title: item.title || "",
      bio: item.bio || "",
    });
    setIsFormModalOpen(true);
  };

  // Handle Form Submit (Direct Staff Post/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.title.trim() || !formData.bio.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!editingItem && !selectedFile) {
      toast.error("Please select a staff profile image.");
      return;
    }

    // Final file size check before submission
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large");
      return;
    }

    try {
      setSubmitting(true);

      // Pass the selected file or existing image URL directly through the staff payload
      const payload: StaffPayload = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        image: selectedFile ? (selectedFile as any) : (editingItem?.image || ""),
      };

      // Post or Update
      if (editingItem?._id) {
        await updateStaff(editingItem._id, payload);
        toast.success("Staff member updated successfully!");
      } else {
        await postStaff(payload);
        toast.success("New staff member posted successfully!");
      }

      setIsFormModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchStaff();
    } catch (err: any) {
      if (err?.response?.status === 500 || err?.response?.status === 413) {
        toast.error("File is too large");
        return;
      }
      toast.error(err?.response?.data?.message || "Failed to save staff record.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteStaff(itemToDelete);
      toast.success("Staff member deleted successfully.");
      setStaffList((prev) => prev.filter((item) => item._id !== itemToDelete));
      setItemToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete staff member.");
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 mb-2">
            <Briefcase className="h-3.5 w-3.5" /> Team Management
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Staff Directory</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage organization team members, executive leadership, and staff profiles.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto shrink-0 text-xs sm:text-sm"
        >
          <UserPlus className="h-4 w-4" /> Add New Staff
        </button>
      </div>

      {/* Staff Grid */}
      {staffList.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl border border-border text-center space-y-3 bg-card">
          <Users className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="font-bold text-primary text-base">No Staff Members Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Get started by adding your organization staff and leaders.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs mt-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" /> Post First Staff
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staffList.toReversed().map((staff) => (
            <div
              key={staff._id}
              className="surface-card rounded-2xl border border-border/80 bg-card overflow-hidden group shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Staff Image with Optimized Top-Priority Fit */}
                <div className="relative h-72 w-full bg-secondary/40 overflow-hidden">
                  <Image
                    src={staff.image || "/placeholder.png"}
                    alt={staff.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                  <span className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-md text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {staff.title}
                  </span>
                </div>

                {/* Staff Details */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-primary text-base">{staff.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {staff.bio}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-border/60 bg-secondary/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(staff)}
                  title="Edit Staff"
                  className="rounded-xl p-2 text-primary hover:bg-secondary transition-colors cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setItemToDelete(staff._id)}
                  title="Delete Staff"
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
                <Briefcase className="h-4 w-4 text-primary" />
                {editingItem ? "Edit Staff Member" : "Add New Staff Member"}
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
                  {editingItem ? "Update Staff Photo (Optional)" : "Staff Photo *"}
                </label>

                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative h-36 w-36 mx-auto rounded-full overflow-hidden shadow-xs border-2 border-primary/20 bg-secondary/20">
                      <Image
                        src={previewUrl}
                        alt="Staff Preview"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    {/* Explicit Button to Trigger File Picker for new/replacement photos */}
                    <label className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-border bg-secondary/30 text-primary text-xs font-semibold hover:bg-secondary/50 transition-colors cursor-pointer">
                      <Upload className="h-4 w-4" /> Choose Different Photo
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
                    <div className="space-y-2 py-3">
                      <Upload className="h-8 w-8 text-primary mx-auto opacity-60" />
                      <p className="text-xs font-semibold text-primary">
                        Click to browse or drag & drop photo
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Supports PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Title / Role Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Title / Position *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Director"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Bio Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Biography / Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write a brief professional background..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
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
                    "Save Staff Member"
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
              <h3 className="font-bold text-primary text-base">Delete Staff Record</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to remove this staff member from the directory?
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