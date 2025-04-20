import React from 'react';
import { useRouter } from 'expo-router';
import { QRScanner } from '../../components/QRScanner';
import { addPlayerWithAccount } from '@/api/gameApi';
import { decodeJWT } from '@/utils/jwtUtils';
import { isAdult } from '@/utils/ageUtils';
import { validatePersonalQr } from '@/api/gameApi';

const PersonalQR = () => {
    const router = useRouter();

    const handlePersonalScan = async (data: string) => {
        console.log('Personal QR Scanned:', data);

        const result = await validatePersonalQr(data);

        if (!result.success) {
            console.error('QR validation failed:', result.error);
            return
        } 

        const userData = result.userData;
        const isAdultPlayer = isAdult(userData.dateOfBirth)

        await addPlayerWithAccount(userData.id, isAdultPlayer)
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
