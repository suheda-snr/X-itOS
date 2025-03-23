import { Game } from '@/types/game';

export interface GameState {
    gameData: Game | null;
    isGameSet: boolean;
    setGameData: (gameData: Game) => void;
    resetGameData: () => void;
    setIsGameSet: (value: boolean) => void;
    updateGameData: (updatedFields: Partial<Game>) => void;
}