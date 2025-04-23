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

export const fetchBookingsByCompanyId = async (companyId: string, roomId: string): Promise<Booking[]> => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            throw new Error('Unauthenticated');
        }

        const response = await fetch(`${BASE_URL}/api/booking/company/${companyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('API Error:', errorData);
            throw new Error('Failed to fetch bookings');
        }

        const bookings: Booking[] = await response.json();
        console.log('Fetched Bookings:', bookings);

        // Filter bookings for IN_PROGRESS and matching roomId
        const filteredBookings = bookings.filter(
            (booking) => booking.state === 'IN_PROGRESS' && booking.room.id === roomId,
        );
        console.log('Filtered Bookings:', filteredBookings);
        return filteredBookings;
    } catch (error) {
        console.log('Error fetching bookings:', error);
        throw error;
    }
};

export const fetchGames = async (bookingId: string): Promise<Game | null> => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.log('JWT token not found. User is not authenticated.');
            throw new Error('Unauthenticated');
        }

        const response = await fetch(`${BASE_URL}/api/game`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('API Error:', errorData);
            throw new Error('Failed to fetch games');
        }

        const games: Game[] = await response.json();
        console.log('Fetched Games:', games);

        // Filter games for matching bookingId
        const filteredGames = games.filter((game) => game.bookingId === bookingId);
        console.log('Filtered Games:', filteredGames);

        // Return the most recent game based on createdAt, or null if none
        if (filteredGames.length === 0) {
            console.log(`No games found for bookingId: ${bookingId}`);
            return null;
        }

        const latestGame = filteredGames.reduce((latest, game) => {
            return !latest || new Date(game.createdAt) > new Date(latest.createdAt) ? game : latest;
        }, filteredGames[0]);
        console.log('Latest Game:', latestGame);

        return latestGame;
    } catch (error) {
        console.log('Error fetching games:', error);
        throw error;
    }
};

export const startGameAndBooking = async (companyId: string, roomId: string): Promise<Game> => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.log('JWT token not found. User is not authenticated.');
            throw new Error('Unauthenticated');
        }

        // Fetch bookings for the company and room
        const bookings = await fetchBookingsByCompanyId(companyId, roomId);
        if (bookings.length === 0) {
            console.log('No IN_PROGRESS bookings found for room:', roomId);
            throw new Error('No active booking found for this room');
        }

        // Use the first IN_PROGRESS booking
        const booking = bookings[0];

        // Fetch the latest game for the booking
        const game = await fetchGames(booking.id);
        if (!game) {
            console.log(`No game found for bookingId: ${booking.id}`);
            throw new Error('No game found for this booking');
        }

        // Update game startTime, include roomId in the payload
        const payload = {
            startTime: new Date().toISOString(),
            roomId: roomId
        };

        const gameResponse = await fetch(`${BASE_URL}/api/game/${game.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify(payload),
        });

        if (!gameResponse.ok) {
            const errorData = await gameResponse.json();
            console.log('API Error:', errorData);
            throw new Error('Failed to update game start time');
        }

        const updatedGame: Game = await gameResponse.json();
        console.log('Started Game:', updatedGame);

        // Update booking state to DONE
        const stateResponse = await fetch(`${BASE_URL}/api/booking/${booking.id}/state`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify({ state: 'DONE' }),
        });

        if (!stateResponse.ok) {
            const errorData = await stateResponse.json();
            console.log('API Error:', errorData);
            throw new Error('Failed to update booking state to DONE');
        }

        // Update store
        useGameStore.getState().setGameData(updatedGame);
        useGameStore.getState().setIsGameSet(true);
        useGameStore.getState().setBookingDetails({ ...booking, state: 'DONE' });

        return updatedGame;
    } catch (error) {
        console.log('Error updating game and booking:', error);
        throw error;
    }
};

export const endGameAndUpdate = async (gameId: string, roomId: string): Promise<Game> => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;
        const gameData = useGameStore.getState().gameData;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            throw new Error('Unauthenticated');
        }

        if (!gameId) {
            console.error('Invalid or missing gameId');
            throw new Error('Invalid gameId');
        }

        if (!roomId) {
            console.error('Invalid or missing roomId');
            throw new Error('Invalid roomId');
        }

        if (!gameData || gameData.id !== gameId) {
            console.warn('Game data mismatch or missing in store:', {
                storedGameId: gameData?.id,
                providedGameId: gameId,
            });
        }

        console.log('Attempting to update endTime', {
            gameId,
            roomId,
            jwtCompany: jwtCompany.substring(0, 20) + '...',
            currentGameData: gameData,
        });

        const payload = {
            endTime: new Date().toISOString(),
            roomId,
        };

        console.log('API Payload:', payload);

        const response = await fetch(`${BASE_URL}/api/game/${gameId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
                errorData = { message: 'Unknown error', statusCode: response.status };
            }
            console.error('API Error:', errorData, 'Status:', response.status);

            const updatedGame = {
                ...gameData,
                endTime: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as Game;

            useGameStore.getState().setGameData(updatedGame);
            console.log('Updated gameData in store:', updatedGame);

            return updatedGame;
        }

        const updatedGame: Game = await response.json();
        console.log('API Success - Ended Game:', updatedGame);

        // Update store
        useGameStore.getState().setGameData(updatedGame);

        return updatedGame;
    } catch (error) {
        console.error('Error updating game end time:', error);
        throw error;
    }
};

export const postStats = async (gameId: string, hintsUsed: number) => {
    try {
        const payload = {
            hintsUsed: hintsUsed,
            gameId: gameId,
        };

        const response = await fetch(`${BASE_URL}/api/statistic/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const resp = await response.json()
        console.log("STATS RESP: ")
        console.log(resp)
        return resp
    } catch (error) {
        console.log("Error getting user data from QR")
        console.log(error)
    }
}

export const getStats = async (gameId: string) => {
    const jwtCompany = useAuthStore.getState().jwtCompany;

    if (!jwtCompany) {
        console.error('JWT token not found. User is not authenticated.');
        throw new Error('Unauthenticated');
    }

    try {
        const response = await fetch(`${BASE_URL}/api/statistic/${gameId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
        })

        const resp = await response.json()
        console.log("STATS GET: ")
        console.log(resp)
        return resp
    } catch (error) {
        console.log("Error getting user data from QR")
        console.log(error)
    }
}
