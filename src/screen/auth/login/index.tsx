"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (data.user.isSuspended) {
        toast.error("Account Suspended", {
          description:
            data.user.suspensionReason ||
            "Please contact system administration for assistance.",
          duration: 8000,
        });
        setLoading(false);
        return;
      }

      // Persist active user info & token in sessionStorage and localStorage
      if (typeof window !== "undefined") {
        if (data.token) {
          sessionStorage.setItem("laef_admin_token", data.token);
          localStorage.setItem("laef_admin_token", data.token);
        }
        if (data.user) {
          sessionStorage.setItem("laef_admin_user", JSON.stringify(data.user));
          localStorage.setItem("laef_admin_user", JSON.stringify(data.user));
        }
      }

      toast.success("Authentication Successful", {
        description: `Welcome back, ${data.user.fullName || data.user.email}`,
        duration: 8000,
      });

      // Dynamic Role-Based Routing
      const role = data.user.role?.toLowerCase() || "";
      const destination = 
        role === "superadmin" || role === "super-admin"
          ? "/super-admin" // Route super-admins here
          : "/admin";      // Route standard staff here

      // Redirect to appropriate Dashboard
      setTimeout(() => {
        router.push(destination);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please verify your credentials.";
      toast.error("Authentication Failed", {
        description: message,
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="mb-8 text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center transition-transform hover:scale-105"
          >
            <Image
              src="/laef-mark.png"
              alt="LAEF Logo"
              width={816}
              height={816}
              className="h-16 w-16"
              priority
            />
          </Link>

          {/* Secure Portal Indicator */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-widest pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Secure Staff Gateway
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Administrative Sign In
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Access is restricted to authorized staff and management personnel of LAEF.
          </p>
        </div>

        {/* Card Section */}
        <div className="surface-card p-8 rounded-2xl border border-border shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="official@laef.org"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-11 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-deep disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying Access...
                </>
              ) : (
                <>
                  Sign In to Portal <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Compliance & Governance Footer */}
          <div className="mt-8 pt-5 border-t border-border/60 text-center">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Protected by multi-factor authentication policies and session encryption. All access attempts are logged for auditing purposes.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}