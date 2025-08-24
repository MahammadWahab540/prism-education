
export type UserRole = 'platform_owner' | 'tenant_admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  settings: {
    branding: {
      primaryColor: string;
      logo?: string;
    };
    features: string[];
  };
  createdAt: string;
}
