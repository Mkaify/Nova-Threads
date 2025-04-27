
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

const NewArrivals = () => {
  const newArrivals = products.slice(0, 8); // Show first 8 products as new arrivals

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">New Arrivals</h1>
          <ProductGrid products={newArrivals} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivals;
