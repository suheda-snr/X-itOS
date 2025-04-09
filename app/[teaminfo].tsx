import { useLocalSearchParams } from 'expo-router';
import React from "react";
import { useRouter } from "expo-router";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from '@/stateStore/gameStore';

interface Player {
  id: string;
  name: string;
  role: "Adult" | "Child" | "";
}

function TeamInfoScreen() {
  const { teamName, players } = useLocalSearchParams();
  const parsedTeamName: string = teamName ? JSON.parse(teamName as string) : "";
  const parsedPlayers: Player[] = players ? JSON.parse(players as string) : [];
  const displayPlayers = useGameStore(state => state.displayPlayers)

  const router = useRouter();

  const handleNavigateToStats = () => {
    router.push('/GameStatistics/[TeamStats]');
  };

  const navigateToPlayerActions = () => {
    router.push('/PlayerActions')
  }

  return (
    <LinearGradient colors={["#1a1a1a", "#2a2a2a"]} style={styles.container}>
      <Text style={styles.teamName}>{parsedTeamName}</Text>

      <FlatList
        data={displayPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <FontAwesome5 name="user" size={24} color="#ff4b8c" style={styles.icon} />
            <Text style={styles.playerName}>{item.name}</Text>
          </View>
        )}
      />

      <Text style={styles.footer}>Enjoy the game!</Text>

      {/* Button to redirect to the statistics, this route will be redirected when the game ends in actual project*/}
      <Text style={styles.redirectText} onPress={handleNavigateToStats}>
        Go to Team Statistics
      </Text>
      <Text style={styles.redirectText} onPress={navigateToPlayerActions}>
        Go to Player Actions
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  teamName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  playerName: {
    fontSize: 18,
    color: "#fff",
  },
  footer: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 40,
    color: "#ff4b8c",
  },
  redirectText: {
    fontSize: 18,
    color: "#ff4b8c",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

export default TeamInfoScreen;
