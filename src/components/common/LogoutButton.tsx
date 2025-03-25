
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ variant = "ghost", size = "sm", ...props }: ButtonProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogout}
      className="flex items-center gap-2"
      {...props}
    >
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </Button>
  );
};

export default LogoutButton;
