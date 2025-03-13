import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthState } from '../types/authState';

const useAuthStore = create<AuthState>((set) => ({
    jwt: null,
    user: null,

    setJwt: async (token, userData) => {
        try {
            // Store token securely in SecureStore
            await SecureStore.setItemAsync('jwt', token);

            // Log when the data is saved
            console.log('JWT saved to SecureStore:', token);
            console.log('User data saved:', userData);

            // Update store state
            set({ jwt: token, user: userData });
        } catch (error) {
            console.error('Error setting JWT:', error);
        }
    },

    logout: async () => {
        try {
            // Delete JWT from SecureStore during logout
            await SecureStore.deleteItemAsync('jwt');
            set({ jwt: null, user: null });
            console.log('Logged out successfully');
            //write to the console  the jwt and user
            console.log('JWT:', useAuthStore.getState().jwt);
            console.log('User:', useAuthStore.getState().user);

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