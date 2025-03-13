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
            await useAuthStore.getState().setJwt(token, userData);
            return token;
        } else {
            console.error('Login failed:', data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};

export const logout = async () => {
    try {
        // Call the logout function from Zustand store to clean up the state
        await useAuthStore.getState().logout();
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
