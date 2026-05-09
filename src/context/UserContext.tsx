import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AccountStatus } from '../types/bot';

// ─── Simple hash (base64) for demo — NOT for production ───
const hashPassword = (pw: string) => btoa(pw);
const verifyPassword = (pw: string, hash: string) => btoa(pw) === hash;

// ─── Superadmin seed ───────────────────────────────────────
const SUPERADMIN: User = {
  id: 'superadmin-1',
  name: 'Belal',
  email: 'Belal@superadmin.com',
  password: hashPassword('Bilal147'),
  role: 'superadmin',
  status: 'active',
  plan: 'enterprise',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  avatarInitials: 'BE',
};

// ─── Context types ─────────────────────────────────────────
interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  isSuperAdmin: boolean;

  // Auth
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (name: string, email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;

  // Admin: user management
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  updateUserPlan: (userId: string, plan: User['plan']) => void;
  updateUserRole: (userId: string, role: User['role']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bc_users');
    if (saved) {
      const parsed: User[] = JSON.parse(saved);
      // Ensure superadmin always exists with latest password
      const hasSA = parsed.some((u) => u.id === SUPERADMIN.id);
      return hasSA ? parsed : [SUPERADMIN, ...parsed];
    }
    return [SUPERADMIN];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist users
  useEffect(() => {
    localStorage.setItem('bc_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Persist session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bc_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bc_current_user');
    }
  }, [currentUser]);

  const updateUser = (userId: string, patch: Partial<User>) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...patch } : u))
    );
    // Also update current session if it's the same user
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => prev ? { ...prev, ...patch } : prev);
    }
  };

  // ── Auth ──────────────────────────────────────────────────
  const login = (email: string, password: string): { ok: boolean; message: string } => {
    const user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, message: 'No account found with this email.' };
    if (!verifyPassword(password, user.password)) return { ok: false, message: 'Incorrect password.' };
    if (user.status === 'suspended') return { ok: false, message: 'Your account has been suspended. Contact support.' };
    if (user.status === 'pending') return { ok: false, message: 'Account is pending approval.' };

    const updated = { ...user, lastLogin: new Date().toISOString() };
    updateUser(user.id, { lastLogin: updated.lastLogin });
    setCurrentUser(updated);
    return { ok: true, message: 'Welcome back!' };
  };

  const register = (name: string, email: string, password: string): { ok: boolean; message: string } => {
    if (allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'An account with this email already exists.' };
    }
    if (password.length < 6) return { ok: false, message: 'Password must be at least 6 characters.' };

    const newUser: User = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      role: 'user',
      status: 'active',
      plan: 'free',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      avatarInitials: name.substring(0, 2).toUpperCase(),
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { ok: true, message: 'Account created successfully!' };
  };

  const logout = () => setCurrentUser(null);

  // ── Admin Actions ─────────────────────────────────────────
  const suspendUser = (userId: string) => {
    if (userId === SUPERADMIN.id) return; // can't suspend self (superadmin)
    updateUser(userId, { status: 'suspended' as AccountStatus });
  };

  const activateUser = (userId: string) => updateUser(userId, { status: 'active' as AccountStatus });

  const deleteUser = (userId: string) => {
    if (userId === SUPERADMIN.id) return;
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const updateUserPlan = (userId: string, plan: User['plan']) => updateUser(userId, { plan });

  const updateUserRole = (userId: string, role: User['role']) => updateUser(userId, { role });

  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isSuperAdmin,
        login,
        register,
        logout,
        suspendUser,
        activateUser,
        deleteUser,
        updateUserPlan,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Backward compat alias
export const useUser = useAuth;
