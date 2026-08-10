"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/context/LangContext";

const PhilosophySection = () => {
  const { t } = useTranslation();
  const items = t.philosophy?.items || [];

  return (
    <section className="py-22 px-12 bg-[#f5f2eb]">
      <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {items.map((item, i) => {
          const accent = i % 2 === 0
            ? "from-[var(--brand-primary)] to-[var(--brand-accent)]"
            : "from-[#c9a84c] to-[#e8c96a]";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden bg-white rounded-2xl border border-[rgba(var(--brand-accent-rgb),0.18)] p-8 shadow-[0_4px_24px_rgba(var(--brand-primary-rgb),0.06)] hover:shadow-[0_12px_36px_rgba(var(--brand-primary-rgb),0.12)] hover:border-[var(--brand-accent)]/40 transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accent}`} />

              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-primary)] mb-3.5">
                {item.label}
              </div>
              <h2 className="font-serif text-[28px] font-normal leading-snug mb-4 text-[#1a2e0e]">
                {item.heading}
              </h2>
              <p className="text-[15px] text-[#3d5228] leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PhilosophySection;
