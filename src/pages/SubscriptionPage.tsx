
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { checkSubscriptionStatus } from '@/services/checkoutService';
import { cancelSubscription } from '@/services/paymentService';
import { getRemainingUsage } from '@/services/usageTracker';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SubscriptionDetails {
  isActive: boolean;
  planType?: 'monthly' | 'yearly';
  expiresAt?: string;
}

const SubscriptionPage = () => {
  const { user } = useRequireAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const subscriptionData = await checkSubscriptionStatus(user.id);
        setSubscription(subscriptionData);
        
        const remaining = await getRemainingUsage();
        setUsageCount(remaining);
      } catch (error) {
        console.error('Error loading subscription data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const result = await cancelSubscription(user.id);
      
      if (result.success) {
        toast({
          title: "Subscription cancelled",
          description: "Your subscription has been cancelled but will remain active until the end of the billing period",
        });
        
        // Reload subscription data
        const subscriptionData = await checkSubscriptionStatus(user.id);
        setSubscription(subscriptionData);
      } else {
        toast({
          title: "Error",
          description: result.error || "There was an error cancelling your subscription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an unexpected error cancelling your subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowCancelDialog(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-3xl">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
        <div className="page-container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Subscription</h1>
            <p className="text-gray-600">Manage your subscription and billing information</p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Subscription Status</CardTitle>
                {subscription?.isActive ? (
                  <Badge className="bg-green-600">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </div>
              <CardDescription>Your current subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              {subscription?.isActive ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">
                      {subscription.planType === 'monthly' ? 'Monthly' : 'Yearly'} Premium Plan
                    </span>
                    <span className="text-gray-500">
                      ({subscription.planType === 'monthly' ? '$5/month' : '$50/year'})
                    </span>
                  </div>
                  
                  {subscription.expiresAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span>
                        Renews on {format(new Date(subscription.expiresAt), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded p-4 mt-4">
                    <h3 className="font-medium mb-2">Usage Information</h3>
                    <p>You have unlimited generations per day with your premium plan.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span>You don't have an active subscription</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-4 mt-4">
                    <h3 className="font-medium mb-2">Free Plan Limits</h3>
                    <p>You have {usageCount} generations remaining today.</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {subscription?.isActive ? (
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              ) : (
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/checkout">Upgrade to Premium</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about your subscription or billing, please don't hesitate to contact our support team.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleCancelSubscription}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
