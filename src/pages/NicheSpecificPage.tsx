import { PlusCircle, Utensils, Dog, Baby, Dumbbell, Shirt, Flame, Flower2, Car, CalendarDays, Cat, House, Sword } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const NicheSpecificPage = () => {
  const generators = [
    {
      title: "Restaurant Name Generator",
      description: "Ideal for food businesses and cafes.",
      icon: Utensils,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Pet Name Generator",
      description: "Generates unique pet names (cats, dogs, etc.).",
      icon: Dog,
      color: "bg-rose-50 text-rose-600",
      path: "/ai-pet-name-generator"
    },
    {
      title: "Dog Name Generator",
      description: "Find the perfect name for your canine companion.",
      icon: Dog,
      color: "bg-rose-50 text-rose-600",
      path: "/ai-dog-name-generator"
    },
    {
      title: "Cat Name Generator",
      description: "Discover unique and creative names for your feline friend.",
      icon: Cat,
      color: "bg-rose-50 text-rose-600",
      path: "/ai-cat-name-generator"
    },
    {
      title: "Horse Name Generator",
      description: "Generate perfect names for your equine companion.",
      icon: House,
      color: "bg-rose-50 text-rose-600",
      path: "/ai-horse-name-generator"
    },
    {
      title: "Warrior Cat Name Generator",
      description: "Create epic clan-based names for warrior cats.",
      icon: Sword,
      color: "bg-rose-50 text-rose-600",
      path: "/ai-warrior-cat-name-generator"
    },
    {
      title: "Baby Name Finder",
      description: "Helps parents discover trending baby names.",
      icon: Baby,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Fitness Brand Name Generator",
      description: "Perfect for gyms and fitness influencers.",
      icon: Dumbbell,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Fashion Brand Name Creator",
      description: "For clothing brands and boutiques.",
      icon: Shirt,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Candle Business Name Generator",
      description: "For handmade candle brands.",
      icon: Flame,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Jewelry Brand Name Generator",
      description: "For jewelers and accessory brands.",
      icon: Flower2,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Car Dealership Name Generator",
      description: "Focused on auto sales businesses.",
      icon: Car,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Photography Business Name Generator",
      description: "For freelance photographers and studios.",
      icon: PlusCircle,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Event Planning Business Name Generator",
      description: "Ideal for wedding and event planners.",
      icon: CalendarDays,
      color: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <CategoryPage
      title="Niche-Specific Name Generators"
      description="Specialized name generators for restaurants, pets, fashion brands, and more."
      icon={PlusCircle}
      backgroundClass="bg-rose-50"
      generators={generators}
    />
  );
};

export default NicheSpecificPage;
