import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const SitemapPage = () => {
  const mainPages = [
    { title: 'Home', path: '/' },
    { title: 'Generators', path: '/generators' },
    { title: 'About', path: '/about' },
    { title: 'Pricing', path: '/pricing' },
    { title: 'Contact', path: '/contact' },
    { title: 'Blog', path: '/blog' },
  ];

  const nameGenerators = [
    { title: 'Pet Name Generator', path: '/ai-pet-name-generator' },
    { title: 'Podcast Name Generator', path: '/ai-podcast-name-generator' },
    { title: 'Random Name Generator', path: '/generator/random' },
    { title: 'Dog Name Generator', path: '/ai-dog-name-generator' },
    { title: 'Cat Name Generator', path: '/ai-cat-name-generator' },
    { title: 'Warrior Cat Name Generator', path: '/ai-warrior-cat-name-generator' },
    { title: 'Horse Name Generator', path: '/ai-horse-name-generator' },
  ];

  const categoryPages = [
    { title: 'Business & Brand', path: '/business-brand' },
    { title: 'Personal & Social', path: '/personal-social' },
    { title: 'Writing & Creative', path: '/writing-creative' },
    { title: 'Niche-Specific', path: '/niche-specific' },
    { title: 'Tech Industry', path: '/tech-industry' },
    { title: 'Geographical & Local', path: '/geographical-local' },
    { title: 'Fantasy & Gaming', path: '/fantasy-gaming' },
    { title: 'Specialty & Fun', path: '/specialty-fun' },
  ];

  const legalPages = [
    { title: 'Terms of Service', path: '/terms' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Refund Policy', path: '/refund-policy' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Sitemap</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Main Pages</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mainPages.map((page) => (
                    <li key={page.path}>
                      <Link to={page.path} className="text-purple-600 hover:text-purple-800 hover:underline">
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Name Generators</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nameGenerators.map((page) => (
                    <li key={page.path}>
                      <Link to={page.path} className="text-purple-600 hover:text-purple-800 hover:underline">
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Category Pages</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryPages.map((page) => (
                    <li key={page.path}>
                      <Link to={page.path} className="text-purple-600 hover:text-purple-800 hover:underline">
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Legal Pages</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {legalPages.map((page) => (
                    <li key={page.path}>
                      <Link to={page.path} className="text-purple-600 hover:text-purple-800 hover:underline">
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SitemapPage;
