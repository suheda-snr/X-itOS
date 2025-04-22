import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompanyStore } from '@/stateStore/companyStore';
import commonStyles, { colors } from '@/styles/common';
import roomStyles from '@/styles/room';

export default function RoomScreen() {
  const room = useCompanyStore(state => state.chosenRoom);
  const selectedRoomForGame = useCompanyStore(state => state.selectedRoomForGame)
  const isRoomReady = useCompanyStore(state => state.isRoomSet);
  const setIsRoomSet = useCompanyStore(state => state.setIsRoomSet);
  const setSelectedRoomForGame = useCompanyStore(state => state.setSelectedRoomForGame);

  const handleSetRoom = () => {
    if (isRoomReady) {
      Alert.alert(
        "Are you sure?",
        `Are you sure you want to reset previously selected room? Currently the selected room's name: ${selectedRoomForGame?.name}`,
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              if (room) {
                console.log("room info from screen!!!!! ")
                console.log(room)
                console.log("updating state...")
                setSelectedRoomForGame(room);
                Alert.alert("Success", "The room has been set up successfully");
              } else {
                Alert.alert("Error", "Error setting the room");
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      setIsRoomSet(true);
      if (room) {
        console.log("room info!!!!! ")
        console.log(room)
        setSelectedRoomForGame(room);
        Alert.alert("Success", "The room has been set up successfully");
      } else {
        Alert.alert("Error", "Error setting the room");
      }
    }
  };

  const handleViewMap = () => {
    // Navigate to map screen
    router.push(`/room/map`);
  };

  const handleBackToRooms = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1573652636601-d6fdcfc59640?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={commonStyles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
        style={commonStyles.overlay}
      >
        <ScrollView style={roomStyles.content} showsVerticalScrollIndicator={false}>
          <Text style={roomStyles.roomScreenTitle}>{room?.name}</Text>

          <View style={roomStyles.infoGrid}>
            <View style={roomStyles.infoItem}>
              <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
              <Text style={roomStyles.infoLabel}>Duration</Text>
              <Text style={roomStyles.infoValue}>{room?.duration} minutes</Text>
            </View>
            <View style={roomStyles.infoItem}>
              <Ionicons name="star-outline" size={24} color={colors.textSecondary} />
              <Text style={roomStyles.infoLabel}>Difficulty</Text>
              <Text style={roomStyles.infoValue}>{room?.difficulty}</Text>
            </View>
          </View>

          <View style={roomStyles.descriptionContainer}>
            <Text style={roomStyles.descriptionLabel}>Description</Text>
            <Text style={roomStyles.description}>{room?.description}</Text>
          </View>

          <View style={roomStyles.buttonContainer}>
            <TouchableOpacity
              style={[commonStyles.button, isRoomReady && roomStyles.secondaryButton]}
              onPress={handleSetRoom}
            >
              <Text style={commonStyles.buttonText}>
                {isRoomReady ? "Reset room" : "Set the room"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={roomStyles.mapLink}
            onPress={handleViewMap}
          >
            <Text style={commonStyles.forgotPasswordText}>View Escape Room Map</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}
