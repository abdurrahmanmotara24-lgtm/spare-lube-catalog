import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const whatsappMessage = encodeURIComponent(`Hi, I would like a quote for ${product.name}`);
  const whatsappUrl = `https://wa.me/27000000000?text=${whatsappMessage}`;

  return (
    <div className="bg-background rounded-lg border border-border p-4 flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Product Image Placeholder */}
      <div className="bg-secondary rounded-md flex items-center justify-center h-40 mb-4">
        <div className="text-4xl opacity-30">🛢️</div>
      </div>

      {/* Product Name */}
      <h4 className="font-semibold text-foreground text-sm sm:text-base mb-2 flex-1">
        {product.name}
      </h4>

      {/* Sizes */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.sizes.map((size) => (
          <span
            key={size}
            className="text-xs font-medium px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
          >
            {size}
          </span>
        ))}
      </div>

      {/* Get Quote Button */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
        <Button variant="quote" size="default">
          <MessageCircle className="h-4 w-4" />
          Get Quote
        </Button>
      </a>
    </div>
  );
};

export default ProductCard;
