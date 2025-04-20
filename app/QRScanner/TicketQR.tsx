import React from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native'; // Import Alert from react-native
import { QRScanner } from '../../components/QRScanner';
import { useCompanyStore } from '../../stateStore/companyStore';
import { addPlayerWithAccount, createGame, getBookingDetails } from '../../api/gameApi';
import { useGameStore } from '@/stateStore/gameStore';
import { decodeJWT } from '@/utils/jwtUtils';
import { validateBooking } from '../../api/gameApi';

// Helper function to generate a team name
const generateTeamName = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    return `Team ${randomNum}`;
};

const TicketQR = () => {
    const router = useRouter();
    const chosenRoom = useCompanyStore((state) => state.chosenRoom);

    const handleTicketScan = async (data: string) => {
        console.log('Ticket QR Scanned:', data);

        if (!chosenRoom) {
            Alert.alert('Error', 'No room selected for the game');
            console.log('some trouble with room')
            return;
        }

        try {
            const validation = await validateBooking(data);

            if (!validation.success) {
                console.error(validation.error);
                return
            } 

            //for automated user adding
            if (validation.success) {
                const bookingData = await getBookingDetails(validation.data.bookingId);

                if(bookingData?.room.id == chosenRoom.id){
                    console.log('Creating game...');

                    const teamName = generateTeamName();

                    const newGame = {
                        teamName,
                        roomId: chosenRoom.id,
                        bookingId: validation.data.bookingId,
                    };

                    const createdGame = await createGame(newGame);

                    if(createdGame){
                        console.log("Adding player...")
                        await addPlayerWithAccount(validation.data.userId)
                        router.push(`/playersinfoadding?teamName=${encodeURIComponent(teamName)}`);
                    }else{
                        throw new Error('Failed to add player');
                    }
                }else {
                    throw new Error('Wrong room!');
                }  
            } else {
                throw new Error('Failed to create game. Created game is undefined.');
            }            
        } catch (error: any) {
            console.log('Error creating game:', error);
            const errorMessage = error.message.includes('Game can only be created for scheduled bookings')
                ? 'Oops! We couldn’t process this QR code. Please ensure your booking valid and scheduled.'
                : error.message || 'Failed to create game. Please try again.';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <QRScanner
            title="Scan Ticket"
            subtitle="Position your booking QR code within the frame to begin your adventure"
            onScan={handleTicketScan}
            scannerType="ticket"
        />
    );
};

export default TicketQR;