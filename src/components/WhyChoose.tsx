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
    <section className="bg-secondary">
      <div className="max-w-7xl mx-auto section-padding py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
          Why Choose Spare Lube
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
