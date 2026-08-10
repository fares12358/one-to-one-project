"use client";

import { useState, useRef } from "react";
import {
  Inbox, Trash2, ChevronDown, ChevronUp,
  Loader2, MailOpen, Mail as MailClosed,
  FileDown, X, CalendarRange,
} from "lucide-react";
import toast from "react-hot-toast";
import EmptyState   from "@/components/dashboard/EmptyState";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { useMessagesContext } from "@/context/MessagesContext";

const FILTERS = ["All", "Unread", "Read"];

/* ─── helpers ─────────────────────────────────────────────── */
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleString("en-EG", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo",
    });
  } catch { return dateStr; }
}

/** Returns YYYY-MM-DD in Cairo local time for a Date object */
function toCairoDateStr(date) {
  return date.toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" }); // en-CA = YYYY-MM-DD
}

/** Today's date string in Cairo time */
function todayStr() {
  return toCairoDateStr(new Date());
}

/* ─── ExportPanel ─────────────────────────────────────────── */
function ExportPanel({ messages, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate,   setEndDate]   = useState(todayStr());
  const [exporting, setExporting] = useState(false);

  const inRange = messages.filter((m) => {
    const d = toCairoDateStr(new Date(m.createdAt));
    if (startDate && d < startDate) return false;
    if (endDate   && d > endDate)   return false;
    return true;
  });

  const handleExport = async () => {
    if (inRange.length === 0) {
      toast.error("No messages in the selected range.");
      return;
    }
    setExporting(true);
    try {
      // Dynamic import — keeps xlsx out of the initial JS bundle
      const XLSX = (await import("xlsx")).default;

      const rows = inRange.map((m) => ({
        Date:     formatDate(m.createdAt),
        Name:     m.name     || "",
        Email:    m.email    || "",
        Phone:    m.phone    || "",
        Subject:  m.subject  || "",
        Message:  m.message  || "",
        Status:   m.read ? "Read" : "Unread",
      }));

      const ws = XLSX.utils.json_to_sheet(rows);

      // Column widths
      ws["!cols"] = [
        { wch: 22 }, // Date
        { wch: 24 }, // Name
        { wch: 32 }, // Email
        { wch: 18 }, // Phone
        { wch: 22 }, // Subject
        { wch: 60 }, // Message
        { wch: 10 }, // Status
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Messages");

      const filename = `messages_${startDate || "all"}_to_${endDate || "all"}.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success(`Exported ${inRange.length} message${inRange.length !== 1 ? "s" : ""}`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white border border-[#037338]/20 rounded-2xl p-5 shadow-[0_4px_24px_rgba(3,115,56,0.08)] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#037338]/10 flex items-center justify-center">
            <CalendarRange size={16} className="text-[#037338]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Export Messages</p>
            <p className="text-xs text-gray-400">Download as Excel (.xlsx)</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Date range inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Start date</label>
          <input
            type="date"
            value={startDate}
            max={endDate || todayStr()}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
          />
          <p className="text-[11px] text-gray-400 mt-1">Leave blank to include all older messages</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">End date</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            max={todayStr()}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
          />
          <p className="text-[11px] text-gray-400 mt-1">Leave blank to include all future messages</p>
        </div>
      </div>

      {/* Quick range presets */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Quick ranges</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Today",      days: 0 },
            { label: "Last 7 days", days: 7 },
            { label: "Last 30 days", days: 30 },
            { label: "Last 90 days", days: 90 },
            { label: "All time",    days: null },
          ].map(({ label, days }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (days === null) {
                  setStartDate("");
                  setEndDate("");
                } else if (days === 0) {
                  const t = todayStr();
                  setStartDate(t);
                  setEndDate(t);
                } else {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - days);
                  setStartDate(toCairoDateStr(start));
                  setEndDate(toCairoDateStr(end));
                }
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-[#037338]/10 hover:text-[#037338] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview count + export button */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{inRange.length}</span>{" "}
          message{inRange.length !== 1 ? "s" : ""} in range
        </p>
        <button
          onClick={handleExport}
          disabled={exporting || inRange.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#037338] hover:bg-[#025c2e] disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {exporting
            ? <Loader2 size={15} className="animate-spin" />
            : <FileDown size={15} />}
          {exporting ? "Exporting…" : "Export .xlsx"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function MessagesPage() {
  const { messages, loading, error, unreadCount, markRead, toggleRead, deleteMsg } =
    useMessagesContext();

  const [filter,       setFilter]       = useState("All");
  const [expanded,     setExpanded]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [showExport,   setShowExport]   = useState(false);

  const filtered = messages.filter((m) => {
    if (filter === "Unread") return !m.read;
    if (filter === "Read")   return  m.read;
    return true;
  });

  const handleRowClick = async (id) => {
    const msg = messages.find((m) => m._id === id);
    if (msg && !msg.read) await markRead(id);
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleToggleRead = async (e, id) => {
    e.stopPropagation();
    await toggleRead(id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMsg(deleteTarget);
      if (expanded === deleteTarget) setExpanded(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[#037338]" />
      </div>
    );
  }
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <div className="space-y-6">

      {/* Top bar: filters + export button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f ? "bg-white text-[#037338] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-[#96C422] text-[#012a14] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {filtered.length} {filtered.length === 1 ? "message" : "messages"}
          </span>
          <button
            onClick={() => setShowExport((v) => !v)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
              showExport
                ? "bg-[#037338] text-white border-[#037338]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#037338]/40 hover:text-[#037338]"
            }`}
          >
            <FileDown size={15} />
            Export
          </button>
        </div>
      </div>

      {/* Export panel — slides in below the top bar */}
      {showExport && (
        <ExportPanel
          messages={messages}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Message list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          heading="No messages"
          body={filter === "All" ? "Contact form submissions will appear here." : `No ${filter.toLowerCase()} messages.`}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((message) => (
            <div
              key={message._id}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                message.read ? "border-gray-100 bg-white" : "border-[#037338]/20 bg-[#037338]/[0.03]"
              }`}
            >
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50/80 transition-colors"
                onClick={() => handleRowClick(message._id)}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${message.read ? "bg-gray-200" : "bg-[#96C422]"}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm ${message.read ? "font-medium text-gray-700" : "font-semibold text-gray-900"}`}>
                      {message.name}
                    </span>
                    <span className="text-xs text-gray-400">{message.email}</span>
                    {message.subject && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {message.subject}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate mt-0.5 ${message.read ? "text-gray-400" : "text-gray-600"}`}>
                    {message.message}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block mr-1">{formatDate(message.createdAt)}</span>
                  <button
                    onClick={(e) => handleToggleRead(e, message._id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      message.read
                        ? "text-gray-300 hover:text-[#037338] hover:bg-[#037338]/8"
                        : "text-[#037338] hover:text-gray-400 hover:bg-gray-100"
                    }`}
                    title={message.read ? "Mark as unread" : "Mark as read"}
                  >
                    {message.read ? <MailClosed size={15} /> : <MailOpen size={15} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(message._id); }}
                    className="p-1.5 text-gray-300 hover:text-[#d4183d] hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                  {expanded === message._id
                    ? <ChevronUp size={16} className="text-gray-400" />
                    : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>

              {expanded === message._id && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="pt-4 space-y-3">
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                      <span><span className="font-medium text-gray-500">From:</span> {message.name} &lt;{message.email}&gt;</span>
                      {message.phone && <span><span className="font-medium text-gray-500">Phone:</span> {message.phone}</span>}
                      <span><span className="font-medium text-gray-500">Sent:</span> {formatDate(message.createdAt)}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </div>
                    <a
                      href={`mailto:${message.email}?subject=Re: ${message.subject || "Your inquiry"}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] transition-colors"
                    >
                      Reply via email →
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete this message?"
          message="This action cannot be undone."
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
