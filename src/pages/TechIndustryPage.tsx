
import { Cpu, Smartphone, Sparkles, Scale, Stethoscope, Cog, Laptop, Atom, FlaskConical, Shield } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const TechIndustryPage = () => {
  const generators = [
    {
      title: "Software & App Name Generator",
      description: "AI-powered names for apps and software.",
      icon: Smartphone,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Crypto & NFT Name Generator",
      description: "Focused on Web3 projects.",
      icon: Cpu,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "AI Startup Name Generator",
      description: "Names for AI-driven businesses.",
      icon: Sparkles,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Legal Firm Name Generator",
      description: "Helps law firms find professional names.",
      icon: Scale,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Medical Practice Name Generator",
      description: "For clinics, doctors, and wellness centers.",
      icon: Stethoscope,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Engineering Firm Name Generator",
      description: "Tailored for technical companies.",
      icon: Cog,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Tech Startup Name Generator",
      description: "Trendy names for tech ventures.",
      icon: Laptop,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "VR & AR Name Generator",
      description: "Names for virtual and augmented reality projects.",
      icon: Cpu,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Biotech Company Name Generator",
      description: "For health and science startups.",
      icon: FlaskConical,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Cybersecurity Business Name Generator",
      description: "Names for security-based brands.",
      icon: Shield,
      color: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <CategoryPage
      title="Tech & Industry-Specific Name Generators"
      description="Professional names for software, legal firms, medical practices and specialized industries."
      icon={Cpu}
      backgroundClass="bg-amber-50"
      generators={generators}
    />
  );
};

export default TechIndustryPage;
