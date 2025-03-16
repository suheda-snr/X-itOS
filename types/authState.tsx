import { User } from './user';

export interface AuthState {
    jwtCompany: string | null;
    jwtAdmin: string | null;
    companyUser: User | null;
    adminUser: User | null;
    setJwt: (token: string, userData: User, role: 'company' | 'admin') => Promise<void>;
    logout: (role: 'company' | 'admin') => Promise<void>;  // Update to accept role parameter
    loadStoredToken: () => Promise<void>;
}