
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShoppingBag, 
  Globe, 
  User, 
  BookOpen, 
  Code,
  Gamepad2,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GeneratorCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: string;
}

const GeneratorCard = ({ icon, title, description, color, delay = '0s' }: GeneratorCardProps) => {
  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className={cn(
        "size-14 flex items-center justify-center rounded-xl mb-5 transition-all duration-300",
        color
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        variant="ghost" 
        className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent group"
        asChild
      >
        <Link to="/generator/random" className="flex items-center gap-1">
          Try Generator
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
};

const GeneratorsSection = () => {
  const generators = [
    {
      icon: <Building2 className="size-7 text-blue-600" />,
      title: "Business Name Generator",
      description: "Create professional, brandable names for your company or startup.",
      color: "bg-blue-50",
      delay: "0.1s"
    },
    {
      icon: <ShoppingBag className="size-7 text-green-600" />,
      title: "Product Name Generator",
      description: "Generate catchy, marketable names for your products and services.",
      color: "bg-green-50",
      delay: "0.2s"
    },
    {
      icon: <Globe className="size-7 text-purple-600" />,
      title: "Domain Name Generator",
      description: "Find available, memorable domains for your online presence.",
      color: "bg-purple-50",
      delay: "0.3s"
    },
    {
      icon: <User className="size-7 text-rose-600" />,
      title: "Character Name Generator",
      description: "Create unique names for characters in your stories and games.",
      color: "bg-rose-50",
      delay: "0.4s"
    },
    {
      icon: <BookOpen className="size-7 text-amber-600" />,
      title: "Book Title Generator",
      description: "Craft compelling titles for books, articles, and blog posts.",
      color: "bg-amber-50",
      delay: "0.5s"
    },
    {
      icon: <Code className="size-7 text-sky-600" />,
      title: "App Name Generator",
      description: "Find the perfect name for your mobile app or software product.",
      color: "bg-sky-50",
      delay: "0.6s"
    },
    {
      icon: <Gamepad2 className="size-7 text-indigo-600" />,
      title: "Game Name Generator",
      description: "Generate exciting names for video games and gaming channels.",
      color: "bg-indigo-50",
      delay: "0.7s"
    },
    {
      icon: <MessageSquare className="size-7 text-emerald-600" />,
      title: "Username Generator",
      description: "Create unique, available usernames for social media and forums.",
      color: "bg-emerald-50",
      delay: "0.8s"
    }
  ];

  return (
    <section id="generators" className="section-padding">
      <div className="page-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Name Generators</h2>
          <p className="text-xl text-gray-600">
            Specialized tools to help you find the perfect name for any purpose.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {generators.map((generator, index) => (
            <GeneratorCard
              key={index}
              icon={generator.icon}
              title={generator.title}
              description={generator.description}
              color={generator.color}
              delay={generator.delay}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/generators" className="flex items-center gap-2">
              View All Generators
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GeneratorsSection;
