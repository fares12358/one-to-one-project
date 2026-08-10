"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaFlask, FaSun, FaLeaf, FaSeedling, FaMicroscope, FaTree, FaAtom, FaCog } from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";

// Icon pool — cycles for any number of cards
const ICON_POOL = [FaFlask, FaSun, FaLeaf, FaSeedling, FaMicroscope, FaTree, FaAtom, FaCog];

// Fallback images — cycles
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
  "https://images.unsplash.com/photo-1592982537447-6f2a6a0a7b8a?w=800&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80",
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
];

const Technology = () => {
  const { t } = useTranslation();
  const tech = t.technology;
  const cards = tech?.cards || [];
  // images stored as [{url, publicId}] objects or fallback strings
  const images = tech?._images || [];

  // Responsive grid: 1 col on mobile, 2 cols on md+, max 3 on lg if many cards
  const gridCols =
    cards.length === 1
      ? "grid-cols-1 max-w-2xl"
      : cards.length >= 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <section id="technology" className="py-22 px-12 bg-[#ede8db]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
          <span className="block w-6 h-px bg-[#c9a84c]" />
          {tech.eyebrow}
        </div>

        <h2 className="font-serif text-4xl font-normal leading-snug mb-8 text-[#1a2e0e]">
          {tech.heading_line1}<br />{tech.heading_line2}
        </h2>

        {/* Dynamic cards grid */}
        <div className={`grid ${gridCols} gap-4`}>
          {cards.map((card, index) => {
            const Icon = ICON_POOL[index % ICON_POOL.length];
            const imgSrc =
              images[index]?.url ||
              images[index] ||
              FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.15, duration: 0.6 }}
                className="bg-white rounded-2xl border border-[rgba(var(--brand-accent-rgb),0.18)] overflow-hidden shadow-[0_4px_24px_rgba(var(--brand-primary-rgb),0.06)]"
              >
                <div className="h-[220px] overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    src={imgSrc}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#f0f8dc] flex items-center justify-center flex-shrink-0">
                      <Icon className="text-xl text-[var(--brand-primary)]" />
                    </div>
                    <div className="text-[15px] font-semibold text-[#1a2e0e]">{card.name}</div>
                  </div>
                  <p className="text-[13px] text-[#6a8050] leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Technology;
