
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

serve(async (req) => {
  try {
    // Create a Supabase client with the admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the user object and token from the request
    const { user } = await req.json()

    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: 'No user found in request' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Auto-confirm the user's email
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    )

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    return new Response(JSON.stringify({ message: 'User email confirmed automatically' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
