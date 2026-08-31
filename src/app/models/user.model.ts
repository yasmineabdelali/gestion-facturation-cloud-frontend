export enum UserRole {
  ADMIN = 'admin',
  CONSULTANT = 'consultant',
}

export interface User {
  id: number;
  nom: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}