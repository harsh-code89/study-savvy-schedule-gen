
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  type: 'signup' | 'email_change';
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Verification email function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, type }: VerificationEmailRequest = await req.json();
    console.log('Sending verification email to:', email);

    const subject = type === 'signup' ? 'Verify your StudySavvy account' : 'Confirm your email change';
    const actionText = type === 'signup' ? 'verify your account' : 'confirm your email change';

    // Use a verified sender address - you need to verify your domain at resend.com/domains
    // For now, we'll use the default onboarding address which works for testing
    const fromAddress = "StudySavvy <onboarding@resend.dev>";

    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7c3aed; margin: 0;">StudySavvy</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Transform your study routine with AI-powered planning</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #374151; margin: 0 0 20px 0; text-align: center;">
              ${type === 'signup' ? 'Welcome to StudySavvy!' : 'Confirm Your Email Change'}
            </h2>
            <p style="color: #6b7280; margin: 0 0 25px 0; text-align: center; line-height: 1.6;">
              ${type === 'signup' 
                ? 'Thank you for joining StudySavvy! To complete your registration and start your learning journey, please verify your email address.' 
                : 'To complete your email change, please click the confirmation link below.'}
            </p>
            
            <div style="text-align: center;">
              <a href="${confirmationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
                ${type === 'signup' ? 'Verify Email Address' : 'Confirm Email Change'}
              </a>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Security Notice:</strong> If you didn't request this ${actionText}, please ignore this email. This link will expire in 24 hours for your security.
            </p>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="margin: 0;">This email was sent by StudySavvy</p>
            <p style="margin: 5px 0 0 0;">Need help? Contact our support team</p>
          </div>
        </div>
      `,
    });

    console.log("Email response:", emailResponse);

    // Check if there was an error
    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      
      // Handle the specific domain verification error
      if (emailResponse.error.message?.includes('verify a domain')) {
        return new Response(JSON.stringify({ 
          error: 'Email domain not verified. Please verify your domain at resend.com/domains or use a verified email address.',
          details: emailResponse.error.message
        }), {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }
      
      throw new Error(emailResponse.error.message || 'Failed to send email');
    }

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      id: emailResponse.data?.id,
      message: 'Verification email sent successfully'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send verification email',
        details: 'Please check your email configuration and domain verification'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
