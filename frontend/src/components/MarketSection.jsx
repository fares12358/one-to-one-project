"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/context/LangContext";

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Memoised — reused on the homepage strip and the full /market page
export const MarketCard = memo(function MarketCard({ item, index, images }) {
  const imgSrc = images?.[index]?.url || images?.[index];
  const rows = item.rows || [];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="bg-white rounded-2xl border border-[rgba(var(--brand-accent-rgb),0.18)] overflow-hidden shadow-[0_4px_24px_rgba(var(--brand-primary-rgb),0.06)]"
    >
      <div className="h-[160px] overflow-hidden relative">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent)]/10" />
        )}
      </div>

      <div className="p-6">
        <h4 className="text-[15px] font-semibold text-[#1a2e0e] mb-3.5">{item.title}</h4>
        <div className="flex flex-col">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2.5 ${i < rows.length - 1 ? "border-b border-[rgba(var(--brand-accent-rgb),0.15)]" : ""}`}
            >
              <span className="text-xs text-[#6a8050]">{row.label}</span>
              <span className="text-sm font-semibold text-[var(--brand-primary)] font-serif">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

const MarketSection = () => {
  const { t } = useTranslation();
  const m = t.market;
  const items  = m?.items   || [];
  const images = m?._images || [];

  const VISIBLE   = 3;
  const hasMore   = items.length > VISIBLE;
  const displayed = items.slice(0, VISIBLE);

  return (
    <section id="market" className="py-22 px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
            <span className="block w-6 h-px bg-[#c9a84c]" />
            {m?.eyebrow}
          </div>
          <h2 className="font-serif text-4xl font-normal leading-snug mb-5 text-[#1a2e0e] max-w-2xl">
            {m?.heading}
          </h2>
          <p className="text-[15px] text-[#3d5228] leading-relaxed max-w-2xl">
            {m?.lead}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {displayed.map((item, index) => (
            <MarketCard key={index} item={item} index={index} images={images} />
          ))}
        </motion.div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/market"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl
                bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] font-semibold text-sm
                hover:bg-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:text-white
                transition-all duration-300 hover:shadow-[0_8px_30px_rgba(var(--brand-primary-rgb),0.2)]"
            >
              <span>
                {m?.show_more || "View More"}
                {" "}
                <span className="text-[var(--brand-accent)] group-hover:text-white">
                  ({items.length})
                </span>
              </span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}

        {m?.note && (
          <p className="mt-10 text-xs text-[#96a882] max-w-2xl leading-relaxed">
            {m.note}
          </p>
        )}
      </div>
    </section>
  );
};

export default MarketSection;
