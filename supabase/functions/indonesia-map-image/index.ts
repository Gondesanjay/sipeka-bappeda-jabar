import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = "https://upload.wikimedia.org/wikipedia/commons/0/0d/Indonesia_location_map.svg";
  const proxy = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });

  if (!proxy.ok) {
    return new Response(JSON.stringify({ error: "upstream failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await proxy.bytes();
  return new Response(body, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
});
