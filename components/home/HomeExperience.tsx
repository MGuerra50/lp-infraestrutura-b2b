"use client";

import { HeroSection } from "@/components/hero/HeroSection";
import { FullPageScroller } from "@/components/scroll/FullPageScroller";
import { FullPageSection } from "@/components/scroll/FullPageSection";
import { ScrollVideoExperience } from "@/components/scroll-video/ScrollVideoExperience";
import { FramePreloader } from "@/components/scroll-video/FramePreloader";
import { TechnicalResourcesSection } from "@/components/technical-resources/TechnicalResourcesSection";
import { EcosystemSection } from "@/components/ecosystem/EcosystemSection";
import { CaseStudiesSection } from "@/components/case-studies/CaseStudiesSection";
import { DeploymentJourneySection } from "@/components/deployment-journey/DeploymentJourneySection";
import { ContactCtaSection } from "@/components/contact-cta/ContactCtaSection";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function HomeExperience() {
  return (
    <FullPageScroller>
      <FramePreloader />
      <FullPageSection id="hero" className="z-10 bg-white">
        <HeroSection />
      </FullPageSection>

      <ScrollVideoExperience />

      <FullPageSection id="recursos-tecnicos" className="relative z-30 bg-[#f4f4f2]">
        <TechnicalResourcesSection />
      </FullPageSection>

      <FullPageSection id="ecossistema" className="relative z-[110]">
        <EcosystemSection />
      </FullPageSection>

      <FullPageSection id="case-studies" className="relative z-[110] bg-[#050505] md:bg-transparent">
        <CaseStudiesSection />
      </FullPageSection>

      <FullPageSection id="jornada-deploy" className="relative z-30 bg-[#050505]">
        <DeploymentJourneySection />
      </FullPageSection>

      <FullPageSection id="contato" footerExtension className="relative z-30 bg-[#050508]">
        <div className="h-dvh">
          <ContactCtaSection />
        </div>
        <div className="h-[50dvh] snap-start snap-always" data-footer-snap>
          <SiteFooter />
        </div>
      </FullPageSection>
    </FullPageScroller>
  );
}
