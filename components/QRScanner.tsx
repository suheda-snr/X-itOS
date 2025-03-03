import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

interface QRScannerProps {
    title: string;
    subtitle: string;
    onScan: (data: string) => void;
    scannerType: 'ticket' | 'personal';
}

export const QRScanner = ({ title, subtitle, onScan, scannerType }: QRScannerProps) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState<boolean>(false); // Track scan status
    const [scannedData, setScannedData] = useState<string>(''); // Store scanned data

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    if (!permission?.granted) {
        return (
            <LinearGradient colors={['#1a2236', '#2a3555', '#0f172a']} style={styles.background}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>Camera access is required to scan QR codes</Text>
                </View>
            </LinearGradient>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (!scanned) {
            setScanned(true);
            setScannedData(data);
            onScan(data);
            //alert(`QR Code scanned successfully! \n ${data}`);
            // Reset scan state after 3 seconds for now later will be redirected to the add player screen 
            setTimeout(() => setScanned(false), 3000);
        }
    };

    return (
        <LinearGradient colors={['#1a2236', '#2a3555', '#0f172a']} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.headerText}>{title}</Text>
                    <Text style={styles.subText}>{subtitle}</Text>

                    <View style={styles.cameraContainer}>
                        <CameraView
                            onBarcodeScanned={handleBarCodeScanned}
                            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                            style={styles.cameraBox}
                        />
                        <View style={styles.qrFrame}>
                            <View style={[styles.corner, styles.cornerTopLeft]} />
                            <View style={[styles.corner, styles.cornerTopRight]} />
                            <View style={[styles.corner, styles.cornerBottomLeft]} />
                            <View style={[styles.corner, styles.cornerBottomRight]} />
                        </View>

                        {/* Success Overlay */}
                        {scanned && (
                            <LinearGradient
                                colors={['rgba(0, 183, 181, 0.9)', 'rgba(0, 128, 128, 0.9)']}
                                style={styles.successOverlay}
                            >
                                <Text style={styles.successText}>Scanned Successfully!</Text>
                                <Text style={styles.scannedDataText}>{scannedData}</Text>
                            </LinearGradient>
                        )}
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: 'rgba(26, 34, 54, 0.85)',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 183, 181, 0.2)',
        shadowColor: '#00b7b5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        width: '100%',
    },
    headerText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 15,
        textShadowColor: 'rgba(0, 183, 181, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    subText: {
        fontSize: 16,
        color: '#b0c4de',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        opacity: 0.9,
    },
    cameraContainer: {
        position: 'relative',
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraBox: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0, 183, 181, 0.3)',
    },
    qrFrame: {
        width: 220,
        height: 220,
        position: 'absolute',
    },
    corner: {
        width: 30,
        height: 30,
        borderColor: '#00b7b5',
        position: 'absolute',
    },
    cornerTopLeft: {
        top: -2,
        left: -2,
        borderTopWidth: 3,
        borderLeftWidth: 3,
    },
    cornerTopRight: {
        top: -2,
        right: -2,
        borderTopWidth: 3,
        borderRightWidth: 3,
    },
    cornerBottomLeft: {
        bottom: -2,
        left: -2,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
    },
    cornerBottomRight: {
        bottom: -2,
        right: -2,
        borderBottomWidth: 3,
        borderRightWidth: 3,
    },
    permissionText: {
        fontSize: 18,
        color: '#b0c4de',
        textAlign: 'center',
        padding: 20,
    },
    successOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    scannedDataText: {
        fontSize: 16,
        color: '#e0ffff',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});