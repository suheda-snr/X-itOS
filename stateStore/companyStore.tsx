import { create } from 'zustand';
import { Company } from '@/types/company';
import { CompanyState } from '@/types/companyState';
import { Room } from '@/types/room';

export const useCompanyStore = create<CompanyState>((set, get) => ({
    companyData: null,
    roomsData: null,
    chosenRoom: null,
    isRoomSet: false,
    selectedRoomForGame: null,
    setCompanyData: (companyData: Company) => set({ companyData: companyData}),
    setRoomsData: (roomsData: Room[]) => set({ roomsData: roomsData}),
    setChosenRoom: (roomId: string) => {
        const rooms = get().roomsData; 

        const selectedRoom = rooms?.find(room => room.id == roomId);
        if (selectedRoom) {
            set({ chosenRoom: selectedRoom });
            console.log("LOG FORM STATE")
            console.log(selectedRoom)
        } else {
            set({ chosenRoom: null });
            console.warn(`Room with ID ${roomId} not found`);
        }
    },
    setIsRoomSet: (value: boolean) => set({ isRoomSet: value }),
    setSelectedRoomForGame: (roomData: Room) => {
        if (roomData) {
            console.log("setting room to the state")
            set({ selectedRoomForGame: roomData });
        } else {
            console.warn(`Room not found`);
        }
    },
    setAllNull: () => set({
        companyData: null,
        roomsData: null,
        chosenRoom: null,
        isRoomSet: false,
        selectedRoomForGame: null,
    })
}))