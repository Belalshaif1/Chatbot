import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/bot';

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  setAdminMode: () => void;
  setUserMode: () => void;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bc_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bc_user');
    }
  }, [user]);

  const setAdminMode = () => {
    if (user) setUser({ ...user, role: 'admin' });
    else setUser({ id: 'admin-1', name: 'Admin User', email: 'admin@botcraft.ai', role: 'admin' });
  };

  const setUserMode = () => {
    if (user) setUser({ ...user, role: 'user' });
    else setUser({ id: 'user-1', name: 'Regular User', email: 'user@botcraft.ai', role: 'user' });
  };

  const login = (email: string, password?: string) => {
    // Check for specific admin credentials provided by user
    if (email === 'Belal@superadmin.com' && password === 'Bilal147') {
      setUser({
        id: 'admin-belal',
        name: 'Belal',
        email: email,
        role: 'admin'
      });
      return true;
    }
    
    // Fallback for demo
    if (email.includes('admin')) {
       setUser({
        id: 'admin-1',
        name: email.split('@')[0],
        email: email,
        role: 'admin'
      });
      return true;
    }

    setUser({
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: 'user'
    });
    return true;
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider value={{ user, isAdmin, setAdminMode, setUserMode, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
