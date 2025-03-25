
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/layout/AuthLayout';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have access token in the URL (from password reset email)
    const checkForResetToken = async () => {
      const hash = window.location.hash;
      if (!hash) return;
    };

    checkForResetToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;
      
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now sign in with your new password.",
      });
      
      // Redirect to sign in page
      navigate('/sign-in');
    } catch (error: any) {
      toast({
        title: "Error resetting password",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Set new password"
      subtitle="Your new password must be different from previously used passwords"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 py-6"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 py-6"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full py-6 text-base bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Resetting password..." : "Reset password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
