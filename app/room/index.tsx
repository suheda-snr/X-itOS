import React from 'react';
import { useCompanyStore } from '@/stateStore/companyStore';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, Text, View, TouchableOpacity, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton } from '@/components/elements/IconButton';
import { logout } from '../../api/authApi';
import { Room } from '@/types/room';
import commonStyles, { colors } from '@/styles/common';
import roomStyles from '@/styles/room';

export default function RoomsScreen() {
  const setChosenRoom = useCompanyStore(state => state.setChosenRoom);

  const handleAdminLogout = async () => {
    await logout('admin');
    router.push('/welcome');
  };

  const navigateToRoomDetails = (roomId: string) => {
    setChosenRoom(roomId);
    router.push(`/room/${roomId}`);
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      }}
      style={commonStyles.container}
    >
      <LinearGradient colors={[colors.overlay, colors.darkerOverlay]} style={commonStyles.overlay}>
        <ScrollView >

          <View style={commonStyles.content}>
            <Text style={commonStyles.title}>Select a Room</Text>
            {useCompanyStore.getState().roomsData?.map((room: Room) => (
              <View key={room.id} style={roomStyles.roomItem}>
                <Text style={roomStyles.roomTitle}>{room.name}</Text>
                <TouchableOpacity
                  style={roomStyles.viewDetailsButton}
                  onPress={() => navigateToRoomDetails(room.id)}
                >
                  <Text style={roomStyles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={commonStyles.form}>
              <IconButton
                title="Logout"
                onPress={handleAdminLogout}
                iconName="log-out-outline"
              />
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}