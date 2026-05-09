export interface Bot {
  id: string;
  userId: string; // owner
  name: string;
  description: string;
  welcomeMessage: string;
  model: string;
  status: 'live' | 'draft' | 'suspended';
  conversations: number;
  initial: string;
  gradient: string;
  accentColor: string;
  avatar: number;
  darkTheme: boolean;
  widgetPosition: 'left' | 'right';
  createdAt: string;
}

export type UserRole = 'superadmin' | 'user';
export type AccountStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed (simple base64 for demo)
  role: UserRole;
  status: AccountStatus;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  lastLogin?: string;
  avatarInitials: string;
}
