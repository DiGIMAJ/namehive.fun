
import { Link } from 'react-router-dom';
import { LucideIcon, Building2, ShoppingBag, Globe, User, BookOpen, Code, Gamepad2, MessageSquare, PlusCircle, Cpu, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GeneratorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category: string;
  delay?: string;
}

const GeneratorCard = ({ icon: Icon, title, description, color, category, delay = '0s' }: GeneratorCardProps) => {
  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-md group animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-between items-start mb-5">
        <div className={cn(
          "size-14 flex items-center justify-center rounded-xl",
          color
        )}>
          <Icon className="size-7" />
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category}</span>
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
};

const GeneratorsPage = () => {
  const allGenerators = [
    // Business & Brand
    {
      title: "AI Business Name Generator",
      description: "Helps startups generate unique, AI-driven business names.",
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      category: "Business & Brand",
      delay: "0.1s"
    },
    {
      title: "Ecommerce Store Name Generator",
      description: "Optimized for Shopify, Etsy, and Amazon sellers.",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      category: "Business & Brand",
      delay: "0.2s"
    },
    {
      title: "Domain Name Finder",
      description: "Suggests available domains with SEO-friendly keywords.",
      icon: Globe,
      color: "bg-blue-50 text-blue-600",
      category: "Business & Brand",
      delay: "0.3s"
    },
    {
      title: "Startup Name Generator",
      description: "Focused on trendy, modern startup names.",
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      category: "Business & Brand",
      delay: "0.4s"
    },
    {
      title: "Catchy Brand Name Generator",
      description: "Helps create memorable and marketable brand names.",
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      category: "Business & Brand",
      delay: "0.5s"
    },
    // Personal & Social Media
    {
      title: "Username Generator Pro",
      description: "For Instagram, TikTok, and gaming platforms.",
      icon: User,
      color: "bg-green-50 text-green-600",
      category: "Personal & Social",
      delay: "0.2s"
    },
    {
      title: "YouTube Channel Name Generator",
      description: "Optimized for niche content creators.",
      icon: User,
      color: "bg-green-50 text-green-600",
      category: "Personal & Social",
      delay: "0.3s"
    },
    {
      title: "Twitch Name Creator",
      description: "Gamer-focused usernames for Twitch streamers.",
      icon: User,
      color: "bg-green-50 text-green-600",
      category: "Personal & Social",
      delay: "0.4s"
    },
    // Writing & Creative
    {
      title: "Book Title Generator",
      description: "Generates bestselling book title ideas.",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
      category: "Writing & Creative",
      delay: "0.3s"
    },
    {
      title: "Pen Name Creator",
      description: "Helps writers find pseudonyms.",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
      category: "Writing & Creative",
      delay: "0.4s"
    },
    {
      title: "Band Name Generator",
      description: "Ideal for musicians and bands.",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
      category: "Writing & Creative",
      delay: "0.5s"
    },
    // Niche-Specific
    {
      title: "Restaurant Name Generator",
      description: "Ideal for food businesses and cafes.",
      icon: PlusCircle,
      color: "bg-rose-50 text-rose-600",
      category: "Niche-Specific",
      delay: "0.4s"
    },
    {
      title: "Pet Name Generator",
      description: "Generates unique pet names (cats, dogs, etc.).",
      icon: PlusCircle,
      color: "bg-rose-50 text-rose-600",
      category: "Niche-Specific",
      delay: "0.5s"
    },
    // Tech & Industry-Specific
    {
      title: "Software & App Name Generator",
      description: "AI-powered names for apps and software.",
      icon: Cpu,
      color: "bg-amber-50 text-amber-600",
      category: "Tech & Industry",
      delay: "0.5s"
    },
    {
      title: "Crypto & NFT Name Generator",
      description: "Focused on Web3 projects.",
      icon: Cpu,
      color: "bg-amber-50 text-amber-600",
      category: "Tech & Industry",
      delay: "0.6s"
    },
    // Geographical & Local Business
    {
      title: "City-Based Business Name Generator",
      description: "Generates names for local businesses.",
      icon: MapPin,
      color: "bg-sky-50 text-sky-600",
      category: "Geographical & Local",
      delay: "0.6s"
    },
    {
      title: "Coffee Shop Name Generator",
      description: "For small cafés and coffee houses.",
      icon: MapPin,
      color: "bg-sky-50 text-sky-600",
      category: "Geographical & Local",
      delay: "0.7s"
    },
    // Fantasy & Gaming
    {
      title: "RPG Character Name Generator",
      description: "Generates fantasy character names.",
      icon: Gamepad2,
      color: "bg-indigo-50 text-indigo-600",
      category: "Fantasy & Gaming",
      delay: "0.7s"
    },
    {
      title: "Dungeons & Dragons Name Generator",
      description: "Perfect for tabletop RPG fans.",
      icon: Gamepad2,
      color: "bg-indigo-50 text-indigo-600",
      category: "Fantasy & Gaming",
      delay: "0.8s"
    },
    // Specialty & Fun
    {
      title: "Halloween Costume Name Generator",
      description: "For spooky and fun costume ideas.",
      icon: Sparkles,
      color: "bg-emerald-50 text-emerald-600",
      category: "Specialty & Fun",
      delay: "0.8s"
    },
    {
      title: "Roller Derby Name Generator",
      description: "Creative derby team names.",
      icon: Sparkles,
      color: "bg-emerald-50 text-emerald-600",
      category: "Specialty & Fun",
      delay: "0.9s"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gray-50 relative">
          <div className="page-container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                All Name Generators
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Browse our complete collection of name generators for every purpose
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button asChild>
                  <Link to="/">Home</Link>
                </Button>
                <Button variant="outline">
                  <Link to="/generator/random">Random Generator</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Generators Grid */}
        <section className="py-16 md:py-24">
          <div className="page-container">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse All Generators</h2>
              <p className="text-gray-600">Find the perfect name generator for your specific needs</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allGenerators.map((generator, index) => (
                <GeneratorCard
                  key={index}
                  title={generator.title}
                  description={generator.description}
                  icon={generator.icon}
                  color={generator.color}
                  category={generator.category}
                  delay={generator.delay}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-4">Need a specific name generator?</p>
              <Button>
                <Link to="/generator/random">Try Our Random Generator</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GeneratorsPage;
