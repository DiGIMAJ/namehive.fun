import * as React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

declare const AuthLayout: React.FC<AuthLayoutProps>;
export default AuthLayout;
