"use client";

import HeroSection       from "@/components/HeroSection";
import AboutSection      from "@/components/AboutSection";
import WhyUsSection      from "@/components/WhyUsSection";
import MissionSection    from "@/components/MissionSection";
import PhilosophySection from "@/components/PhilosophySection";
import ProblemSection    from "@/components/ProblemSection";
import ServicesSection   from "@/components/ServicesSection";
import TechnologySection from "@/components/TechnologySection";
import WhoWeServeSection from "@/components/WhoWeServeSection";
import PartnersSection   from "@/components/PartnersSection";
import ClientsSection    from "@/components/ClientsSection";
import MarketSection     from "@/components/MarketSection";
import TeamSection       from "@/components/TeamSection";
import ContactSection    from "@/components/ContactSection";
import Header            from "@/components/Header";
import Footer            from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <WhyUsSection />
        <MissionSection />
        <PhilosophySection />
        <ProblemSection />
        <ServicesSection />
        <TechnologySection />
        <WhoWeServeSection />
        <PartnersSection />
        <ClientsSection />
        <MarketSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
