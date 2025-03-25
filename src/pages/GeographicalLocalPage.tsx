
import { MapPin, Building, Cake, Building2, PlaneTakeoff, Home, Scissors, Podcast, Flower, Car } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const GeographicalLocalPage = () => {
  const generators = [
    {
      title: "City-Based Business Name Generator",
      description: "Generates names for local businesses.",
      icon: Building,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Coffee Shop Name Generator",
      description: "For small cafés and coffee houses.",
      icon: Building,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Bakery Name Generator",
      description: "Ideal for pastry shops and bakeries.",
      icon: Cake,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Hotel & Resort Name Generator",
      description: "For hospitality businesses.",
      icon: Building2,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Travel Agency Name Generator",
      description: "Helps travel agents find catchy names.",
      icon: PlaneTakeoff,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Real Estate Business Name Generator",
      description: "For property agencies and brokers.",
      icon: Home,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Barbershop Name Generator",
      description: "Trendy names for hair salons and barber shops.",
      icon: Scissors,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Tattoo Shop Name Generator",
      description: "Creative names for tattoo studios.",
      icon: Podcast,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Florist Business Name Generator",
      description: "Ideal for flower shop owners.",
      icon: Flower,
      color: "bg-sky-50 text-sky-600"
    },
    {
      title: "Car Wash Name Generator",
      description: "For auto detailing and cleaning businesses.",
      icon: Car,
      color: "bg-sky-50 text-sky-600"
    }
  ];

  return (
    <CategoryPage
      title="Geographical & Local Business Name Generators"
      description="Location-based names for cafés, hotels, shops, and other local establishments."
      icon={MapPin}
      backgroundClass="bg-sky-50"
      generators={generators}
    />
  );
};

export default GeographicalLocalPage;
