import { MessageCircle, Trash2, X } from "lucide-react";
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

const QuoteListSection = ({ items, onRemoveItem, onClearAll }: QuoteListSectionProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const whatsappUrl = `https://wa.me/27000000000?text=${buildWhatsAppQuoteMessage(items)}`;
  const hasItems = items.length > 0;

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
              onClick={() => {
                onClearAll();
                trackEvent("quote_list_cleared");
              }}
            >
              <Trash2 className="h-4 w-4" />
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
