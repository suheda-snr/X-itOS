import useAuthStore from '@/stateStore/authStore';
import { useGameStore } from '@/stateStore/gameStore';
import { Booking } from '@/types/booking';
import { Game } from '@/types/game';
import { DisplayPlayers, Player } from '@/types/player';

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
            console.error('API Error:', errorData);
            throw new Error('Failed to create game: ' + JSON.stringify(errorData));
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

// export const addGuestPlayer = async() => {
//     const newPlayer = {
//           gameId: useGameStore.getState().gameData?.id, 
//           isGuest: true,
//           isAdult: true
//     }

//     try {
//         const jwtCompany = useAuthStore.getState().jwtCompany;

//         if (!jwtCompany) {
//             console.error('JWT token not found. User is not authenticated.');
//             return;
//         }

//         const response = await fetch(`${BASE_URL}/api/player`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${jwtCompany}`,
//             },
//             body: JSON.stringify(newPlayer),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to add player');
//         }

//         const addedPlayer: Player = await response.json();
//         console.log('Created Game:', addedPlayer);
//         return addedPlayer;
//     } catch (error) {
//         console.error('Error creating game:', error);
//         throw error;
//     }
// }

export const addGuestPlayers = async (players: DisplayPlayers[]) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        const requests = players.filter(player => player.isGuest === true).map(player=>{
            const newPlayer = {
                gameId: useGameStore.getState().gameData?.id, 
                isGuest: true,
                isAdult: player.isAdult
            }

            fetch(`${BASE_URL}/api/player`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtCompany}`,
                },
                body: JSON.stringify(newPlayer),
            }).then(async response => {
                if (!response.ok) {
                    throw new Error(`Failed to add player: ${JSON.stringify(player)}`);
                }
                return response.json();
            })
        }
        );

        const addedPlayers: Player[] = await Promise.all(requests);

        const setPlayersData = useGameStore.getState().setPlayersData;

        if(addedPlayers){
            addedPlayers.map(player => {
                setPlayersData(player)
            })
        }else{
            console.error("setPlayersData is not defined in the store");
        }

        console.log('Created Players:', addedPlayers);
        return addedPlayers;
    } catch (error) {
        console.error('Error adding players:', error);
        throw error;
    }
};


export const addPlayerWithAccount = async(userId: string) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        const newPlayer = {
            gameId: useGameStore.getState().gameData?.id,
            userId: userId,
            isGuest: false,
            isAdult: true //TBA function to get age
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
        console.log('Added player', addedPlayer);
        const modifiedPlayer = addPlayerToDisplay(addedPlayer)
        useGameStore.getState().setDisplayPlayers(modifiedPlayer)
        useGameStore.getState().setPlayersData(addedPlayer)
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}

// export const generatePlayersData = (isGuest: boolean, isAdult: boolean) => {
//     return {
//         gameId: useGameStore.getState().gameData?.id,
//         userId: 
//         isGuest: isGuest,
//         isAdult: isAdult
//     }
// }

export const getBookingDetails = async(bookingId: string) => {
    try {
        const jwtCompany = useAuthStore.getState().jwtCompany;

        if (!jwtCompany) {
            console.error('JWT token not found. User is not authenticated.');
            return;
        }

        //const bookingId = useGameStore.getState().gameData?.bookingId
        console.log("Bookind Id: ")

        console.log(bookingId)

        const response = await fetch(`${BASE_URL}/api/booking/${bookingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtCompany}`,
            },
        });

        // if (!response.ok) {
        //     console.log(response)

        //     throw new Error('Failed to fetch player');
        // }

        const bookingData: Booking = await response.json();
        console.log("BOOKING DATA: ")
        console.log(bookingData)
        useGameStore.getState().setBookingDetails(bookingData)
    } catch (error) {
        console.error('Failed to fetch booking:', error);
        throw error;
    }
}


  const addPlayerToDisplay = (player: Player): DisplayPlayers => {
    const newDisplayPlayer: DisplayPlayers = {
      id: player.id ?? crypto.randomUUID(), // Generate ID if null
      name: player.user 
        ? `${player.user.firstName} ${player.user.lastName}` 
        : "Unknown Player", // Default name for guests
      isAdult: player.isAdult ?? null, // Preserve isAdult or null
      isGuest: player.isGuest
    };

    return newDisplayPlayer
  };
