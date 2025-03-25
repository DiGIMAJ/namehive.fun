
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/layout/AuthLayout';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the password reset link.",
      });
      setIsSubmitted(true);
    } catch (error: any) {
      toast({
        title: "Error sending reset email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={isSubmitted ? "Check your email" : "Reset your password"}
      subtitle={
        isSubmitted
          ? `We've sent a password reset link to ${email}`
          : "Enter your email address and we'll send you a link to reset your password"
      }
      footer={
        <div className="flex justify-center">
          <Link to="/sign-in" className="flex items-center text-purple-600 hover:underline font-medium">
            <ArrowLeft className="mr-2 size-4" />
            Back to sign in
          </Link>
        </div>
      }
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-6"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full py-6 text-base bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>
      ) : (
        <div className="space-y-6 text-center">
          <p className="text-gray-600">
            Didn't receive the email? Check your spam folder or request another link.
          </p>
          
          <Button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-6 text-base bg-purple-600 hover:bg-purple-700 text-white"
          >
            Resend reset link
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
