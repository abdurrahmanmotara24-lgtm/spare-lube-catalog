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

import shellLogo from "@/assets/brands/shell.png";
import castrolLogo from "@/assets/brands/castrol.jpeg";
import blixemLogo from "@/assets/brands/blixem.png";
import engenLogo from "@/assets/brands/engen.jpeg";
import fuchsLogo from "@/assets/brands/fuchs.png";
import motolubeLogo from "@/assets/brands/motolube.jpg";
import winnersLogo from "@/assets/brands/winners.jpg";

export const brands: Brand[] = [
  { id: "shell", name: "Shell", logo: "🐚", image: shellLogo },
  { id: "castrol", name: "Castrol", logo: "🛢️", image: castrolLogo },
  { id: "blixem", name: "Blixem", logo: "⚡", image: blixemLogo },
  { id: "engen", name: "Engen", logo: "⛽", image: engenLogo },
  { id: "valvoline", name: "Valvoline", logo: "⚙️" },
  { id: "g4", name: "G4 Lubricants", logo: "🏭" },
  { id: "motolube", name: "Motolube", logo: "🔧", image: motolubeLogo },
  { id: "winners", name: "Winners", logo: "🏆", image: winnersLogo },
  { id: "fuchs", name: "Fuchs", logo: "🔵", image: fuchsLogo },
];

export const categories = ["Engine Oils", "Hydraulic Oils", "Gear Oils", "Greases", "Additives / Cleaners"];

export const products: Product[] = [
  // Shell
  { id: "s1", name: "Shell Helix HX5 15W-40", brand: "shell", category: "Engine Oils", sizes: ["1L", "4L", "5L", "20L", "208L"], image: "" },
  { id: "s2", name: "Shell Helix HX7 10W-40", brand: "shell", category: "Engine Oils", sizes: ["1L", "4L", "5L", "20L", "208L"], image: "" },
  { id: "s3", name: "Shell Helix Ultra 5W-30", brand: "shell", category: "Engine Oils", sizes: ["1L", "4L", "5L", "20L"], image: "" },
  { id: "s4", name: "Shell Tellus S2 V 46", brand: "shell", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "s5", name: "Shell Spirax S4 G 75W-90", brand: "shell", category: "Gear Oils", sizes: ["1L", "20L", "208L"], image: "" },
  { id: "s6", name: "Shell Gadus S2 V220", brand: "shell", category: "Greases", sizes: ["0.4kg", "18kg", "180kg"], image: "" },

  // Castrol
  { id: "c1", name: "Castrol GTX 15W-40", brand: "castrol", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "c2", name: "Castrol Magnatec 5W-40", brand: "castrol", category: "Engine Oils", sizes: ["1L", "4L", "5L"], image: "" },
  { id: "c3", name: "Castrol EDGE 5W-30", brand: "castrol", category: "Engine Oils", sizes: ["1L", "4L", "5L"], image: "" },
  { id: "c4", name: "Castrol Hyspin AWS 46", brand: "castrol", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "c5", name: "Castrol Syntrax 75W-90", brand: "castrol", category: "Gear Oils", sizes: ["1L", "20L"], image: "" },
  { id: "c6", name: "Castrol Spheerol EPL 2", brand: "castrol", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Blixem
  { id: "b1", name: "Blixem Premium 15W-40", brand: "blixem", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "b2", name: "Blixem Turbo Diesel 20W-50", brand: "blixem", category: "Engine Oils", sizes: ["5L", "20L"], image: "" },
  { id: "b3", name: "Blixem Hydraulic AW 68", brand: "blixem", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "b4", name: "Blixem Gear Oil 85W-140", brand: "blixem", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "b5", name: "Blixem Multi-Purpose Grease", brand: "blixem", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },
  { id: "b6", name: "Blixem Water Base Degreaser", brand: "blixem", category: "Additives / Cleaners", sizes: ["5L", "25L"], image: "" },

  // Engen
  { id: "e1", name: "Engen Dieselube 500 15W-40", brand: "engen", category: "Engine Oils", sizes: ["5L", "20L", "208L"], image: "" },
  { id: "e2", name: "Engen Superlube 20W-50", brand: "engen", category: "Engine Oils", sizes: ["1L", "5L", "20L"], image: "" },
  { id: "e3", name: "Engen Hytrans 46", brand: "engen", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "e4", name: "Engen EP Gear Oil 80W-90", brand: "engen", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "e5", name: "Engen Lithium Grease EP2", brand: "engen", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Valvoline
  { id: "v1", name: "Valvoline All-Fleet 15W-40", brand: "valvoline", category: "Engine Oils", sizes: ["5L", "20L", "208L"], image: "" },
  { id: "v2", name: "Valvoline SynPower 5W-40", brand: "valvoline", category: "Engine Oils", sizes: ["1L", "4L", "5L"], image: "" },
  { id: "v3", name: "Valvoline Ultramax HLP 68", brand: "valvoline", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "v4", name: "Valvoline HD Gear Oil 80W-90", brand: "valvoline", category: "Gear Oils", sizes: ["20L", "208L"], image: "" },
  { id: "v5", name: "Valvoline Multi-Purpose Grease", brand: "valvoline", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // G4 Lubricants
  { id: "g1", name: "G4 Ultra 10W-40", brand: "g4", category: "Engine Oils", sizes: ["1L", "5L", "20L"], image: "" },
  { id: "g2", name: "G4 Diesel Plus 15W-40", brand: "g4", category: "Engine Oils", sizes: ["5L", "20L", "208L"], image: "" },
  { id: "g3", name: "G4 Hydraulic HLP 32", brand: "g4", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "g4", name: "G4 Gear EP 80W-90", brand: "g4", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "g5", name: "G4 Lithium Complex Grease", brand: "g4", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },
  { id: "g6", name: "G4 Smoke Gone", brand: "g4", category: "Additives / Cleaners", sizes: ["200ml", "500ml"], image: "" },

  // Motolube
  { id: "m1", name: "Motolube Gold 20W-50", brand: "motolube", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "m2", name: "Motolube Synthetic 5W-30", brand: "motolube", category: "Engine Oils", sizes: ["1L", "5L"], image: "" },
  { id: "m3", name: "Motolube Hydro 46", brand: "motolube", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "m4", name: "Motolube Gear EP 90", brand: "motolube", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "m5", name: "Motolube Lithium Grease EP2", brand: "motolube", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Winners
  { id: "w1", name: "Winners Supreme 20W-50", brand: "winners", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "w2", name: "Winners Synthetic 5W-40", brand: "winners", category: "Engine Oils", sizes: ["1L", "5L"], image: "" },
  { id: "w3", name: "Winners Hydraulic 46", brand: "winners", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "w4", name: "Winners Gear Oil 90", brand: "winners", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "w5", name: "Winners EP2 Grease", brand: "winners", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Fuchs
  { id: "f1", name: "Fuchs Titan GT1 5W-40", brand: "fuchs", category: "Engine Oils", sizes: ["1L", "4L", "5L", "20L"], image: "" },
  { id: "f2", name: "Fuchs Titan Cargo 15W-40", brand: "fuchs", category: "Engine Oils", sizes: ["5L", "20L", "208L"], image: "" },
  { id: "f3", name: "Fuchs Renolin B 46 HVI", brand: "fuchs", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "f4", name: "Fuchs Titan Sintofluid 75W-80", brand: "fuchs", category: "Gear Oils", sizes: ["1L", "20L"], image: "" },
  { id: "f5", name: "Fuchs Renolit EP2 Grease", brand: "fuchs", category: "Greases", sizes: ["0.4kg", "18kg", "180kg"], image: "" },
];
