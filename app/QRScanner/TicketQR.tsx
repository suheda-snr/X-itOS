import React from 'react';
import { useRouter } from 'expo-router';
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

        if (!chosenRoom) {
            console.error('No room selected for the game');
            return;
        }

        const teamName = generateTeamName();

        const newGame = {
            teamName,
            roomId: chosenRoom.id,
            bookingId: data,
        };

        try {
            console.log('Creating game:', newGame);
            const createdGame = await createGame(newGame);
            //for automated user adding
            //await getBookingDetails(createdGame.bookingId)
            //TBA getting userid
            //await addPlayerWithAccount(useGameStore.getState().bookingDetails?.user)
            router.push(`/playersinfoadding?teamName=${encodeURIComponent(teamName)}`);
        } catch (error) {
            console.error('Error creating game:', error);
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