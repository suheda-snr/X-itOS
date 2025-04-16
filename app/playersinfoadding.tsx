import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useGameStore } from "@/stateStore/gameStore";
import { DisplayPlayers, Player } from "@/types/player";
import { addGuestPlayers } from "@/api/gameApi";
import { updateGameData } from "@/api/gameApi";



const PlayersInfoAddingScreen: React.FC = () => {
  const { gameData, updateGameData: updateStoreGameData } = useGameStore();
  const teamName = gameData?.teamName || "Team Name";
  const [newTeamName, setNewTeamName] = useState(teamName);
  const [isEditingName, setIsEditingName] = useState(false);
  const playersData = useGameStore(state => state.playersData)
  const setPlayersData = useGameStore(state => state.setPlayersData)
  const displayPlayers = useGameStore(state => state.displayPlayers)
  const setDisplayPlayers = useGameStore(state => state.setDisplayPlayers)

  const updatePlayerRole = (id: string, role: "Adult" | "Child" | ""): void => {
    const isAdult = role === "Adult";
    displayPlayers?.map((player) =>
      player.id === id ? setDisplayPlayers({ ...player, isAdult: isAdult }) : setDisplayPlayers(player)
    )

    console.log("updatedUser")
    console.log(displayPlayers)
  };

  const addGuest = () => {
    const newGuest: DisplayPlayers = { 
      id: `${displayPlayers.length * 2}`,
      name: `Guest ${displayPlayers.length + 1}`,
      isGuest: true,
      isAdult: null
    }

    setDisplayPlayers(newGuest)
  };

  const handleEditName = () => setIsEditingName(true);

  const handleSaveName = async () => {
    if (newTeamName.length > 15) {
      Alert.alert("Invalid Name", "Team names longer than 15 characters are not valid.");
      return;
    }

    Alert.alert(
      "Confirm Change",
      `Are you sure you want to change the team name to "${newTeamName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await updateGameData({
                teamName: newTeamName,
              });
              updateStoreGameData({ teamName: newTeamName });
              setIsEditingName(false);
            } catch (error) {
              console.log("Error updating team name:", error);
              Alert.alert("Error", "Failed to update team name. Please try again.");
            }
          },
        },
      ]
    );
  };

  const showInstructions = () => {
    Alert.alert(
      "Instructions",
      "Here you can add players to your team. Each player can be assigned a role: Adult or Child. INSTRUCTIONS TBA."
    );
  };

  async function startTheGame() {
    console.log(displayPlayers)
    if (displayPlayers?.filter(player => player.isAdult === null).length == 0) {
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
            onPress: async () => {
              const playersParam = JSON.stringify(playersData);
              const teamNameParam = JSON.stringify(teamName);
              await addGuestPlayers(displayPlayers)
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

      <Text style={styles.subtitle}>Players: {displayPlayers?.length}</Text>

      <FlatList
        data={displayPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <FontAwesome5 name="user" size={20} color="#ff4b8c" style={styles.icon} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Picker
              selectedValue={item.isAdult === null ? "" : item.isAdult ? "Adult" : "Child"}
              style={item.isGuest ? styles.picker : styles.pickerNotAvailable}
              onValueChange={(value) => updatePlayerRole(item.id, value as "" | "Adult" | "Child")}
              enabled={item.isGuest}
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
