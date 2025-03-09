import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export interface Player {
  id: string;
  name: string;
  role: "Adult" | "Child" | "";
}

const PlayersInfoAddingScreen: React.FC = () => {
  const [teamName, setTeamName] = useState<string>("Team1");
  const [newTeamName, setNewTeamName] = useState(teamName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "John Doe", role: "Adult" },
    { id: "2", name: "Jane Doe", role: "Adult" },
    { id: "3", name: "Johnathan Doe", role: "Child" },
  ]);

  const updatePlayerRole = (id: string, role: "Adult" | "Child" | ""): void => {
    setPlayers(players.map(player => (player.id === id ? { ...player, role } : player)));
  };

  const addGuest = (): void => {
    setPlayers([...players, { id: Date.now().toString(), name: `Guest ${players.length + 1}`, role: "" }]);
  };

  const handleEditName = () => setIsEditingName(true);

  const handleSaveName = () => {
    if (newTeamName.length > 15) {
      Alert.alert("Invalid Name", "Team names longer than 15 characters are not valid.");
      return;
    }
    setTeamName(newTeamName);
    setIsEditingName(false);
  };

  const showInstructions = () => {
    Alert.alert(
      "Instructions",
      "Here you can add players to your team. Each player can be assigned a role: Adult or Child. INSTRUCTIONS TBA."
    );
  };

  function startTheGame() {
    if (players.filter(player => player.role == "").length == 0) {
      Alert.alert(
        "Are you sure?",
        "Are you sure you want to start the game?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              const playersParam = JSON.stringify(players);
              const teamNameParam = JSON.stringify(teamName);
              router.push(`/teaminfo?players=${encodeURIComponent(playersParam)}&teamName=${encodeURIComponent(teamNameParam)}`);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert("Warning", "Not all players have roles!");
    }
  }

  return (
    <LinearGradient colors={["#1a1a1a", "#2a2a2a"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Team name:</Text>
        {isEditingName ? (
          <>
            <TextInput
              style={styles.input}
              value={newTeamName}
              onChangeText={setNewTeamName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.teamName}>{teamName}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditName}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.subtitle}>Players: {players.length}</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <FontAwesome5 name="user" size={20} color="#ff4b8c" style={styles.icon} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Picker
              selectedValue={item.role}
              style={item.name.startsWith("Guest") ? styles.picker : styles.pickerNotAvailable}
              onValueChange={(value) => updatePlayerRole(item.id, value as "Adult" | "Child" | "")}
              enabled={item.name.startsWith("Guest")}
            >
              <Picker.Item label="Choose..." value="" />
              <Picker.Item label="Adult" value="Adult" />
              <Picker.Item label="Child" value="Child" />
            </Picker>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={showInstructions}>
          <FontAwesome5 name="info-circle" size={32} color="#ff4b8c" />
        </TouchableOpacity>
        <View style={styles.buttonsGroup}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={() => router.push('/QRScanner/PersonalQR')}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={addGuest}>
            <Text style={styles.buttonText}>Add Guest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={() => startTheGame()}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", marginRight: 10 },
  teamName: { fontSize: 18, color: "#fff", marginRight: 10 },
  editButton: { padding: 5, backgroundColor: "#ff4b8c", borderRadius: 5 },
  saveButton: { padding: 5, backgroundColor: "#ff4b8c", borderRadius: 5, marginLeft: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  input: { borderBottomWidth: 1, borderColor: "#fff", padding: 5, flex: 1, color: "#fff" },
  subtitle: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  playerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  icon: { marginRight: 10 },
  playerName: { flex: 1, fontSize: 16, color: "#fff" },
  picker: { width: 200, color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" },
  pickerNotAvailable: { width: 200, color: "#fff" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { padding: 10, backgroundColor: "#ff4b8c", borderRadius: 5, marginHorizontal: 10 },
  startButton: { padding: 10, backgroundColor: "#ff4b8c", borderRadius: 5, marginHorizontal: 10 },
  buttonsGroup: { flexDirection: "row", justifyContent: "space-between" },
});

export default PlayersInfoAddingScreen;

