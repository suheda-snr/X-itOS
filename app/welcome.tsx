import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import useAuthStore from '@/stateStore/authStore';
import { useCompanyStore } from '@/stateStore/companyStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const [count, setCount] = useState(1);
  const isRoomSet = useCompanyStore(state => state.isRoomSet);
  const companyName = useCompanyStore(state => state.companyData?.name);
  const room = useCompanyStore(state => state.selectedRoomForGame);
  console.log("SELECTED ROOM STATE")
  console.log(room)

  function navigateToPasscode() {
    if (count >= 5) {
      setCount(1);
      router.push('/passcode');
    } else {
      setCount(prevCount => prevCount + 1);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => navigateToPasscode()} style={styles.headerPressable}>
            <Text style={styles.headerTitle}>{companyName}</Text>
          </Pressable>

          <View style={styles.roomTitleContainer}>
            <Text style={styles.title}>{isRoomSet ? `Welcome to ${room?.name}` : "Welcome"}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {isRoomSet ? (
            <>
              <Text style={styles.subtitle}>
                Scan your ticket QR code to begin your adventure in {room?.name}
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push('/QRScanner/TicketQR')}
              >
                <Text style={styles.startButtonText}>Begin Your Adventure</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.subtitle}>
              Room is not set for this device. Please navigate to the admin panel.
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerPressable: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '600',
    color: '#fff',
  },
  roomTitleContainer: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#ff4b8c',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
