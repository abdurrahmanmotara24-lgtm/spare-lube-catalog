import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroBgDefault from "@/assets/hero-bg.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface HeroProps {
  onBrowseClick: () => void;
}

const Hero = ({ onBrowseClick }: HeroProps) => {
  const { settings } = useSiteSettings();
  const bg = settings.hero_image_url || heroBgDefault;
  const overlay = settings.hero_overlay_opacity;

  return (
    <section className="relative overflow-hidden">
      <img
        src={bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Dynamic dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right,
            hsl(var(--foreground) / ${overlay}),
            hsl(var(--foreground) / ${overlay * 0.94}),
            hsl(var(--foreground) / ${overlay * 0.82}))`,
        }}
      />

      <div className="relative max-w-7xl mx-auto section-padding py-24 sm:py-32 lg:py-40 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-4">
          {settings.hero_eyebrow}
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wide uppercase text-primary-foreground mb-5 leading-tight whitespace-pre-line">
          {settings.hero_heading}
        </h1>
        <p className="text-base sm:text-lg text-primary-foreground/60 mb-10 max-w-xl mx-auto tracking-wide">
          {settings.hero_subheading}
        </p>
        <Button size="lg" onClick={onBrowseClick} className="text-base tracking-wider uppercase font-semibold">
          Browse Products
          <ChevronDown className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
