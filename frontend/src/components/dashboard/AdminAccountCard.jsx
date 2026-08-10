"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const INPUT = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

const EMPTY = { currentPassword: "", newEmail: "", newPassword: "", confirmPassword: "" };

// Independent of the page's main Settings save flow — different endpoint
// (/api/auth/credentials) requiring re-auth via the current password.
export default function AdminAccountCard() {
  const { refreshUser } = useAuth();
  const [form,     setForm]     = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error,    setError]    = useState("");

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (key === "currentPassword") setError("");
  };

  const hasChange      = form.newEmail.trim() || form.newPassword;
  const passwordsMatch = !form.newPassword || form.newPassword === form.confirmPassword;
  const canSubmit       = Boolean(form.currentPassword) && Boolean(hasChange) && passwordsMatch && !isSaving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSaving(true);
    setError("");
    try {
      await api.put("/auth/credentials", {
        currentPassword: form.currentPassword,
        newEmail:    form.newEmail.trim() || undefined,
        newPassword: form.newPassword     || undefined,
      });
      await refreshUser();
      setForm(EMPTY);
      toast.success("Account updated!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#037338]" />
          <h2 className="text-base font-semibold text-gray-800">Admin Account</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Change your login email and/or password. Requires your current password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => set("currentPassword", e.target.value)}
            className={INPUT}
            autoComplete="current-password"
          />
          {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">New email (optional)</label>
            <input
              type="email"
              value={form.newEmail}
              onChange={(e) => set("newEmail", e.target.value)}
              className={INPUT}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New password (optional)</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => set("newPassword", e.target.value)}
              className={INPUT}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              className={INPUT}
              autoComplete="new-password"
            />
            {form.newPassword && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1.5">Passwords don&apos;t match</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#037338] text-white hover:bg-[#025c2e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? "Updating..." : "Update Account"}
          </button>
        </div>
      </form>
    </section>
  );
}
