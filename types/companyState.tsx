import { Company } from "./company";
import { Room } from "./room";

export interface CompanyState{
    companyData: Company | null
    roomsData: Room[] | null
    chosenRoom: Room | null
    setCompanyData: (companyData: Company) => void;
    setRoomsData: (roomsData: Room[]) => void;
    setChosenRoom: (roomId: string) => void
}