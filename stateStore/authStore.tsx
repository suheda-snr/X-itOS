import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthState } from '../types/authState';
import { useCompanyStore } from './companyStore';

const useAuthStore = create<AuthState>((set) => ({
    jwtCompany: null,
    jwtAdmin: null,
    companyUser: null,
    adminUser: null,

    setJwt: async (token: string, userData: any, role: 'company' | 'admin') => {
        try {
            if (role === 'company') {
                await SecureStore.setItemAsync('jwtCompany', token);
                await SecureStore.setItemAsync('companyUser', JSON.stringify(userData));
                set({ jwtCompany: token, companyUser: userData });
                console.log('Company JWT and User saved');
                //write the jwt and company user to the c   onsole
                console.log(token);
                console.log(userData);
            } else if (role === 'admin') {
                await SecureStore.setItemAsync('jwtAdmin', token);
                await SecureStore.setItemAsync('adminUser', JSON.stringify(userData));
                set({ jwtAdmin: token, adminUser: userData });
                console.log('Admin JWT and User saved');
                console.log(token);
                console.log(userData);
            }
        } catch (error) {
            console.error('Error setting JWT:', error);
        }
    },

    logout: async (role: 'company' | 'admin') => {
        try {
            if (role === 'company') {
                // Delete company-related data
                await SecureStore.deleteItemAsync('jwtCompany');
                await SecureStore.deleteItemAsync('companyUser');
                await SecureStore.deleteItemAsync('jwtAdmin');
                await SecureStore.deleteItemAsync('adminUser');
                set({ jwtCompany: null, companyUser: null, jwtAdmin: null, adminUser: null });
                useCompanyStore.getState().setAllNull()
                console.log('Company logged out successfully');
            } else if (role === 'admin') {
                // Delete admin-related data
                await SecureStore.deleteItemAsync('jwtAdmin');
                await SecureStore.deleteItemAsync('adminUser');
                set({ jwtAdmin: null, adminUser: null });
                useCompanyStore.getState().setAllNull()
                console.log('Admin logged out successfully');
            }
            // Optional: You can log both the role and the data that has been cleared if needed
            set((state) => {
                console.log(state.jwtCompany);
                console.log(state.jwtAdmin);
                console.log(state.companyUser);
                console.log(state.adminUser);
                return state;
            });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    },

    loadStoredToken: async () => {
        const storedTokenCompany = await SecureStore.getItemAsync('jwtCompany');
        const storedTokenAdmin = await SecureStore.getItemAsync('jwtAdmin');
        const storedCompanyUser = await SecureStore.getItemAsync('companyUser');
        const storedAdminUser = await SecureStore.getItemAsync('adminUser');

        if (storedTokenCompany && storedCompanyUser) {
            set({ jwtCompany: storedTokenCompany, companyUser: JSON.parse(storedCompanyUser) });
        }

        if (storedTokenAdmin && storedAdminUser) {
            set({ jwtAdmin: storedTokenAdmin, adminUser: JSON.parse(storedAdminUser) });
        }
    },
}));

export default useAuthStore;
