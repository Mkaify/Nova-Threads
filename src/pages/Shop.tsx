import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts'; // ✅ Real Data
import { Loader2 } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState('all');
  
  // ✅ Fetch from Supabase
  const { data: products = [], isLoading } = useProducts();
  
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery) || 
                          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery)));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
             {searchQuery ? `Results for "${searchQuery}"` : "Shop All Products"}
          </h1>
          
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {['all', 'clothing', 'accessories', 'shoes'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm capitalize ${category === cat ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>
          ) : filteredProducts.length > 0 ? (
             <ProductGrid products={filteredProducts} />
          ) : (
             <div className="text-center py-20">No products found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;