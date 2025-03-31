import { StyleSheet } from 'react-native';

export const colors = {
    white: '#fff',
    primary: '#ff4b8c',
    overlay: 'rgba(0, 0, 0, 0.7)',
    darkerOverlay: 'rgba(0, 0, 0, 0.9)',    
    backgroundLight: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.2)',
    buttonDefault: 'rgba(255, 75, 140, 0.5)',
    buttonActive: '#ff4b8c',
    buttonText: '#fff',
    textPrimary: '#fff',
    textSecondary: '#ff4b8c',
    linkText: '#fff',
    dark1: '#1a1a1a',
    dark2: '#2a2a2a',
};

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
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
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        letterSpacing: 4,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 30,
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
        color: colors.textPrimary,
        marginLeft: 4,
    },
    input: {
        height: 56,
        backgroundColor: colors.backgroundLight,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.borderLight,
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
        backgroundColor: colors.buttonDefault,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderWidth: 1,
        borderColor: colors.textSecondary,
    },
    buttonActive: {
        backgroundColor: colors.buttonActive,
    },
    buttonDisabled: {
        backgroundColor: colors.buttonDefault,
        borderColor: colors.buttonDefault,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.buttonText,
        letterSpacing: 2,
    },
    buttonTextActive: {
        color: colors.buttonText,
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: 16,
        padding: 8,
    },
    forgotPasswordText: {
        color: colors.linkText,
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    layoutHeaderSection: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    layoutLargeTitle: {
        fontSize: 40,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    layoutTitleContainer: {
        paddingVertical: 20,
    },
    iconButton: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: colors.buttonDefault,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        marginTop: 16,
    },
    iconButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
        marginLeft: 8,
    },
    iconButtonIcon: {
        marginRight: 4,
    },
});

export default commonStyles;
