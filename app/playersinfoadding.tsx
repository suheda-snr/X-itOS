import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useGameStore } from "@/stateStore/gameStore";
import { DisplayPlayers, Player } from "@/types/player";
import { addGuestPlayers, updateGameData, updateBookingState } from "@/api/gameApi";
import { checkProfanity } from '../utils/profanity';
import PlayersInfoAddingScreenStyles from '../styles/playersInfo';
import { colors } from '../styles/common';

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

    if (checkProfanity(newTeamName)) {
      Alert.alert("Invalid Name", "The team name contains inappropriate language. Please choose a different name.");
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
        "Are you sure you want to proceed forward with the game?",
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
              await addGuestPlayers(displayPlayers);
              const bookingId = gameData?.bookingId
              if (bookingId) {
                await updateBookingState(bookingId, "IN_PROGRESS");
              } else {
                console.error("Booking ID is undefined.");
              }
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
    <LinearGradient
      colors={[colors.dark1, colors.dark2]}
      style={PlayersInfoAddingScreenStyles.container}
    >
      <View style={PlayersInfoAddingScreenStyles.header}>
        <Text style={PlayersInfoAddingScreenStyles.title}>Team name:</Text>
        {isEditingName ? (
          <>
            <TextInput
              style={PlayersInfoAddingScreenStyles.input}
              value={newTeamName}
              onChangeText={setNewTeamName}
            />
            <TouchableOpacity
              style={PlayersInfoAddingScreenStyles.saveButton}
              onPress={handleSaveName}
            >
              <Text style={PlayersInfoAddingScreenStyles.buttonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={PlayersInfoAddingScreenStyles.teamName}>{teamName}</Text>
            <TouchableOpacity
              style={PlayersInfoAddingScreenStyles.editButton}
              onPress={handleEditName}
            >
              <Text style={PlayersInfoAddingScreenStyles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={PlayersInfoAddingScreenStyles.subtitle}>
        Players: {displayPlayers?.length}
      </Text>

      <FlatList
        data={displayPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={PlayersInfoAddingScreenStyles.playerRow}>
            <FontAwesome5
              name="user"
              size={20}
              color={colors.primary}
              style={PlayersInfoAddingScreenStyles.icon}
            />
            <Text style={PlayersInfoAddingScreenStyles.playerName}>{item.name}</Text>
            <Picker
              selectedValue={
                item.isAdult === null ? '' : item.isAdult ? 'Adult' : 'Child'
              }
              style={
                item.isGuest
                  ? PlayersInfoAddingScreenStyles.picker
                  : PlayersInfoAddingScreenStyles.pickerNotAvailable
              }
              onValueChange={(value) => updatePlayerRole(item.id, value as '' | 'Adult' | 'Child')}
              enabled={item.isGuest}
            >
              <Picker.Item label="Choose..." value="" />
              <Picker.Item label="Adult" value="Adult" />
              <Picker.Item label="Child" value="Child" />
            </Picker>
          </View>
        )}
      />

      <View style={PlayersInfoAddingScreenStyles.buttonContainer}>
        <TouchableOpacity onPress={showInstructions}>
          <FontAwesome5 name="info-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
        <View style={PlayersInfoAddingScreenStyles.buttonsGroup}>
          <TouchableOpacity style={PlayersInfoAddingScreenStyles.button}>
            <Text
              style={PlayersInfoAddingScreenStyles.buttonText}
              onPress={() => router.push('/QRScanner/PersonalQR')}
            >
              Scan QR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={PlayersInfoAddingScreenStyles.button}
            onPress={addGuest}
          >
            <Text style={PlayersInfoAddingScreenStyles.buttonText}>Add Guest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={PlayersInfoAddingScreenStyles.startButton}
            onPress={startTheGame}
          >
            <Text style={PlayersInfoAddingScreenStyles.buttonText}>Proceed to Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default PlayersInfoAddingScreen;