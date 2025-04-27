
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

const Bestsellers = () => {
  const bestsellers = products.slice(0, 6); // Show first 6 products as bestsellers

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Bestsellers</h1>
          <ProductGrid products={bestsellers} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bestsellers;
