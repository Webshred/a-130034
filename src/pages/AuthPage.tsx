
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Lock, UserPlus, LogIn, Mail, Phone, MapPin } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  
  // Signup form fields
  const [signupUsername, setSignupUsername] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<string>('login');
  
  const navigate = useNavigate();
  const { login, signup } = useAuthContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginUsername || !loginPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const success = login(loginUsername, loginPassword);
    
    if (success) {
      toast.success('Connexion réussie');
      navigate('/');
    } else {
      toast.error('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupUsername || !signupPassword || !signupConfirmPassword || 
        !firstName || !lastName || !email || !phone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    const success = signup(signupUsername, signupPassword, {
      firstName,
      lastName,
      email,
      phone,
      address
    });
    
    if (success) {
      toast.success('Compte créé avec succès');
      navigate('/');
    } else {
      toast.error('Ce nom d\'utilisateur est déjà utilisé');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" width="60" height="60" className="text-blue-600">
              <path fill="currentColor" d="M19.5,6c-1.3-1.3-3-2-4.8-2c-1.8,0-3.5,0.7-4.8,2L8.5,7.3l1.4,1.4l1.4-1.4c1.7-1.7,4.3-1.7,6,0c1.7,1.7,1.7,4.3,0,6l-1.4,1.4l1.4,1.4l1.4-1.4C20.2,13,21,11.3,21,9.5C21,8.1,20.4,6.9,19.5,6z M15.5,11.7L10.3,16.9c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4l5.2-5.2c0.4-0.4,1-0.4,1.4,0S15.8,11.3,15.5,11.7z M7.5,15.5c-1.7-1.7-1.7-4.3,0-6c0.8-0.8,1.8-1.2,2.8-1.2c1,0,2.1,0.4,2.8,1.2l1.4,1.4l1.4-1.4l-1.4-1.4c-1.3-1.3-3-2-4.8-2c-1.8,0-3.5,0.7-4.8,2C3.6,9.5,3,11.2,3,13c0,1.8,0.7,3.5,2,4.8l1.4,1.4l1.4-1.4L7.5,15.5z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Bienvenue chez RWS</h2>
          <p className="text-gray-600">Connectez-vous pour accéder au tableau de bord</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Inscription
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      className="pl-10" 
                      placeholder="Nom d'utilisateur"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      className="pl-10" 
                      type="password" 
                      placeholder="Mot de passe"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-agri-primary hover:bg-agri-primary/90">
                  Se connecter
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      className="pl-10" 
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      className="pl-10" 
                      placeholder="Nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Nom d'utilisateur"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Adresse (optionnelle)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    type="password" 
                    placeholder="Mot de passe"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    type="password" 
                    placeholder="Confirmer le mot de passe"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-agri-primary hover:bg-agri-primary/90">
                  S'inscrire
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
