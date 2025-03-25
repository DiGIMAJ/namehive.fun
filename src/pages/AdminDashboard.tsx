import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RefreshCw, Users, Zap, BookOpen, Settings } from 'lucide-react';
import LogoutButton from '@/components/common/LogoutButton';
import AdminLoading from '@/components/admin/AdminLoading';
import AccessDenied from '@/components/admin/AccessDenied';

interface AdminSettings {
  groqApiKey: string;
  twoCheckoutSellerId: string;
  twoCheckoutSecretKey: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isAdmin: boolean;
}

interface SiteStats {
  totalUsers: number;
  totalGenerations: number;
  activeSubscriptions: number;
  blogPosts: number;
}

const AdminDashboard = () => {
  const { user, isLoading } = useRequireAuth('/admin-login');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [settings, setSettings] = useState<AdminSettings>({
    groqApiKey: '',
    twoCheckoutSellerId: '',
    twoCheckoutSecretKey: '',
    monthlyPrice: 5,
    yearlyPrice: 50,
    isAdmin: false
  });

  const [siteStats, setSiteStats] = useState<SiteStats>({
    totalUsers: 0,
    totalGenerations: 0,
    activeSubscriptions: 0,
    blogPosts: 0
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (settings) {
        setSettings(prev => ({ ...prev, ...settings }));
      }
      setIsLoadingSettings(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load admin settings",
        variant: "destructive"
      });
    }
  };

  const fetchSiteStats = async () => {
    try {
      const [users, generations, subscriptions, posts] = await Promise.all([
        supabase.from('profiles').select('count'),
        supabase.from('name_generations').select('count'),
        supabase.from('subscriptions').select('count').eq('status', 'active'),
        supabase.from('blog_posts').select('count')
      ]);

      setSiteStats({
        totalUsers: users.count || 0,
        totalGenerations: generations.count || 0,
        activeSubscriptions: subscriptions.count || 0,
        blogPosts: posts.count || 0
      });
      setIsLoadingStats(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load site statistics",
        variant: "destructive"
      });
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          groq_api_key: settings.groqApiKey,
          two_checkout_seller_id: settings.twoCheckoutSellerId,
          two_checkout_secret_key: settings.twoCheckoutSecretKey,
          monthly_price: settings.monthlyPrice,
          yearly_price: settings.yearlyPrice
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateSitemap = async () => {
    try {
      await supabase.functions.invoke('generate-sitemap');
      toast({
        title: "Success",
        description: "Sitemap generated successfully"
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error",
        description: "Failed to generate sitemap",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (!data?.is_admin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive"
          });
          navigate('/admin-login');
        } else {
          setSettings(prev => ({ ...prev, isAdmin: true }));
          loadSettings();
          fetchSiteStats();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/admin-login');
      }
    };

    checkAdminStatus();
  }, [user, navigate, toast]);

  if (isLoading || isLoadingSettings || isLoadingStats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-6xl">
            <AdminLoading />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!settings.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-6xl">
            <AccessDenied />
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
        <div className="page-container max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your application settings and content</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={generateSitemap} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="size-4" />
                Generate Sitemap
              </Button>
              <LogoutButton />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{siteStats.totalUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-5" />
                  Name Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{siteStats.totalGenerations}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{siteStats.activeSubscriptions}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5" />
                  Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{siteStats.blogPosts}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">GROQ API Key</label>
                <Input
                  type="password"
                  value={settings.groqApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, groqApiKey: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">2Checkout Seller ID</label>
                <Input
                  type="password"
                  value={settings.twoCheckoutSellerId}
                  onChange={(e) => setSettings(prev => ({ ...prev, twoCheckoutSellerId: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">2Checkout Secret Key</label>
                <Input
                  type="password"
                  value={settings.twoCheckoutSecretKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, twoCheckoutSecretKey: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Monthly Price ($)</label>
                <Input
                  type="number"
                  value={settings.monthlyPrice}
                  onChange={(e) => setSettings(prev => ({ ...prev, monthlyPrice: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Yearly Price ($)</label>
                <Input
                  type="number"
                  value={settings.yearlyPrice}
                  onChange={(e) => setSettings(prev => ({ ...prev, yearlyPrice: parseFloat(e.target.value) }))}
                />
              </div>

              <Button 
                onClick={saveSettings} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;