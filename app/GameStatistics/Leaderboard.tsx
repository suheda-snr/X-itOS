import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

export interface LeaderboardEntry {
    teamName: string;
    score: number;
}

interface LeaderboardProps {
    visible: boolean;
    onClose: () => void;
}

const leaderboardData: LeaderboardEntry[] = [
    { teamName: "Team 1", score: 1500 },
    { teamName: "Team 2", score: 1400 },
    { teamName: "Team 3", score: 1300 },
    { teamName: "Team 4", score: 1200 },
    { teamName: "Team 5", score: 1100 },
];

const Leaderboard = ({ visible, onClose }: LeaderboardProps) => {
    if (!visible) return null;

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.leaderboardTitle}>🏅 TOP 5</Text>
                {leaderboardData.map((team, index) => (
                    <View key={index} style={styles.leaderboardItem}>
                        <Text style={styles.leaderboardIcon}>🌟</Text>
                        <Text style={styles.leaderboardTeamName}>{team.teamName}</Text>
                        <Text style={styles.leaderboardScore}>{team.score} points</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'rgba(26, 42, 61, 0.9)',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(0, 183, 181, 0.5)',
        shadowColor: '#00b7b5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        width: 250,
        maxHeight: 300,
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 5,
    },
    closeText: {
        fontSize: 16,
        color: '#ff4444',
        fontWeight: 'bold',
    },
    leaderboardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00b7b5',
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    leaderboardIcon: {
        fontSize: 16,
        color: '#00b7b5',
        marginRight: 10,
    },
    leaderboardTeamName: {
        fontSize: 14,
        color: '#e0f0ff',
        flex: 1,
    },
    leaderboardScore: {
        fontSize: 14,
        color: '#e0f0ff',
        fontWeight: '500',
    },
});

export default Leaderboard;