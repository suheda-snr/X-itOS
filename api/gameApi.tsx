import useAuthStore from '@/stateStore/authStore';
import { useGameStore } from '@/stateStore/gameStore';
import { Game } from '@/types/game';
import { Player } from '@/types/player';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const createGame = async (newGameData: Omit<Game, 'id'>) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        const response = await fetch(`${BASE_URL}/api/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify(newGameData),
        });

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        const createdGame: Game = await response.json();
        console.log('Created Game:', createdGame);

        const { id, ...restOfGame } = createdGame;

        useGameStore.getState().setGameData({ id, ...restOfGame });
        useGameStore.getState().setIsGameSet(true);

        return createdGame;
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
};

export const addGuestPlayer = async() => {
    const newPlayer = {
          gameId: useGameStore.getState().gameData?.id, 
          isGuest: true,
          isAdult: true
    }

    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        const response = await fetch(`${BASE_URL}/api/player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify(newPlayer),
        });

        if (!response.ok) {
            throw new Error('Failed to add player');
        }

        const addedPlayer: Player = await response.json();
        console.log('Created Game:', addedPlayer);
        return addedPlayer;
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}

export const addPlayerWithAccount = async(userId: string) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        const response = await fetch(`${BASE_URL}/api/player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            // body: JSON.stringify(newPlayer),
        });

        if (!response.ok) {
            throw new Error('Failed to add player');
        }

        const addedPlayer: Player = await response.json();
        console.log('Created Game:', addedPlayer);
        return addedPlayer;
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}
