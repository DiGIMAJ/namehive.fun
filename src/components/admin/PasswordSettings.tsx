
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Save, Lock } from 'lucide-react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const PasswordSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePassword = async () => {
    if (!user) return;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // For admin user, we handle it slightly differently
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed",
      });
      
      // Clear the form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your administrator password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-white/70 border-purple-200"
            placeholder="Enter your current password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-white/70 border-purple-200"
            placeholder="Enter new password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white/70 border-purple-200"
            placeholder="Confirm new password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSavePassword} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Update Password"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordSettings;
