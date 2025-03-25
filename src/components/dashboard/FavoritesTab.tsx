
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';

interface Favorite {
  id: string;
  name: string;
  description: string;
  type: string;
  created_at: string;
}

const FavoritesTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Use type assertion to bypass TypeScript error
        const { data, error } = await (supabase
          .from('favorites') as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setFavorites(data || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast({
          title: "Error",
          description: "Failed to load favorites. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user, toast]);

  const handleDelete = async (id: string, name: string) => {
    try {
      // Use type assertion to bypass TypeScript error
      const { error } = await (supabase
        .from('favorites') as any)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setFavorites(favorites.filter(fav => fav.id !== id));
      
      toast({
        title: "Favorite Removed",
        description: `"${name}" has been removed from your favorites`
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove favorite. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getGeneratorLink = (type: string) => {
    switch (type) {
      case 'podcast':
        return '/podcast-name-generator';
      // Add more generator types as needed
      default:
        return '/generators';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 mb-4">You haven't saved any favorites yet</p>
        <Button onClick={() => navigate('/generators')}>
          Browse Generators
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">Your Favorites</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="p-4 flex items-center justify-between">
            <div className="flex-grow">
              <p className="font-medium">{favorite.name}</p>
              <p className="text-sm text-gray-500">
                {favorite.type.charAt(0).toUpperCase() + favorite.type.slice(1)} • {new Date(favorite.created_at).toLocaleDateString()}
              </p>
              {favorite.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{favorite.description}</p>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(getGeneratorLink(favorite.type))}
                className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(favorite.id, favorite.name)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesTab;
