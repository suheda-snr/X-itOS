import { useLocalSearchParams } from 'expo-router';
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Player {
  id: string;
  name: string;
  role: "Adult" | "Child" | "";
}

function TeamInfoScreen() {
  const { teamName, players } = useLocalSearchParams();
  const parsedTeamName: string = teamName ? JSON.parse(teamName as string) : "";
  const parsedPlayers: Player[] = players ? JSON.parse(players as string) : [];

  return (
    <LinearGradient colors={["#1a1a1a", "#2a2a2a"]} style={styles.container}>
      <Text style={styles.teamName}>{parsedTeamName}</Text>

      <FlatList
        data={parsedPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <FontAwesome5 name="user" size={24} color="#ff4b8c" style={styles.icon} />
            <Text style={styles.playerName}>{item.name}</Text>
          </View>
        )}
      />
      
      <Text style={styles.footer}>Enjoy the game!</Text>
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
});

export default TeamInfoScreen;
