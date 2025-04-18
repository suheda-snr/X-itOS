import { StyleSheet } from 'react-native';
import { colors } from './common';

const PlayersInfoAddingScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        marginRight: 10
    },
    teamName: {
        fontSize: 18,
        color: colors.white,
        marginRight: 10
    },
    editButton: {
        padding: 5,
        backgroundColor: colors.primary,
        borderRadius: 5
    },
    saveButton: {
        padding: 5,
        backgroundColor: colors.primary,
        borderRadius: 5,
        marginLeft: 10
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold'
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.white,
        padding: 5,
        flex: 1,
        color: colors.white
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 10
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    icon: {
        marginRight: 10
    },
    playerName: {
        flex: 1,
        fontSize: 16,
        color: colors.white
    },
    picker: {
        width: 200,
        color: colors.white,
        backgroundColor: colors.backgroundLight
    },
    pickerNotAvailable: {
        width: 200,
        color: colors.white
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    button: {
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 5,
        marginHorizontal: 10
    },
    startButton: {
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 5,
        marginHorizontal: 10
    },
    buttonsGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});

export default PlayersInfoAddingScreenStyles;