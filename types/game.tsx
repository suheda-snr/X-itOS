export interface Game {
    id: string;
    teamName: string;
    roomId: string;
    startTime?: string | null;
    endTime?: string | null;
    bookingId: string;
    createdAt: string;
    updatedAt: string;
}
