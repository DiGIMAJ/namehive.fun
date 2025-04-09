// Global type declarations for the project

// Declare module paths for TypeScript to recognize imports
declare module 'integrations/supabase/client' {
  import { createClient } from '@supabase/supabase-js';
  
  export const supabase: ReturnType<typeof createClient>;
}

declare module 'context/AuthContext' {
  import { ReactNode } from 'react';
  
  export interface AuthContextType {
    session: any | null;
    user: any | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string, metadata?: object) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
  }
  
  export const AuthProvider: React.FC<{ children: ReactNode }>;
  export const useAuth: () => AuthContextType;
}

declare module 'components/ui/use-toast' {
  import * as React from 'react';
  
  export interface ToastActionElement extends React.ReactElement {}
  
  export interface ToastProps {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: "default" | "destructive";
  }
  
  export function toast(props: Omit<ToastProps, "id">): {
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

declare module 'components/layout/AuthLayout' {
  import { ReactNode } from 'react';
  
  interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    footer?: ReactNode;
  }
  
  const AuthLayout: React.FC<AuthLayoutProps>;
  export default AuthLayout;
}

declare module 'components/ui/button' {
  import { ButtonHTMLAttributes } from 'react';
  
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  
  export const Button: React.ForwardRefExoticComponent<ButtonProps>;
}

declare module 'components/ui/input' {
  import { InputHTMLAttributes } from 'react';
  
  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
  
  export const Input: React.ForwardRefExoticComponent<InputProps>;
}

declare module 'components/ui/separator' {
  import { HTMLAttributes } from 'react';
  
  export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }
  
  export const Separator: React.ForwardRefExoticComponent<SeparatorProps>;
}
