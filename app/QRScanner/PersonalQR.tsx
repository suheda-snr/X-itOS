import { QRScanner } from '../../components/QRScanner';

const PersonalQR = () => {
    const handlePersonalScan = (data: string) => {
        console.log('Personal QR Scanned:', data);
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
