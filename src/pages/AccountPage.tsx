
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { EditableField } from '@/components/ui/editable-field';

interface UserProfile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

const AccountPage = () => {
  const { currentUser, updateProfilePic, logout } = useAuthContext();
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: currentUser?.username?.split(' ')[0] || '',
    lastName: currentUser?.username?.split(' ')[1] || '',
    jobTitle: 'Product Designer',
    location: 'Los Angeles, California, USA',
    email: 'user@example.com',
    phone: '(213) 555-1234',
    bio: 'Product Designer',
    country: 'United States of America',
    cityState: 'California, USA',
    postalCode: 'ERT 62574',
    taxId: 'AS564178969',
  });
  
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

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    toast.success(`${field} updated successfully`);
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">My Profile</h1>
        
        {/* Profile Card */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  {currentUser?.profilePic ? (
                    <AvatarImage src={currentUser.profilePic} alt={currentUser.username} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label 
                  htmlFor="profile-pic" 
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-300 cursor-pointer hover:bg-gray-100"
                >
                  <Pencil className="h-3 w-3" />
                  <span className="sr-only">Change profile picture</span>
                </label>
                <input 
                  type="file" 
                  id="profile-pic" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-medium text-gray-800">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-gray-600">{profile.jobTitle}</p>
                    <p className="text-gray-500 text-sm">{profile.location}</p>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      // Edit main profile info
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Personal Information */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Personal information</CardTitle>
            <button className="text-gray-500 hover:text-gray-700">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">First Name</p>
                <p className="text-gray-800">{profile.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">Last Name</p>
                <p className="text-gray-800">{profile.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">Email address</p>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">Phone</p>
                <p className="text-gray-800">{profile.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-normal text-gray-500 mb-1">Bio</p>
                <p className="text-gray-800">{profile.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Address Information */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Address</CardTitle>
            <button className="text-gray-500 hover:text-gray-700">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">Country</p>
                <p className="text-gray-800">{profile.country}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">City/State</p>
                <p className="text-gray-800">{profile.cityState}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">Postal Code</p>
                <p className="text-gray-800">{profile.postalCode}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-500 mb-1">TAX ID</p>
                <p className="text-gray-800">{profile.taxId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Logout Button */}
        <div className="mt-8">
          <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
            Se déconnecter
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountPage;
