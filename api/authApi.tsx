import { decodeJWT } from '../utils/jwtUtils';
import useAuthStore from "@/stateStore/authStore";
import { User } from "../types/user";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email: string, password: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
            const token = data.access_token;
            const decoded = decodeJWT(token);

            if (!decoded || decoded.role !== 'COMPANY') {
                console.warn('Unauthorized role. Logging out.');
                await useAuthStore.getState().logout(); // Logout in case of invalid role
                return;
            }

            // Extract user info from decoded JWT payload
            const userData: User = {
                id: decoded.id,
                email: decoded.email,
                username: decoded.username,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                phoneNumber: decoded.phoneNumber,
                companyId: decoded.companyId,
                dateOfBirth: decoded.dateOfBirth,
                role: decoded.role,
            };

            // Save the JWT and user info in the store
            await useAuthStore.getState().setJwt(token, userData, 'company');
            return token;
        } else {
            console.error('Login failed:', data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};

export const getCompanyUserInfo = async () => {
    try {
        const companyUser = useAuthStore.getState().companyUser;  // Retrieve the company user data from Zustand store
        if (companyUser) {
            return companyUser;  // Return the whole user object
        } else {
            throw new Error('No company user found. User may not be logged in as a company.');
        }
    } catch (error) {
        console.error('Error getting company user info:', error);
        throw error;
    }
};

export const loginWithAccessCode = async (accessCode: string, companyId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/access-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessCode, companyId }),
        });

        const data = await response.json();
        console.log('Access code login response:', data);

        if (response.ok) {
            const token = data.access_token;
            const decoded = decodeJWT(token);

            // Extract user info from decoded JWT payload
            const userData: User = {
                id: decoded.id,
                email: decoded.email,
                username: decoded.username,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                phoneNumber: decoded.phoneNumber,
                companyId: decoded.companyId,
                dateOfBirth: decoded.dateOfBirth,
                role: decoded.role,
            };

            // Save the JWT and user info in the store for company role
            await useAuthStore.getState().setJwt(token, userData, 'admin');
            return token;
        } else {
            console.error('Access code login failed:', data.message);
            throw new Error(data.message || 'Access code login failed');
        }
    } catch (error) {
        console.error('Error during access code login:', error);
        throw error;  // Rethrow the error for further handling in the UI
    }
};



export const logout = async (role: 'company' | 'admin') => {
    try {
        // Call the logout function from Zustand store with the role parameter
        await useAuthStore.getState().logout(role);
        console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} logged out successfully`);
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
