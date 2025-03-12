import { User } from './user';

export interface AuthState {
    jwt: string | null;
    user: User | null;
    setJwt: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
    loadStoredToken: () => Promise<void>;
}