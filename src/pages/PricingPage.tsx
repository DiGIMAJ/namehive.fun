
import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PricingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    if (!user) {
      navigate('/sign-in', { state: { returnTo: '/checkout', planType: plan } });
      return;
    }

    navigate('/checkout', { state: { planType: plan } });
  };

  const renderFeatureItem = (feature: string, included: boolean) => (
    <div className="flex items-center gap-2 py-2">
      {included ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
      )}
      <span className={included ? "text-gray-700" : "text-gray-400"}>{feature}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you and start generating perfect names
            </p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-10">
            <Tabs 
              defaultValue="monthly" 
              className="w-64"
              onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Anonymous Plan */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Anonymous</CardTitle>
                <CardDescription>For casual users</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">Free</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {renderFeatureItem('3 generations per day', true)}
                  {renderFeatureItem('All generators', true)}
                  {renderFeatureItem('No account required', true)}
                  {renderFeatureItem('Saved history', false)}
                  {renderFeatureItem('Priority support', false)}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Start Generating</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Free Account Plan */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Free Account</CardTitle>
                <CardDescription>For regular users</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">Free</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {renderFeatureItem('15 generations per day', true)}
                  {renderFeatureItem('All generators', true)}
                  {renderFeatureItem('Saved generation history', true)}
                  {renderFeatureItem('Email support', true)}
                  {renderFeatureItem('Priority support', false)}
                </div>
              </CardContent>
              <CardFooter>
                {user ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/generators">Start Generating</Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/sign-up">Create Account</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border-purple-200 bg-purple-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                MOST POPULAR
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>For power users</CardDescription>
                <div className="mt-4">
                  {billingPeriod === 'monthly' ? (
                    <>
                      <span className="text-3xl font-bold">$5</span>
                      <span className="text-gray-500">/month</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">$50</span>
                      <span className="text-gray-500">/year</span>
                      <div className="text-sm text-purple-600 font-medium mt-1">
                        Save $10 with annual billing
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {renderFeatureItem('Unlimited generations', true)}
                  {renderFeatureItem('All generators', true)}
                  {renderFeatureItem('Saved generation history', true)}
                  {renderFeatureItem('Priority support', true)}
                  {renderFeatureItem('Advanced customization', true)}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  onClick={() => handleSubscribe(billingPeriod)}
                >
                  {user ? 'Upgrade Now' : 'Sign Up & Subscribe'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What happens if I reach my daily limit?</h3>
                <p className="text-gray-600">
                  Once you reach your daily generation limit, you'll need to wait until the next day to generate more names. 
                  Alternatively, you can upgrade to our Premium plan for unlimited generations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your Premium subscription at any time. Your access will continue until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is there a limit to Premium users?</h3>
                <p className="text-gray-600">
                  While we advertise "unlimited" generations, we have a fair use policy with a soft cap of 750 generations per month to prevent abuse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
