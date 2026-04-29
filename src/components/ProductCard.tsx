import { useState, useRef, useEffect } from "react";
import { Plus, Expand, ChevronDown, ZoomIn, ZoomOut, ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/data/products";
import { brands } from "@/data/products";
import { trackEvent } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
  isExpanded: boolean;
  isMobilePreviewActive: boolean;
  onToggleExpand: (id: string) => void;
  onMobilePreviewToggle: (id: string) => void;
  onAddToQuote: (
    product: Product,
    selectedSize: string | null,
    meta?: { sourceRect: DOMRect; imageSrc?: string },
  ) => void;
}

const ProductCard = ({
  product,
  isExpanded,
  isMobilePreviewActive,
  onToggleExpand,
  onMobilePreviewToggle,
  onAddToQuote,
}: ProductCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isTouchViewport, setIsTouchViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px), (hover: none), (pointer: coarse)").matches
      : false,
  );
  const expandRef = useRef<HTMLDivElement>(null);
  const [expandHeight, setExpandHeight] = useState(0);

  useEffect(() => {
    if (expandRef.current) {
      setExpandHeight(expandRef.current.scrollHeight);
    }
  }, [isExpanded, product.description]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px), (hover: none), (pointer: coarse)");
    const syncViewport = () => {
      const nextIsTouchViewport = mediaQuery.matches;
      setIsTouchViewport(nextIsTouchViewport);
      if (!nextIsTouchViewport && isMobilePreviewActive) {
        onMobilePreviewToggle(product.id);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, [isMobilePreviewActive, onMobilePreviewToggle, product.id]);

  const brandName = brands.find((b) => b.id === product.brand)?.name || "";

  return (
    <>
      <div
        className={`group bg-card rounded-xl border border-border/90 flex flex-col h-full overflow-hidden will-change-transform transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none sm:hover:-translate-y-1.5 sm:hover:scale-[1.01] sm:hover:shadow-2xl sm:hover:border-primary/30 ${
          isMobilePreviewActive
            ? "-translate-y-3.5 scale-[1.01] shadow-xl border-primary/30"
            : ""
        }`}
        onClick={(event) => {
          if (!isTouchViewport) return;
          const target = event.target as HTMLElement;
          if (target.closest("button,a,input,select,textarea,label")) return;
          onMobilePreviewToggle(product.id);
        }}
      >
        <div className="p-4 flex flex-col flex-1">
          {/* Product Image with enlarge icon */}
          <div
            className={`relative rounded-lg flex items-center justify-center h-32 sm:h-40 mb-4 overflow-hidden border border-border/60 bg-transparent transition-colors duration-300 sm:group-hover:border-primary/30 ${
              isMobilePreviewActive ? "border-primary/30" : ""
            }`}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className={`max-h-full max-w-full object-contain p-2 transition-transform duration-300 ease-out motion-reduce:transition-none sm:group-hover:scale-[1.04] ${
                  isMobilePreviewActive ? "scale-[1.04]" : ""
                }`}
              />
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
                  trackEvent("product_image_zoom_opened", { productId: product.id });
                }}
                className="absolute top-2 right-2 h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-background/70 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-background/90 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 inline-flex items-center justify-center"
                aria-label="Enlarge image"
              >
                <Expand className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            )}
          </div>

          {/* Brand */}
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{brandName}</p>

          {/* Product Name */}
          <h4 className="font-semibold text-foreground text-sm mb-2 leading-snug flex-1">
            {product.name}
          </h4>

          {/* Size selector */}
          {product.sizes.length > 1 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                    trackEvent("product_size_selected", { productId: product.id, size });
                  }}
                  className={`text-xs px-3 py-2 min-h-10 rounded-md border transition-colors ${
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
            <p className="text-sm text-muted-foreground mb-3">Size: {product.sizes[0]}</p>
          ) : null}

          {/* Expand indicator */}
          {product.description && (
            <button
              type="button"
              onClick={() => {
                onToggleExpand(product.id);
                trackEvent("product_description_toggled", { productId: product.id, expanded: !isExpanded });
              }}
              className="mt-1 inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground min-h-10"
              aria-expanded={isExpanded}
              aria-controls={`product-description-${product.id}`}
            >
              <span>{isExpanded ? "Hide details" : "Show details"}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Expandable description section */}
        <div
          id={`product-description-${product.id}`}
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

        {/* Add to Quote List Button */}
        <div className="px-4 pb-4">
          <motion.div
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96, y: 1 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            <Button
              type="button"
              variant="quote"
              size="sm"
              className="text-xs sm:text-sm min-h-11 w-full"
              onClick={(event) => {
                onAddToQuote(product, selectedSize || null, {
                  sourceRect: event.currentTarget.getBoundingClientRect(),
                  imageSrc: product.image || undefined,
                });
                trackEvent("quote_item_added", { productId: product.id, size: selectedSize || "none" });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add to Quote List
            </Button>
          </motion.div>
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

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-20 sm:hidden inline-flex items-center gap-1 rounded-md border border-border bg-background/90 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted min-h-9"
          aria-label="Back to products"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

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
