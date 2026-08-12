"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, ExternalLink } from "lucide-react";
import api from "@/services/api";

const INPUT =
  "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-mono " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

// Reads/writes metaPixelId via the standard PUT /api/settings endpoint —
// no dedicated sub-route needed since the Pixel ID is not sensitive.
export default function MetaPixelSettingsCard() {
  const [pixelId,   setPixelId]   = useState("");
  const [loading,   setLoading]   = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => setPixelId(data.data?.metaPixelId || ""))
      .catch(() => toast.error("Failed to load Meta Pixel settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/settings", { metaPixelId: pixelId.trim() });
      toast.success("Meta Pixel ID saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save Meta Pixel ID");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-[#037338]" />
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          {/* Meta "f" logomark in brand blue */}
          <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#1877F2"/>
            <path d="M25 18c0-3.866-3.134-7-7-7s-7 3.134-7 7c0 3.495 2.562 6.391 5.906 6.921V20.39h-1.778V18h1.778v-1.542c0-1.754 1.046-2.723 2.644-2.723.766 0 1.567.137 1.567.137v1.723h-.882c-.87 0-1.141.54-1.141 1.094V18h1.942l-.31 2.39h-1.632v4.531C22.438 24.391 25 21.495 25 18z" fill="white"/>
          </svg>
          <h2 className="text-base font-semibold text-gray-800">Meta Pixel</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Tracks page views and contact form submissions for Facebook & Instagram ad optimisation.
        </p>
      </div>

      {/* What gets tracked */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
        <p className="font-medium text-gray-600">Events fired automatically</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center flex-shrink-0 text-[10px] font-bold">P</span>
            <span><b className="text-gray-600">PageView</b> — fires when a visitor opens the main page.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center flex-shrink-0 text-[10px] font-bold">L</span>
            <span><b className="text-gray-600">Lead</b> — fires after the contact form is submitted successfully.</span>
          </div>
        </div>
      </div>

      {/* Pixel ID input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pixel ID
        </label>
        <input
          type="text"
          value={pixelId}
          onChange={(e) => setPixelId(e.target.value)}
          placeholder="e.g. 1234567890123456"
          className={INPUT}
        />
        <p className="text-xs text-gray-400 mt-1.5 ml-1 flex items-center gap-1">
          Find your Pixel ID in
          <a
            href="https://business.facebook.com/events_manager"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1877F2] hover:underline inline-flex items-center gap-0.5"
          >
            Events Manager <ExternalLink size={10} />
          </a>
          → Data Sources → your Pixel → Settings.
        </p>
      </div>

      {/* Status badge */}
      {pixelId.trim() ? (
        <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          ✓ Pixel active — ID <span className="font-mono">{pixelId.trim()}</span>
        </div>
      ) : (
        <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          Pixel inactive — enter an ID above to enable tracking.
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#037338] text-white hover:bg-[#025c2e] transition-colors disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Pixel ID"}
        </button>
      </div>

    </section>
  );
}
