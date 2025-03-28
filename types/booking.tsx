import { UserPlayer } from "./player"

export interface Booking{
    room: string,
    user: UserPlayer,
    createdAt: string
    updatedAt: string
}