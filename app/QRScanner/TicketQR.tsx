// screens/TicketQRScanner.tsx
import React from 'react';
import { QRScanner } from '../../components/QRScanner';

const TicketQR = () => {
    const handleTicketScan = (data: string) => {
        console.log('Ticket QR Scanned:', data);

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