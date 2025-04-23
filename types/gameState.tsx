import { Game } from '@/types/game';
import { DisplayPlayers, Player } from './player';
import { Booking } from './booking';

export interface GameState {
    gameData: Game | null;
    playersData: Player[] | null
    isGameSet: boolean;
    displayPlayers: DisplayPlayers[]
    bookingDetails: Booking | null
    hintsUsed: number | null
    adminJwt: string | null
    setGameData: (gameData: Game) => void;
    resetGameData: () => void;
    setIsGameSet: (value: boolean) => void;
    updateGameData: (updatedFields: Partial<Game>) => void;
    setPlayersData: (player: Player) => void
    setDisplayPlayers: (player: DisplayPlayers) => void
    setBookingDetails: (booking: Booking | null) => void
    setAdminJwt: (adminJwt: string) => void
    setHintsUsed: (hints: number) => void
}