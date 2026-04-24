import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import BrandSection from "@/components/BrandSection";
import ProductCatalog from "@/components/ProductCatalog";
import WhyChoose from "@/components/WhyChoose";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { type QuoteListItem } from "@/components/QuoteListSection";
import type { Product } from "@/data/products";
import { getBrandThemeSuggestion } from "@/lib/brandThemeSuggestions";
import { applyThemeToDocument, useSiteSettings } from "@/hooks/useSiteSettings";
import { useDbBrands } from "@/hooks/useDbBrands";

const QUOTE_LIST_STORAGE_KEY = "spare-lube-quote-list";

const Index = () => {
  type ThemeToggleOrigin = { x: number; y: number };
  type ViewTransitionCapableDocument = Document & {
    startViewTransition?: (updateCallback: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
    };
  };

  const { settings } = useSiteSettings();
  const { brands } = useDbBrands();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandViewMode, setBrandViewMode] = useState<"grid" | "brandFocused">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteListItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(QUOTE_LIST_STORAGE_KEY);
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored) as QuoteListItem[];
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("color-mode");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const catalogRef = useRef<HTMLDivElement>(null);
  const isThemeTransitioningRef = useRef(false);

  const brandScopedTheme = useMemo(() => {
    if (!selectedBrand) return settings;
    const selectedBrandData = brands.find((brand) => brand.id === selectedBrand);
    const selectedBrandName = selectedBrandData?.name;
    const suggestion = getBrandThemeSuggestion(selectedBrand, selectedBrandName, {
      primary_color: selectedBrandData?.theme_primary_color ?? undefined,
      accent_color: selectedBrandData?.theme_accent_color ?? undefined,
      button_color: selectedBrandData?.theme_button_color ?? undefined,
      button_foreground_color: selectedBrandData?.theme_button_foreground_color ?? undefined,
    });
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
    window.localStorage.setItem(QUOTE_LIST_STORAGE_KEY, JSON.stringify(quoteItems));
  }, [quoteItems]);

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

  const handleAddToQuote = (product: Product, selectedSize: string | null) => {
    const brandName = brands.find((brand) => brand.id === product.brand)?.name ?? "Brand";

    setQuoteItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === selectedSize,
      );

      if (existingIndex === -1) {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            brandName,
            size: selectedSize,
            quantity: 1,
          },
        ];
      }

      return prev.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const handleRemoveQuoteItem = (productId: string, size: string | null) => {
    setQuoteItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const handleClearQuoteList = () => {
    setQuoteItems([]);
  };

  const toggleDarkMode = async (origin?: ThemeToggleOrigin) => {
    if (isThemeTransitioningRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextIsDarkMode = !isDarkMode;
    const root = document.documentElement;
    const viewDoc = document as ViewTransitionCapableDocument;

    if (!origin || prefersReducedMotion || !viewDoc.startViewTransition) {
      setIsDarkMode(nextIsDarkMode);
      return;
    }

    isThemeTransitioningRef.current = true;
    const toLight = !nextIsDarkMode;
    root.dataset.themeTransition = toLight ? "to-light" : "to-dark";

    try {
      const transition = viewDoc.startViewTransition(() => {
        flushSync(() => setIsDarkMode(nextIsDarkMode));
      });

      await transition.ready;

      const endRadius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );

      const viewportCenterX = window.innerWidth / 2;
      const sunriseOriginY = window.innerHeight * 1.08;
      const nightfallOriginY = window.innerHeight * -0.08;
      const fullClip = `ellipse(${endRadius}px ${endRadius * 0.82}px at ${viewportCenterX}px ${window.innerHeight / 2}px)`;
      const sunriseClip = [
        `ellipse(0px 0px at ${viewportCenterX}px ${sunriseOriginY}px)`,
        `ellipse(${endRadius}px ${endRadius * 0.82}px at ${viewportCenterX}px ${sunriseOriginY}px)`,
      ];
      const nightfallClip = [
        `ellipse(0px 0px at ${viewportCenterX}px ${nightfallOriginY}px)`,
        `ellipse(${endRadius}px ${endRadius * 0.82}px at ${viewportCenterX}px ${nightfallOriginY}px)`,
      ];

      if (toLight) {
        root.animate(
          { clipPath: sunriseClip },
          {
            duration: 1380,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        root.animate(
          { clipPath: [fullClip, fullClip] },
          {
            duration: 1380,
            easing: "ease-out",
            pseudoElement: "::view-transition-old(root)",
          },
        );
      } else {
        root.animate(
          { clipPath: nightfallClip },
          {
            duration: 1380,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        root.animate(
          { clipPath: [fullClip, fullClip] },
          {
            duration: 1380,
            easing: "ease-out",
            pseudoElement: "::view-transition-old(root)",
          },
        );
      }

      await transition.finished;
    } finally {
      delete root.dataset.themeTransition;
      isThemeTransitioningRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-10">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        quoteItems={quoteItems}
        onRemoveQuoteItem={handleRemoveQuoteItem}
        onClearQuoteList={handleClearQuoteList}
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
          onAddToQuote={handleAddToQuote}
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
