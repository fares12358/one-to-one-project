"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/context/LangContext";

const TeamSection = () => {
  const { t } = useTranslation();
  const team = t.team;
  const imgSrc = team?._images?.[0]?.url;

  return (
    <section className="relative py-22 px-12 bg-[#f5f2eb] overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-accent)]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--brand-primary)]/6 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[380px] lg:h-[440px] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(var(--brand-primary-rgb),0.18)]"
          >
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={team?.img_alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent)]/10" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
              <span className="block w-6 h-px bg-[#c9a84c]" />
              {team?.eyebrow}
            </div>

            <h2 className="font-serif text-4xl font-normal leading-snug mb-6 text-[#1a2e0e]">
              {team?.heading}
            </h2>

            <div className="space-y-4">
              {(team?.body || []).map((paragraph, i) => (
                <p key={i} className="text-[15px] text-[#3d5228] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
