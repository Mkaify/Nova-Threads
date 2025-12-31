import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { useCart } from '@/context/CartContext'; // Import Cart Context

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Use the real cart count from context
  const { cartCount } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if the current user is an admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      navigate('/');
      setIsAdmin(false); // Reset admin state on logout
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl">
            NOVA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-black transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-black transition-colors">Shop</Link>
            <Link to="/collections" className="text-gray-700 hover:text-black transition-colors">Collections</Link>
            <Link to="/about" className="text-gray-700 hover:text-black transition-colors">About</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar Animation Container */}
            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-full md:w-64 absolute md:relative left-0 md:left-auto px-4 md:px-0 bg-white z-20' : 'w-auto'}`}>
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2">
                  <Input 
                    autoFocus
                    placeholder="Search products..." 
                    className="h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)}>
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button 
                  className="text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            
            {!isSearchOpen && (
              <>
                {user ? (
                  <>
                    {/* Admin Link - Only visible to admins */}
                    {isAdmin && (
                      <Link 
                        to="/admin/add-product" 
                        className="text-sm font-medium text-gray-700 hover:text-black hover:underline mr-2 transition-colors"
                      >
                        Admin
                      </Link>
                    )}

                    <Link to="/account" className="text-gray-700 hover:text-black transition-colors">
                      <User size={20} />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-black transition-colors"
                    >
                      <LogOut size={20} />
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" className="text-gray-700 hover:text-black transition-colors">
                    <User size={20} />
                  </Link>
                )}
                
                <Link to="/checkout" className="text-gray-700 hover:text-black transition-colors relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-black text-white text-xs rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button 
                  className="md:hidden text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 absolute top-16 left-0 w-full shadow-md z-40">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/collections" className="text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Collections</Link>
            <Link to="/about" className="text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            
            {/* Mobile Admin Link */}
            {user && isAdmin && (
               <Link to="/admin/add-product" className="text-gray-700 hover:text-black transition-colors py-2 font-medium" onClick={() => setIsMenuOpen(false)}>
                 Admin Dashboard
               </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;