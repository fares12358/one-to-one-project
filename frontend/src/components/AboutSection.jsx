"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/context/LangContext";

const AboutSection = () => {
  const { t } = useTranslation();
  const a = t.about;
  const imgSrc = a?._images?.[0]?.url;

  return (
    <section id="about" className="py-22 px-12 bg-[#f5f2eb]">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-18 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
              <span className="block w-6 h-px bg-[#c9a84c]" />
              {a.eyebrow}
            </div>

            <h2 className="font-serif text-4xl font-normal leading-snug mb-8">
              {a.heading_line1}<br />{a.heading_line2}
            </h2>

            <div className="space-y-4">
              {(a.body || []).map((paragraph, i) => (
                <p key={i} className="text-[15px] text-[#3d5228] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[460px] hidden lg:block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(var(--brand-primary-rgb),0.18)]"
            >
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={a.img_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent)]/10" />
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
