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
import { getBrandThemeSuggestion } from "@/lib/brandThemeSuggestions";
import { applyThemeToDocument, useSiteSettings } from "@/hooks/useSiteSettings";
import { useDbBrands } from "@/hooks/useDbBrands";

const Index = () => {
  const { settings } = useSiteSettings();
  const { brands } = useDbBrands();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandViewMode, setBrandViewMode] = useState<"grid" | "brandFocused">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("color-mode");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const catalogRef = useRef<HTMLDivElement>(null);

  const brandScopedTheme = useMemo(() => {
    if (!selectedBrand) return settings;
    const selectedBrandName = brands.find((brand) => brand.id === selectedBrand)?.name;
    const suggestion = getBrandThemeSuggestion(selectedBrand, selectedBrandName);
    return {
      ...settings,
      primary_color: suggestion.primary_color,
      accent_color: suggestion.accent_color,
      button_color: suggestion.button_color,
      button_foreground_color: suggestion.button_foreground_color,
    };
  }, [selectedBrand, settings, brands]);

  useEffect(() => {
    applyThemeToDocument(brandScopedTheme);
  }, [brandScopedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("color-mode", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (!isDarkMode) {
      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--card");
      root.style.removeProperty("--card-foreground");
      root.style.removeProperty("--popover");
      root.style.removeProperty("--popover-foreground");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--secondary-foreground");
      root.style.removeProperty("--muted");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--border");
      root.style.removeProperty("--input");
      root.style.removeProperty("--hero-overlay-base");
      return;
    }

    root.style.setProperty("--background", "0 0% 5%");
    root.style.setProperty("--foreground", "0 0% 96%");
    root.style.setProperty("--card", "0 0% 8%");
    root.style.setProperty("--card-foreground", "0 0% 96%");
    root.style.setProperty("--popover", "0 0% 8%");
    root.style.setProperty("--popover-foreground", "0 0% 96%");
    root.style.setProperty("--secondary", "0 0% 12%");
    root.style.setProperty("--secondary-foreground", "0 0% 94%");
    root.style.setProperty("--muted", "0 0% 11%");
    root.style.setProperty("--muted-foreground", "0 0% 70%");
    root.style.setProperty("--accent-foreground", "0 0% 96%");
    root.style.setProperty("--border", "0 0% 18%");
    root.style.setProperty("--input", "0 0% 18%");
    root.style.setProperty("--hero-overlay-base", "0 0% 0%");
  }, [isDarkMode, brandScopedTheme]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBrandSelect = (brandId: string | null) => {
    setSelectedBrand(brandId);
    if (brandId) {
      setBrandViewMode("brandFocused");
      return;
    }
    setBrandViewMode("grid");
  };

  const handleBackToBrandGrid = () => {
    setSelectedBrand(null);
    setBrandViewMode("grid");
  };

  const handleCatalogBrandChange = (brandId: string | null) => {
    setSelectedBrand(brandId);
    setBrandViewMode(brandId ? "brandFocused" : "grid");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
      <Hero onBrowseClick={scrollToCatalog} />
      <TrustBar />
      <BrandSection
        selectedBrand={selectedBrand}
        viewMode={brandViewMode}
        onBrandSelect={handleBrandSelect}
        onBackToGrid={handleBackToBrandGrid}
      />
      <div ref={catalogRef}>
        <ProductCatalog
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          searchQuery={searchQuery}
          onBackToBrands={handleBackToBrandGrid}
          onBrandChange={handleCatalogBrandChange}
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
