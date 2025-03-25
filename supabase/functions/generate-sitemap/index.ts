
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('published', true);

    if (blogError) throw blogError;

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://namehive.fun/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://namehive.fun/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://namehive.fun/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://namehive.fun/generators</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://namehive.fun/business-brand</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/personal-social</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/writing-creative</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/niche-specific</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/tech-industry</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/geographical-local</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/fantasy-gaming</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/specialty-fun</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://namehive.fun/generator/random</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://namehive.fun/generator/podcast</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Add blog posts to sitemap
    for (const post of blogPosts || []) {
      sitemap += `
  <url>
    <loc>https://namehive.fun/blog/${post.slug || post.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    // Close sitemap
    sitemap += `
</urlset>`;

    // Save sitemap to the database
    const { error: saveError } = await supabase
      .from('site_config')
      .upsert({ 
        id: 'sitemap', 
        content: sitemap,
        updated_at: new Date().toISOString() 
      });

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({ success: true, message: 'Sitemap generated successfully' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});
