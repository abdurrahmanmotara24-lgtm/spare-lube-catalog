import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

export function useDbProducts() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        setDbProducts(
          data.map((p) => ({
            id: `db-${p.id}`,
            name: p.name,
            brand: p.brand,
            category: p.category,
            sizes: p.sizes || [],
            image: p.image_url || "",
            description: p.description || "",
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { dbProducts, loading };
}
