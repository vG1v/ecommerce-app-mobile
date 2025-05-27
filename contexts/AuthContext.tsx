import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/ApiService';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
}

interface LoginCredentials {
  login: string;  // Changed from identifier to login
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await api.getUser();
          setUser(response.data);
        }
      } catch (error) {
        await AsyncStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Just pass the login credentials directly - the API expects login and password
      const response = await api.login(credentials);
      const data = response.data;
      await AsyncStorage.setItem('token', data.token);
      
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};