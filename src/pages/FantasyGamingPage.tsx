
import { Gamepad2, Swords, Umbrella, Skull, Rocket, Anchor, Bomb, Zap, Wand2, FlaskConical } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const FantasyGamingPage = () => {
  const generators = [
    {
      title: "RPG Character Name Generator",
      description: "Generates fantasy character names.",
      icon: Gamepad2,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Dungeons & Dragons Name Generator",
      description: "Perfect for tabletop RPG fans.",
      icon: Swords,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Elf Name Generator",
      description: "For fantasy and mythical characters.",
      icon: Umbrella,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Vampire Name Generator",
      description: "Gothic and dark-themed name ideas.",
      icon: Skull,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Sci-Fi Name Generator",
      description: "Futuristic name ideas for stories and games.",
      icon: Rocket,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Pirate Name Generator",
      description: "Fun and adventurous pirate names.",
      icon: Anchor,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Zombie Name Generator",
      description: "For horror-themed projects.",
      icon: Bomb,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Superhero Name Generator",
      description: "Hero and villain name ideas.",
      icon: Zap,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Wizard Name Generator",
      description: "Magic-based fantasy character names.",
      icon: Wand2,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Alien Name Generator",
      description: "Unique extraterrestrial name ideas.",
      icon: FlaskConical,
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <CategoryPage
      title="Fantasy & Gaming Name Generators"
      description="Epic names for RPG characters, fantasy worlds, and gaming personas."
      icon={Gamepad2}
      backgroundClass="bg-indigo-50"
      generators={generators}
    />
  );
};

export default FantasyGamingPage;
