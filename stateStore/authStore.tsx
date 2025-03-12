import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthState } from '../types/authState';

const useAuthStore = create<AuthState>((set) => ({
    jwt: null,
    user: null,

    setJwt: async (token, userData) => {
        try {
            await SecureStore.setItemAsync('jwt', token);
            set({ jwt: token, user: userData });
        } catch (error) {
            console.error('Error setting JWT:', error);
        }
    },

    logout: async () => {
        try {
            await SecureStore.deleteItemAsync('jwt');
            set({ jwt: null, user: null });
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    },

    loadStoredToken: async () => {
        const storedToken = await SecureStore.getItemAsync('jwt');
        if (storedToken) {
            set({ jwt: storedToken });
        }
    },
}));

export default useAuthStore;