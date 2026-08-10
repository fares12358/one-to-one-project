"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/context/LangContext";

const TechnologySection = () => {
  const { t } = useTranslation();
  const tech  = t.technology;
  const steps = tech?.steps || [];
  const imgSrc = tech?._images?.[0]?.url;

  return (
    <section id="technology" className="py-22 px-12 bg-[#ede8db]">
      <div className="max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
          <span className="block w-6 h-px bg-[#c9a84c]" />
          {tech.eyebrow}
        </div>

        <h2 className="font-serif text-4xl font-normal leading-snug mb-5 text-[#1a2e0e]">
          {tech.heading}
        </h2>

        <p className="text-[15px] text-[#3d5228] leading-relaxed max-w-2xl mb-12">
          {tech.lead}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`flex gap-5 py-5 ${i < steps.length - 1 ? "border-b border-dashed border-[rgba(var(--brand-accent-rgb),0.35)]" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-serif text-sm shrink-0">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[#1a2e0e] mb-1.5">{step.title}</h4>
                  <p className="text-sm text-[#6a8050] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[340px] lg:h-[460px] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(var(--brand-primary-rgb),0.18)]"
          >
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={tech.img_alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent)]/10" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
