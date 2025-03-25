
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        // Use type assertion to handle the database structure mismatch
        const { data, error } = await (supabase
          .from('blog_posts') as any)
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setPosts(data as BlogPost[]);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map((post: any) => post.category).filter(Boolean))
          );
          setCategories(uniqueCategories as string[]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-5xl">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">NameHive Blog</h1>
            <p className="text-gray-600 text-lg">
              Insights, tips, and strategies to help you choose the perfect name
            </p>
          </div>
          
          {categories.length > 0 && (
            <div className="mb-8 overflow-x-auto pb-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug || post.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm transition-transform hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                    )}
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-3 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      {post.date && (
                        <time dateTime={post.date}>
                          {format(new Date(post.date), 'MMM d, yyyy')}
                        </time>
                      )}
                      {post.author && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-10 text-center">
              <h2 className="text-xl font-semibold mb-2">No posts found</h2>
              <p className="text-gray-600">
                {selectedCategory
                  ? `No posts available in the "${selectedCategory}" category.`
                  : 'No blog posts are available at the moment.'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
