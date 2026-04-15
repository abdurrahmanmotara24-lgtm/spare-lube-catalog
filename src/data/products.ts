export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  sizes: string[];
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  image?: string;
}

// Brand logos
import shellLogo from "@/assets/brands/shell.png";
import castrolLogo from "@/assets/brands/castrol.jpeg";
import blixemLogo from "@/assets/brands/blixem.png";
import engenLogo from "@/assets/brands/engen.jpeg";
import fuchsLogo from "@/assets/brands/fuchs.png";
import motolubeLogo from "@/assets/brands/motolube.jpg";
import winnersLogo from "@/assets/brands/winners.jpg";
import valvolineLogo from "@/assets/brands/valvoline.png";
import g4Logo from "@/assets/brands/g4.png";

// Shell product images
import shellHx5_5l from "@/assets/products/shell-hx5-5l.png";
import shellHx5_500ml from "@/assets/products/shell-hx5-500ml.jpeg";
import shellHx7_5l from "@/assets/products/shell-hx7-5l.webp";
import shellHx7_500ml from "@/assets/products/shell-hx7-500ml.png";
import shellHx3_5l from "@/assets/products/shell-hx3-5l.jpeg";
import shellHx3_500ml from "@/assets/products/shell-hx3-500ml.webp";
import shellHx8_5l from "@/assets/products/shell-hx8-5l.jpeg";
import shellRimulaR4_5l from "@/assets/products/shell-rimula-r4-5l.jpeg";

export const brands: Brand[] = [
  { id: "shell", name: "Shell", logo: "🐚", image: shellLogo },
  { id: "castrol", name: "Castrol", logo: "🛢️", image: castrolLogo },
  { id: "engen", name: "Engen", logo: "⛽", image: engenLogo },
  { id: "fuchs", name: "Fuchs", logo: "🔶", image: fuchsLogo },
  { id: "valvoline", name: "Valvoline", logo: "⚙️", image: valvolineLogo },
  { id: "motolube", name: "MOTOLUBE", logo: "🔧", image: motolubeLogo },
  { id: "winners", name: "Winners", logo: "🏆", image: winnersLogo },
  { id: "newlook", name: "New Look", logo: "🔵" },
  { id: "g4", name: "G4 Lubricants", logo: "🏭", image: g4Logo },
];

export const categories = ["Engine Oils", "Antifreeze", "Brake Fluid", "Additives", "Transmission & Gear Oils"];

export const products: Product[] = [
  // Shell
  { id: "s1", name: "Shell Helix HX5", brand: "shell", category: "Engine Oils", sizes: ["5L"], image: shellHx5_5l },
  { id: "s2", name: "Shell Helix HX5", brand: "shell", category: "Engine Oils", sizes: ["500ml"], image: shellHx5_500ml },
  { id: "s3", name: "Shell Helix HX7", brand: "shell", category: "Engine Oils", sizes: ["5L"], image: shellHx7_5l },
  { id: "s4", name: "Shell Helix HX7", brand: "shell", category: "Engine Oils", sizes: ["500ml"], image: shellHx7_500ml },
  { id: "s5", name: "Shell Helix HX3", brand: "shell", category: "Engine Oils", sizes: ["5L"], image: shellHx3_5l },
  { id: "s6", name: "Shell Helix HX3", brand: "shell", category: "Engine Oils", sizes: ["500ml"], image: shellHx3_500ml },
  { id: "s7", name: "Shell Helix HX8", brand: "shell", category: "Engine Oils", sizes: ["5L"], image: shellHx8_5l },
  { id: "s8", name: "Shell Helix HX8", brand: "shell", category: "Engine Oils", sizes: ["500ml"], image: shellHx8_5l },
  { id: "s10", name: "Shell Rimula R4", brand: "shell", category: "Engine Oils", sizes: ["5L"], image: shellRimulaR4_5l },

  // Castrol
  { id: "c1", name: "Castrol GTX 20W-50", brand: "castrol", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "c2", name: "Castrol GTX 15W-40", brand: "castrol", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "c3", name: "Castrol Magnatec 10W-40", brand: "castrol", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "c4", name: "Castrol Magnatec 5W-30", brand: "castrol", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "c5", name: "Castrol Diesel 15W-40", brand: "castrol", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "c6", name: "Castrol Diesel 20W-50", brand: "castrol", category: "Engine Oils", sizes: ["5L"], image: "" },

  // Engen
  { id: "e1", name: "Engen Xtreme 5W-40", brand: "engen", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "e2", name: "Engen Xtreme 10W-40", brand: "engen", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "e3", name: "Engen Formula DX 5W-30", brand: "engen", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "e4", name: "Engen Dieselube 15W-40", brand: "engen", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "e5", name: "Engen Dieselube 20W-50", brand: "engen", category: "Engine Oils", sizes: ["5L"], image: "" },

  // Valvoline
  { id: "v1", name: "Valvoline All Climate 20W-50", brand: "valvoline", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "v2", name: "Valvoline All Climate 15W-40", brand: "valvoline", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "v3", name: "Valvoline SynPower 5W-30", brand: "valvoline", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "v4", name: "Valvoline SynPower 10W-40", brand: "valvoline", category: "Engine Oils", sizes: ["5L"], image: "" },

  // MOTOLUBE
  { id: "m1", name: "Motolube EP90", brand: "motolube", category: "Transmission & Gear Oils", sizes: ["5L"], image: "" },
  { id: "m2", name: "Motolube EP90", brand: "motolube", category: "Transmission & Gear Oils", sizes: ["500ml"], image: "" },
  { id: "m3", name: "Motolube ATF", brand: "motolube", category: "Transmission & Gear Oils", sizes: ["5L"], image: "" },
  { id: "m4", name: "Motolube ATF", brand: "motolube", category: "Transmission & Gear Oils", sizes: ["500ml"], image: "" },
  { id: "m5", name: "Motolube ATW90", brand: "motolube", category: "Transmission & Gear Oils", sizes: ["5L"], image: "" },
  { id: "m6", name: "Motolube ATW90", brand: "motolube", category: "Transmission & Gear Oils", sizes: ["500ml"], image: "" },
  { id: "m7", name: "Motolube Hydraulic Oil", brand: "motolube", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "m8", name: "Motolube SAE 40", brand: "motolube", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "m9", name: "Motolube SAE 40", brand: "motolube", category: "Engine Oils", sizes: ["500ml"], image: "" },

  // Winners
  { id: "w1", name: "Winners Antifreeze Green", brand: "winners", category: "Antifreeze", sizes: ["1L"], image: "" },
  { id: "w2", name: "Winners Antifreeze Green", brand: "winners", category: "Antifreeze", sizes: ["5L"], image: "" },
  { id: "w3", name: "Winners Antifreeze Red", brand: "winners", category: "Antifreeze", sizes: ["1L"], image: "" },
  { id: "w4", name: "Winners Antifreeze Red", brand: "winners", category: "Antifreeze", sizes: ["5L"], image: "" },

  // New Look
  { id: "n1", name: "New Look Brake Fluid", brand: "newlook", category: "Brake Fluid", sizes: ["200ml"], image: "" },
  { id: "n2", name: "New Look Brake Fluid", brand: "newlook", category: "Brake Fluid", sizes: ["500ml"], image: "" },

  // G4 Lubricants - Additives
  { id: "g1", name: "G4 Injector Cleaner", brand: "g4", category: "Additives", sizes: [], image: "" },
  { id: "g2", name: "G4 Radiator Flush", brand: "g4", category: "Additives", sizes: [], image: "" },
  { id: "g3", name: "G4 Engine Flush", brand: "g4", category: "Additives", sizes: [], image: "" },
  { id: "g4", name: "G4 Stop Smoke", brand: "g4", category: "Additives", sizes: [], image: "" },

  // G4 Lubricants - Oils
  { id: "g5", name: "G4 15W-40", brand: "g4", category: "Engine Oils", sizes: ["5L"], image: "" },
  { id: "g6", name: "G4 ATF", brand: "g4", category: "Transmission & Gear Oils", sizes: ["5L"], image: "" },
  { id: "g7", name: "G4 Gear Oil 80W-90", brand: "g4", category: "Transmission & Gear Oils", sizes: ["5L"], image: "" },
];
