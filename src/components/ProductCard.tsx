import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { brands } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const sizeText = product.sizes.length > 0 ? ` (${product.sizes.join(" / ")})` : "";
  const whatsappMessage = encodeURIComponent(`Hi, I would like a quote for ${product.name}${sizeText}`);
  const whatsappUrl = `https://wa.me/27000000000?text=${whatsappMessage}`;
  const brandName = brands.find((b) => b.id === product.brand)?.name || "";

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Product Image Placeholder */}
      <div className="bg-muted rounded-lg flex items-center justify-center h-32 sm:h-40 mb-4">
        <div className="text-4xl opacity-20">🛢️</div>
      </div>

      {/* Brand */}
      <p className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider mb-1">{brandName}</p>

      {/* Product Name */}
      <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-2 leading-snug flex-1">
        {product.name}
      </h4>

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          {product.sizes.join(" / ")}
        </p>
      )}

      {/* Get Quote Button */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
        <Button variant="quote" size="sm" className="text-xs">
          <MessageCircle className="h-3.5 w-3.5" />
          Get Quote
        </Button>
      </a>
    </div>
  );
};

export default ProductCard;
