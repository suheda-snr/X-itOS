import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logout } from '../api/authApi';

export default function PasscodeScreen() {
  const [passcode, setPasscode] = useState('');

  const handleSubmit = () => {
    // In a real app, you would validate the passcode here
    router.replace('/room');
  };

  const handleLogout = async () => {
    await logout();  // Call the logout function
    router.push('/login')
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <View style={styles.header}>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Enter Passcode</Text>
            <Text style={styles.subtitle}>
              Please enter the admin passcode to access admin panel.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Passcode</Text>
              <TextInput
                style={styles.input}
                value={passcode}
                onChangeText={setPasscode}
                placeholder="Enter 6-digit passcode"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToRooms}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.backToRoomsText}>Back to Rooms</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  titleContainer: {
    gap: 16,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
  },
  submitButton: {
    height: 56,
    backgroundColor: 'rgba(255, 75, 140, 0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4b8c',
  },
  submitButtonActive: {
    backgroundColor: '#ff4b8c',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToRooms: {
    alignSelf: 'center',
    padding: 8,
  },
  backToRoomsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  logoutButton: {
    marginTop: 24,
    height: 56,
    backgroundColor: '#ff4b8c',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4b8c',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});