// qrScannerStyles.js
import { StyleSheet } from 'react-native';
import { colors } from '@/styles/common';

const qrScannerStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.dark2,
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.textSecondary,
        width: '100%',
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
        borderColor: colors.borderLight,
    },
    qrFrame: {
        width: 220,
        height: 220,
        position: 'absolute',
    },
    corner: {
        width: 30,
        height: 30,
        borderColor: colors.textSecondary,
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
    successOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: colors.overlay,
    },
});

export default qrScannerStyles;
