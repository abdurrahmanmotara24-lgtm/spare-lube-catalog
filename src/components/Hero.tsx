import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onBrowseClick: () => void;
}

const Hero = ({ onBrowseClick }: HeroProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-foreground/80" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto section-padding py-24 sm:py-32 lg:py-40 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-4">
          Trusted Wholesale Partner
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wide uppercase text-primary-foreground mb-5 leading-tight">
          Wholesale Lubricants
          <br />
          Supplier
        </h1>
        <p className="text-base sm:text-lg text-primary-foreground/60 mb-10 max-w-xl mx-auto tracking-wide">
          Shell, Castrol, and More
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
