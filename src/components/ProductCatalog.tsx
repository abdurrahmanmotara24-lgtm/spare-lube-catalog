import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { products, brands, categories } from "@/data/products";

interface ProductCatalogProps {
  selectedBrand: string | null;
  selectedCategory: string | null;
  selectedSize: string | null;
  searchQuery: string;
  onCategoryChange: (cat: string | null) => void;
  onSizeChange: (size: string | null) => void;
}

const allSizes = ["1L", "4L", "5L", "20L", "208L", "0.4kg", "0.5kg", "18kg", "180kg"];

const ProductCatalog = ({
  selectedBrand,
  selectedCategory,
  selectedSize,
  searchQuery,
  onCategoryChange,
  onSizeChange,
}: ProductCatalogProps) => {
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSize && !p.sizes.includes(selectedSize)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const brandName = brands.find((b) => b.id === p.brand)?.name || "";
        return (
          p.name.toLowerCase().includes(q) ||
          brandName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedBrand, selectedCategory, selectedSize, searchQuery]);

  // Group by category
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
    <section className="max-w-7xl mx-auto section-padding py-12">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Category Filter */}
        <select
          value={selectedCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="h-10 px-3 rounded-md bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Size Filter */}
        <select
          value={selectedSize || ""}
          onChange={(e) => onSizeChange(e.target.value || null)}
          className="h-10 px-3 rounded-md bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="text-sm text-primary font-medium hover:underline self-center"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {brandName ? `${brandName} Products` : "All Products"}
      </h2>
      <p className="text-muted-foreground mb-8">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, prods]) => (
          <div key={category} className="mb-12">
            <h3 className="text-lg font-bold text-foreground mb-6 pb-2 border-b border-border">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
