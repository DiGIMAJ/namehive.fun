import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const generatorCategories = [
    { title: 'Business & Brand', path: '/business-brand' },
    { title: 'Personal & Social', path: '/personal-social' },
    { title: 'Writing & Creative', path: '/writing-creative' },
    { title: 'Tech Industry', path: '/tech-industry' },
    { title: 'Geographical & Local', path: '/geographical-local' },
    { title: 'Fantasy & Gaming', path: '/fantasy-gaming' },
    { title: 'Niche-Specific', path: '/niche-specific' },
    { title: 'Specialty & Fun', path: '/specialty-fun' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Logo variant="light" className="w-32 h-auto" />
            <p className="text-gray-400 text-sm mt-4">
              AI-powered name generator for all your needs
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Generators</h3>
            <ul className="space-y-2">
              {generatorCategories.slice(0, 4).map((category) => (
                <li key={category.path}>
                  <Link 
                    to={category.path} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Special Generators</h3>
            <ul className="space-y-2">
              {generatorCategories.slice(4).map((category) => (
                <li key={category.path}>
                  <Link 
                    to={category.path} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white/90 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-purple-400 transition-all-300 text-sm block py-1.5 hover:translate-x-1">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-purple-400 transition-all-300 text-sm block py-1.5 hover:translate-x-1">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-300 hover:text-purple-400 transition-all-300 text-sm block py-1.5 hover:translate-x-1">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-purple-400 transition-all-300 text-sm block py-1.5 hover:translate-x-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-purple-400 transition-all-300 text-sm block py-1.5 hover:translate-x-1">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-300 hover:text-purple-400 transition-all-300 text-sm block py-1.5 hover:translate-x-1">
                  Refund Policy
                </Link>
              </li>
              <li>
                <a href="mailto:info@namehive.fun" className="text-gray-300 hover:text-purple-400 transition-all-300 text-sm block py-1.5 hover:translate-x-1">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Name Hive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
