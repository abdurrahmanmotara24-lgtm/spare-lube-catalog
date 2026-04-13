import { useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import ProductCatalog from "@/components/ProductCatalog";
import WhyChoose from "@/components/WhyChoose";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBrandSelect = (brandId: string | null) => {
    setSelectedBrand(brandId);
    if (brandId) {
      setTimeout(() => {
        catalogRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Hero onBrowseClick={scrollToCatalog} />
      <BrandSection selectedBrand={selectedBrand} onBrandSelect={handleBrandSelect} />
      <div ref={catalogRef}>
        <ProductCatalog
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSizeChange={setSelectedSize}
        />
      </div>
      <WhyChoose />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
