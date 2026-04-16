import { useState } from "react";
import { MessageCircle, Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/data/products";
import { brands } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const sizeText = selectedSize ? ` (${selectedSize})` : "";
  const whatsappMessage = encodeURIComponent(`Hi, I would like a quote for ${product.name}${sizeText}`);
  const whatsappUrl = `https://wa.me/27000000000?text=${whatsappMessage}`;
  const brandName = brands.find((b) => b.id === product.brand)?.name || "";

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        {/* Product Image with enlarge icon */}
        <div className="relative bg-muted rounded-lg flex items-center justify-center h-32 sm:h-40 mb-4 overflow-hidden group">
          {product.image ? (
            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain p-2" />
          ) : (
            <div className="text-4xl opacity-20">🛢️</div>
          )}
          {product.image && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-background/70 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-background/90 transition-all opacity-60 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Enlarge image"
            >
              <Expand className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Brand */}
        <p className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider mb-1">{brandName}</p>

        {/* Product Name */}
        <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-2 leading-snug flex-1">
          {product.name}
        </h4>

        {/* Size selector */}
        {product.sizes.length > 1 ? (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-[10px] sm:text-xs px-2 py-1 rounded-md border transition-colors ${
                  selectedSize === size
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        ) : product.sizes.length === 1 ? (
          <p className="text-xs text-muted-foreground mb-3">{product.sizes[0]}</p>
        ) : null}

        {/* Get Quote Button */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <Button variant="quote" size="sm" className="text-xs">
            <MessageCircle className="h-3.5 w-3.5" />
            Get Quote
          </Button>
        </a>
      </div>

      {/* Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-md border-border p-2 sm:p-4">
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[70vh] max-w-full object-contain rounded-lg"
            />
          </div>
          <p className="text-center text-sm font-medium text-foreground mt-2">{product.name}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
