import { Company } from "./company";
import { Room } from "./room";

export interface CompanyState{
    companyData: Company | null
    roomsData: Room[] | null
    chosenRoom: Room | null
    isRoomSet: boolean
    selectedRoomForGame: Room | null
    setCompanyData: (companyData: Company) => void;
    setRoomsData: (roomsData: Room[]) => void;
    setChosenRoom: (roomId: string) => void
    setIsRoomSet: (value: boolean) => void
    setSelectedRoomForGame: (roomData: Room) => void
    setAllNull: () => void
}