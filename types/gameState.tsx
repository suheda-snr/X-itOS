import { Game } from '@/types/game';
import { Player } from './player';

export interface GameState {
    gameData: Game | null;
    playersData: Player[] | null
    isGameSet: boolean;
    setGameData: (gameData: Game) => void;
    resetGameData: () => void;
    setIsGameSet: (value: boolean) => void;
    updateGameData: (updatedFields: Partial<Game>) => void;
    setPlayersData: (player: Player) => void
}