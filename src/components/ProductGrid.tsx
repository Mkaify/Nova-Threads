import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Product } from "../types/product";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/context/CartContext";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem } = useCart();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is Admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (data?.role === 'admin') {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [user]);

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist!`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleDelete = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from('Products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "The product has been removed.",
      });

      // Refresh the list immediately
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete product",
      });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link 
          to={`/product/${product.id}`}
          key={product.id}
          className="group relative block"
        >
          {/* Image Container */}
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Action Buttons - No more "dummy circles" (Transparent background) */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
               {/* Wishlist */}
               <button
                onClick={(e) => handleAddToWishlist(e, product)}
                className="p-2 rounded-full bg-black/20 text-white hover:bg-red-500 hover:text-white backdrop-blur-sm transition-all"
                title="Add to Wishlist"
              >
                <Heart size={18} />
              </button>

              {/* Quick Add to Cart */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="p-2 rounded-full bg-black/20 text-white hover:bg-black hover:text-white backdrop-blur-sm transition-all"
                title="Add to Cart"
              >
                <ShoppingCart size={18} />
              </button>
            </div>

            {/* Admin Delete Button (Top Left) */}
            {isAdmin && (
              <button
                onClick={(e) => handleDelete(e, product.id)}
                className="absolute top-3 left-3 p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-all z-20"
                title="Delete Product"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          <p className="mt-1 text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;