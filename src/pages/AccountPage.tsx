
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AccountPage = () => {
  const { currentUser, updateProfilePic, logout } = useAuthContext();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5MB)");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Seules les images sont acceptées");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateProfilePic(event.target.result.toString());
        toast.success("Photo de profil mise à jour");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    toast.success('Vous avez été déconnecté');
  };

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Mon Compte</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24">
                {currentUser?.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser.username} />
                ) : (
                  <AvatarFallback className="text-lg">{currentUser?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <label 
                htmlFor="profile-pic" 
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 cursor-pointer hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span className="sr-only">Changer la photo de profil</span>
              </label>
              <input 
                type="file" 
                id="profile-pic" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <h2 className="text-xl font-semibold">{currentUser?.username}</h2>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
            <div className="pt-4">
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountPage;
