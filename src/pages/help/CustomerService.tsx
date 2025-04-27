
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CustomerService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Customer Service</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Welcome to NOVA Customer Service. We're here to help you with any questions or concerns you may have about our products or services.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              Email: support@nova.com<br />
              Phone: 1-800-NOVA<br />
              Hours: Monday - Friday, 9am - 5pm EST
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerService;
