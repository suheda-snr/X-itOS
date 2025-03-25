import { Game } from '@/types/game';
import { Guest, Player } from './player';

export interface GameState {
    gameData: Game | null;
    playersData: Player[] | null
    isGameSet: boolean;
    guestsData: Guest[] | null
    setGameData: (gameData: Game) => void;
    resetGameData: () => void;
    setIsGameSet: (value: boolean) => void;
    updateGameData: (updatedFields: Partial<Game>) => void;
    setPlayersData: (player: Player) => void
    setGuestsData: (guest: Guest) => void
}