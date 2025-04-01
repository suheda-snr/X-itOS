import React from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native'; // Import Alert from react-native
import { QRScanner } from '../../components/QRScanner';
import { useCompanyStore } from '../../stateStore/companyStore';
import { addPlayerWithAccount, createGame, getBookingDetails } from '../../api/gameApi';
import { useGameStore } from '@/stateStore/gameStore';

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
        // data: {"booking_id":"12345","token":"abcde","user_id":"user123"}
        const dataAsObject = JSON.parse(data)
        if (!chosenRoom) {
            Alert.alert('Error', 'No room selected for the game');
            return;
        }

        const teamName = generateTeamName();

        const newGame = {
            teamName,
            roomId: chosenRoom.id,
            bookingId: dataAsObject.booking_id,
        };

        try {
            console.log('Creating game:', newGame);
            const createdGame = await createGame(newGame);
            //for automated user adding
            if (createdGame) {
                const bookingData = await getBookingDetails(createdGame.bookingId);
                console.log("booking from db: " + bookingData?.id)
                console.log("user from db: " + bookingData?.user.id)
                console.log("booking from qr: " + dataAsObject.booking_id)
                console.log("user from qr: " + dataAsObject.user_id)
                if(bookingData?.id.trim() == dataAsObject.booking_id.trim() && bookingData?.user.id.trim() == dataAsObject.user_id.trim()){
                    console.log("Adding player...")
                    await addPlayerWithAccount(bookingData?.user.id)
                    router.push(`/playersinfoadding?teamName=${encodeURIComponent(teamName)}`);
                }else {
                    throw new Error('Failed to add player');
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