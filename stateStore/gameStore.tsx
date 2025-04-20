import { create } from 'zustand';
import { Game } from '@/types/game';
import { GameState } from '@/types/gameState';
import { DisplayPlayers, Player } from '@/types/player';
import { Booking } from '@/types/booking';

export const useGameStore = create<GameState>((set, get) => ({
    gameData: null,
    isGameSet: false,
    playersData: null,
    adminJwt: null,
    displayPlayers: [],
    bookingDetails: null,
    setGameData: (gameData: Game) => set({ gameData: gameData }),
    setAdminJwt: (adminJwt: string) => set({ adminJwt: adminJwt }),
    resetGameData: () => set({ gameData: null }),
    setIsGameSet: (value: boolean) => set({ isGameSet: value }),
    updateGameData: (updatedFields: Partial<Game>) => {
        const gameData = get().gameData;
        if (gameData) {
            set({ gameData: { ...gameData, ...updatedFields } });
        } else {
            console.warn('Game not found');
        }
    },
    setPlayersData: (player: Player) =>
        set((state) => ({
            playersData: state.playersData ? [...state.playersData, player] : [player]
        })),
    setDisplayPlayers: (player: DisplayPlayers) =>
        set((state) => ({
            displayPlayers: state.displayPlayers
                ? state.displayPlayers.some((p) => p.id === player.id)
                    ? state.displayPlayers.map((p) => (p.id === player.id ? player : p)) // Update existing
                    : [...state.displayPlayers, player] // Add new
                : [player], // Initialize array if empty
        })),
    setBookingDetails: (booking: Booking | null) => set({ bookingDetails: booking })
}));