import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 30,
        backgroundColor: '#333',
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    modalButton: {
        width: 200,
        alignSelf: 'center',
    }
});