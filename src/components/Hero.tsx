import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  onBrowseClick: () => void;
}

const Hero = ({ onBrowseClick }: HeroProps) => {
  return (
    <section className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto section-padding py-20 sm:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
          Wholesale Lubricants Supplier
        </h1>
        <p className="text-lg sm:text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
          Shell, Castrol, and More
        </p>
        <Button size="lg" onClick={onBrowseClick} className="text-base">
          Browse Products
          <ChevronDown className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
