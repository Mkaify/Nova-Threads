import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("Products")
        .select("*");

      if (error) {
        throw new Error(error.message);
      }

      // Map database fields to your frontend Product type
      // Ensure your DB column names match or map them here
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: item.image,
        category: item.category,
        tags: item.tags || [],
        colors: item.colors || [],
        sizes: item.sizes || [],
      }));
    },
  });
};