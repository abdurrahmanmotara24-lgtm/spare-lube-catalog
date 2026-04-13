import { brands, type Brand } from "@/data/products";

interface BrandSectionProps {
  selectedBrand: string | null;
  onBrandSelect: (brandId: string | null) => void;
}

const BrandSection = ({ selectedBrand, onBrandSelect }: BrandSectionProps) => {
  return (
    <section className="max-w-7xl mx-auto section-padding py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
        Browse by Brand
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onBrandSelect(selectedBrand === brand.id ? null : brand.id)}
            className={`group flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg transition-all duration-200 cursor-pointer ${
              selectedBrand === brand.id
                ? "bg-foreground text-primary-foreground shadow-lg"
                : "bg-secondary hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            <span className="text-3xl sm:text-4xl mb-3">{brand.logo}</span>
            <span className={`font-semibold text-sm sm:text-base ${
              selectedBrand === brand.id ? "text-primary-foreground" : "text-foreground"
            }`}>
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrandSection;
