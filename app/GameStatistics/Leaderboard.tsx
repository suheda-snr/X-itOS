import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import commonStyles, { colors } from '../../styles/common';
import qrScannerStyles from '../../styles/qrScannerStyles';

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
        <View style={[commonStyles.overlay, { position: 'absolute', top: 20, right: 20 }]}>
            <View style={[qrScannerStyles.card, { width: 250, maxHeight: 300 }]}>
                <TouchableOpacity 
                    style={{ position: 'absolute', top: 5, right: 5, padding: 5 }} 
                    onPress={onClose}
                >
                    <Text style={[commonStyles.buttonText, { color: colors.textSecondary }]}>
                        X
                    </Text>
                </TouchableOpacity>
                <Text style={[commonStyles.title, { textTransform: 'uppercase', marginBottom: 10 }]}>
                    🏅 TOP 5
                </Text>
                {leaderboardData.map((team, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, color: colors.textSecondary, marginRight: 10 }}>🌟</Text>
                        <Text style={commonStyles.label}>{team.teamName}</Text>
                        <Text style={[commonStyles.label, { marginLeft: 'auto' }]}>
                            {team.score} points
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default Leaderboard;