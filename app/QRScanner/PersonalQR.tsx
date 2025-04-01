import React from 'react';
import { useRouter } from 'expo-router';
import { QRScanner } from '../../components/QRScanner';
import { addPlayerWithAccount } from '@/api/gameApi';

const PersonalQR = () => {
    const router = useRouter();

    const handlePersonalScan = async (data: string) => {
        console.log('Personal QR Scanned:', data);
        //lets assume that there is userId in plain format
        await addPlayerWithAccount(data)
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
