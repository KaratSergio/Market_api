export interface JwtUserPayload {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}
