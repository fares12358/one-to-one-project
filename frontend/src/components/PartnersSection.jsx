"use client";

import LogoMarquee from "@/components/LogoMarquee";
import { useTranslation } from "@/context/LangContext";

const PartnersSection = () => {
  const { t } = useTranslation();
  const p = t.partners;

  return (
    <LogoMarquee
      id="partners"
      eyebrow={p?.eyebrow}
      heading={p?.heading}
      lead={p?.lead}
      items={p?.items}
      images={p?._images}
      bgClassName="bg-white"
    />
  );
};

export default PartnersSection;
