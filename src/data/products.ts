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

export const brands: Brand[] = [
  { id: "shell", name: "Shell", logo: "🐚", image: shellLogo },
  { id: "castrol", name: "Castrol", logo: "🛢️", image: castrolLogo },
  { id: "engen", name: "Engen", logo: "⛽", image: engenLogo },
  { id: "valvoline", name: "Valvoline", logo: "⚙️" },
  { id: "motorlube", name: "Motorlube", logo: "🔧" },
  { id: "blixem", name: "Blixem", logo: "⚡", image: blixemLogo },
  { id: "g4", name: "G4 Lubricants", logo: "🏭" },
  { id: "winners", name: "Winners", logo: "🏆" },
  { id: "newlook", name: "New Look", logo: "✨" },
];

export const categories = ["Engine Oils", "Hydraulic Oils", "Gear Oils", "Greases"];

export const products: Product[] = [
  // Shell
  { id: "s1", name: "Shell Helix HX7 10W-40", brand: "shell", category: "Engine Oils", sizes: ["1L", "4L", "5L", "20L", "208L"], image: "" },
  { id: "s2", name: "Shell Helix Ultra 5W-30", brand: "shell", category: "Engine Oils", sizes: ["1L", "4L", "5L", "20L"], image: "" },
  { id: "s3", name: "Shell Tellus S2 V 46", brand: "shell", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "s4", name: "Shell Spirax S4 G 75W-90", brand: "shell", category: "Gear Oils", sizes: ["1L", "20L", "208L"], image: "" },
  { id: "s5", name: "Shell Gadus S2 V220", brand: "shell", category: "Greases", sizes: ["0.4kg", "18kg", "180kg"], image: "" },

  // Castrol
  { id: "c1", name: "Castrol GTX 15W-40", brand: "castrol", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "c2", name: "Castrol EDGE 5W-30", brand: "castrol", category: "Engine Oils", sizes: ["1L", "4L", "5L"], image: "" },
  { id: "c3", name: "Castrol Hyspin AWS 46", brand: "castrol", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "c4", name: "Castrol Syntrax 75W-90", brand: "castrol", category: "Gear Oils", sizes: ["1L", "20L"], image: "" },
  { id: "c5", name: "Castrol Spheerol EPL 2", brand: "castrol", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Valvoline
  { id: "v1", name: "Valvoline Premium Blue 15W-40", brand: "valvoline", category: "Engine Oils", sizes: ["5L", "20L", "208L"], image: "" },
  { id: "v2", name: "Valvoline SynPower 5W-40", brand: "valvoline", category: "Engine Oils", sizes: ["1L", "4L", "5L"], image: "" },
  { id: "v3", name: "Valvoline Ultramax HLP 68", brand: "valvoline", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "v4", name: "Valvoline Heavy Duty Gear Oil 80W-90", brand: "valvoline", category: "Gear Oils", sizes: ["20L", "208L"], image: "" },
  { id: "v5", name: "Valvoline Multi-Purpose Grease", brand: "valvoline", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Motorlube
  { id: "m1", name: "Motorlube Gold 20W-50", brand: "motorlube", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "m2", name: "Motorlube Synthetic 5W-30", brand: "motorlube", category: "Engine Oils", sizes: ["1L", "5L"], image: "" },
  { id: "m3", name: "Motorlube Hydro 46", brand: "motorlube", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "m4", name: "Motorlube Gear EP 90", brand: "motorlube", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "m5", name: "Motorlube Lithium Grease EP2", brand: "motorlube", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Blixem
  { id: "b1", name: "Blixem Premium 15W-40", brand: "blixem", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "b2", name: "Blixem Turbo Diesel 20W-50", brand: "blixem", category: "Engine Oils", sizes: ["5L", "20L"], image: "" },
  { id: "b3", name: "Blixem Hydraulic AW 68", brand: "blixem", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "b4", name: "Blixem Gear Oil 85W-140", brand: "blixem", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "b5", name: "Blixem Multi-Purpose Grease", brand: "blixem", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // G4 Lubricants
  { id: "g1", name: "G4 Ultra 10W-40", brand: "g4", category: "Engine Oils", sizes: ["1L", "5L", "20L"], image: "" },
  { id: "g2", name: "G4 Diesel Plus 15W-40", brand: "g4", category: "Engine Oils", sizes: ["5L", "20L", "208L"], image: "" },
  { id: "g3", name: "G4 Hydraulic HLP 32", brand: "g4", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "g4", name: "G4 Gear EP 80W-90", brand: "g4", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "g5", name: "G4 Lithium Complex Grease", brand: "g4", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // Winners
  { id: "w1", name: "Winners Supreme 20W-50", brand: "winners", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "w2", name: "Winners Synthetic 5W-40", brand: "winners", category: "Engine Oils", sizes: ["1L", "5L"], image: "" },
  { id: "w3", name: "Winners Hydraulic 46", brand: "winners", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "w4", name: "Winners Gear Oil 90", brand: "winners", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "w5", name: "Winners EP2 Grease", brand: "winners", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },

  // New Look
  { id: "n1", name: "New Look Premium 15W-40", brand: "newlook", category: "Engine Oils", sizes: ["1L", "5L", "20L", "208L"], image: "" },
  { id: "n2", name: "New Look HD Diesel 20W-50", brand: "newlook", category: "Engine Oils", sizes: ["5L", "20L"], image: "" },
  { id: "n3", name: "New Look Hydraulic AW 46", brand: "newlook", category: "Hydraulic Oils", sizes: ["20L", "208L"], image: "" },
  { id: "n4", name: "New Look Gear EP 85W-140", brand: "newlook", category: "Gear Oils", sizes: ["5L", "20L"], image: "" },
  { id: "n5", name: "New Look Multi-Grease", brand: "newlook", category: "Greases", sizes: ["0.5kg", "18kg"], image: "" },
];
