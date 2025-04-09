// This file provides TypeScript with declarations for path aliases

// UI Components
declare module '@/components/ui/button' {
  import * as React from 'react';
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
}

declare module '@/components/ui/input' {
  import * as React from 'react';
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
}

declare module '@/components/ui/separator' {
  import * as React from 'react';
  export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }
  export const Separator: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLDivElement>>;
}

declare module '@/components/ui/use-toast' {
  import * as React from 'react';
  
  export interface ToastActionElement extends React.ReactElement {}
  
  export interface ToastProps {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: 'default' | 'destructive';
  }
  
  export function toast(props: Omit<ToastProps, 'id'>): {
    id: string;
    dismiss: () => void;
    update: (props: ToastProps) => void;
  };
  
  export function useToast(): {
    toast: typeof toast;
    dismiss: (toastId?: string) => void;
    toasts: ToastProps[];
  };
}

// Layout Components
declare module '@/components/layout/AuthLayout' {
  import * as React from 'react';
  
  interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    footer?: React.ReactNode;
  }
  
  const AuthLayout: React.FC<AuthLayoutProps>;
  export default AuthLayout;
}

// Context
declare module '@/context/AuthContext' {
  import * as React from 'react';
  import { Session, User } from '@supabase/supabase-js';
  
  export interface AuthContextType {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string, metadata?: object) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
  }
  
  export const AuthProvider: React.FC<{ children: React.ReactNode }>;
  export const useAuth: () => AuthContextType;
}

// Integrations
declare module '@/integrations/supabase/client' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  // Define a generic Database type that will be replaced by the actual Database type
  interface Database {}
  
  export const supabase: SupabaseClient<Database>;
}
