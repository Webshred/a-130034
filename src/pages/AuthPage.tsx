
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { currentUser, login, signup } = useAuthContext();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [signupError, setSignupError] = useState('');
  
  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginUsername || !loginPassword) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }
    
    const success = login(loginUsername, loginPassword);
    
    if (success) {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes connecté avec succès",
      });
      navigate('/');
    } else {
      setLoginError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (!signupUsername || !signupPassword || !confirmPassword || !email) {
      setSignupError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setSignupError('Les mots de passe ne correspondent pas');
      return;
    }
    
    const success = signup(signupUsername, signupPassword, {
      email: email,
      firstName: fullName.split(' ')[0] || '',
      lastName: fullName.split(' ').slice(1).join(' ') || '',
      phone: phone,
      address: address,
    });
    
    if (success) {
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
        variant: "success"
      });
      setActiveTab("login");
    } else {
      setSignupError('Ce nom d\'utilisateur existe déjà');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <svg viewBox="0 0 24 24" width="48" height="48" className="text-blue-600">
              <path fill="currentColor" d="M19.5,6c-1.3-1.3-3-2-4.8-2c-1.8,0-3.5,0.7-4.8,2L8.5,7.3l1.4,1.4l1.4-1.4c1.7-1.7,4.3-1.7,6,0c1.7,1.7,1.7,4.3,0,6l-1.4,1.4l1.4,1.4l1.4-1.4C20.2,13,21,11.3,21,9.5C21,8.1,20.4,6.9,19.5,6z M15.5,11.7L10.3,16.9c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4l5.2-5.2c0.4-0.4,1-0.4,1.4,0S15.8,11.3,15.5,11.7z M7.5,15.5c-1.7-1.7-1.7-4.3,0-6c0.8-0.8,1.8-1.2,2.8-1.2c1,0,2.1,0.4,2.8,1.2l1.4,1.4l1.4-1.4l-1.4-1.4c-1.3-1.3-3-2-4.8-2c-1.8,0-3.5,0.7-4.8,2C3.6,9.5,3,11.2,3,13c0,1.8,0.7,3.5,2,4.8l1.4,1.4l1.4-1.4L7.5,15.5z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">RWS</h1>
          <p className="text-gray-600">Gestion d'entreprise agricole</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Connexion
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Inscription
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte pour accéder à l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Nom d'utilisateur</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Entrez votre nom d'utilisateur"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" /> Se connecter
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("signup")}
                >
                  Pas encore de compte ? S'inscrire
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Inscription</CardTitle>
                <CardDescription>
                  Créez un compte pour commencer à utiliser l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Nom d'utilisateur</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choisissez un nom d'utilisateur"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Nom complet</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="Entrez votre nom complet"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Numéro de téléphone</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Entrez votre numéro de téléphone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-address">Adresse</Label>
                    <Input
                      id="signup-address"
                      type="text"
                      placeholder="Entrez votre adresse"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Entrez votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Choisissez un mot de passe"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> S'inscrire
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("login")}
                >
                  Déjà un compte ? Se connecter
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
