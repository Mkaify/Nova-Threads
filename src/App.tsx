import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Collections from "./pages/Collections";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import NewArrivals from "./pages/shop/NewArrivals";
import Bestsellers from "./pages/shop/Bestsellers";
import CustomerService from "./pages/help/CustomerService";

// ✅ IMPORT MISSING PAGES
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import AddProduct from "./pages/admin/AddProduct";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* ✅ WRAP WITH CART PROVIDER */}
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/new-arrivals" element={<NewArrivals />} />
            <Route path="/shop/bestsellers" element={<Bestsellers />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            
            {/* ✅ CHECKOUT ROUTES */}
            <Route path="/cart" element={<Checkout />} />
            <Route path="/checkout" element={<Checkout />} />
            
            <Route path="/customer-service" element={<CustomerService />} />
            
            {/* ✅ PRODUCT DETAILS ROUTE */}
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* ✅ ADMIN ROUTE (Fixes your 404 error) */}
            <Route path="/admin/add-product" element={<AddProduct />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;