import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen name="welcome" options={{ title: "Welcome" }} />
        <Stack.Screen name="[teaminfo]" options={{ title: "Team info" }} />
        <Stack.Screen name="playersinfoadding" options={{ title: "Player Info Adding" }} />
        <Stack.Screen name="passcode" options={{ title: "Enter Passcode" }} />
        <Stack.Screen name="room/index" options={{ title: "Room Selection" }} />
        <Stack.Screen name="room/[id]" options={{ title: "Room Details" }} />
        <Stack.Screen name="/room/map" options={{ title: "Map" }} />
        <Stack.Screen name="/QRScanner/TicketQR" options={{ title: "Ticket Scanning" }} />
        <Stack.Screen name="/QRScanner/PersonalQR" options={{ title: "Personal QR" }} />
        <Stack.Screen name="GameStatistics/[TeamStats]" options={{ title: "Team Statistics" }} />
      </Stack>
    </>
  );
}