import { useState } from "react";
import { Search, MessageCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SL</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Spare Lube</span>
          </div>

          {/* Search - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-md bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/27000000000?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="whatsapp" size="sm" className="hidden sm:inline-flex">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button variant="whatsapp" size="icon" className="sm:hidden">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </a>
            <button
              className="sm:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-md bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
