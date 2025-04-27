
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterRequest = await req.json();

    console.log("Sending welcome email to:", email);

    const emailResponse = await resend.emails.send({
      from: "NOVA <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to NOVA Newsletter! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Welcome to NOVA Newsletter! 🎉</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for subscribing to our newsletter. You'll be the first to know about:</p>
          <ul style="color: #666; font-size: 16px; line-height: 1.5;">
            <li>Latest fashion collections</li>
            <li>Exclusive deals and discounts</li>
            <li>Style tips and trends</li>
            <li>Special events and previews</li>
          </ul>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">Stay tuned for our next update!</p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 14px;">Best regards,<br>The NOVA Team</p>
          </div>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            You received this email because you subscribed to our newsletter.
            If you didn't subscribe, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
