import { create } from 'zustand';
import { Game } from '@/types/game';
import { GameState } from '@/types/gameState';
import { Player } from '@/types/player';

export const useGameStore = create<GameState>((set, get) => ({
    gameData: null,
    isGameSet: false,
    playersData: null,
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
    }));