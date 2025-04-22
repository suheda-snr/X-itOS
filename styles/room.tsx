import { StyleSheet } from 'react-native';
import { colors } from '@/styles/common';

const roomStyles = StyleSheet.create({
    roomList: {
        marginTop: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    roomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: colors.backgroundLight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    roomTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    viewDetailsButton: {
        backgroundColor: colors.textSecondary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        alignItems: 'center',
    },

    // styles for Room details screen
    content: {
        flex: 1,
        padding: 20,
    },
    roomScreenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 24,
        textAlign: 'center',
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    infoItem: {
        width: '45%',
        backgroundColor: colors.backgroundLight,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    infoLabel: {
        fontSize: 14,
        color: '#ccc',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    descriptionContainer: {
        backgroundColor: colors.backgroundLight,
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    descriptionLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#ccc',
        lineHeight: 24,
    },
    buttonContainer: {
        gap: 16,
        marginBottom: 16,
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,75,140,0.2)',
    },
    mapLink: {
        alignSelf: 'center',
        marginBottom: 24,
        padding: 8,
    },
});

export default roomStyles;
