import { UserPlayer } from "./player"

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface Room {
    id: string;
    name: string;
    description: string;
    duration: number;
    cleanUpTime: number;
}
  
export interface Booking {
    id: string;
    state: string;
    room: Room;
    user: User;
    createdAt: string;
    updatedAt: string;
}