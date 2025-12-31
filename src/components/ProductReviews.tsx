import { useState, useEffect } from "react";
import { Star, User as UserIcon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: string;
  created_at: string;
  rating: number;
  comment: string;
  user_id: string;
  profiles?: {
    email: string; // Fetching email or name from profiles
  };
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("Reviews")
        .select(`
          *,
          profiles:user_id (email) 
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [productId]);

  // Submit Review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to write a review");
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("Reviews")
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newRating,
          comment: newComment,
        })
        .select(`*, profiles:user_id(email)`) // Select relation data to update UI immediately
        .single();

      if (error) {
        if (error.code === "23505") throw new Error("You have already reviewed this product");
        throw error;
      }

      setReviews([data, ...reviews]);
      setNewComment("");
      setNewRating(5);
      toast.success("Review submitted!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Review
  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase.from("Reviews").delete().eq("id", reviewId);
    if (!error) {
      setReviews(reviews.filter((r) => r.id !== reviewId));
      toast.success("Review deleted");
    }
  };

  // Calculate Average Rating
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  if (loading) return <p className="text-gray-500">Loading reviews...</p>;

  return (
    <div className="mt-16 space-y-8">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>

      {/* Summary */}
      <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-lg">
        <div className="text-4xl font-bold">{averageRating}</div>
        <div>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? "fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{reviews.length} Reviews</p>
        </div>
      </div>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg">
          <h3 className="font-semibold">Write a Review</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`focus:outline-none transition-colors ${
                    star <= newRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  <Star className={`w-6 h-6 ${star <= newRating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Post Review"}
          </Button>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="mb-2">Please log in to write a review.</p>
        </div>
      )}

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            <Avatar>
              <AvatarFallback><UserIcon className="w-5 h-5" /></AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">
                    {review.profiles?.email?.split("@")[0] || "User"}
                  </p>
                  <div className="flex text-yellow-400 text-xs mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  {user?.id === review.user_id && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500 italic">No reviews yet. Be the first!</p>}
      </div>
    </div>
  );
};

export default ProductReviews;