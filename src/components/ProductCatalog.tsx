import { useMemo, useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { products, brands, categories } from "@/data/products";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface ProductCatalogProps {
  selectedBrand: string | null;
  selectedCategory: string | null;
  selectedSize: string | null;
  searchQuery: string;
  onCategoryChange: (cat: string | null) => void;
  onSizeChange: (size: string | null) => void;
}

const allSizes = ["1L", "4L", "5L", "20L", "208L", "200ml", "500ml", "0.4kg", "0.5kg", "18kg", "180kg", "25L"];

const ProductCatalog = ({
  selectedBrand,
  selectedCategory,
  selectedSize,
  searchQuery,
  onCategoryChange,
  onSizeChange,
}: ProductCatalogProps) => {
  const [loading, setLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  // Simulate loading on filter change
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [selectedBrand, selectedCategory, selectedSize]);

  const combinedSearch = searchQuery || localSearch;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSize && !p.sizes.includes(selectedSize)) return false;
      if (combinedSearch) {
        const q = combinedSearch.toLowerCase();
        const brandName = brands.find((b) => b.id === p.brand)?.name || "";
        return (
          p.name.toLowerCase().includes(q) ||
          brandName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedBrand, selectedCategory, selectedSize, combinedSearch]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [filtered]);

  const brandName = selectedBrand
    ? brands.find((b) => b.id === selectedBrand)?.name
    : null;

  return (
    <section className="max-w-7xl mx-auto section-padding py-16">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={selectedCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="h-11 px-4 rounded-lg bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedSize || ""}
          onChange={(e) => onSizeChange(e.target.value || null)}
          className="h-11 px-4 rounded-lg bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Sizes</option>
          {allSizes.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        {(selectedCategory || selectedSize || selectedBrand) && (
          <button
            onClick={() => {
              onCategoryChange(null);
              onSizeChange(null);
            }}
            className="text-sm text-primary font-semibold hover:underline self-center"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Title */}
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-wide mb-2">
        {brandName ? `${brandName} Products` : "All Products"}
      </h2>
      <p className="text-muted-foreground text-sm mb-10">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
      </p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-lg border border-border">
              <Skeleton className="h-36 w-full rounded-md mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No products found. Try adjusting your search.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, prods]) => (
          <div key={category} className="mb-14">
            <h3 className="font-heading text-lg font-semibold text-foreground uppercase tracking-wider mb-6 pb-3 border-b border-border">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {prods.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default ProductCatalog;
