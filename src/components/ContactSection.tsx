import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section className="max-w-7xl mx-auto section-padding py-20 text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
        Reach Out
      </p>
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground uppercase tracking-wide mb-4">
        Get in Touch
      </h2>
      <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
        Ready to place an order or need more information? Reach out to us directly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://wa.me/27000000000?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20products"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="whatsapp" size="lg" className="tracking-wider uppercase">
            <MessageCircle className="h-5 w-5" />
            WhatsApp Us
          </Button>
        </a>
        <a href="tel:+27000000000">
          <Button variant="outline" size="lg" className="tracking-wider uppercase">
            <Phone className="h-5 w-5" />
            Call Us
          </Button>
        </a>
      </div>
    </section>
  );
};

export default ContactSection;
