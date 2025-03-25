
import { User, Instagram, Youtube, Gamepad2, Twitter, BookOpen, Linkedin, Ghost, MessageCircle, Users } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const PersonalSocialPage = () => {
  const generators = [
    {
      title: "Username Generator Pro",
      description: "For Instagram, TikTok, and gaming platforms.",
      icon: User,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "YouTube Channel Name Generator",
      description: "Optimized for niche content creators.",
      icon: Youtube,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Twitch Name Creator",
      description: "Gamer-focused usernames for Twitch streamers.",
      icon: Gamepad2,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Twitter Handle Generator",
      description: "Unique Twitter/X username ideas.",
      icon: Twitter,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Fantasy Name Generator",
      description: "For RPGs, books, and fantasy content.",
      icon: Ghost,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Personal Blog Name Generator",
      description: "Custom blog names for influencers.",
      icon: BookOpen,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "LinkedIn Profile Name Generator",
      description: "Helps professionals create strong usernames.",
      icon: Linkedin,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Snapchat Username Creator",
      description: "Unique and trendy Snapchat handles.",
      icon: Ghost,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "TikTok Username Generator",
      description: "For viral branding on TikTok.",
      icon: Instagram,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Gaming Clan Name Generator",
      description: "Ideal for esports teams and gaming groups.",
      icon: Users,
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <CategoryPage
      title="Personal & Social Media Name Generators"
      description="Stand out with unique usernames and handles across all social platforms."
      icon={User}
      backgroundClass="bg-green-50"
      generators={generators}
    />
  );
};

export default PersonalSocialPage;
