"use client";

import LogoMarquee from "@/components/LogoMarquee";
import { useTranslation } from "@/context/LangContext";

const ClientsSection = () => {
  const { t } = useTranslation();
  const c = t.clients;

  return (
    <LogoMarquee
      id="clients"
      eyebrow={c?.eyebrow}
      heading={c?.heading}
      lead={c?.lead}
      items={c?.items}
      images={c?._images}
      bgClassName="bg-[#f5f2eb]"
      reverse
    />
  );
};

export default ClientsSection;
