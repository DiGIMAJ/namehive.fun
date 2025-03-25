
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

const AuthLayout = ({ children, title, subtitle, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Include the Navbar */}
      <Navbar />
      
      {/* Add spacing to account for the navbar */}
      <div className="h-24"></div>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
          
          {children}
          
          {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
