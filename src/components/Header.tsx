import { useState } from "react";
import { Search, MessageCircle, Menu, X, ScrollText } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggleIcon } from "@/components/ui/theme-toggle-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import QuoteListSection, { type QuoteListItem } from "@/components/QuoteListSection";
import spareLubeLogo from "@/assets/spare-lube-logo.jpg";
import { trackEvent } from "@/lib/analytics";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (origin?: { x: number; y: number }) => void;
  quoteItems: QuoteListItem[];
  onRemoveQuoteItem: (productId: string, size: string | null) => void;
  onClearQuoteList: () => void;
}

const Header = ({
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
  quoteItems,
  onRemoveQuoteItem,
  onClearQuoteList,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuId = "mobile-header-menu";
  const prefersReducedMotion = useReducedMotion();
  const quoteCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <div
              className={`rounded-md px-1.5 py-1 transition-colors ${
                isDarkMode ? "bg-white/95 shadow-sm ring-1 ring-white/20" : "bg-transparent"
              }`}
            >
              <img
                src={spareLubeLogo}
                alt="Spare Lube - Auto Lubricant Distributors"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  trackEvent("header_search_changed", { hasQuery: Boolean(e.target.value.trim()) });
                }}
                className="w-full h-10 pl-10 pr-4 rounded-md bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={(event) => onToggleDarkMode({ x: event.clientX, y: event.clientY })}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDarkMode}
              title={isDarkMode ? "Light mode" : "Dark mode"}
              className="hidden sm:inline-flex"
            >
              <motion.span
                className="relative h-4 w-4"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.88 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
              >
                <ThemeToggleIcon
                  isDarkMode={isDarkMode}
                  reducedMotion={Boolean(prefersReducedMotion)}
                  className="absolute inset-0 text-foreground"
                />
              </motion.span>
            </Button>
            <Button asChild variant="whatsapp" size="sm" className="hidden sm:inline-flex">
              <a
                href="https://wa.me/27000000000?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                onClick={() => trackEvent("header_whatsapp_clicked", { source: "desktop_header" })}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex relative border-border bg-card text-foreground hover:bg-muted hover:border-border"
                  onClick={() => trackEvent("header_quote_panel_opened", { source: "desktop_header" })}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                    <ScrollText className="h-3.5 w-3.5" />
                  </span>
                  Quote List
                  {quoteCount > 0 && (
                    <span className="ml-1 inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-2 ring-background shadow-sm">
                      {quoteCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Your Quote List</SheetTitle>
                  <SheetDescription>
                    Review added items and send one WhatsApp quote request.
                  </SheetDescription>
                </SheetHeader>
                <QuoteListSection
                  items={quoteItems}
                  onRemoveItem={onRemoveQuoteItem}
                  onClearAll={onClearQuoteList}
                />
              </SheetContent>
            </Sheet>
            <Button asChild variant="whatsapp" size="icon" className="sm:hidden h-11 w-11">
              <a
                href="https://wa.me/27000000000?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                onClick={() => trackEvent("header_whatsapp_clicked", { source: "mobile_header" })}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="sm:hidden h-11 w-11 relative border-border bg-card text-foreground hover:bg-muted hover:border-border"
                  aria-label="Open quote list"
                  onClick={() => trackEvent("header_quote_panel_opened", { source: "mobile_header" })}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                    <ScrollText className="h-3.5 w-3.5" />
                  </span>
                  {quoteCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-2 ring-background shadow-sm">
                      {quoteCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Your Quote List</SheetTitle>
                  <SheetDescription>
                    Review added items and send one WhatsApp quote request.
                  </SheetDescription>
                </SheetHeader>
                <QuoteListSection
                  items={quoteItems}
                  onRemoveItem={onRemoveQuoteItem}
                  onClearAll={onClearQuoteList}
                />
              </SheetContent>
            </Sheet>
            <button
              type="button"
              className="sm:hidden min-h-11 min-w-11 p-2 text-foreground"
              onClick={() => {
                const next = !mobileMenuOpen;
                setMobileMenuOpen(next);
                trackEvent("header_mobile_menu_toggled", { open: next });
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileMenuOpen && (
          <div id={mobileMenuId} className="sm:hidden pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  trackEvent("header_search_changed", { hasQuery: Boolean(e.target.value.trim()), source: "mobile_menu" });
                }}
                className="w-full h-10 pl-10 pr-4 rounded-md bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(event) => onToggleDarkMode({ x: event.clientX, y: event.clientY })}
              className="w-full"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDarkMode}
            >
              <motion.span
                className="relative h-4 w-4"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
              >
                <ThemeToggleIcon
                  isDarkMode={isDarkMode}
                  reducedMotion={Boolean(prefersReducedMotion)}
                  className="absolute inset-0 text-foreground"
                />
              </motion.span>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
