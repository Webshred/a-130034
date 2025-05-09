
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  username: string;
  password: string;
  profilePic?: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };

  const signup = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: User) => u.username === username)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      profilePic: '',
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/auth');
  };

  const updateProfilePic = (imageUrl: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, profilePic: imageUrl };
      
      // Update in state
      setCurrentUser(updatedUser);
      
      // Update in localStorage for currentUser
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in the users array in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: User) => 
        u.id === currentUser.id ? updatedUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  return { currentUser, isLoading, login, signup, logout, updateProfilePic };
};

export default useAuth;
