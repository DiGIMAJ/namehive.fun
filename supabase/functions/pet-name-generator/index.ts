import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
      console.error("GROQ_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ error: "API key configuration error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { petType, personalityTraits, theme, numberOfNames } = await req.json();

    console.log("Request received with parameters:", { petType, personalityTraits, theme, numberOfNames });

    const userPrompt = `Generate ${numberOfNames || 5} unique, creative, and adorable pet name ideas for a ${petType}. The names should be:

- Cute, catchy, and easy to say
- Suitable for the pet's personality traits: ${description}
- Based on the following tone: ${tone}

Response Format:
Return the pet names in a JSON array exactly as specified in the system instructions.`;

    const systemPrompt = `You are an AI specializing in generating creative and adorable pet names based on user input. You will receive a user prompt describing the desired pet name generation task. Your task is to generate a list of names based on the prompt.

You MUST respond with a valid JSON structure containing an array of name objects:
{
  "names": [
    {
      "name": "Fluffy",
      "petType": "Dog",
      "personalityTraits": "Playful, energetic",
      "theme": "fun",
      "why_it_fits": "The name is playful, easy to say, and matches the pet's personality."
    },
    ...more names
  ]
}`;

    console.log("Making request to Groq API");

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Groq API returned an error: ${response.status}`, details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("Groq API response received:", JSON.stringify(data).substring(0, 200) + "...");

    if (!data.choices || data.choices.length === 0) {
      console.error("No choices returned from Groq API:", data);
      return new Response(
        JSON.stringify({ error: "No choices returned from Groq API", data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const message = data.choices[0]?.message;
    if (!message || !message.content) {
      console.error("No message content in Groq API response:", data);
      return new Response(
        JSON.stringify({ error: "No message content in Groq API response", data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedContent = message.content.trim();
    console.log("Generated content (first 200 chars):", generatedContent.substring(0, 200) + "...");

    let jsonContent = generatedContent;
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
      console.log("Extracted JSON from content");
    }

    let parsedNames;
    try {
      parsedNames = JSON.parse(jsonContent);
      console.log("Successfully parsed JSON response");
    } catch (e) {
      console.error("Failed to parse JSON:", e, "Content:", generatedContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse generated content as JSON", content: generatedContent }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Returning successful response with names");
    return new Response(
      JSON.stringify(parsedNames),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in pet-name-generator:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
