import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import BrandSection from "@/components/BrandSection";
import ProductCatalog from "@/components/ProductCatalog";
import WhyChoose from "@/components/WhyChoose";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { BRAND_THEME_SUGGESTIONS } from "@/lib/brandThemeSuggestions";
import { applyThemeToDocument, useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  const { settings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);

  const brandScopedTheme = useMemo(() => {
    if (!selectedBrand) return settings;
    const suggestion = BRAND_THEME_SUGGESTIONS[selectedBrand];
    if (!suggestion) return settings;
    return {
      ...settings,
      primary_color: suggestion.primary_color,
      accent_color: suggestion.accent_color,
      button_color: suggestion.button_color,
      button_foreground_color: suggestion.button_foreground_color,
    };
  }, [selectedBrand, settings]);

  useEffect(() => {
    applyThemeToDocument(brandScopedTheme);
  }, [brandScopedTheme]);

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
      <TrustBar />
      <BrandSection selectedBrand={selectedBrand} onBrandSelect={handleBrandSelect} />
      <div ref={catalogRef}>
        <ProductCatalog
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          searchQuery={searchQuery}
          onBrandChange={setSelectedBrand}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onSizeChange={setSelectedSize}
        />
      </div>
      <WhyChoose />
      <ContactSection />
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Index;
