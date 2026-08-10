"use client";

import { useState } from "react";
import {
  Inbox, Trash2, ChevronDown, ChevronUp,
  Loader2, MailOpen, Mail as MailClosed,
} from "lucide-react";
import toast from "react-hot-toast";
import EmptyState   from "@/components/dashboard/EmptyState";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { useMessagesContext } from "@/context/MessagesContext";

const FILTERS = ["All", "Unread", "Read"];

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleString("en-EG", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo",
    });
  } catch { return dateStr; }
}

export default function MessagesPage() {
  // Shared context — no second API call
  const { messages, loading, error, unreadCount, markRead, toggleRead, deleteMsg } =
    useMessagesContext();

  const [filter,       setFilter]       = useState("All");
  const [expanded,     setExpanded]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

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
      {/* Filter tabs */}
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
        <span className="text-sm text-gray-400">
          {filtered.length} {filtered.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {/* List */}
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
                  {expanded === message._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
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
