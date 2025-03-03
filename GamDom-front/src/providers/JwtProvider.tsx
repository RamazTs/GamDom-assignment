import React, { createContext, Suspense, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import axios from 'axios';

interface JwtContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}


interface AuthResponse {
  user_id: string;
  token: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface User {
  user_id: string;
  email: string;
}

const JwtContext = createContext<JwtContextType | undefined>(undefined);


export const JwtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthToken = async (url: string, {email, password}: AuthRequest) => {
    const response = await axios.post(url, {
      email,
      password,
    });
    const data = response.data as AuthResponse;
    const user: User = { user_id: data.user_id, email: email };
    setToken(data.token);
    setUser(user);
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    return data;
  }

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/auth/login');
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    const storedUser = localStorage.getItem('user');
    setIsLoading(false);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/register') {
      navigate('/auth/login');
    }
  }, [navigate]);

  return (
    <JwtContext.Provider value={{ 
      token, user, login: (email, password) => getAuthToken(`${import.meta.env.VITE_API_ROOT}/api/auth/login`, {email, password}), register: (email, password) => getAuthToken(`${import.meta.env.VITE_API_ROOT}/api/auth/register`, {email, password}), logout,
     }}>
      <Suspense fallback={<Loading />}>
        {isLoading ? <Loading /> : children}
      </Suspense>
    </JwtContext.Provider>
  );
};

export const useJwt = () => {
  const context = useContext(JwtContext);
  if (!context) {
    throw new Error('useJwt must be used within a JwtProvider');
  }
  return context;
}; 