
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
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if admin user exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('is_admin', true);

    if (checkError) throw checkError;

    // If admin already exists, return success
    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin user already exists', 
          adminEmail: 'admin@namehive.fun' 
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    // Identify user with admin@namehive.fun
    const { data: userData, error: userError } = await supabase.auth.admin
      .listUsers();

    if (userError) throw userError;

    let adminUserId = null;

    for (const user of userData.users) {
      if (user.email === 'admin@namehive.fun') {
        adminUserId = user.id;
        break;
      }
    }

    // If admin user not found, create one
    if (!adminUserId) {
      const { data: newUser, error: createError } = await supabase.auth.admin
        .createUser({
          email: 'admin@namehive.fun',
          password: 'Admin123!',
          email_confirm: true,
        });

      if (createError) throw createError;
      adminUserId = newUser.user.id;
    }

    // Set admin flag in profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', adminUserId);

    if (updateError) throw updateError;

    // Generate initial blog posts
    const { error: blogError } = await generateInitialBlogPosts(supabase);
    if (blogError) throw blogError;

    // Generate initial sitemap
    await supabase.functions.invoke('generate-sitemap');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user and sample content created successfully',
        adminEmail: 'admin@namehive.fun',
        adminPassword: 'Admin123!' 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error setting up admin user:', error);
    
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

async function generateInitialBlogPosts(supabase) {
  const samplePosts = [
    {
      title: 'How to Choose the Perfect Name for Your Business',
      excerpt: 'Finding the right business name can make or break your brand. Learn our expert tips for creating a name that stands out.',
      content: `Choosing the perfect name for your business is one of the most critical early decisions you'll make as an entrepreneur. Your business name is often the first impression potential customers will have of your brand, and it can significantly impact your marketing efforts and overall success.\n\nIn this article, we'll explore proven strategies to help you choose a name that resonates with your target audience and positions your business for long-term success.\n\n## Start with Your Brand Identity\n\nBefore brainstorming names, take time to clearly define your brand identity. Ask yourself:\n\n- What are your core values?\n- What problem does your business solve?\n- What emotions do you want your brand to evoke?\n- Who is your target audience?\n\nHaving clear answers to these questions will guide your naming process and help you evaluate potential options.\n\n## Brainstorming Techniques\n\n1. **Word Association**: Start with words related to your industry and create chains of associated words.\n\n2. **Founder Names**: Consider using your name or a combination of founder names (like Ben & Jerry's).\n\n3. **Made-Up Words**: Create a completely new word (like Kodak or Google).\n\n4. **Foreign Words**: Look to other languages for inspiration.\n\n5. **AI Assistance**: Use AI tools like our name generator to quickly generate hundreds of options based on your inputs.\n\n## Characteristics of a Great Business Name\n\nThe best business names tend to be:\n\n- **Memorable**: Easy to remember and recall\n- **Pronounceable**: People should be able to say it without difficulty\n- **Meaningful**: Conveys something about your brand or offerings\n- **Scalable**: Won't limit you as your business grows\n- **Protectable**: Can be trademarked and secured as a domain\n\n## Testing Your Name\n\nBefore finalizing your decision, test potential names with these steps:\n\n1. Get feedback from your target audience\n2. Check domain availability and social media handles\n3. Do a trademark search\n4. Say it out loud in different contexts\n5. Consider how it looks visually in a logo\n\nBy following these steps and taking your time with the naming process, you'll be more likely to land on a business name that serves your brand well for years to come.`,
      image: '/placeholder.svg',
      category: 'Business',
      tags: ['naming', 'branding', 'startups', 'business-tips'],
      author: 'Sarah Johnson',
      date: new Date().toISOString(),
      meta_description: 'Learn expert strategies and best practices for choosing the perfect business name that will help your brand stand out and connect with customers.',
      published: true,
      slug: 'how-to-choose-perfect-business-name'
    },
    {
      title: 'Top 10 Naming Trends for Startups in 2023',
      excerpt: 'Stay ahead of the curve with these trending naming conventions that successful startups are using this year.',
      content: `The startup landscape is constantly evolving, and naming trends shift alongside it. In 2023, we're seeing some fascinating patterns emerge in how founders are naming their companies. Whether you're launching a new venture or rebranding an existing one, understanding these trends can give you valuable insights.\n\nHere are the top 10 naming trends we're seeing in the startup world this year:\n\n## 1. Short and Punchy Names\n\nOne-syllable names are making a strong comeback. Brands like Ramp, Bolt, and Pipe demonstrate the power of brevity. These names are easy to remember, type, and say.\n\n## 2. Deliberate Misspellings\n\nStartups are intentionally misspelling common words to create distinctive brand names and secure domain names. Examples include Lyft (lift), Flickr (flicker), and Dribbble (dribble).\n\n## 3. Human Names\n\nUsing human first names for brands continues to be popular, especially for companies wanting to convey approachability. Oscar (insurance), Albert (financial services), and Lola (travel) all leverage this trend.\n\n## 4. Compound Words\n\nCombining two unrelated words to create something new and memorable is gaining traction. Examples include Facebook, YouTube, and Salesforce.\n\n## 5. Descriptive Functionality\n\nNames that directly describe what the product or service does are trending for their clarity. Think Square, Robinhood, or Coinbase.\n\n## 6. Abstract Concepts\n\nAbstract names that evoke feelings or ideas rather than describing literal products are popular for brands wanting flexibility as they grow. Examples include Element, Notion, and Discord.\n\n## 7. Geographic References\n\nUsing place names or geographic features can create instant associations and storytelling opportunities. Examples include Patagonia, Amazon, and Atlassian.\n\n## 8. Letter-Number Combinations\n\nWe're seeing more startups incorporate numbers into their names for a technical, modern feel. Examples include C3.ai, 23andMe, and A1 Ventures.\n\n## 9. Latin and Greek Roots\n\nClassical languages continue to inspire startup names, lending gravitas and uniqueness. Examples include Astra (stars), Novus (new), and Chronos (time).\n\n## 10. Invented Words with Meaning\n\nCompletely made-up words that still evoke relevant meanings are becoming more common. Shopify, Spotify, and Zendesk all follow this pattern.\n\n## Conclusion\n\nWhile trends are interesting to observe, remember that the right name for your startup ultimately depends on your unique brand, values, and audience. The best names stand the test of time because they authentically represent the business, not because they followed a trend.\n\nWhen brainstorming names, consider using our AI name generator to quickly explore possibilities that align with these trends while still reflecting your brand's essence.`,
      image: '/placeholder.svg',
      category: 'Trends',
      tags: ['naming-trends', 'startups', '2023-trends', 'branding'],
      author: 'David Martinez',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      meta_description: 'Discover the top 10 naming trends for startups in 2023, from short punchy names to abstract concepts and number combinations.',
      published: true,
      slug: 'top-10-naming-trends-startups-2023'
    },
    {
      title: 'The Psychology of Names: Why Some Names Stick',
      excerpt: 'Explore the fascinating science behind memorable names and how they impact consumer perception of your brand.',
      content: `Have you ever wondered why some brand names instantly stick in your memory while others fade away? The psychology behind memorable names is a fascinating field that combines linguistics, cognitive science, and marketing psychology.\n\nIn this article, we'll explore the science behind what makes certain names more memorable and impactful than others.\n\n## The Processing Fluency Effect\n\nResearch in cognitive psychology has identified a phenomenon called "processing fluency" - our brains naturally prefer things that are easy to process and understand. Names that are simpler to pronounce and spell benefit from this effect, creating a subtle positive bias.\n\nA classic study published in the Journal of Experimental Psychology found that companies with easier-to-pronounce names performed better in the stock market immediately after their IPO compared to those with complex names.\n\n## The Sound Symbolism Factor\n\nSound symbolism refers to the idea that certain sounds carry inherent meanings. For example:\n\n- Names with "K" sounds (Kodak, Coca-Cola) tend to convey hardness or solidity\n- Names with soft "L" sounds (Luna, Lull) often evoke feelings of softness or tranquility\n- Names with "Z" sounds (Zoom, Zesty) can suggest speed or energy\n\nBrands can leverage these psychological associations to reinforce their positioning.\n\n## The Memory Hook\n\nThe most memorable names often have at least one of these "hooks":\n\n1. **Distinctiveness**: Names that stand out from competitors are more likely to be remembered\n2. **Emotional resonance**: Names that evoke emotions create stronger memory imprints\n3. **Conceptual connections**: Names that link to existing knowledge or metaphors are easier to remember\n4. **Phonetic patterns**: Alliteration, rhyming, and rhythm improve recall (PayPal, Coca-Cola)\n\n## The Recognition Factor\n\nOur brains process familiar information more efficiently. This is why names that feel somewhat familiar yet distinct tend to work well. They balance novelty (to capture attention) with familiarity (to feel trustworthy).\n\n## Cultural and Linguistic Considerations\n\nThe psychological impact of a name can vary dramatically across cultures and languages. What sounds appealing in one language might have negative connotations in another. International brands must carefully consider these cross-cultural implications.\n\n## Applying the Psychology to Your Naming Process\n\nWhen developing your brand name, consider these psychologically-informed strategies:\n\n1. **Conduct association tests**: Ask people what feelings or images come to mind when they hear your potential name\n2. **Test for memorability**: See which names people can recall after 24 hours\n3. **Analyze phonetic elements**: Consider the emotional qualities of the sounds in your name\n4. **Check cross-cultural implications**: Ensure your name works well in all your target markets\n\nBy understanding the psychology behind effective naming, you can create a brand name that naturally resonates with your audience and sticks in their memory.`,
      image: '/placeholder.svg',
      category: 'Psychology',
      tags: ['psychology', 'branding', 'consumer-behavior', 'naming-science'],
      author: 'Dr. Emma Richards',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
      meta_description: 'Understand the psychological principles behind memorable brand names and learn how to apply these insights to create names that resonate with consumers.',
      published: true,
      slug: 'psychology-of-names-why-some-names-stick'
    }
  ];

  try {
    // Insert sample blog posts
    const { error: insertError } = await supabase
      .from('blog_posts')
      .insert(samplePosts);

    return { error: insertError };
  } catch (error) {
    console.error('Error creating sample blog posts:', error);
    return { error };
  }
}
