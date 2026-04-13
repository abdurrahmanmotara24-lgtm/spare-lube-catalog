import { brands } from "@/data/products";

interface BrandSectionProps {
  selectedBrand: string | null;
  onBrandSelect: (brandId: string | null) => void;
}

const BrandSection = ({ selectedBrand, onBrandSelect }: BrandSectionProps) => {
  return (
    <section className="max-w-7xl mx-auto section-padding py-20">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary text-center mb-3">
        Our Partners
      </p>
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center uppercase tracking-wide mb-12">
        Browse by Brand
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onBrandSelect(selectedBrand === brand.id ? null : brand.id)}
            className={`group flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg transition-all duration-200 cursor-pointer border ${
              selectedBrand === brand.id
                ? "bg-foreground text-primary-foreground border-foreground shadow-xl"
                : "bg-card border-border hover:shadow-lg hover:-translate-y-1"
            }`}
          >
            <span className="text-3xl sm:text-4xl mb-3">{brand.logo}</span>
            <span
              className={`font-semibold text-sm sm:text-base tracking-wide ${
                selectedBrand === brand.id ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrandSection;
