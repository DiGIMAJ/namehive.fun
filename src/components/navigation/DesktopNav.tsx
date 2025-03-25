
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CategoryDropdown from './CategoryDropdown';

const DesktopNav = () => {
  const { user } = useAuth();
  
  return (
    <div className="hidden md:flex items-center gap-8">
      <ul className="flex items-center gap-6">
        <li>
          <Link 
            to="/generators" 
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-all-300"
          >
            All Generators
          </Link>
        </li>
        <li className="relative group">
          <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-purple-600 transition-all-300">
            Categories
            <ChevronDown className="size-4 opacity-70" />
          </button>
          <CategoryDropdown />
        </li>
        <li>
          <Link 
            to="/blog" 
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-all-300"
          >
            Blog
          </Link>
        </li>
        <li>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-all-300"
          >
            How It Works
          </a>
        </li>
        <li>
          <a 
            href="#faq" 
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-all-300"
          >
            FAQ
          </a>
        </li>
      </ul>
    </div>
  );
};

export default DesktopNav;
