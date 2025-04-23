import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Leaderboard from './Leaderboard';
import commonStyles, { colors } from '../../styles/common';
import qrScannerStyles from '../../styles/qrScannerStyles';
import { useGameStore } from '@/stateStore/gameStore';

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
    const [isCompleted, setIscompleted] = useState<boolean>(true);
    const gameData = useGameStore(state => state.gameData)

    const handleSharePress = () => {
        setShareDecision(true);
        console.log('Sharing score:', {
            team: gameData?.teamName,
            game: teamStatsData.gameName,
            score: teamStatsData.totalScore,
            hints: useGameStore.getState().hintsUsed,
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
        <LinearGradient 
            colors={[colors.dark1, colors.dark2, colors.dark1]} 
            style={[commonStyles.container]}
        >
            <View style={[commonStyles.content]}>
                <View style={[qrScannerStyles.card]}>
                    <Text style={[commonStyles.title, { textTransform: 'uppercase' }]}>
                        {gameData?.teamName} STATISTICS
                    </Text>

                    {isCompleted ? (
                        <>
                            <Text style={[commonStyles.subtitle, {
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }]}>
                                CONGRATULATIONS {gameData?.teamName}!🎉
                            </Text>
                            <Text style={commonStyles.subtitle}>
                                '{teamStatsData.gameName}' completed in {useGameStore.getState().timeOfGame} seconds
                            </Text>

                            <View style={{ marginVertical: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <Text style={{ fontSize: 18, color: colors.textSecondary, marginRight: 10, width: 20 }}>⏱</Text>
                                    <Text style={commonStyles.label}>
                                        {Math.floor(timeLeft)} minutes left
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <Text style={{ fontSize: 18, color: colors.textSecondary, marginRight: 10, width: 20 }}>💡</Text>
                                <Text style={commonStyles.label}>
                                    {useGameStore.getState().hintsUsed} hints used
                                </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <Text style={{ fontSize: 18, color: colors.textSecondary, marginRight: 10, width: 20 }}>🏆</Text>
                                    <Text style={commonStyles.label}>
                                        Total score: {teamStatsData.totalScore}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ marginVertical: 20 }}>
                                <Text style={commonStyles.label}>
                                    Would you like to share your team stats with others?
                                </Text>
                                <Text style={[commonStyles.label, { color: colors.textSecondary }]}>
                                    Note: Choosing "NO" will permanently delete your stats.
                                </Text>

                                <View style={commonStyles.form}>
                                    <TouchableOpacity
                                        style={[commonStyles.button, commonStyles.buttonActive]}
                                        onPress={handleSharePress}
                                    >
                                        <Text style={commonStyles.buttonText}>YES</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={commonStyles.button}
                                        onPress={handleNoShare}
                                    >
                                        <Text style={commonStyles.buttonText}>NO</Text>
                                    </TouchableOpacity>
                                </View>

                                {shareDecision !== null && (
                                    <Text style={[commonStyles.label, { marginTop: 16 }]}>
                                        {shareDecision
                                            ? 'Stats shared successfully!'
                                            : 'Stats have been permanently deleted.'
                                        }
                                    </Text>
                                )}
                            </View>
                        </>
                    ) : (
                        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <Text style={[commonStyles.title, { color: colors.textSecondary }]}>
                                MISSION FAILED!
                            </Text>
                            <Text style={commonStyles.subtitle}>
                                {teamStatsData.teamName} couldn't crack '{teamStatsData.gameName}' this time.
                            </Text>
                            <Text style={[commonStyles.subtitle, { fontStyle: 'italic' }]}>
                                Don’t give up! Review your strategy and try again next time.
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={commonStyles.iconButton}
                        onPress={handleLeaderboardPress}
                    >
                        <Text style={commonStyles.iconButtonText}>LEADERBOARD: TOP 5</Text>
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

export default TeamStats;