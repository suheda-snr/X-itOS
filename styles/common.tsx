import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
    },
    content: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    headerPressable: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Add a background color for the pressable area
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#ff4b8c',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    form: {
        gap: 24,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginLeft: 4,
    },
    input: {
        height: 56,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 56,
        backgroundColor: 'rgba(255, 75, 140, 0.5)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ff4b8c',
    },
    buttonActive: {
        backgroundColor: '#ff4b8c',
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255, 75, 140, 0.5)',
        borderColor: 'rgba(255, 75, 140, 0.5)',
    },

    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 2,
    },
    buttonTextActive: {
        color: '#fff',
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: 16,
        padding: 8,
    },
    forgotPasswordText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});

export default commonStyles;
