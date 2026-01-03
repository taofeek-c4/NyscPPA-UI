import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/dashboard';
import { authService, UserDto } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, stateCode: string, callUpNumber: string, joinCode: string) => Promise<void>;
  registerSupervisor: (name: string, email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUserDtoToUser(dto: UserDto): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role === 'CorpsMember' ? 'corps_member' : 'supervisor',
    ppaId: dto.profile?.ppaId,
    ppaName: dto.profile?.ppa,
    supervisorId: dto.profile?.supervisorId,
    supervisorName: dto.profile?.supervisorName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and load user
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userDto = await authService.getCurrentUser();
      setUser(mapUserDtoToUser(userDto));
    } catch (error) {
      // Token might be invalid, clear it
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem('auth_token', response.token);
    setUser(mapUserDtoToUser(response.user));
  };

  const registerSupervisor = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await authService.registerSupervisor({
      name,
      email,
      password,
    });
    localStorage.setItem('auth_token', response.token);
    setUser(mapUserDtoToUser(response.user));
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    stateCode: string,
    callUpNumber: string,
    joinCode: string
  ) => {
    const response = await authService.register({
      name,
      email,
      password,
      stateCode,
      callUpNumber,
      joinCode,
    });
    localStorage.setItem('auth_token', response.token);
    setUser(mapUserDtoToUser(response.user));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, registerSupervisor, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
