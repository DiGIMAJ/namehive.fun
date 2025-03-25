
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  BookOpen, 
  PlusCircle, 
  Cpu, 
  MapPin, 
  Gamepad2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
  delay?: string;
}

const CategoryCard = ({ icon, title, description, link, color, delay = '0s' }: CategoryCardProps) => {
  return (
    <Link to={link}>
      <div 
        className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group animate-fade-in-up h-full flex flex-col"
        style={{ animationDelay: delay }}
      >
        <div className={cn(
          "size-14 flex items-center justify-center rounded-xl mb-5 transition-all duration-300",
          color
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <Button 
          variant="ghost" 
          className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent group mt-auto w-fit"
        >
          <span className="flex items-center gap-1">
            Explore Category
            <Sparkles className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </Link>
  );
};

const CategorySection = () => {
  const categories = [
    {
      icon: <Briefcase className="size-7 text-blue-600" />,
      title: "Business & Brand Names",
      description: "Catchy, memorable names for businesses, startups, and brands",
      link: "/business-brand",
      color: "bg-blue-50",
      delay: "0.1s"
    },
    {
      icon: <User className="size-7 text-green-600" />,
      title: "Personal & Social Media",
      description: "Creative usernames for social platforms and personal branding",
      link: "/personal-social",
      color: "bg-green-50",
      delay: "0.2s"
    },
    {
      icon: <BookOpen className="size-7 text-purple-600" />,
      title: "Writing & Creative",
      description: "Inspiring names for books, bands, podcasts and creative projects",
      link: "/writing-creative",
      color: "bg-purple-50",
      delay: "0.3s"
    },
    {
      icon: <PlusCircle className="size-7 text-rose-600" />,
      title: "Niche-Specific",
      description: "Specialized names for restaurants, pets, fashion brands and more",
      link: "/niche-specific",
      color: "bg-rose-50",
      delay: "0.4s"
    },
    {
      icon: <Cpu className="size-7 text-amber-600" />,
      title: "Tech & Industry-Specific",
      description: "Professional names for tech startups, legal firms, and specialized businesses",
      link: "/tech-industry",
      color: "bg-amber-50",
      delay: "0.5s"
    },
    {
      icon: <MapPin className="size-7 text-sky-600" />,
      title: "Geographical & Local",
      description: "Location-based names for coffee shops, hotels, and local establishments",
      link: "/geographical-local",
      color: "bg-sky-50",
      delay: "0.6s"
    },
    {
      icon: <Gamepad2 className="size-7 text-indigo-600" />,
      title: "Fantasy & Gaming",
      description: "Epic names for characters, worlds, and gaming personas",
      link: "/fantasy-gaming",
      color: "bg-indigo-50",
      delay: "0.7s"
    },
    {
      icon: <Sparkles className="size-7 text-emerald-600" />,
      title: "Specialty & Fun",
      description: "Quirky and creative names for costumes, drag queens, and more",
      link: "/specialty-fun",
      color: "bg-emerald-50",
      delay: "0.8s"
    }
  ];

  return (
    <section id="categories" className="section-padding">
      <div className="page-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Categories</h2>
          <p className="text-xl text-gray-600">
            Find the perfect name generator for your specific needs
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
              link={category.link}
              color={category.color}
              delay={category.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
