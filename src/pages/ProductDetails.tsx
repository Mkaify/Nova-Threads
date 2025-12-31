import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import ProductReviews from "@/components/ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { addItem } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  
  // Find product from the fetched list
  const product = products?.find((p) => p.id === id);

  if (isLoading) return <div className="p-10"><Skeleton className="h-[500px] w-full" /></div>;
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">(4.9)</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 w-14 rounded-md border flex items-center justify-center text-sm font-medium transition-colors
                        ${selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-200 text-gray-900 hover:border-gray-900'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 px-4 rounded-md border flex items-center justify-center text-sm font-medium transition-colors capitalize
                        ${selectedColor === color 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-200 text-gray-900 hover:border-gray-900'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100">
              <Button 
                size="lg" 
                className="w-full md:w-auto min-w-[200px]"
                onClick={() => addItem(product, selectedSize, selectedColor)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productId={product.id} />
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;