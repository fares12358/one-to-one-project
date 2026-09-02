"use client";

import React from "react";
import Image from "next/image";

const MARK_COLORS = ["var(--brand-primary)", "var(--brand-accent)", "#05964a", "#048a44", "#007FFF"];

const LogoCard = ({ item, index }) => {
  const content = (
    <div className="group shrink-0 w-56 h-36 flex items-center justify-center bg-white border border-[rgba(var(--brand-accent-rgb),0.2)] rounded-2xl px-6 transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[0_10px_28px_rgba(var(--brand-primary-rgb),0.14)] hover:-translate-y-1">
      {item.src ? (
        <div className="relative w-full h-full my-2 grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105">
          <Image
            src={item.src}
            alt={item.name}
            fill
            sizes="224px"
            className="object-contain"
            unoptimized={item.src.includes("unsplash.com")}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-serif text-2xl shrink-0"
            style={{ background: MARK_COLORS[index % MARK_COLORS.length] }}
          >
            {(item.name || "?").trim().charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-[#6a8050] text-center leading-tight">{item.name}</span>
        </div>
      )}
    </div>
  );

  if (item.link) {
    const href = /^https?:\/\//i.test(item.link) ? item.link : `https://${item.link}`;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>
        {content}
      </a>
    );
  }
  return content;
};

// Shared infinite-scroll logo strip — used by Strategic Partners and Our Clients.
// Reversed direction lets the two sections visually distinguish themselves when stacked.
export default function LogoMarquee({ id, eyebrow, heading, lead, items = [], images = [], bgClassName = "bg-white", reverse = false }) {
  const logos = items.map((item, i) => ({
    ...item,
    src: images[i]?.url || images[i] || null,
  }));
  // duplicated for a seamless infinite loop
  const track = [...logos, ...logos];

  return (
    <section id={id} className={`py-22 px-5 sm:px-8 lg:px-12 ${bgClassName} overflow-hidden`}>
      <div className="max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
          <span className="block w-6 h-px bg-[#c9a84c]" />
          {eyebrow}
        </div>
        <h2 className="font-serif text-4xl font-normal leading-snug mb-5 text-[#1a2e0e]">
          {heading}
        </h2>
        <p className="text-[15px] text-[#3d5228] leading-relaxed max-w-2xl">
          {lead}
        </p>
      </div>

      {logos.length > 0 && (
        <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          {/* Spacing lives on each item (mr-7), not on the flex container's `gap` —
              that keeps the duplicated track's two halves pixel-identical in width,
              so translateX(-50%) loops with no snap/jump at the seam. */}
          <div className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
            {track.map((logo, i) => (
              <div key={i} className="mr-7">
                <LogoCard item={logo} index={i % logos.length} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
