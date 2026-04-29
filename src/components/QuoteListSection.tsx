import { useEffect, useRef, useState } from "react";
import { MessageCircle, Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export interface QuoteListItem {
  productId: string;
  productName: string;
  brandName: string;
  size: string | null;
  quantity: number;
}

interface QuoteListSectionProps {
  items: QuoteListItem[];
  onRemoveItem: (productId: string, size: string | null) => void;
  onUpdateQuantity: (productId: string, size: string | null, quantity: number) => void;
  onClearAll: () => void;
}

const buildWhatsAppQuoteMessage = (items: QuoteListItem[]) => {
  const lines = items.map((item, index) => {
    const sizeText = item.size ? ` - ${item.size}` : "";
    const quantityText = item.quantity > 1 ? ` x${item.quantity}` : "";
    return `${index + 1}. ${item.brandName} ${item.productName}${sizeText}${quantityText}`;
  });

  return `Hi, I would like a quote for the following products:%0A%0A${lines.join("%0A")}`;
};

const QuoteListSection = ({ items, onRemoveItem, onUpdateQuantity, onClearAll }: QuoteListSectionProps) => {
  const [isClearing, setIsClearing] = useState(false);
  const clearTimeoutRef = useRef<number | null>(null);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const whatsappUrl = `https://wa.me/27000000000?text=${buildWhatsAppQuoteMessage(items)}`;
  const hasItems = items.length > 0;

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current !== null) {
        window.clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-heading text-xl font-semibold text-foreground uppercase tracking-wide">
              Quote List
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalItems} item{totalItems !== 1 ? "s" : ""} selected
            </p>
          </div>
          {hasItems && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-10"
              disabled={isClearing}
              onClick={() => {
                if (isClearing) return;
                setIsClearing(true);
                clearTimeoutRef.current = window.setTimeout(() => {
                  onClearAll();
                  trackEvent("quote_list_cleared");
                  setIsClearing(false);
                }, 620);
              }}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center overflow-visible">
                <svg viewBox="0 0 24 24" className="h-5 w-5 scale-[1.98]" aria-hidden>
                  <motion.g
                    animate={isClearing ? { rotate: [0, -42, 0] } : { rotate: 0 }}
                    transition={{ duration: 0.56, ease: "easeInOut", times: [0, 0.5, 1] }}
                    style={{ transformOrigin: "12px 7px" }}
                  >
                    <path
                      d="M9.35 5.35h5.3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M7.35 7.35h9.3"
                      stroke="currentColor"
                      strokeWidth="1.85"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </motion.g>
                  <path
                    d="M8.55 8.55h6.9l-.55 9.05a1.68 1.68 0 0 1-1.68 1.52h-2.44A1.68 1.68 0 0 1 9.1 17.6l-.55-9.05Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M10.8 11.05v5.05M13.2 11.05v5.05"
                    stroke="currentColor"
                    strokeWidth="1.45"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              Clear List
            </Button>
          )}
        </div>

        {!hasItems ? (
          <p className="text-sm text-muted-foreground">
            Add products from the catalog to build a single quote request.
          </p>
        ) : (
          <>
            <div className="space-y-2 mb-5">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size ?? "no-size"}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.brandName} {item.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.size ? item.size : "No size selected"} - Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-md border border-border/80 bg-background">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-l-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={`Decrease quantity for ${item.productName}`}
                        disabled={item.quantity <= 1}
                        onClick={() => {
                          const nextQuantity = Math.max(1, item.quantity - 1);
                          onUpdateQuantity(item.productId, item.size, nextQuantity);
                          trackEvent("quote_list_item_quantity_changed", {
                            productId: item.productId,
                            size: item.size ?? "none",
                            quantity: nextQuantity,
                          });
                        }}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="inline-flex min-w-8 justify-center px-1 text-xs font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label={`Increase quantity for ${item.productName}`}
                        onClick={() => {
                          const nextQuantity = item.quantity + 1;
                          onUpdateQuantity(item.productId, item.size, nextQuantity);
                          trackEvent("quote_list_item_quantity_changed", {
                            productId: item.productId,
                            size: item.size ?? "none",
                            quantity: nextQuantity,
                          });
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label={`Remove ${item.productName}`}
                      onClick={() => {
                        onRemoveItem(item.productId, item.size);
                        trackEvent("quote_list_item_removed", {
                          productId: item.productId,
                          size: item.size ?? "none",
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild variant="quote" size="lg" className="w-full sm:w-auto min-h-11">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("quote_list_submitted_whatsapp", {
                    uniqueItems: items.length,
                    totalItems,
                  })
                }
              >
                <MessageCircle className="h-4 w-4" />
                Request Quote on WhatsApp
              </a>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default QuoteListSection;
