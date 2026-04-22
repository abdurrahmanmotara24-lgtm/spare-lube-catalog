import { useState, useRef, useEffect } from "react";
import { MessageCircle, Expand, ChevronDown, ZoomIn, ZoomOut } from "lucide-react";
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
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

const ProductCard = ({ product, isExpanded, onToggleExpand }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const expandRef = useRef<HTMLDivElement>(null);
  const [expandHeight, setExpandHeight] = useState(0);

  useEffect(() => {
    if (expandRef.current) {
      setExpandHeight(expandRef.current.scrollHeight);
    }
  }, [isExpanded, product.description]);

  const sizeText = selectedSize ? ` (${selectedSize})` : "";
  const whatsappMessage = encodeURIComponent(`Hi, I would like a quote for ${product.name}${sizeText}`);
  const whatsappUrl = `https://wa.me/27000000000?text=${whatsappMessage}`;
  const brandName = brands.find((b) => b.id === product.brand)?.name || "";

  return (
    <>
      <div className="bg-card rounded-xl border border-border flex flex-col h-full transition-all duration-200 hover:shadow-lg overflow-hidden">
        {/* Clickable card area */}
        <div
          className="p-4 flex flex-col flex-1 cursor-pointer"
          onClick={() => onToggleExpand(product.id)}
        >
          {/* Product Image with enlarge icon */}
          <div className="relative rounded-lg flex items-center justify-center h-32 sm:h-40 mb-4 overflow-hidden group border border-border/60 bg-transparent">
            {product.image ? (
              <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain p-2" />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center gap-1 bg-transparent">
                <div className="text-xl font-semibold text-muted-foreground/80">
                  {product.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-[10px] text-muted-foreground">Image coming soon</div>
              </div>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
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
            <p className="text-xs text-muted-foreground mb-3">Size: {product.sizes[0]}</p>
          ) : null}

          {/* Expand indicator */}
          {product.description && (
            <div className="flex items-center justify-center mt-1">
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          )}
        </div>

        {/* Expandable description section */}
        <div
          ref={expandRef}
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ maxHeight: isExpanded ? expandHeight : 0 }}
        >
          <div className="px-4 pb-4 border-t border-border pt-3">
            {selectedSize && (
              <p className="text-xs text-primary font-medium mb-2">{selectedSize}</p>
            )}
            {product.description && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Get Quote Button */}
        <div className="px-4 pb-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            <Button variant="quote" size="sm" className="text-xs">
              <MessageCircle className="h-3.5 w-3.5" />
              Request Quote
            </Button>
          </a>
        </div>
      </div>

      {/* Image Lightbox with zoom & pan */}
      <ZoomableLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        src={product.image}
        alt={product.name}
      />
    </>
  );
};

interface ZoomableLightboxProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  src: string;
  alt: string;
}

const ZoomableLightbox = ({ open, onOpenChange, src, alt }: ZoomableLightboxProps) => {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  const reset = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const clampScale = (s: number) => Math.min(5, Math.max(1, s));

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    setScale((s) => {
      const next = clampScale(s + delta);
      if (next === 1) {
        setTx(0);
        setTy(0);
      }
      return next;
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setTx(dragRef.current.tx + (e.clientX - dragRef.current.x));
    setTy(dragRef.current.ty + (e.clientY - dragRef.current.y));
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = { dist: Math.hypot(dx, dy), scale };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const next = clampScale(pinchRef.current.scale * (dist / pinchRef.current.dist));
      setScale(next);
      if (next === 1) {
        setTx(0);
        setTy(0);
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchRef.current = null;
  };

  const onDoubleClick = () => {
    if (scale > 1) reset();
    else setScale(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-md border-border p-2 sm:p-4">
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        {/* Zoom controls */}
        <div className="absolute top-3 left-3 z-10 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md border border-border p-1">
          <button
            onClick={() => setScale((s) => clampScale(s - 0.5))}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted text-foreground"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={reset}
            className="h-7 px-2 text-xs flex items-center justify-center rounded hover:bg-muted text-foreground tabular-nums"
            aria-label="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={() => setScale((s) => clampScale(s + 0.5))}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted text-foreground"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        <div
          className="flex items-center justify-center min-h-[300px] sm:min-h-[500px] overflow-hidden select-none touch-none"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onDoubleClick={onDoubleClick}
          style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-h-[75vh] max-w-full object-contain rounded-lg transition-transform duration-100 ease-out"
            style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
          />
        </div>
        <p className="text-center text-sm font-medium text-foreground mt-2">{alt}</p>
        <p className="text-center text-[11px] text-muted-foreground">
          Scroll, pinch, or double-click to zoom · drag to pan
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
