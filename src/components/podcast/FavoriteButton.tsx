
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface FavoriteButtonProps {
  podcastName: string;
  description: string;
  niche: string;
}

const FavoriteButton = ({ podcastName, description, niche }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if this podcast is already a favorite
    const checkFavoriteStatus = async () => {
      if (!user) return;
      
      try {
        // Use type assertion to bypass TypeScript error
        const { data, error } = await (supabase
          .from('favorites') as any)
          .select('*')
          .eq('user_id', user.id)
          .eq('name', podcastName)
          .eq('type', 'podcast')
          .maybeSingle();
          
        if (error) throw error;
        
        setIsFavorite(!!data);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [user, podcastName]);

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await (supabase
          .from('favorites') as any)
          .delete()
          .eq('user_id', user.id)
          .eq('name', podcastName)
          .eq('type', 'podcast');
          
        if (error) throw error;
        
        toast({
          title: "Removed from Favorites",
          description: `"${podcastName}" has been removed from your favorites`
        });
        
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error } = await (supabase
          .from('favorites') as any)
          .insert({
            user_id: user.id,
            name: podcastName,
            description: description || niche,
            type: 'podcast',
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
        
        toast({
          title: "Added to Favorites",
          description: `"${podcastName}" has been added to your favorites`
        });
        
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={isFavorite ? "default" : "outline"} 
      size="sm" 
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center gap-1 ${isFavorite ? 'bg-red-500 hover:bg-red-600' : 'text-red-500 hover:text-red-600 hover:bg-red-50'}`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
      <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
    </Button>
  );
};

export default FavoriteButton;
