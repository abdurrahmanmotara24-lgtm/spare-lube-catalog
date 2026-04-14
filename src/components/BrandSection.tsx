import { brands } from "@/data/products";

interface BrandSectionProps {
  selectedBrand: string | null;
  onBrandSelect: (brandId: string | null) => void;
}

const BrandSection = ({ selectedBrand, onBrandSelect }: BrandSectionProps) => {
  return (
    <section className="max-w-7xl mx-auto section-padding py-20">
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center uppercase tracking-wide mb-12">
        Browse by Brand
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onBrandSelect(selectedBrand === brand.id ? null : brand.id)}
            className={`group flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 cursor-pointer border
              active:scale-[0.97]
              ${selectedBrand === brand.id
                ? "bg-foreground text-primary-foreground border-foreground shadow-xl scale-[1.02]"
                : "bg-card border-border hover:shadow-lg hover:scale-[1.03]"
              }`}
          >
            {brand.image ? (
              <div className="w-full h-14 sm:h-16 flex items-center justify-center mb-3">
                <img
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  className="max-h-full max-w-[80%] object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-14 sm:h-16 flex items-center justify-center mb-3">
                <span className="text-3xl">{brand.logo}</span>
              </div>
            )}
            <span
              className={`font-semibold text-xs sm:text-sm tracking-wide ${
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
