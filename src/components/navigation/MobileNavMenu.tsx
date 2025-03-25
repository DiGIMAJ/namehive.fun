import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const categoryLinks = [
  { to: "/generators", label: "All Generators" },
  { to: "/business-brand", label: "Business & Brand Names" },
  { to: "/personal-social", label: "Personal & Social Media" },
  { to: "/writing-creative", label: "Writing & Creative" },
  { to: "/niche-specific", label: "Niche-Specific" },
  { to: "/tech-industry", label: "Tech & Industry" },
  { to: "/geographical-local", label: "Geographical & Local" },
  { to: "/fantasy-gaming", label: "Fantasy & Gaming" },
  { to: "/specialty-fun", label: "Specialty & Fun" }
];

const MobileNavMenu = ({ isOpen, onClose, onSignOut }: MobileNavMenuProps) => {
  const { user } = useAuth();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <div 
      className={cn(
        "md:hidden fixed inset-x-0 bg-white/95 blur-backdrop shadow-md transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "top-16 h-auto opacity-100 visible" : "top-16 h-0 opacity-0 invisible"
      )}
    >
      <div className="py-4 px-6 flex flex-col space-y-4">
        <Link 
          to="/generators" 
          className="text-base font-medium py-2 text-gray-700 hover:text-purple-600"
          onClick={onClose}
        >
          All Generators
        </Link>

        <div>
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-500 uppercase tracking-wider px-2"
          >
            Categories
            <ChevronDown className={cn(
              "size-4 transition-transform duration-200",
              isCategoriesOpen ? "rotate-180" : ""
            )} />
          </button>
          <div className={cn(
            "pl-2 border-l border-gray-100 space-y-2 overflow-hidden transition-all duration-200",
            isCategoriesOpen ? "max-h-96 mt-2 opacity-100" : "max-h-0 opacity-0"
          )}>
            {categoryLinks.slice(1).map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-sm font-medium py-1 block text-gray-700 hover:text-purple-600"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <Link 
          to="/blog" 
          className="text-base font-medium py-2 text-gray-700 hover:text-purple-600"
          onClick={onClose}
        >
          Blog
        </Link>

        <a 
          href="#how-it-works" 
          className="text-base font-medium py-2 text-gray-700 hover:text-purple-600"
          onClick={onClose}
        >
          How It Works
        </a>

        <a 
          href="#faq" 
          className="text-base font-medium py-2 text-gray-700 hover:text-purple-600"
          onClick={onClose}
        >
          FAQ
        </a>

        <div className="border-t border-gray-100 pt-4 mt-2">
          {!user ? (
            <>
              <Link 
                to="/pricing" 
                className="text-base font-medium py-2 block text-gray-700 hover:text-purple-600"
                onClick={onClose}
              >
                Pricing
              </Link>
              <Link 
                to="/sign-in" 
                className="text-base font-medium py-2 block text-gray-700 hover:text-purple-600"
                onClick={onClose}
              >
                Sign In
              </Link>
              <Link 
                to="/sign-up" 
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 mt-2 inline-block"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className="text-base font-medium py-2 block text-gray-700 hover:text-purple-600"
                onClick={onClose}
              >
                Dashboard
              </Link>
              <Link 
                to="/subscription" 
                className="text-base font-medium py-2 block text-gray-700 hover:text-purple-600"
                onClick={onClose}
              >
                Subscription
              </Link>
              <button 
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="text-base font-medium py-2 block text-red-500 hover:text-red-600"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavMenu;