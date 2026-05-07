export interface Bot {
  id: string;
  name: string;
  description: string;
  welcomeMessage: string;
  model: string;
  status: 'live' | 'draft';
  conversations: number;
  initial: string;
  gradient: string;
  accentColor: string;
  avatar: number;
  darkTheme: boolean;
  widgetPosition: 'left' | 'right';
  createdAt: string;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
