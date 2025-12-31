import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/lib/auth"; 
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  
  // FIX 1: Destructure 'loading' from the hook
  const { user, loading } = useAuth(); 
  
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // FIX 2: Only redirect if NOT loading AND NO user
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to complete your purchase");
      // Optional: Pass state so you can redirect back here after login
      navigate("/auth", { state: { from: "/checkout" } });
    }
  }, [user, loading, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsProcessing(true);

    try {
      // 1. Create the Order
      const { data: order, error: orderError } = await supabase
        .from("Orders")
        .insert({
          user_id: user.id,
          total_amount: cartTotal,
          status: "paid", 
          shipping_details: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id, 
        quantity: item.quantity,
        price_at_purchase: item.price,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor
      }));

      const { error: itemsError } = await supabase
        .from("OrderItems")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Success
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/account"); 
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  // FIX 3: Show a loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
      return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
            </div>
          </main>
          <Footer />
        </div>
      );
    }
  
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Forms */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} id="checkout-form">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required value={formData.firstName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required value={formData.lastName} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" required value={formData.address} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required value={formData.city} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" required value={formData.zipCode} onChange={handleInputChange} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
  
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="0000 0000 0000 0000" required value={formData.cardNumber} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required value={formData.expiry} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required value={formData.cvc} onChange={handleInputChange} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
  
            {/* Right Column: Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between items-start py-2 border-b">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} 
                              {item.selectedSize && ` • Size: ${item.selectedSize}`}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
  
                    <Button 
                      type="submit" 
                      form="checkout-form"
                      className="w-full mt-6" 
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay $${cartTotal.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
};

export default Checkout;