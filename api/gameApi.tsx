import useAuthStore from '@/stateStore/authStore';
import { useGameStore } from '@/stateStore/gameStore';
import { Booking } from '@/types/booking';
import { Game } from '@/types/game';
import { DisplayPlayers, Player } from '@/types/player';
import { isAdult as checkIsAdult } from '@/utils/ageUtils';
import { User } from '@/types/user';

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


export const updateGameData = async (updatedFields: Partial<Game>) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;
        const currentGameData = useGameStore.getState().gameData;

        if (!jwtCompany || !currentGameData) {
            console.error('JWT token or game data not found. User is not authenticated or game is not set.');
            return;
        }

        const fullUpdatedGame = { ...currentGameData, ...updatedFields };

        const response = await fetch(`${BASE_URL}/api/game/${currentGameData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify(fullUpdatedGame),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('API Error:', errorData);
            throw new Error('Error updating game. Please try again later.');
        }

        const updatedGame: Game = await response.json();
        console.log('Updated Game:', updatedGame);

        // Store the fully updated game data
        useGameStore.getState().setGameData(updatedGame);

        return updatedGame;
    } catch (error) {
        console.log('Error updating game:', error);
        throw error;
    }
};

export const addGuestPlayers = async (players: DisplayPlayers[]) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        const requests = players
            .filter(player => player.isGuest === true)
            .map(async player => {
                const newPlayer = {
                    gameId: useGameStore.getState().gameData?.id,
                    isGuest: true,
                    isAdult: player.isAdult
                };

                const response = await fetch(`${BASE_URL}/api/player`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtCompany}`,
                    },
                    body: JSON.stringify(newPlayer),
                });
                if (!response.ok) {
                    throw new Error(`Failed to add player: ${JSON.stringify(player)}`);
                }
                return await response.json();
            });

        const addedPlayers: Player[] = await Promise.all(requests);

        const setPlayersData = useGameStore.getState().setPlayersData;

        if (addedPlayers) {
            addedPlayers.map(player => {
                setPlayersData(player)
            })
        } else {
            console.error("setPlayersData is not defined in the store");
        }

        console.log('Created Players:', addedPlayers);
        return addedPlayers;
    } catch (error) {
        console.error('Error adding players:', error);
        throw error;
    }
};


export const addPlayerWithAccount = async (userId: string, isAdult?: boolean) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;
        let userInfo

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        if (isAdult == undefined) {
            userInfo = await getPlayerInfo(userId)
        }

        let newPlayer = {
            gameId: useGameStore.getState().gameData?.id,
            userId: userId,
            isGuest: false,
            isAdult: isAdult != undefined ? isAdult : checkIsAdult(userInfo?.dateOfBirth ?? '')
        }

        console.log("Attemting to add player with account")
        console.log(newPlayer)

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
        console.log('Added player', addedPlayer);
        const modifiedPlayer = addPlayerToDisplay(addedPlayer)
        useGameStore.getState().setDisplayPlayers(modifiedPlayer)
        useGameStore.getState().setPlayersData(addedPlayer)
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}


export const getBookingDetails = async (bookingId: string) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        console.log("Bookind Id: ")
        console.log(bookingId)

        const response = await fetch(`${BASE_URL}/api/booking/${bookingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
        })

        const bookingData: Booking = await response.json();
        console.log("BOOKING DATA: ")
        console.log(bookingData)
        useGameStore.getState().setBookingDetails(bookingData)
        return bookingData
    } catch (error) {
        console.error('Failed to fetch booking:', error);
        throw error;
    }
}


const addPlayerToDisplay = (player: Player): DisplayPlayers => {
    const newDisplayPlayer: DisplayPlayers = {
        id: `${useGameStore.getState().displayPlayers.length}`,
        name: player.user
            ? `${player.user.firstName} ${player.user.lastName}`
            : "Unknown Player",
        isAdult: player.isAdult ?? null,
        isGuest: player.isGuest
    };

    return newDisplayPlayer
};

const getPlayerInfo = async (userId: string) => {
    try {
        const adminToken = useGameStore.getState().adminJwt

        if (adminToken == undefined) {
            console.log("Admin JWT undefined")
            return
        }

        const response = await fetch(`${BASE_URL}/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            },
        })

        const userInfo: User = await response.json()
        console.log("USER DATA FROM QR CODE: ")
        console.log(userInfo)
        return userInfo
    } catch (error) {
        console.log("Error getting user data from QR")
        console.log(error)
    }
}

export const validateBooking = async (token: string) => {
    const jwtCompany = useAuthStore.getState().jwtCompany;

    if (!jwtCompany) {
        console.error('JWT token not found. User is not authenticated.');
        return { success: false, error: 'Unauthenticated' };
    }

    try {
        const response = await fetch(`${BASE_URL}/api/booking/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify({ token }),
        });

        const contentType = response.headers.get('Content-Type') || '';

        let data: any = null;

        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                error: data?.message || 'Server returned an error',
                data,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Unexpected error',
        };
    }
};

export const validatePersonalQr = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const userData = await response.json();

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                error: userData?.message || 'Server error occurred',
                userData,
            };
        }

        return {
            success: true,
            userData,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Unexpected error',
        };
    }
};

export const updateBookingState = async (bookingId: string, state: string) => {
    const jwtCompany = useAuthStore.getState().jwtCompany;

    if (!jwtCompany) {
        console.error('JWT token not found. User is not authenticated.');
        return { success: false, error: 'Unauthenticated' };
    }

    try {
        const response = await fetch(`${BASE_URL}/api/booking/${bookingId}/state`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify({ state }),
        });

        const contentType = response.headers.get('Content-Type') || '';

        let data: any = null;

        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                error: data?.message || 'Server returned an error',
                data,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Unexpected error',
        };
    }
};
