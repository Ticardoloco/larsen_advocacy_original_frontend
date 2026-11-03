"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  X,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Eye,
  MapPin,
} from "lucide-react";
import {
  getAllUsers,
  registerAdmin,
  suspendUser,
  deleteUser,
  User,
  RegisterAdminPayload,
} from "@/services/auth";

export default function SuperAdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // Register Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerForm, setRegisterForm] = useState<RegisterAdminPayload>({
    email: "",
    password: "",
    role: "admin",
  });

  // View Info Modal State
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Suspend Modal State
  const [suspendModalUser, setSuspendModalUser] = useState<User | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspending, setSuspending] = useState(false);

  // Delete Confirmation State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.users || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Register Admin Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.email || !registerForm.password) {
      toast.error("Please fill in email and password.");
      return;
    }

    try {
      setRegistering(true);
      await registerAdmin(registerForm);
      toast.success("New admin registered successfully!");
      setIsRegisterModalOpen(false);
      setRegisterForm({
        email: "",
        password: "",
        role: "admin",
      });
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to register admin.");
    } finally {
      setRegistering(false);
    }
  };

  // Handle Suspend / Unsuspend Toggle
  const handleSuspendToggle = async () => {
    if (!suspendModalUser) return;
    
    if (suspendModalUser.role === "super-admin") {
      toast.error("Super Admin accounts cannot be suspended.");
      return;
    }

    try {
      setSuspending(true);
      const newSuspensionState = !suspendModalUser.isSuspended;
      
      await suspendUser(suspendModalUser._id, {
        isSuspended: newSuspensionState,
        suspensionReason: newSuspensionState ? suspensionReason || "Administrative suspension" : null,
      });

      toast.success(
        newSuspensionState ? "User suspended successfully." : "User unsuspended successfully."
      );
      setSuspendModalUser(null);
      setSuspensionReason("");
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update suspension status.");
    } finally {
      setSuspending(false);
    }
  };

  // Handle Delete User
  const confirmDelete = async () => {
    if (!userToDelete) return;

    if (userToDelete.role === "super-admin") {
      toast.error("Super Admin accounts cannot be deleted.");
      return;
    }

    try {
      setDeleting(true);
      await deleteUser(userToDelete._id);
      toast.success("User deleted successfully.");
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setUserToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete user.");
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
            <Users className="h-3.5 w-3.5" /> Access Control
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">User Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            View system users, inspect full profiles, regulate suspensions, and onboard new administrators.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto shrink-0 text-xs sm:text-sm"
        >
          <UserPlus className="h-4 w-4" /> Register New Admin
        </button>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl border border-border text-center space-y-3 bg-card">
          <Users className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="font-bold text-primary text-base">No Users Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Get started by adding new administrators or checking user records.
          </p>
        </div>
      ) : (
        <div className="surface-card rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 sm:px-6">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {users.map((u) => {
                  const isSuperAdmin = u.role === "super-admin";

                  return (
                    <tr key={u._id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-4 sm:px-6">
                        <div className="font-semibold text-primary">{u.fullName || u.email.split("@")[0]}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" /> {u.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            isSuperAdmin
                              ? "bg-purple-500/10 text-purple-700"
                              : "bg-emerald-500/10 text-emerald-700"
                          }`}
                        >
                          {isSuperAdmin ? <ShieldCheck className="h-3 w-3" /> : null}
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {u.phoneNumber || "N/A"}
                        </div>
                        <div className="mt-0.5 capitalize">Gender: {u.gender || "N/A"}</div>
                      </td>
                      <td className="p-4">
                        {u.isSuspended ? (
                          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                            <UserX className="h-3 w-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                            <UserCheck className="h-3 w-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Info Button */}
                          <button
                            onClick={() => setViewingUser(u)}
                            title="View Full Info"
                            className="rounded-xl p-2 text-primary hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {isSuperAdmin ? (
                            <span className="text-[11px] text-muted-foreground font-medium italic ml-1">
                              Protected
                            </span>
                          ) : (
                            <>
                              {/* Suspend / Unsuspend Button */}
                              <button
                                onClick={() => {
                                  setSuspendModalUser(u);
                                  setSuspensionReason(u.suspensionReason || "");
                                }}
                                title={u.isSuspended ? "Unsuspend User" : "Suspend User"}
                                className={`rounded-xl p-2 transition-colors cursor-pointer ${
                                  u.isSuspended
                                    ? "text-green-600 hover:bg-green-50"
                                    : "text-amber-600 hover:bg-amber-50"
                                }`}
                              >
                                <ShieldAlert className="h-4 w-4" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => setUserToDelete(u)}
                                title="Delete User"
                                className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Info Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/25">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> User Profile Information
              </h3>
              <button
                onClick={() => setViewingUser(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-xl border border-border/60">
                <div>
                  <span className="text-[11px] font-bold uppercase text-muted-foreground block">Full Name</span>
                  <span className="font-semibold text-primary">{viewingUser.fullName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-muted-foreground block">Role</span>
                  <span className="font-semibold text-primary capitalize">{viewingUser.role}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Email Address</span>
                  <span className="font-medium text-primary">{viewingUser.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span className="font-medium text-primary">{viewingUser.phoneNumber || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium text-primary capitalize">{viewingUser.gender || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Account Status</span>
                  <span>
                    {viewingUser.isSuspended ? (
                      <span className="text-rose-600 font-bold text-xs bg-rose-500/10 px-2 py-0.5 rounded-md uppercase">Suspended</span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">Active</span>
                    )}
                  </span>
                </div>
                {viewingUser.isSuspended && viewingUser.suspensionReason && (
                  <div className="py-2 border-b border-border/40">
                    <span className="text-muted-foreground block text-xs mb-1">Suspension Reason</span>
                    <span className="font-medium text-rose-700 bg-rose-500/5 p-2.5 rounded-lg block text-xs">{viewingUser.suspensionReason}</span>
                  </div>
                )}
              </div>

              {/* Address Details Section */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Address Information
                </span>
                <div className="bg-secondary/10 p-4 rounded-xl border border-border/60 text-xs space-y-1.5 text-muted-foreground">
                  <div><strong className="text-primary">Street:</strong> {viewingUser.address?.street || "N/A"}</div>
                  <div><strong className="text-primary">City:</strong> {viewingUser.address?.city || "N/A"} | <strong className="text-primary">State:</strong> {viewingUser.address?.state || "N/A"}</div>
                  <div><strong className="text-primary">Zip Code:</strong> {viewingUser.address?.zipCode || "N/A"} | <strong className="text-primary">Country:</strong> {viewingUser.address?.country || "N/A"}</div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground font-mono">
                <div>User ID: {viewingUser._id}</div>
              </div>
            </div>

            <div className="flex items-center justify-end p-4 border-t border-border bg-secondary/10">
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-95 transition-opacity cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Admin Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/20">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" /> Register New Admin
              </h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Role</label>
                <select
                  value={registerForm.role}
                  onChange={(e: any) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {registering ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Registering...
                    </>
                  ) : (
                    "Create Admin"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div className="space-y-1 text-center">
              <h3 className="font-bold text-primary text-base">
                {suspendModalUser.isSuspended ? "Unsuspend User" : "Suspend User"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {suspendModalUser.isSuspended
                  ? `Are you sure you want to restore access for ${suspendModalUser.fullName || suspendModalUser.email}?`
                  : `Provide a reason for suspending ${suspendModalUser.fullName || suspendModalUser.email}.`}
              </p>
            </div>

            {!suspendModalUser.isSuspended && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block">Suspension Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Policy violation"
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSuspendModalUser(null)}
                disabled={suspending}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSuspendToggle}
                disabled={suspending}
                className={`flex-1 inline-flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 ${
                  suspendModalUser.isSuspended
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {suspending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...
                  </>
                ) : suspendModalUser.isSuspended ? (
                  "Unsuspend"
                ) : (
                  "Suspend"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="surface-card bg-background border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-xl p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-primary text-base">Delete User Record</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to permanently delete <span className="font-semibold text-primary">{userToDelete.fullName || userToDelete.email}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
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