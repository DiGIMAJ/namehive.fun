
import { BookOpen, PenTool, Music, Headphones, Sparkles, FileText, Film, Music2, BookMarked, PanelTop } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';
import { Link } from 'react-router-dom';

const WritingCreativePage = () => {
  const generators = [
    {
      title: "Book Title Generator",
      description: "Generates bestselling book title ideas.",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Pen Name Creator",
      description: "Helps writers find pseudonyms.",
      icon: PenTool,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Band Name Generator",
      description: "Ideal for musicians and bands.",
      icon: Music,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Podcast Name Generator",
      description: "Generates creative podcast titles.",
      icon: Headphones,
      color: "bg-purple-50 text-purple-600",
      path: "/ai-podcast-name-generator"
    },
    {
      title: "AI Blog Name Generator",
      description: "SEO-optimized blog name ideas.",
      icon: Sparkles,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Poetry Title Generator",
      description: "Creates unique poem titles.",
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Screenplay Name Generator",
      description: "Tailored for movie and TV scripts.",
      icon: Film,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Song Name Generator",
      description: "Helps musicians find song title ideas.",
      icon: Music2,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Fan Fiction Name Generator",
      description: "Perfect for online fan fiction writers.",
      icon: BookMarked,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    },
    {
      title: "Comic Book Name Generator",
      description: "Generates superhero and villain names.",
      icon: PanelTop,
      color: "bg-purple-50 text-purple-600",
      path: "/"
    }
  ];

  // Define the custom rendering function for generator cards
  const renderCustomGeneratorCard = (generator, defaultRender) => (
    <Link to={generator.path} className="block">
      {defaultRender(generator)}
    </Link>
  );

  return (
    <CategoryPage
      title="Writing & Creative Name Generators"
      description="Spark your creativity with perfect names for books, music, podcasts and more."
      icon={BookOpen}
      backgroundClass="bg-purple-50"
      generators={generators}
      renderGeneratorCard={renderCustomGeneratorCard}
    />
  );
};

export default WritingCreativePage;
