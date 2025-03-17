import { create } from 'zustand';
import { Company } from '@/types/company';
import { CompanyState } from '@/types/companyState';
import { Room } from '@/types/room';

export const useCompanyStore = create<CompanyState>((set, get) => ({
    companyData: null,
    roomsData: null,
    chosenRoom: null,
    setCompanyData: (companyData: Company) => set({ companyData: companyData}),
    setRoomsData: (roomsData: Room[]) => set({ roomsData: roomsData}),
    setChosenRoom: (roomId: string) => {
        const rooms = get().roomsData; 
        if (!rooms) return; 

        const selectedRoom = rooms.find(room => room.id === roomId);
        if (selectedRoom) {
            set({ chosenRoom: selectedRoom });
        } else {
            console.warn(`Room with ID ${roomId} not found`);
        }
    },
}))