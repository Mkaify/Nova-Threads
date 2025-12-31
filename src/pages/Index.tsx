import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts'; // ✅ Import Hook
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [category, setCategory] = useState('all');
  
  // ✅ Fetch Real Data from Supabase
  const { data: products = [], isLoading } = useProducts();
  
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);
    
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {['all', 'clothing', 'accessories', 'shoes'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition-colors
                    ${category === cat 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* ✅ Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No products found. Try adding some from the Admin Dashboard!</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;