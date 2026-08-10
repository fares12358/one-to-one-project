"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/context/LangContext";

const ProblemSection = () => {
  const { t, isRTL } = useTranslation();
  const p = t.problem;
  const items = p?.items || [];
  const rows = Math.ceil(items.length / 2);

  return (
    <section className="py-22 px-12 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
          <span className="block w-6 h-px bg-[#c9a84c]" />
          {p.eyebrow}
        </div>

        <h2 className="font-serif text-4xl font-normal leading-snug mb-10 max-w-2xl">
          {p.heading}
        </h2>

        <div className="bg-[#f5f2eb] rounded-2xl border border-[rgba(var(--brand-accent-rgb),0.18)] p-10 lg:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {items.map((item, i) => {
              const row = Math.floor(i / 2);
              const isLastRow = row === rows - 1;
              const isLeftCol = i % 2 === 0;
              const sideBorder = isRTL ? "md:border-l" : "md:border-r";
              const sidePad = isRTL ? "md:pl-10" : "md:pr-10";
              const otherPad = isRTL ? "md:pr-10" : "md:pl-10";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`group flex gap-4 py-6 border-[rgba(var(--brand-accent-rgb),0.25)] ${!isLastRow ? "border-b" : ""} ${isLeftCol ? `${sideBorder} ${sidePad}` : otherPad}`}
                >
                  <div className="w-9 h-9 rounded-full bg-white border border-[rgba(var(--brand-accent-rgb),0.3)] text-[var(--brand-primary)] font-serif text-sm flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-[var(--brand-primary)] group-hover:text-white group-hover:border-[var(--brand-primary)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--brand-primary)] mb-2.5">{item.title}</h4>
                    <p className="text-sm text-[#6a8050] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
