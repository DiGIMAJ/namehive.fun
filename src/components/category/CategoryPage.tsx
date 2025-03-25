
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export interface Generator {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  delay?: string;
  path?: string;
}

interface CategoryPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  backgroundClass: string;
  generators: Generator[];
  renderGeneratorCard?: (generator: Generator, defaultRender: (generator: Generator) => React.ReactNode) => React.ReactNode;
}

const GeneratorCard = ({ title, description, icon: Icon, color, delay = '0s', path }: Generator) => {
  const cardContent = (
    <div 
      className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className={cn(
        "size-14 flex items-center justify-center rounded-xl mb-5 transition-all duration-300",
        color
      )}>
        <Icon className="size-7" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        variant="ghost" 
        className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent group"
      >
        <span className="flex items-center gap-1">
          Try Generator
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Button>
    </div>
  );

  if (path) {
    return (
      <Link to={path} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

const CategoryPage = ({ 
  title, 
  description, 
  icon: Icon, 
  backgroundClass, 
  generators,
  renderGeneratorCard
}: CategoryPageProps) => {
  
  // Default generator card rendering function
  const defaultGeneratorCard = (generator: Generator) => (
    <GeneratorCard
      key={generator.title}
      title={generator.title}
      description={generator.description}
      icon={generator.icon}
      color={generator.color}
      delay={generator.delay}
      path={generator.path}
    />
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className={cn("pt-32 pb-20 relative overflow-hidden", backgroundClass)}>
          <div className="page-container relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className={cn(
                  "size-20 flex items-center justify-center rounded-2xl mb-4 md:mb-0",
                  backgroundClass === "bg-blue-50" ? "bg-blue-100 text-blue-600" : 
                  backgroundClass === "bg-green-50" ? "bg-green-100 text-green-600" :
                  backgroundClass === "bg-purple-50" ? "bg-purple-100 text-purple-600" :
                  backgroundClass === "bg-rose-50" ? "bg-rose-100 text-rose-600" :
                  backgroundClass === "bg-amber-50" ? "bg-amber-100 text-amber-600" :
                  backgroundClass === "bg-sky-50" ? "bg-sky-100 text-sky-600" :
                  backgroundClass === "bg-indigo-50" ? "bg-indigo-100 text-indigo-600" :
                  "bg-emerald-100 text-emerald-600"
                )}>
                  <Icon className="size-10" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>
                  <p className="text-xl text-gray-600 mt-2">{description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <Button asChild>
                  <Link to="/">Home</Link>
                </Button>
                <Button variant="outline">
                  <Link to="/#categories">All Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Generators Grid */}
        <section className="section-padding">
          <div className="page-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generators.map((generator, index) => {
                // If custom rendering function is provided, use it
                if (renderGeneratorCard) {
                  return (
                    <div key={index}>
                      {renderGeneratorCard(generator, defaultGeneratorCard)}
                    </div>
                  );
                }
                
                // Otherwise use the default card
                return (
                  <GeneratorCard
                    key={index}
                    title={generator.title}
                    description={generator.description}
                    icon={generator.icon}
                    color={generator.color}
                    delay={`0.${index + 1}s`}
                    path={generator.path}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
