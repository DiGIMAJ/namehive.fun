
import { Sparkles, Skull, Crown, ChevronsRight, Anchor, ShieldAlert, Cpu, Axe, Cog, CircleOff } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const SpecialtyFunPage = () => {
  const generators = [
    {
      title: "Halloween Costume Name Generator",
      description: "For spooky and fun costume ideas.",
      icon: Skull,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Roller Derby Name Generator",
      description: "Creative derby team names.",
      icon: ChevronsRight,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Drag Queen Name Generator",
      description: "Fabulous and catchy stage names.",
      icon: Crown,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Cowboy Name Generator",
      description: "Western-themed name ideas.",
      icon: Axe,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Pirate Ship Name Generator",
      description: "Fun and adventurous ship names.",
      icon: Anchor,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Spy Name Generator",
      description: "Secret agent-style aliases.",
      icon: ShieldAlert,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Robot Name Generator",
      description: "For futuristic and AI-inspired names.",
      icon: Cpu,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Villain Name Generator",
      description: "Dark and sinister character names.",
      icon: CircleOff,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Steampunk Name Generator",
      description: "Victorian-era industrial-themed names.",
      icon: Cog,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Unicorn Name Generator",
      description: "Whimsical and magical name ideas.",
      icon: Sparkles,
      color: "bg-emerald-50 text-emerald-600"
    }
  ];

  return (
    <CategoryPage
      title="Specialty & Fun Name Generators"
      description="Creative and unique names for costumes, stage personas, and themed characters."
      icon={Sparkles}
      backgroundClass="bg-emerald-50"
      generators={generators}
    />
  );
};

export default SpecialtyFunPage;
