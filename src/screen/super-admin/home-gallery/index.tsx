"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  Upload,
  X,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { getHomeImage, postHomeImage, HomeImageItem, ImageData } from "@/services/gallery"; 
import { api } from "@/lib/api";

export default function SuperAdminHomeGalleryPage() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Custom Delete Modal State
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Home Gallery Images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await getHomeImage();
      // Normalize response items to ensure ImageData structure
      const formattedImages: ImageData[] = res.map((item: any) => {
        if (item.data && typeof item.data === "object") {
          return item.data;
        }
        return item;
      });
      setImages(formattedImages);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load home gallery images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle File Selection & Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Upload Submission
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image file to upload.");
      return;
    }

    try {
      setUploading(true);
      await postHomeImage({ image: selectedFile });
      toast.success("Home gallery image uploaded successfully!");
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchImages();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Confirmed Deletion via Custom Modal
 const confirmDelete = async () => {
    if (!imageToDelete) {
      toast.error("Invalid image identifier.");
      return;
    }

    try {
      setDeleting(true);

      // Encode ID to prevent slashes in publicIds from breaking Express route params
      const encodedId = encodeURIComponent(imageToDelete);

      // Attempt deletion via URL parameter first
      try {
        await api.delete(`/home-images/${encodedId}`);
      } catch (paramErr: any) {
        // Fallback: If backend expects body data (req.body.id or req.body.publicId)
        await api.delete("/home-images", {
          data: { id: imageToDelete, publicId: imageToDelete },
        });
      }

      toast.success("Image deleted successfully.");
      setImages((prev) =>
        prev.filter((img) => img._id !== imageToDelete && img.publicId !== imageToDelete)
      );
      setImageToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete image.");
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
            <Sparkles className="h-3.5 w-3.5" /> Media Management
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Home Gallery Images</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage banner and slider imagery displayed on the main foundation homepage.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto shrink-0 text-xs sm:text-sm"
        >
          <Plus className="h-4 w-4" /> Upload New Image
        </button>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl border border-border text-center space-y-3 bg-card">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="font-bold text-primary text-base">No Home Gallery Images Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Get started by uploading banner images for your homepage gallery showcase.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 bg-secondary text-primary font-semibold px-4 py-2 rounded-xl text-xs mt-2 hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Upload First Image
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, idx) => {
            const uniqueKey = img._id || img.publicId || idx;
            const targetId = img._id || img.publicId;

            return (
              <div
                key={uniqueKey}
                className="surface-card rounded-2xl border border-border/80 bg-card overflow-hidden group shadow-xs flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-48 w-full bg-secondary/40 overflow-hidden">
                  <Image
                    src={img.url}
                    alt="Home Gallery Slide"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Footer Details & Actions */}
                <div className="p-4 flex items-center justify-between gap-2 border-t border-border/60 bg-secondary/10">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground truncate">
                      ID: {img.publicId ? img.publicId.substring(0, 16) + "..." : "Uploaded Asset"}
                    </p>
                    {img.createdAt && (
                      <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                        {new Date(img.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => targetId && setImageToDelete(targetId)}
                    title="Delete Image"
                    className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/20">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" /> Upload Home Gallery Image
              </h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-5">
              {/* File Dropzone / Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block uppercase tracking-wider">
                  Select Image File
                </label>

                <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-secondary/10 hover:bg-secondary/20 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />

                  {previewUrl ? (
                    <div className="relative h-36 w-full rounded-xl overflow-hidden shadow-xs">
                      <Image
                        src={previewUrl}
                        alt="Upload Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <Upload className="h-8 w-8 text-primary mx-auto opacity-60" />
                      <p className="text-xs font-semibold text-primary">
                        Click to browse or drag & drop image
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Supports PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-xl text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    "Upload Image"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-primary text-base">Delete Gallery Image</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to remove this image from the home gallery? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
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