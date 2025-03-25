
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { BlogPost } from '@/types/blog';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        
        // Use type assertion to handle the database structure mismatch
        const { data, error } = await (supabase
          .from('blog_posts') as any)
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();
        
        if (error) {
          console.error('Error fetching post:', error);
          navigate('/blog');
          return;
        }
        
        if (!data) {
          navigate('/blog');
          return;
        }
        
        setPost(data as BlogPost);
        
        // Fetch related posts in the same category
        if (data.category) {
          const { data: relatedData, error: relatedError } = await (supabase
            .from('blog_posts') as any)
            .select('*')
            .eq('category', data.category)
            .eq('published', true)
            .neq('id', data.id)
            .limit(3);
          
          if (!relatedError && relatedData) {
            setRelatedPosts(relatedData as BlogPost[]);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-4xl">
            <Skeleton className="h-10 w-3/4 mb-6" />
            <Skeleton className="h-6 w-1/3 mb-10" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-4xl">
            <div className="bg-white rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Link to="/blog" className="text-blue-600 hover:underline flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-4xl">
          <div className="mb-8">
            <Link to="/blog" className="text-blue-600 hover:underline flex items-center w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>
          
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {post.image && (
              <div className="aspect-[21/9] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.category && (
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                )}
                {post.tags && post.tags.length > 0 && post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center mb-6 text-gray-500 text-sm">
                {post.author && <span className="mr-4">{post.author}</span>}
                {post.date && (
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </time>
                )}
              </div>
              
              {post.excerpt && (
                <div className="text-lg font-medium text-gray-700 mb-6 italic">
                  {post.excerpt}
                </div>
              )}
              
              <div className="prose max-w-none">
                {post.content && post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  } else if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-bold mt-6 mb-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={index} className="mb-4 font-bold">
                        {paragraph.replace(/^\*\*|\*\*$/g, '')}
                      </p>
                    );
                  } else if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                    return (
                      <p key={index} className="mb-4 italic">
                        {paragraph.replace(/^\*|\*$/g, '')}
                      </p>
                    );
                  } else if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-disc list-inside mb-4">
                        {paragraph.split('\n').map((item, idx) => (
                          <li key={idx} className="mb-1">{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  } else if (/^\d+\.\s/.test(paragraph)) {
                    return (
                      <ol key={index} className="list-decimal list-inside mb-4">
                        {paragraph.split('\n').map((item, idx) => (
                          <li key={idx} className="mb-1">{item.replace(/^\d+\.\s/, '')}</li>
                        ))}
                      </ol>
                    );
                  }
                  return <p key={index} className="mb-4">{paragraph}</p>;
                })}
              </div>
            </div>
          </article>
          
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug || post.id}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:-translate-y-1"
                  >
                    {post.image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
