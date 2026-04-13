import { Truck, Shield, DollarSign } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Reliable and timely delivery to your business location.",
  },
  {
    icon: Shield,
    title: "Trusted Brands",
    description: "Only genuine products from leading lubricant manufacturers.",
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description: "Wholesale rates that help your business stay profitable.",
  },
];

const WhyChoose = () => {
  return (
    <section className="bg-muted">
      <div className="max-w-7xl mx-auto section-padding py-20">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary text-center mb-3">
          Our Promise
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center uppercase tracking-wide mb-12">
          Why Choose Spare Lube
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-xl uppercase tracking-wide mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
