import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "clothing",
    tags: "", // Comma separated
    colors: "", // Comma separated
    sizes: "", // Comma separated
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile) throw new Error("Please select a product image");

      // 1. Upload Image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 3. Insert Product into Database
      const { error: insertError } = await supabase
        .from('Products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: publicUrl,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()),
          colors: formData.colors.split(',').map(c => c.trim()),
          sizes: formData.sizes.split(',').map(s => s.trim()),
        });

      if (insertError) throw insertError;

      toast.success("Product created successfully!");
      navigate("/shop");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-500">
                        <Upload className="h-10 w-10 mb-2" />
                        <span>Click to upload image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" required value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" required value={formData.price} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" required value={formData.description} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))} 
                    defaultValue="clothing"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Attributes */}
                <div className="space-y-2">
                  <Label htmlFor="sizes">Sizes (comma separated)</Label>
                  <Input id="sizes" placeholder="S, M, L, XL" value={formData.sizes} onChange={handleInputChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colors">Colors (comma separated)</Label>
                  <Input id="colors" placeholder="Red, Blue, Green" value={formData.colors} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="summer, new, sale" value={formData.tags} onChange={handleInputChange} />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Product"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProduct;