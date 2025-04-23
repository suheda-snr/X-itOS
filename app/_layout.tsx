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
        headerTransparent: true,
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
        <Stack.Screen name="index" options={{ title: "" }} />
        <Stack.Screen name="welcome" options={{ title: "" }} />
        <Stack.Screen name="[teaminfo]" options={{ title: "" }} />
        <Stack.Screen name="playersinfoadding" options={{ title: "" }} />
        <Stack.Screen name="passcode" options={{ title: "" }} />
        <Stack.Screen name="room/index" options={{ title: "", headerShown: false, }} />
        <Stack.Screen name="room/[id]" options={{ title: "" }} />
        <Stack.Screen name="room/map" options={{ title: "" }} />
        <Stack.Screen name="/QRScanner/TicketQR" options={{ title: "" }} />
        <Stack.Screen name="/QRScanner/PersonalQR" options={{ title: "" }} />
        <Stack.Screen name="GameStatistics/[TeamStats]" options={{ title: "" }} />
      </Stack>
    </>
  );
}