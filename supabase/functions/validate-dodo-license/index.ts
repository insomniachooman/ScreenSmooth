// Supabase Edge Function: validate-dodo-license
// Secure proxy for DodoPayments License Validation API
// Deploy: supabase functions deploy validate-dodo-license
// Set secret: supabase secrets set DODO_PAYMENTS_API_KEY=your_key

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Get API key from environment
const DODO_API_KEY = Deno.env.get("DODO_PAYMENTS_API_KEY");
// Use live.dodopayments.com for production, test.dodopayments.com for testing
const DODO_BASE_URL = Deno.env.get("DODO_API_URL") || "https://live.dodopayments.com";

// CORS headers for Chrome extension requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ valid: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Check API key is configured
    if (!DODO_API_KEY) {
      console.error("DODO_PAYMENTS_API_KEY not configured");
      return new Response(
        JSON.stringify({ valid: false, error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { license_key } = body;

    if (!license_key) {
      return new Response(
        JSON.stringify({ valid: false, error: "License key is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Validating license key: ${license_key.substring(0, 8)}...`);

    // Call DodoPayments API
    const dodoResponse = await fetch(`${DODO_BASE_URL}/licenses/validate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DODO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ license_key }),
    });

    // Parse DodoPayments response
    const dodoResult = await dodoResponse.json();

    console.log("DodoPayments response:", dodoResponse.status, dodoResult);

    // Forward the response
    return new Response(
      JSON.stringify({
        valid: dodoResult.valid === true,
        status: dodoResult.status || (dodoResult.valid ? "active" : "invalid"),
        expires_at: dodoResult.expires_at || null,
        error: dodoResult.valid ? null : (dodoResult.error || "Invalid license key"),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error validating license:", error);
    
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: "Validation service error. Please try again." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
