
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignIn = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) throw error;
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Google sign in failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <div className="w-full max-w-sm mx-auto space-y-6">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 font-medium relative"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <img src="/google.svg" alt="Google" className="absolute left-4 size-5" />
              Continue with Google
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                {...form.register('email')}
                className="pl-10 h-12"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...form.register('password')}
                className="pl-10 h-12"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-medium bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign up <ArrowRight className="inline size-4" />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
