import { useDbBrands } from "@/hooks/useDbBrands";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandSectionProps {
  selectedBrand: string | null;
  onBrandSelect: (brandId: string | null) => void;
}

const BrandSection = ({ selectedBrand, onBrandSelect }: BrandSectionProps) => {
  const { brands, loading } = useDbBrands();

  return (
    <section className="max-w-7xl mx-auto section-padding py-20">
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center uppercase tracking-wide mb-12">
        Browse by Brand
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          : brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => onBrandSelect(selectedBrand === brand.id ? null : brand.id)}
                aria-pressed={selectedBrand === brand.id}
                aria-label={`${brand.name}${selectedBrand === brand.id ? " selected" : ""}`}
                className={`group flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 cursor-pointer border
                  active:scale-[0.97]
                  ${selectedBrand === brand.id
                    ? "bg-primary text-primary-foreground border-primary shadow-xl scale-[1.02] ring-2 ring-primary/40"
                    : "bg-card border-border hover:shadow-lg hover:scale-[1.03] hover:border-primary/30"
                  }`}
              >
                <div className="w-full h-14 sm:h-16 flex items-center justify-center mb-3">
                  {brand.image_url ? (
                    <img
                      src={brand.image_url}
                      alt={`${brand.name} logo`}
                      className="max-h-full max-w-[80%] object-contain"
                    />
                  ) : (
                    <span className="text-3xl">{brand.logo || "🛢️"}</span>
                  )}
                </div>
                <span
                  className={`font-semibold text-xs sm:text-sm tracking-wide text-center ${
                    selectedBrand === brand.id ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {brand.name}
                </span>
                {selectedBrand === brand.id && (
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/90">
                    Selected
                  </span>
                )}
              </button>
            ))}
      </div>
    </section>
  );
};

export default BrandSection;
