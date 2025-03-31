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
});

export default roomStyles;
