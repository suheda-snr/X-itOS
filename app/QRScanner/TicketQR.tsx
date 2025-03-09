import React from 'react';
import { useRouter } from 'expo-router';
import { QRScanner } from '../../components/QRScanner';

const TicketQR = () => {
    const router = useRouter();

    const handleTicketScan = (data: string) => {
        console.log('Ticket QR Scanned:', data);
        router.push('/playersinfoadding'); // Redirect to playersinfoadding
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