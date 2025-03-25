
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';
import DesktopNav from '../navigation/DesktopNav';
import MobileNav from '../navigation/MobileNav';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, CreditCard, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all-300',
        isScrolled
          ? 'py-3 bg-white/90 shadow-sm blur-backdrop'
          : 'py-6 bg-transparent'
      )}
    >
      <div className="page-container">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/pricing">
                  <Button variant="outline" className="text-gray-700 hover:text-purple-700">
                    Pricing
                  </Button>
                </Link>
                <Link to="/sign-in">
                  <Button variant="ghost" className="text-gray-700 hover:text-purple-700">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/pricing">
                  <Button variant="outline" className="text-gray-700 hover:text-purple-700">
                    Pricing
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="flex items-center justify-center h-full w-full bg-purple-100 rounded-full">
                        <User className="h-5 w-5 text-purple-700" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-gray-700 font-medium">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-gray-700">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/subscription')} className="text-gray-700">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Subscription</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <MobileNav />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
