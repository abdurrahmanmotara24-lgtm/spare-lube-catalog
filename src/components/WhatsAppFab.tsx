import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const WhatsAppFab = () => {
  return (
    <a
      href="https://wa.me/27000000000?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-[hsl(142,70%,40%)] text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      aria-label="Chat on WhatsApp"
      onClick={() => trackEvent("whatsapp_fab_clicked", { source: "fab" })}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppFab;
