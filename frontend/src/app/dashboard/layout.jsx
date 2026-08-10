"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MessagesProvider } from "@/context/MessagesContext";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

const PAGE_TITLES = {
  "/dashboard":               "Overview",
  "/dashboard/hero":          "Hero Section",
  "/dashboard/about":         "About Section",
  "/dashboard/why-us":        "Why Us Section",
  "/dashboard/mission":       "Mission & Vision",
  "/dashboard/philosophy":    "Philosophy Section",
  "/dashboard/problem":       "Problem We Solve",
  "/dashboard/services":      "Our Services",
  "/dashboard/technology":    "How We Work",
  "/dashboard/who-we-serve":  "Who We Serve",
  "/dashboard/partners":      "Strategic Partners",
  "/dashboard/clients":       "Our Clients",
  "/dashboard/market":        "Market Opportunity",
  "/dashboard/team":          "Our Team",
  "/dashboard/contact":       "Contact Section",
  "/dashboard/footer":        "Footer",
  "/dashboard/messages":      "Messages",
  "/dashboard/settings":      "Settings",
};

const PUBLIC_PATHS = [
  "/dashboard/login",
  "/dashboard/forgot-password",
  "/dashboard/reset-password",
];

function DashboardShell({ children }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isPublicPath) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: "Alexandria, sans-serif", fontSize: "14px" },
          }}
        />
        {children}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#037338]" />
      </div>
    );
  }

  if (!user) return null;

  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  return (
    // dashboard-shell — marker class scopes the globals.css RTL input rule
    // away from this subtree so the per-field dir="ltr/rtl" on FieldEditor
    // is never overridden by the [dir="rtl"] body input global selector.
    <MessagesProvider>
      <div className="dashboard-shell min-h-screen bg-gray-50 overflow-x-hidden">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: "Alexandria, sans-serif", fontSize: "14px" },
            success: { iconTheme: { primary: "#037338", secondary: "#fff" } },
          }}
        />
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
          <TopBar title={pageTitle} onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 flex flex-col">
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </MessagesProvider>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
