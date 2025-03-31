import { create } from 'zustand';
import { Game } from '@/types/game';
import { GameState } from '@/types/gameState';
import { DisplayPlayers, Player } from '@/types/player';
import { Booking } from '@/types/booking';

export const useGameStore = create<GameState>((set, get) => ({
    gameData: null,
    isGameSet: false,
    playersData: null,
    // guestsData: null,
    displayPlayers: [],
    bookingDetails: null,
    setGameData: (gameData: Game) => set({ gameData: gameData }),
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
    setBookingDetails: (booking: Booking) => set({bookingDetails: booking})
    // setGuestsData: (guest: Guest) =>
    //     set((state) => ({
    //         guestsData: state.guestsData ? [...state.guestsData, guest] : [guest]
    //     })),
    }));