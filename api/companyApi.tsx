import useAuthStore from "@/stateStore/authStore";
import { useCompanyStore } from "@/stateStore/companyStore";
import { Room } from "@/types/room";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const getCompanyName = async () => {
    try {
        const companyId = useAuthStore.getState().companyUser?.companyId;
        const response = await fetch(`${BASE_URL}/api/company/${companyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Company data: ', data);
        useCompanyStore.getState().setCompanyData(data)
    } catch (error) {
        console.error('Error getting company data: ', error);
        throw error;
    }
}

export const getRoomsByCompanyId = async () => {
    try {
        const companyId = useAuthStore.getState().companyUser?.companyId;
        const jwtCompany = useAuthStore.getState().jwtCompany;
        const jwtAdmin = useAuthStore.getState().jwtAdmin;
        console.log("ADMIN JWT: " + jwtAdmin)
        console.log("COMPANY JWT: " + jwtCompany)

        const response = await fetch(`${BASE_URL}/api/room/company/${companyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
        });

        const data = await response.json(); 
        useCompanyStore.getState().setRoomsData(data)
        console.log(data)
    } catch (error) {
        console.error('Error getting rooms data: ', error);
        throw error;
    }
}