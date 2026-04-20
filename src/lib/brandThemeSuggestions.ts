// Optional theme color suggestions per brand. Admin must explicitly apply.
// Values are HSL strings matching the site_settings format.

export interface BrandThemeSuggestion {
  label: string;
  primary_color: string;
  accent_color: string;
  button_color: string;
  button_foreground_color: string;
}

export const BRAND_THEME_SUGGESTIONS: Record<string, BrandThemeSuggestion> = {
  shell: {
    label: "Shell — yellow & red",
    primary_color: "0 85% 46%",
    accent_color: "48 100% 50%",
    button_color: "0 85% 46%",
    button_foreground_color: "0 0% 100%",
  },
  castrol: {
    label: "Castrol — green & red",
    primary_color: "142 72% 29%",
    accent_color: "0 85% 46%",
    button_color: "142 72% 29%",
    button_foreground_color: "0 0% 100%",
  },
  g4: {
    label: "G4 — blue industrial",
    primary_color: "215 90% 45%",
    accent_color: "210 15% 35%",
    button_color: "215 90% 45%",
    button_foreground_color: "0 0% 100%",
  },
  blixem: {
    label: "Blixem — neutral industrial",
    primary_color: "0 0% 20%",
    accent_color: "30 90% 55%",
    button_color: "0 0% 20%",
    button_foreground_color: "0 0% 100%",
  },
  valvoline: {
    label: "Valvoline — blue & red",
    primary_color: "215 90% 45%",
    accent_color: "0 85% 46%",
    button_color: "0 85% 46%",
    button_foreground_color: "0 0% 100%",
  },
};
