import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Greeting(): JSX.Element {
    const companyName: string = "EscapeX";
    const roomName: string = "Game Room 1";
    const isRoomSet: boolean = false;

    const instructions: string = isRoomSet
        ? `Scan your ticket QR code to begin your adventure in ${roomName}`
        : "Please proceed to the admin panel.";

    return (
        <LinearGradient colors={['#1a2236', '#2a3555', '#0f172a']} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.mainTitle}>{companyName}</Text>
                    {isRoomSet && <Text style={styles.title}>Welcome to {roomName}</Text>}
                    <Text style={styles.subtitle}>{instructions}</Text>
                    {isRoomSet && (
                        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                            <LinearGradient colors={['#00b7b5', '#008080']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
                                <Text style={styles.buttonText}>Begin Your Journey</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </LinearGradient>
    );
}

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
    },
    mainTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 25,
        textShadowColor: 'rgba(0, 183, 181, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#e0ffff',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 16,
        color: '#b0c4de',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        opacity: 0.9,
    },
    button: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 14,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});