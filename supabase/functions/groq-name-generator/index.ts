/// <reference path="./deno.d.ts" />
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    const { generatorType, ...params } = await req.json();
    console.log("Request received for generator type:", generatorType, "with params:", params);

    if (!generatorType) {
      throw new Error("Generator type is required");
    }

    // Make the request to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: params.systemPrompt || "You are a helpful assistant that generates creative name suggestions in JSON format. Return ONLY a JSON object with an array of names under the 'names' key."
          },
          {
            role: "user",
            content: params.userPrompt || "Generate 5 creative name suggestions."
          }
        ],
        temperature: 0.7,
        max_tokens: 2024,
        top_p: 1,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from Groq API");
    }

    // Parse and validate the JSON response
    let parsedNames;
    try {
        parsedNames = JSON.parse(content);
        if (!parsedNames.names || !Array.isArray(parsedNames.names)) {
          throw new Error("Invalid JSON structure, missing 'names' array");
        }

    } catch (e) {
      console.error("Failed to parse JSON:", e, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse generated content as JSON", content: content }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }


    console.log("Successfully generated names for", generatorType);
    return new Response(
      JSON.stringify(parsedNames),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in name generator:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});