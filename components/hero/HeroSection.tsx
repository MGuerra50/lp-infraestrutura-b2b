import { HeroAlignedCta } from "./HeroAlignedCta";
import { HeroContent } from "./HeroContent";
import { HeroHeader } from "./HeroHeader";
import { HeroImage } from "./HeroImage";
import { HeroLayoutProvider } from "./HeroLayoutContext";
import { HeroLeadForm } from "./HeroLeadForm";

export function HeroSection() {
  return (
    <HeroLayoutProvider>
      <section className="relative h-full overflow-hidden bg-white">
        <HeroHeader />

        <div className="relative flex h-full flex-col lg:flex-row">
          <HeroContent>
            <HeroAlignedCta>
              <HeroLeadForm />
            </HeroAlignedCta>
          </HeroContent>

          <HeroImage />
        </div>
      </section>
    </HeroLayoutProvider>
  );
}
