import { ShieldCheck, DollarSign, Package, HeartHandshake } from "lucide-react";

const features = [
  { icon: ShieldCheck, label: "Genuine Products" },
  { icon: DollarSign, label: "Competitive Pricing" },
  { icon: Package, label: "Bulk Supply Available" },
  { icon: HeartHandshake, label: "Reliable Service" },
];

const WhyChoose = () => {
  return (
    <section className="bg-muted">
      <div className="max-w-7xl mx-auto section-padding py-16 text-center">
        <p className="text-sm font-semibold text-primary mb-2">Trusted by 100+ Customers</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-6">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-foreground">
              <f.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium tracking-wide">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
