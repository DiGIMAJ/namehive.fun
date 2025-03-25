
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const SitemapPage = () => {
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await (supabase
          .from('site_config') as any)
          .select('content')
          .eq('id', 'sitemap')
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching sitemap:', error);
        }
        
        if (data?.content) {
          setSitemap(data.content);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSitemap();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Sitemap</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : sitemap ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div dangerouslySetInnerHTML={{ __html: sitemap }} />
            </div>
          ) : (
            <div className="bg-white rounded-lg p-10 text-center">
              <h2 className="text-xl font-semibold mb-2">Sitemap Not Found</h2>
              <p className="text-gray-600">
                The sitemap is currently unavailable or being generated.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SitemapPage;
