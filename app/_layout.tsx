import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import React from 'react';

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <>
      <Stack screenOptions={{
    headerStyle: {
      backgroundColor: "transparent", // Change header background color
      ...Platform.select({
        android: { elevation: 1 }, // Remove shadow on Android
        ios: { shadowOpacity: 0 }, // Remove shadow on iOS
      }),
      
    },
    headerTintColor: "#333333", // Change text color
    headerTitleStyle: {
      fontSize: 16, // Reduce title font size
    },
    headerBackVisible: true, // Hide back button 

  }}>
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen name="welcome" options={{ title: "Welcome" }} />
        <Stack.Screen name="[teaminfo]" options={{ title: "Team info" }} />
        <Stack.Screen name="playersinfoadding" options={{ title: "Player Info Adding" }} />
        <Stack.Screen name="passcode" options={{ title: "Enter Passcode" }} />
        <Stack.Screen name="room/index" options={{ title: "Room Selection", headerShown: false, }} />
        <Stack.Screen name="room/[id]" options={{ title: "Room Details" }} />
        <Stack.Screen name="room/map" options={{ title: "Map"}} />
        <Stack.Screen name="/QRScanner/TicketQR" options={{ title: "Ticket Scanning" }} />
        <Stack.Screen name="/QRScanner/PersonalQR" options={{ title: "Personal QR" }} />
        <Stack.Screen name="GameStatistics/[TeamStats]" options={{ title: "Team Statistics" }} />
      </Stack>
    </>
  );
}