import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import NewsletterForm from "./NewsletterForm";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">NOVA</h3>
            <p className="text-gray-600 mb-4 max-w-xs">
              Premium quality fashion and accessories for the modern individual.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/shop/new-arrivals" className="text-gray-600 hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop/bestsellers" className="text-gray-600 hover:text-black transition-colors">Bestsellers</Link></li>
              <li><Link to="/shop" className="text-gray-600 hover:text-black transition-colors">Sale</Link></li>
              <li><Link to="/collections" className="text-gray-600 hover:text-black transition-colors">Collections</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/customer-service" className="text-gray-600 hover:text-black transition-colors">Customer Service</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-gray-600 hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link to="/faqs" className="text-gray-600 hover:text-black transition-colors">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Subscribe</h4>
            <p className="text-gray-600 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <NewsletterForm />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 NOVA. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
