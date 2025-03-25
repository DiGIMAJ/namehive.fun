import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock } from 'lucide-react';
import * as z from 'zod';
import { Link } from 'react-router-dom';

// Form schema
const formSchema = z
  .object({
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string(),
    fullName: z.string().min(2, {
      message: 'Full name must be at least 2 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SignUp = () => {
  const { signUp, signUpWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(values.email, values.password, {
        full_name: values.fullName,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Account created',
        description: 'You have successfully signed up. Please check your email for verification.',
      });
      
      // Redirect to dashboard instead of home page
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      toast({
        title: 'Sign up failed',
        description: error.message || 'An error occurred during sign up.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      // Implement Google sign up logic here
      const { error } = await signUpWithGoogle(); // Assuming signUpWithGoogle is defined in useAuth
      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Google sign up failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your information below to create your account"
    >
      <div className="w-full max-w-sm mx-auto space-y-6">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 font-medium relative"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <img src="/google.svg" alt="Google" className="absolute left-4 h-5" />
              Continue with Google
            </>
          )}
        </Button>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 6 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
