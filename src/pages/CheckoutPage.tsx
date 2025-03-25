
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { process2CheckoutPayment, CheckoutFormData } from '@/services/checkoutService';
import { Check, CreditCard, ShieldCheck } from 'lucide-react';

interface LocationState {
  planType?: 'monthly' | 'yearly';
}

const CheckoutPage = () => {
  const { user } = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const locationState = location.state as LocationState;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>(locationState?.planType || 'monthly');
  const [formData, setFormData] = useState<CheckoutFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    country: 'US',
    postalCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with your purchase",
        variant: "destructive"
      });
      navigate('/sign-in', { state: { returnTo: '/checkout', planType } });
      return;
    }
    
    // Simple validation
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await process2CheckoutPayment(user.id, planType, formData);
      
      if (result.success) {
        toast({
          title: "Payment successful!",
          description: "Your subscription has been activated",
        });
        navigate('/subscription-success');
      } else {
        toast({
          title: "Payment failed",
          description: result.error || "There was an error processing your payment",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment error",
        description: "There was an unexpected error processing your payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setFormData(prev => ({ ...prev, expiryDate: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your purchase to start generating unlimited names</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>Enter your payment details securely</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {/* Plan Selection */}
                    <div className="mb-6">
                      <Tabs 
                        value={planType} 
                        onValueChange={(value) => setPlanType(value as 'monthly' | 'yearly')}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="monthly">Monthly ($5)</TabsTrigger>
                          <TabsTrigger value="yearly">Yearly ($50)</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    {/* Card Details */}
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        placeholder="John Smith"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="4111 1111 1111 1111"
                        value={formData.cardNumber}
                        onChange={formatCardNumber}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={formatExpiryDate}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Billing Address */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={formData.country} onValueChange={handleCountryChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          placeholder="12345"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      Your payment is secure and encrypted
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Pay ${planType === 'monthly' ? '$5' : '$50'}`}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {planType === 'monthly' ? 'Monthly' : 'Yearly'} Premium Plan
                      </span>
                      <span>{planType === 'monthly' ? '$5.00' : '$50.00'}</span>
                    </div>
                    {planType === 'yearly' && (
                      <div className="flex justify-between text-green-600">
                        <span>Savings</span>
                        <span>$10.00</span>
                      </div>
                    )}
                    <div className="border-t pt-4 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{planType === 'monthly' ? '$5.00' : '$50.00'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold">You'll get:</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Unlimited generations</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Access to all generators</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Saved generation history</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Priority support</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Cancel anytime</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
