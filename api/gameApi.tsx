import useAuthStore from '@/stateStore/authStore';
import { useGameStore } from '@/stateStore/gameStore';
import { Game } from '@/types/game';

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
            const errorData = await response.json();
            console.log('API Error:', errorData);
            throw new Error('Error creating game. Please try again later.');
        }

        const createdGame: Game = await response.json();
        console.log('Created Game:', createdGame);

        const { id, ...restOfGame } = createdGame;

        useGameStore.getState().setGameData({ id, ...restOfGame });
        useGameStore.getState().setIsGameSet(true);

        return createdGame;
    } catch (error) {
        console.log('Error creating game:', error);
        throw error;
    }
};
