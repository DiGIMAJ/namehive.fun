
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

const SubscriptionSuccessPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Subscription Activated!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your premium subscription is now active and you can enjoy unlimited name generations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/generators">Start Generating</Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/subscription">View Subscription Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionSuccessPage;
