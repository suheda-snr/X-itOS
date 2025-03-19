import { StyleSheet } from 'react-native';

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
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    roomTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    viewDetailsButton: {
        backgroundColor: '#ff4b8c',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
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
