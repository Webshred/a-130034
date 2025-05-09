
import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const ProfileImageUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, updateProfilePic } = useAuthContext();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };
  
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="relative">
      <Avatar className="h-8 w-8">
        {currentUser?.profilePic ? (
          <AvatarImage src={currentUser.profilePic} alt={currentUser.username} />
        ) : (
          <AvatarFallback>{currentUser?.username ? getInitials(currentUser.username) : 'RW'}</AvatarFallback>
        )}
      </Avatar>
      <button 
        onClick={handlePlusClick}
        className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <Plus className="h-3 w-3" />
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileImageUpload;
