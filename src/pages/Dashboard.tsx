
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import FavoritesTab from '@/components/dashboard/FavoritesTab';
import LogoutButton from '@/components/common/LogoutButton';
import { History, Heart, Sparkles, BarChart, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const generatorCategories = [
  { title: 'Business & Brand', path: '/business-brand', description: 'Company, startup, and product names' },
  { title: 'Personal & Social', path: '/personal-social', description: 'Username and social media handles' },
  { title: 'Writing & Creative', path: '/writing-creative', description: 'Book, character, and story names' },
  { title: 'Tech Industry', path: '/tech-industry', description: 'Tech startups, apps, and domains' },
  { title: 'Geographical & Local', path: '/geographical-local', description: 'Location-based business names' },
  { title: 'Fantasy & Gaming', path: '/fantasy-gaming', description: 'Game characters and fantasy worlds' },
  { title: 'Niche-Specific', path: '/niche-specific', description: 'Specialized industry names' },
  { title: 'Specialty & Fun', path: '/specialty-fun', description: 'Unique and creative name ideas' },
];

const specificGenerators = [
  { title: 'Random Name Generator', path: '/generator/random', description: 'Generate completely random names' },
  { title: 'Podcast Name Generator', path: '/generator/podcast', description: 'Create the perfect podcast name' },
];

const Dashboard = () => {
  const { user, isLoading } = useRequireAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [usageStats, setUsageStats] = useState({ total: 0, premium: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin, full_name')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.is_admin) {
          setIsAdmin(true);
          navigate('/admin');
        }
        
        setUserName(data?.full_name || user.email?.split('@')[0] || 'User');
        
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    if (user) {
      checkAdminStatus();
      fetchUsageStats();
    }
  }, [user, navigate]);
  
  const fetchUsageStats = async () => {
    if (!user) return;
    
    try {
      setLoadingStats(true);
      
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('generator_usage')
        .select('is_premium, count')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .select();
      
      if (error) throw error;
      
      if (data) {
        const premium = data.filter(item => item.is_premium).length;
        setUsageStats({
          total: data.length,
          premium: premium
        });
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-5xl">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="grid gap-6">
              {Array(3).fill(null).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
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
        <div className="page-container max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {userName}</h1>
              <p className="text-gray-600">Manage your account and favorites</p>
            </div>
            <LogoutButton variant="outline" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <History className="h-4 w-4 mr-2 text-blue-500" />
                  Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{usageStats.total}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Name generations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  Premium Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{usageStats.premium}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Premium generations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Saved Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Link to="/dashboard?tab=favorites" className="flex items-center group">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-1">Manage your saved names</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="generators" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Generators</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites">
              <FavoritesTab />
            </TabsContent>
            
            <TabsContent value="generators">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Special Generators</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {specificGenerators.map(generator => (
                      <Link key={generator.path} to={generator.path}>
                        <Card className="h-full transition-all hover:shadow-md">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{generator.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{generator.description}</CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Categories</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {generatorCategories.map(category => (
                      <Link key={category.path} to={category.path}>
                        <Card className="h-full transition-all hover:shadow-md">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{category.description}</CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Your Subscription</h3>
                    <Link to="/subscription" className="text-blue-600 hover:underline">
                      View subscription details
                    </Link>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Account Security</h3>
                    <Link to="/dashboard?tab=password" className="text-blue-600 hover:underline block mb-2">
                      Change password
                    </Link>
                    <LogoutButton variant="outline" className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
