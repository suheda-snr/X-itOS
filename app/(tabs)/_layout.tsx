import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rooms',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      /> */}
      {Platform.OS !== 'web' && (
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scan',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="qr-code" size={size} color={color} />
            ),
          }}
          // listeners={{
          //   tabPress: (e) => {
          //     // Prevent default navigation
          //     e.preventDefault();
          //     // Navigate to the scan screen
          //     router.push('/scan');
          //   },
          // }}
        />
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4b8c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});