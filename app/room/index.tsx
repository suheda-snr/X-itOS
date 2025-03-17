import React from 'react';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logout } from '../../api/authApi';
import { getRoomsByCompanyId } from '@/api/companyApi';
import { useCompanyStore } from '@/stateStore/companyStore';
import { Room } from '@/types/room';

export default function RoomsScreen() {
  const setChosenRoom = useCompanyStore(state => state.setChosenRoom)
  const handleAdminLogout = async () => {
    await logout('admin');
    router.push('/welcome');
  };

  const navigateToRoomDetails = (roomId: string) => {
    setChosenRoom(roomId)
    router.push(`/room/${roomId}`)
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >

        <View style={styles.content}>
          <Text style={styles.title}>Select a Room</Text>

          <ScrollView style={styles.roomList} showsVerticalScrollIndicator={false}>
            {useCompanyStore.getState().roomsData?.map((room: Room) => (
              <View key={room.id} style={styles.roomItem}>
                <Text style={styles.roomTitle}>{room.name}</Text>
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => navigateToRoomDetails(room.id)}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

      </LinearGradient>
      <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleAdminLogout}
          >
            <Ionicons name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  roomList: {
    maxHeight: '100%',
  },
  roomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20, // Increased space after each room item
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  viewDetailsButton: {
    backgroundColor: '#ff4b8c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  floatingButton: {
    width: '100%', // Make the button rectangular (full width)
    height: 50, // Set a specific height
    borderRadius: 10, // Adjust the corner radius for a rectangular shape
    backgroundColor: '#ff4b8c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});