export interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  phone: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: Date;
  updatedAt: Date;
}
