
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom d'utilisateur et un mot de passe",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Attempt login
    const success = login(username, password);
    
    setIsLoading(false);
    
    if (success) {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord",
      });
      navigate('/');
    } else {
      toast({
        title: "Échec de connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" width="60" height="60" className="text-blue-600">
              <path fill="currentColor" d="M19.5,6c-1.3-1.3-3-2-4.8-2c-1.8,0-3.5,0.7-4.8,2L8.5,7.3l1.4,1.4l1.4-1.4c1.7-1.7,4.3-1.7,6,0c1.7,1.7,1.7,4.3,0,6l-1.4,1.4l1.4,1.4l1.4-1.4C20.2,13,21,11.3,21,9.5C21,8.1,20.4,6.9,19.5,6z M15.5,11.7L10.3,16.9c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4l5.2-5.2c0.4-0.4,1-0.4,1.4,0S15.8,11.3,15.5,11.7z M7.5,15.5c-1.7-1.7-1.7-4.3,0-6c0.8-0.8,1.8-1.2,2.8-1.2c1,0,2.1,0.4,2.8,1.2l1.4,1.4l1.4-1.4l-1.4-1.4c-1.3-1.3-3-2-4.8-2c-1.8,0-3.5,0.7-4.8,2C3.6,9.5,3,11.2,3,13c0,1.8,0.7,3.5,2,4.8l1.4,1.4l1.4-1.4L7.5,15.5z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Bienvenue chez RWS</h1>
          <p className="text-gray-600">Connectez-vous pour accéder au tableau de bord</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-10" 
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-10" 
                  type="password" 
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-agri-primary hover:bg-agri-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500 text-center">
              Pas encore de compte ? Contactez votre administrateur
            </p>
            <div className="text-xs text-gray-400 text-center">
              © 2025 RWS - Tous droits réservés
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
