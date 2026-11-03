"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  X,
  AlertTriangle,
  Layers,
  Upload,
  Sparkles,
  Eye,
  Tag,
  CheckCircle2,
} from "lucide-react";
import {
  getPrograms,
  postProgram,
  updateProgram,
  deleteProgram,
  ProgramItem,
} from "@/services/program";

export default function SuperAdminProgramsPage() {
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);

  // Form Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // View Details Modal State
  const [viewingItem, setViewingItem] = useState<ProgramItem | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "",
    calloutTitle: "",
    calloutBody: "",
  });

  // Dynamic Input Arrays for separate UI boxes
  const [bodyParagraphs, setBodyParagraphs] = useState<string[]>([""]);
  const [ctas, setCtas] = useState<string[]>([""]);

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Programs
  const fetchProgramsList = async () => {
    try {
      setLoading(true);
      const data = await getPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramsList();
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
      tagline: "",
      category: "",
      calloutTitle: "",
      calloutBody: "",
    });
    setBodyParagraphs([""]);
    setCtas([""]);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal (Unpacks backend arrays/strings into separate input fields)
  const handleOpenEditModal = (item: ProgramItem) => {
    setEditingItem(item);
    setSelectedFile(null);
    setPreviewUrl(item.image || null);
    setFormData({
      name: item.name || "",
      tagline: item.taglines || item.tagline || "",
      category: item.category || "General",
      calloutTitle: item.callout?.title || "",
      calloutBody: item.callout?.body || "",
    });

    if (Array.isArray(item.body)) {
      setBodyParagraphs(item.body.length > 0 ? [...item.body] : [""]);
    } else if (typeof item.body === "string") {
      setBodyParagraphs(
        (item.body as string)
          .split("|")
          .map((p) => p.trim())
          .filter(Boolean),
      );
    } else {
      setBodyParagraphs([""]);
    }

    if (Array.isArray(item.ctas)) {
      setCtas(item.ctas.length > 0 ? [...item.ctas] : [""]);
    } else if (typeof item.ctas === "string") {
      setCtas(
        (item.ctas as string)
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean),
      );
    } else {
      setCtas([""]);
    }

    setIsFormModalOpen(true);
  };

  // Handlers for Body Paragraph inputs
  const handleBodyChange = (index: number, value: string) => {
    const updated = [...bodyParagraphs];
    updated[index] = value;
    setBodyParagraphs(updated);
  };

  const addBodyParagraph = () => {
    setBodyParagraphs([...bodyParagraphs, ""]);
  };

  const removeBodyParagraph = (index: number) => {
    if (bodyParagraphs.length === 1) {
      setBodyParagraphs([""]);
      return;
    }
    setBodyParagraphs(bodyParagraphs.filter((_, i) => i !== index));
  };

  // Handlers for CTA inputs
  const handleCtaChange = (index: number, value: string) => {
    const updated = [...ctas];
    updated[index] = value;
    setCtas(updated);
  };

  const addCtaField = () => {
    setCtas([...ctas, ""]);
  };

  const removeCtaField = (index: number) => {
    if (ctas.length === 1) {
      setCtas([""]);
      return;
    }
    setCtas(ctas.filter((_, i) => i !== index));
  };

  // Handle Form Submit (Post / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredBody = bodyParagraphs.map((p) => p.trim()).filter(Boolean);
    const filteredCtas = ctas.map((c) => c.trim()).filter(Boolean);

    if (
      !formData.name.trim() ||
      !formData.tagline.trim() ||
      filteredBody.length === 0
    ) {
      toast.error(
        "Please fill in all required fields (Name, Tagline, at least one Body Paragraph).",
      );
      return;
    }

    if (!editingItem && !selectedFile) {
      toast.error("Please select a program image.");
      return;
    }

    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: formData.category.trim() || "General",
        body: filteredBody,
        ctas: filteredCtas,
        callout:
          formData.calloutTitle.trim() || formData.calloutBody.trim()
            ? {
                title: formData.calloutTitle.trim(),
                body: formData.calloutBody.trim(),
              }
            : undefined,
        // Only pass File when a new image is selected
        image: selectedFile
          ? selectedFile
          : editingItem?.image || undefined,
      };

      if (editingItem?._id) {
        await updateProgram(editingItem._id, payload);
        toast.success("Program updated successfully!");
      } else {
        await postProgram(payload);
        toast.success("New program posted successfully!");
      }

      setIsFormModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchProgramsList();
    } catch (err: any) {
      console.error("Submission error details:", err?.response?.data || err);
      const serverMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;
      toast.error(
        serverMessage
          ? `Failed to save program: ${serverMessage}`
          : "Failed to save program. Check console.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteProgram(itemToDelete);
      toast.success("Program deleted successfully.");
      setPrograms((prev) => prev.filter((item) => item._id !== itemToDelete));
      setItemToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete program.");
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-700 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Initiatives & Services
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
            Program Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage organization programs, outreach pillars, and detailed
            descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto shrink-0 text-xs sm:text-sm"
        >
          <Plus className="h-4 w-4" /> Add New Program
        </button>
      </div>

      {/* Programs Grid */}
      {programs.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl border border-border text-center space-y-3 bg-card">
          <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="font-bold text-primary text-base">No Programs Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Get started by creating your organization's core programs and
            activities.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs mt-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Post First Program
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program._id}
              className="surface-card rounded-2xl border border-border/80 bg-card overflow-hidden group shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                {/* Program Image Container */}
                <div className="relative h-52 w-full bg-secondary/40 overflow-hidden">
                  <Image
                    src={program.image || "/placeholder.png"}
                    alt={program.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {program.category && (
                    <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {program.category}
                    </span>
                  )}
                </div>

                {/* Program Details Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-primary text-base line-clamp-1">
                      {program.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary/80 line-clamp-1 mt-0.5">
                      {program.taglines || program.tagline}
                    </p>
                  </div>

                  {/* Body Preview */}
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {Array.isArray(program.body) ? program.body[0] : ""}
                  </p>

                  {/* Callout Quick Highlight if Present */}
                  {program.callout?.title && (
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-2.5 text-xs text-blue-900 space-y-0.5">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-blue-700 flex items-center gap-1">
                        <Layers className="h-3 w-3" /> {program.callout.title}
                      </span>
                      <p className="line-clamp-1 text-muted-foreground text-[11px]">
                        {program.callout.body}
                      </p>
                    </div>
                  )}

                  {/* CTAs Badges */}
                  {Array.isArray(program.ctas) && program.ctas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {program.ctas.slice(0, 3).map((cta, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-secondary/60 text-secondary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />{" "}
                          {cta}
                        </span>
                      ))}
                      {program.ctas.length > 3 && (
                        <span className="text-[10px] font-bold text-muted-foreground px-1 py-0.5">
                          +{program.ctas.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-border/60 bg-secondary/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingItem(program)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:bg-secondary/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" /> View Details
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(program)}
                    title="Edit Program"
                    className="rounded-xl p-2 text-primary hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setItemToDelete(program._id)}
                    title="Delete Program"
                    className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL PROGRAM DETAILS INSPECTION MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary p-1.5 rounded-xl">
                  <FolderKanban className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-primary text-base">
                    {viewingItem.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold">
                    {viewingItem.category || "General"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Image Preview */}
              {viewingItem.image && (
                <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-border shadow-xs bg-secondary/20">
                  <Image
                    src={viewingItem.image}
                    alt={viewingItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Tagline */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Tagline / Subtitle
                </h4>
                <p className="text-sm font-semibold text-primary mt-1">
                  {viewingItem.taglines || viewingItem.tagline}
                </p>
              </div>

              {/* Body Paragraphs */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Body Paragraphs
                </h4>
                <div className="space-y-3 bg-secondary/10 p-4 rounded-2xl border border-border/60">
                  {Array.isArray(viewingItem.body) &&
                  viewingItem.body.length > 0 ? (
                    viewingItem.body.map((para, index) => (
                      <p
                        key={index}
                        className="text-xs text-primary leading-relaxed"
                      >
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No detailed body content available.
                    </p>
                  )}
                </div>
              </div>

              {/* Callout Section if present */}
              {viewingItem.callout?.title && (
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-blue-600" />{" "}
                    {viewingItem.callout.title}
                  </h4>
                  <p className="text-xs text-blue-950 leading-relaxed">
                    {viewingItem.callout.body}
                  </p>
                </div>
              )}

              {/* Call to Actions (CTAs) */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Call to Actions (CTAs)
                </h4>
                {Array.isArray(viewingItem.ctas) &&
                viewingItem.ctas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {viewingItem.ctas.map((cta, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-xl border border-primary/20"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />{" "}
                        {cta}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No CTAs specified.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-secondary/10">
              <button
                onClick={() => {
                  const itemToEdit = viewingItem;
                  setViewingItem(null);
                  handleOpenEditModal(itemToEdit);
                }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL (CREATE / EDIT) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/20">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                {editingItem ? "Edit Program" : "Add New Program"}
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

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary block">
                  {editingItem
                    ? "Update Program Image (Optional)"
                    : "Program Image *"}
                </label>

                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-border shadow-xs bg-secondary/20">
                      <Image
                        src={previewUrl}
                        alt="Program Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
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

              {/* Name & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary block">
                    Program Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Health Outreach"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary block">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Healthcare, Education"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">
                  Tagline / Subtitle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bringing medical care closer to rural communities"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* DYNAMIC BODY PARAGRAPHS INPUTS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-primary block">
                    Body Paragraphs *{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      (Each box is a separate paragraph)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={addBodyParagraph}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Paragraph
                  </button>
                </div>

                {bodyParagraphs.map((para, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <textarea
                      required={index === 0}
                      rows={2}
                      placeholder={`Paragraph ${index + 1} content...`}
                      value={para}
                      onChange={(e) => handleBodyChange(index, e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 resize-y"
                    />
                    <button
                      type="button"
                      onClick={() => removeBodyParagraph(index)}
                      title="Remove Paragraph"
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* DYNAMIC CTAs INPUTS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-primary block">
                    Call to Actions (CTAs)
                  </label>
                  <button
                    type="button"
                    onClick={addCtaField}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add CTA
                  </button>
                </div>

                {ctas.map((cta, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`CTA ${index + 1} (e.g. Donate Now)`}
                      value={cta}
                      onChange={(e) => handleCtaChange(index, e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeCtaField(index)}
                      title="Remove CTA"
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Callout Section */}
              <div className="border border-border/80 rounded-2xl p-4 bg-secondary/10 space-y-3">
                <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> Callout Highlights
                  (Optional)
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Callout Title (e.g. Impact Summary)"
                    value={formData.calloutTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        calloutTitle: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <textarea
                    rows={2}
                    placeholder="Callout message body..."
                    value={formData.calloutBody}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        calloutBody: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
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
                    "Save Program"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-primary text-base">
                Delete Program
              </h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to remove this program from the active
                directory?
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