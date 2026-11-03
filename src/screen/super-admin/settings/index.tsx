"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User as UserIcon,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  KeyRound,
  CheckCircle2,
  Building,
  Globe,
  Pencil,
  X,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  getCurrentUser,
  updateCurrentUser,
  changeUserPassword,
  User,
  ChangePasswordPayload,
  deleteCurrentUser,
} from "@/services/auth";

interface PasswordFormInputs extends ChangePasswordPayload {
  confirmPassword: string;
}

export default function SuperAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "security">("account");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete Account Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Edit Mode Toggle State for Account
  const [isEditing, setIsEditing] = useState(false);

  // Original Profile Snapshot (for reset on cancel)
  const [originalProfile, setOriginalProfile] = useState({
    fullName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Working Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Role details
  const [userRole, setUserRole] = useState<string>("super-admin");

  // React Hook Form for Password Change
  const {
    register,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
    watch,
  } = useForm<PasswordFormInputs>();

  const newPasswordValue = watch("newPassword");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        const user: User = res.user;

        setUserRole(user.role || "super-admin");
        const loadedData = {
          fullName: user.fullName || "",
          email: user.email || "",
          gender: user.gender || "",
          phoneNumber: user.phoneNumber || "",
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        };

        setOriginalProfile(loadedData);
        setProfileData(loadedData);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Cancel Editing and Restore Original Data
  const handleCancelEdit = () => {
    setProfileData(originalProfile);
    setIsEditing(false);
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      const payload = {
        fullName: profileData.fullName,
        gender: profileData.gender,
        phoneNumber: profileData.phoneNumber,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
          country: profileData.country,
        },
      };

      await updateCurrentUser(payload);
      toast.success("Account details updated successfully!");

      setOriginalProfile(profileData);
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile details.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Change Password Form Submit
  const onPasswordSubmit = async (data: PasswordFormInputs) => {
    try {
      setChangingPassword(true);
      await changeUserPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      resetPasswordForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await deleteCurrentUser();
      
      toast.success("Account deleted successfully.");
      
      // Clear session/local tokens
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeletingAccount(false);
      setDeleteModalOpen(false);
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
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Super Admin System Preferences
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Account & Security Settings</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage your super admin credentials, contact information, and platform security preferences.
            </p>
          </div>
          <span className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Role: {userRole}
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border space-x-2 md:space-x-4">
        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "account"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserIcon className="h-4 w-4" /> Account Details
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="h-4 w-4" /> Security & Password
        </button>
      </div>

      {/* TAB 1: ACCOUNT DETAILS */}
      {activeTab === "account" && (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isEditing ? "Editing Mode Active" : "Profile Details (Read Only)"}
            </span>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Information
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Cancel Editing
              </button>
            )}
          </div>

          {/* Personal Info Card */}
          <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary shrink-0" /> Personal Information
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className={`w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm focus:outline-none ${
                      isEditing
                        ? "bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Email Address (System ID)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={profileData.email}
                    className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className={`w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm focus:outline-none ${
                      isEditing
                        ? "bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Gender
                </label>
                <select
                  disabled={!isEditing}
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  className={`w-full rounded-xl border border-border py-2.5 px-4 text-sm capitalize focus:outline-none ${
                    isEditing
                      ? "bg-background text-foreground focus:border-primary"
                      : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location / Address Card */}
          <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary shrink-0" /> Address & Location
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.street}
                  onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                  placeholder="e.g. 37 Oluarikawe Street"
                  className={`w-full rounded-xl border border-border py-2.5 px-4 text-sm focus:outline-none ${
                    isEditing
                      ? "bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  City / Neighborhood
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    placeholder="e.g. Ikotun"
                    className={`w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm focus:outline-none ${
                      isEditing
                        ? "bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  State / Region
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  placeholder="e.g. Lagos"
                  className={`w-full rounded-xl border border-border py-2.5 px-4 text-sm focus:outline-none ${
                    isEditing
                      ? "bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Zip / Postal Code
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.zipCode}
                  onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                  placeholder="e.g. 100001"
                  className={`w-full rounded-xl border border-border py-2.5 px-4 text-sm focus:outline-none ${
                    isEditing
                      ? "bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Country
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    placeholder="e.g. Nigeria"
                    className={`w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm focus:outline-none ${
                      isEditing
                        ? "bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {savingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </form>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
            <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-border space-y-6">
              <h3 className="text-base sm:text-lg font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary shrink-0" /> Password Management
              </h3>

              <div className="max-w-xl space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      {...register("currentPassword", { required: "Current password is required" })}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <span className="text-xs text-rose-600 mt-1 block">
                      {passwordErrors.currentPassword.message}
                    </span>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message:
                            "Must include uppercase, lowercase, number, and special symbol (@$!%*?&)",
                        },
                      })}
                      placeholder="Min 8 chars, Upper, Lower, Number & Symbol"
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <span className="text-xs text-rose-600 mt-1 block">
                      {passwordErrors.newPassword.message}
                    </span>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Please confirm your new password",
                        validate: (value) =>
                          value === newPasswordValue || "Passwords do not match",
                      })}
                      placeholder="Re-enter new password"
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <span className="text-xs text-rose-600 mt-1 block">
                      {passwordErrors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Password Action */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {changingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Update Password
              </button>
            </div>
          </form>

          {/* DANGER ZONE: DELETE ACCOUNT */}
          <div className="surface-card p-5 sm:p-6 md:p-8 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0" /> Danger Zone: Delete Super Admin Account
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Once you delete your account, there is no going back. All super administrative privileges and associated data will be permanently removed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-700 cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="h-4 w-4 shrink-0" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-md rounded-2xl border border-border p-6 md:p-8 space-y-6 shadow-xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-primary">Are you absolutely sure?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action cannot be undone. This will permanently delete your super admin account and remove your access from the portal.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 rounded-xl border border-border bg-background py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingAccount}
                onClick={handleDeleteAccount}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {deletingAccount && <Loader2 className="h-4 w-4 animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}