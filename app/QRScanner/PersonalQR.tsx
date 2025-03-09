import React from 'react';
import { useRouter } from 'expo-router';
import { QRScanner } from '../../components/QRScanner';

const PersonalQR = () => {
    const router = useRouter();

    const handlePersonalScan = (data: string) => {
        console.log('Personal QR Scanned:', data);

        // Redirect to playersinfoadding after successful scan
        router.push('/playersinfoadding');
    };

    return (
        <QRScanner
            title="Scan Personal QR"
            subtitle="Position your personal QR code within the frame to add your personal details"
            onScan={handlePersonalScan}
            scannerType="personal"
        />
    );
};

export default PersonalQR;
