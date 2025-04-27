
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Subscription failed');

      toast({
        title: "Successfully subscribed! 🎉",
        description: "Welcome to our newsletter! Check your inbox for a welcome email.",
      });
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: "Please try again later.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="flex gap-2">
      <Input 
        type="email" 
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-r-none flex-grow"
        required
      />
      <Button 
        type="submit" 
        disabled={isSubscribing}
        className="rounded-l-none"
      >
        {isSubscribing ? "..." : "Subscribe"}
      </Button>
    </form>
  );
};

export default NewsletterForm;
