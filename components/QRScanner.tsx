import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import commonStyles, { colors } from '@/styles/common';
import { QRScannerProps } from '@/types/componentInterfaces';
import qrScannerStyles from '@/styles/qrScannerStyles';

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
            <View style={[commonStyles.container, { backgroundColor: colors.dark1 }]}>
                <View style={commonStyles.container}>
                    <Text style={commonStyles.subtitle}>Camera access is required to scan QR codes</Text>
                </View>
            </View>
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
        <LinearGradient
            colors={[colors.dark1, colors.dark2]}
            style={[commonStyles.container, { flex: 1 }]}
        >
            <View style={{ ...commonStyles.container, marginTop: 20 }}>
                <View style={qrScannerStyles.card}>
                    <Text style={commonStyles.title}>{title}</Text>
                    <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>{subtitle}</Text>

                    <View style={qrScannerStyles.cameraContainer}>
                        <CameraView
                            onBarcodeScanned={handleBarCodeScanned}
                            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                            style={qrScannerStyles.cameraBox}
                        />
                        <View style={qrScannerStyles.qrFrame}>
                            <View style={[qrScannerStyles.corner, qrScannerStyles.cornerTopLeft]} />
                            <View style={[qrScannerStyles.corner, qrScannerStyles.cornerTopRight]} />
                            <View style={[qrScannerStyles.corner, qrScannerStyles.cornerBottomLeft]} />
                            <View style={[qrScannerStyles.corner, qrScannerStyles.cornerBottomRight]} />
                        </View>

                        {/* Success Overlay */}
                        {scanned && (
                            <LinearGradient
                                colors={[colors.textSecondary, colors.buttonDefault]}
                                style={qrScannerStyles.successOverlay}
                            >
                                <Text style={commonStyles.title}>Scanned Successfully!</Text>
                                <Text style={[commonStyles.title, { fontSize: 15 }]}>{scannedData}</Text>
                            </LinearGradient>
                        )}
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};