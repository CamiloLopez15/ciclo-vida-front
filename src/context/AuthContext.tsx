import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';
import { mockCiudadanos, mockRecicladores } from '../data/mockData';

// Usuario administrador para pruebas
const adminUser: User = {
  id: 'admin',
  email: 'admin@ciclovida.com',
  name: 'Administrador',
  phone: '+57 300 000 0000',
  type: 'ciudadano', // Usamos ciudadano pero con permisos especiales
  createdAt: '2024-01-01T00:00:00Z'
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Simular verificación de sesión existente
    const savedUser = localStorage.getItem('ciclovida_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('ciclovida_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuario en mock data
    const allUsers = [...mockCiudadanos, ...mockRecicladores, adminUser];
    const user = allUsers.find(u => u.email === email);
    
    if (user && password === '123456') { // Password mock
      localStorage.setItem('ciclovida_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular registro exitoso
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      phone: userData.phone!,
      type: userData.type!,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('ciclovida_user', JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false
    });
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('ciclovida_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};