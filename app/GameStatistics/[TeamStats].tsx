import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Leaderboard from './Leaderboard';

interface TeamStats {
    teamName: string;
    startTime: Date;
    endTime: Date;
    hintsUsed: number;
    totalScore: number;
    gameName: string;
}

const teamStatsData: TeamStats = {
    teamName: "Team 1",
    startTime: new Date('2025-03-03T10:00:00'),
    endTime: new Date('2025-03-03T10:45:00'),
    hintsUsed: 3,
    totalScore: 1500,
    gameName: "Escape Challenge",
};

const MAX_GAME_TIME: number = 60;
const timeTaken: number = Math.min(
    (teamStatsData.endTime.getTime() - teamStatsData.startTime.getTime()) / (1000 * 60),
    MAX_GAME_TIME
);
const timeLeft: number = Math.max(0, MAX_GAME_TIME - timeTaken);

const TeamStats = () => {
    const [shareDecision, setShareDecision] = useState<boolean | null>(null);
    const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(true);

    const handleSharePress = () => {
        setShareDecision(true);
        console.log('Sharing score:', {
            team: teamStatsData.teamName,
            game: teamStatsData.gameName,
            score: teamStatsData.totalScore,
            hints: teamStatsData.hintsUsed,
            timeTaken,
        });
    };

    const handleNoShare = () => {
        setShareDecision(false);
        console.log('Stats deleted permanently');
    };

    const handleLeaderboardPress = () => {
        setShowLeaderboard(!showLeaderboard);
    };

    return (
        <LinearGradient colors={['#1a2a3d', '#2a3d52', '#0f172a']} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.mainTitle}>{teamStatsData.teamName} STATISTICS</Text>

                    {/* Conditional rendering based on isCompleted */}
                    {isCompleted ? (
                        <>
                            <Text style={styles.congratsText}>CONGRATULATIONS {teamStatsData.teamName}!🎉</Text>
                            <Text style={styles.subtitle}>
                                'Escape Challenge' completed in {Math.floor(timeTaken)} minutes
                            </Text>

                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>⏱</Text>
                                    <Text style={styles.statText}>{Math.floor(timeLeft)} minutes left</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>💡</Text>
                                    <Text style={styles.statText}>{teamStatsData.hintsUsed} hints used</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>🏆</Text>
                                    <Text style={styles.statText}>Total score: {teamStatsData.totalScore}</Text>
                                </View>
                            </View>

                            <View style={styles.shareContainer}>
                                <Text style={styles.shareText}>
                                    Would you like to share your team stats with others?
                                </Text>
                                <Text style={styles.shareNote}>
                                    Note: Choosing "NO" will permanently delete your stats.
                                </Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.yesButton]}
                                        onPress={handleSharePress}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.buttonText}>YES</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.noButton]}
                                        onPress={handleNoShare}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.buttonText}>NO</Text>
                                    </TouchableOpacity>
                                </View>

                                {shareDecision !== null && (
                                    <Text style={[
                                        styles.shareNote,
                                        styles.decision,
                                    ]}>
                                        {shareDecision
                                            ? 'Stats shared successfully!'
                                            : 'Stats have been permanently deleted.'
                                        }
                                    </Text>
                                )}
                            </View>
                        </>
                    ) : (
                        <View style={styles.unsuccessfulContainer}>
                            <Text style={styles.unsuccessfulTitle}>MISSION FAILED!</Text>
                            <Text style={styles.unsuccessfulSubtitle}>
                                {teamStatsData.teamName} couldn't crack '{teamStatsData.gameName}' this time.
                            </Text>
                            <Text style={styles.motivationalText}>
                                Don’t give up! Review your strategy and try again next time.
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.leaderboardButton}
                        onPress={handleLeaderboardPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.leaderboardText}>LEADERBOARD: TOP 5</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Leaderboard
                visible={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        maxWidth: 1000,
    },
    card: {
        backgroundColor: 'rgba(26, 42, 61, 0.9)',
        padding: 25,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(0, 183, 181, 0.5)',
        shadowColor: '#00b7b5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        width: '100%',
        maxWidth: 800,
    },
    mainTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: '#00b7b5',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
        textAlign: 'center',
    },
    congratsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 14,
        color: '#a0c0d0',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    statsContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    statIcon: {
        fontSize: 18,
        color: '#00b7b5',
        marginRight: 10,
        width: 20,
    },
    statText: {
        fontSize: 14,
        color: '#e0f0ff',
        fontWeight: '500',
    },
    shareContainer: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'rgba(0, 183, 181, 0.1)',
        padding: 15,
        borderRadius: 10,
    },
    shareText: {
        fontSize: 14,
        color: '#a0c0d0',
        marginBottom: 10,
        textAlign: 'center',
    },
    shareNote: {
        fontSize: 12,
        color: '#ff6b6b',
        marginBottom: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },
    button: {
        borderRadius: 8,
        alignItems: 'center',
        width: 50,
    },
    yesButton: {
        backgroundColor: '#00b7b5',
        borderWidth: 1,
        borderColor: '#00e0dd',
    },
    noButton: {
        backgroundColor: '#ff4444',
        borderWidth: 1,
        borderColor: '#ff6666',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    decision: {
        color: '#ffffff',
    },
    leaderboardButton: {
        backgroundColor: '#008080',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    leaderboardText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    unsuccessfulContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    unsuccessfulTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#ff6b6b',
        textTransform: 'uppercase',
        marginBottom: 15,
        textAlign: 'center',
    },
    unsuccessfulSubtitle: {
        fontSize: 16,
        color: '#a0c0d0',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 22,
    },
    motivationalText: {
        fontSize: 14,
        color: '#e0f0ff',
        textAlign: 'center',
        marginBottom: 25,
        fontStyle: 'italic',
    },
});

export default TeamStats;
