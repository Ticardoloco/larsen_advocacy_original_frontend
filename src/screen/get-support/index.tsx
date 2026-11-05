"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  ShieldAlert, 
  Send, 
  Loader2, 
  PhoneCall, 
  UserCheck, 
  UserX, 
  BadgeCheck, 
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/site/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { HELPLINE } from "@/data/laef";
import { postSupport, SupportPayload } from "@/services/getSupport";

const reportCategories = [
  "Sexual Assault and Rape",
  "Child Sexual Abuse",
  "Gender-Based Violence",
  "Child Abuse and Neglect",
  "Child Trafficking and Exploitation",
  "Domestic and Intimate Partner Violence",
  "Online Sexual Exploitation and Abuse",
  "Sexual Harassment and Intimidation",
  "Child Protection Concerns",
  "Survivor Support and Referrals",
];

const urgencyLevels = [
  { value: "standard", label: "Standard", desc: "General question or non-urgent help" },
  { value: "high", label: "High Urgency", desc: "Needs a fast response within 24 hours" },
  { value: "critical", label: "Critical Emergency", desc: "Immediate danger or active crisis" },
] as const;

export default function GetSupportPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [category, setCategory] = useState(reportCategories[0]);
  const [urgency, setUrgency] = useState<"standard" | "high" | "critical">("standard");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const resetForm = () => {
    setCategory(reportCategories[0]);
    setUrgency("standard");
    setMessage("");
    setIsAnonymous(false);
    setFullName("");
    setEmail("");
    setPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please explain what you are going through or what help you need.");
      return;
    }

    if (!isAnonymous && !fullName.trim() && !email.trim() && !phone.trim()) {
      toast.error("Please give us at least one way to contact you, or switch to Anonymous mode.");
      return;
    }

    const payload: SupportPayload = {
      category,
      urgency,
      message: message.trim(),
      isAnonymous,
      ...(!isAnonymous && {
        fullName: fullName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      }),
    };

    try {
      setSubmitting(true);
      const res = await postSupport(payload);
      toast.success(res.message || "Your request was sent securely.");
      setSubmitted(true);
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Standardized Site Page Header */}
      <PageHeader
        eyebrow="Confidential Help Desk"
        title="Get Support / Report an Issue"
        lead="If you or someone you know needs help, counseling, legal advice, or emergency protection, fill out the form below safely and securely."
      />

      <div className="max-w-4xl mx-auto space-y-8 px-4 py-12">
        {/* Immediate Emergency Hotline Callout */}
        <div className="surface-card p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-900 dark:text-rose-400">Are you in immediate danger?</h2>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
                Please do not wait for a web message response. Call our free 24-Hour Helpline right away.
              </p>
            </div>
          </div>
          <a
            href={`tel:${HELPLINE}`}
            className="inline-flex items-center gap-2 bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-rose-700 transition-colors shrink-0"
          >
            <PhoneCall className="h-4 w-4" /> Call {HELPLINE}
          </a>
        </div>

        {/* Main Support Form */}
        <form onSubmit={handleSubmit} className="surface-card p-7 md:p-9 rounded-2xl border border-border space-y-6">
          <h2 className="text-xl text-primary font-bold">Help Request Form</h2>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              What type of help do you need? <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium outline-none focus:border-primary cursor-pointer"
            >
              {reportCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Level Cards */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">How fast do you need help?</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {urgencyLevels.map((lvl) => {
                const isSelected = urgency === lvl.value;
                return (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => setUrgency(lvl.value as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="font-bold text-xs text-primary capitalize flex items-center justify-between">
                      {lvl.label}
                      {lvl.value === "critical" && <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anonymous Toggle Switch */}
          <div className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-primary flex items-center gap-2">
                {isAnonymous ? <UserX className="h-4 w-4 text-amber-600" /> : <UserCheck className="h-4 w-4 text-emerald-600" />}
                Send Anonymously (Hide My Name)
              </div>
              <p className="text-xs text-muted-foreground">
                {isAnonymous
                  ? "Your name and details will stay completely hidden. No contact info will be saved."
                  : "Enter your contact details so our support team can reach back out to help you."}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAnonymous ? "bg-primary" : "bg-input"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isAnonymous ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Contact Fields (Shown only if not anonymous) */}
          {!isAnonymous && (
            <div className="space-y-4 pt-2 border-t border-border/60 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-foreground">Full Name</span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-foreground">Phone Number</span>
                  <input
                    type="tel"
                    placeholder="e.g., 08012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Email Address</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
            </div>
          )}

          {/* Detailed Message Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Tell us what is happening or how we can help <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please write down what happened, your location (if safe), or what kind of help you need..."
              className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full cursor-pointer"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending Request...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Send Request Privately
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 pt-2">
            <ShieldAlert className="h-3.5 w-3.5 text-emerald-600" />
            Protected by LAEF safety standards. Your privacy and safety come first.
          </p>
        </form>

        {/* Confirmation Modal */}
        {submitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="surface-card w-full max-w-md p-8 text-center rounded-2xl shadow-xl space-y-4">
              <BadgeCheck className="mx-auto h-16 w-16 text-emerald-600" />
              <h2 className="text-2xl font-bold text-primary">Request Received</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thank you. Your help request has been sent safely to the LAEF support team.
              </p>
              <Button
                className="w-full cursor-pointer mt-4"
                size="lg"
                onClick={() => setSubmitted(false)}
              >
                Close Window
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}