
import { Briefcase, ShoppingBag, Globe, Building2, Sparkles, Database, Lightbulb, Crown, Leaf, Hammer } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const BusinessBrandPage = () => {
  const generators = [
    {
      title: "AI Business Name Generator",
      description: "Helps startups generate unique, AI-driven business names.",
      icon: Sparkles,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Ecommerce Store Name Generator",
      description: "Optimized for Shopify, Etsy, and Amazon sellers.",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Domain Name Finder",
      description: "Suggests available domains with SEO-friendly keywords.",
      icon: Globe,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Startup Name Generator",
      description: "Focused on trendy, modern startup names.",
      icon: Lightbulb,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Catchy Brand Name Generator",
      description: "Helps create memorable and marketable brand names.",
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "SaaS Name Generator",
      description: "Tailored for Software-as-a-Service businesses.",
      icon: Database,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Consulting Firm Name Generator",
      description: "Ideal for business consultants and agencies.",
      icon: Building2,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Luxury Brand Name Generator",
      description: "High-end, sophisticated business name ideas.",
      icon: Crown,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Green Business Name Generator",
      description: "Focused on eco-friendly brands.",
      icon: Leaf,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Handmade Business Name Generator",
      description: "For artisans and handmade product sellers.",
      icon: Hammer,
      color: "bg-blue-50 text-blue-600"
    }
  ];

  return (
    <CategoryPage
      title="Business & Brand Name Generators"
      description="Create professional, catchy, and memorable names for your business ventures."
      icon={Briefcase}
      backgroundClass="bg-blue-50"
      generators={generators}
    />
  );
};

export default BusinessBrandPage;
