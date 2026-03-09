import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function validateInput(body: unknown): {
  valid: boolean;
  data?: { name: string; phone: string; email: string; description: string; user_id: string | null };
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const { name, phone, email, description, user_id } = body as Record<string, unknown>;

  // Name
  if (typeof name !== "string" || name.trim().length === 0 || name.trim().length > 100) {
    return { valid: false, error: "Name is required and must be 1-100 characters" };
  }

  // Phone – digits, spaces, parentheses, plus, dash, dot
  if (typeof phone !== "string" || phone.trim().length === 0 || phone.trim().length > 20) {
    return { valid: false, error: "Phone is required and must be 1-20 characters" };
  }
  if (!/^[\d\s()+\-.]+$/.test(phone.trim())) {
    return { valid: false, error: "Phone contains invalid characters" };
  }

  // Email
  if (typeof email !== "string" || email.trim().length === 0 || email.trim().length > 255) {
    return { valid: false, error: "Email is required and must be 1-255 characters" };
  }
  // Basic email regex
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { valid: false, error: "Invalid email format" };
  }

  // Description
  if (typeof description !== "string" || description.trim().length === 0 || description.trim().length > 1000) {
    return { valid: false, error: "Description is required and must be 1-1000 characters" };
  }

  // user_id – optional uuid or null
  let validUserId: string | null = null;
  if (user_id !== null && user_id !== undefined) {
    if (typeof user_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user_id)) {
      return { valid: false, error: "Invalid user_id format" };
    }
    validUserId = user_id;
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      description: description.trim(),
      user_id: validUserId,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const result = validateInput(body);

    if (!result.valid) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If there's an auth header, verify the user_id matches the token
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    let authenticatedUserId: string | null = null;

    if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (user) {
        authenticatedUserId = user.id;
      }
    }

    // If user_id is provided, it must match the authenticated user
    const finalUserId = authenticatedUserId;
    if (result.data!.user_id && result.data!.user_id !== authenticatedUserId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to insert (bypasses RLS)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { error } = await adminClient.from("contact_submissions").insert({
      name: result.data!.name,
      phone: result.data!.phone,
      email: result.data!.email,
      description: result.data!.description,
      user_id: finalUserId,
    });

    if (error) {
      console.error("DB insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to submit request" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
