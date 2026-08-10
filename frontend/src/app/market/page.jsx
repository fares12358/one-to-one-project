"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MarketCard } from "@/components/MarketSection";
import { useTranslation } from "@/context/LangContext";

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export default function MarketAllPage() {
  const { t } = useTranslation();
  const m      = t.market;
  const items  = m?.items   || [];
  const images = m?._images || [];

  const lgCols =
    items.length <= 1 ? "lg:grid-cols-1" :
    items.length === 2 ? "lg:grid-cols-2" :
                          "lg:grid-cols-3";

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <Link
              href="/#market"
              className="inline-flex items-center gap-2 text-[#6a8050] hover:text-[var(--brand-primary)] text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {m?.back_to_home || "Back to home"}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
              <span className="block w-6 h-px bg-[#c9a84c]" />
              {m?.eyebrow}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[#1a2e0e] max-w-3xl">
              {m?.heading}
            </h1>
            <p className="mt-4 text-[#6a8050] text-sm">
              {items.length} {items.length === 1 ? "market" : "markets"}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${lgCols}`}
          >
            {items.map((item, index) => (
              <MarketCard key={index} item={item} index={index} images={images} />
            ))}
          </motion.div>

          {m?.note && (
            <p className="mt-14 text-xs text-[#96a882] max-w-2xl leading-relaxed">
              {m.note}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
