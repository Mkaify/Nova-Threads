import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

export default function Account() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [fullName, setFullName] = useState('');
  const [updating, setUpdating] = useState(false);

  // 1. Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // 2. Fetch Profile Data from Supabase
  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data as Profile);
          setFullName(data.full_name || '');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingProfile(false);
      }
    }

    if (user) {
      getProfile();
    }
  }, [user]);

  // 3. Handle Profile Update
  const handleUpdateProfile = async () => {
    if (!user) return;
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your information has been saved successfully.",
      });
      
      // Update local state
      setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || (user && loadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-full px-4 shadow-sm border">
            <span className="text-sm font-medium text-gray-600">
              Role: <span className="text-black capitalize">{profile?.role || 'Customer'}</span>
            </span>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* LEFT COLUMN: Profile Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your public profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-gray-100">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="text-xl bg-gray-100">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{profile?.full_name || 'User'}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      id="full-name" 
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="pl-9 bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Email cannot be changed.</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="uid">User ID</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      id="uid" 
                      value={user?.id || ''} 
                      disabled 
                      className="pl-9 bg-gray-50 font-mono text-xs text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50/50 px-6 py-4">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={updating}
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* RIGHT COLUMN: Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and navigation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/shop')}
                >
                  Browse Shop
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/cart')}
                >
                  View Cart
                </Button>
                {profile?.role === 'admin' && (
                  <Button 
                    className="w-full justify-start border-black text-black hover:bg-gray-100" 
                    variant="outline"
                    onClick={() => navigate('/admin/add-product')}
                  >
                    Add New Product
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Need help with an order or have a question about your account?
                </p>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => navigate('/customer-service')}
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}