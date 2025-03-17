import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompanyStore } from '@/stateStore/companyStore';

export default function RoomScreen() {
  const room = useCompanyStore.getState().chosenRoom

  const handleBookRoom = () => {
    // Navigate to booking screen
    // router.push('/booking');
  };

  const handleViewMap = () => {
    // Navigate to map screen
    // router.push('/map');
  };

  const handleBackToRooms = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1573652636601-d6fdcfc59640?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.roomTitle}>{room?.name}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={24} color="#ff4b8c" />
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>TBA</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={24} color="#ff4b8c" />
              <Text style={styles.infoLabel}>Team Size</Text>
              <Text style={styles.infoValue}>TBA</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="trending-up-outline" size={24} color="#ff4b8c" />
              <Text style={styles.infoLabel}>Success Rate</Text>
              <Text style={styles.infoValue}>TBA</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="star-outline" size={24} color="#ff4b8c" />
              <Text style={styles.infoLabel}>Difficulty</Text>
              <Text style={styles.infoValue}>TBA</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{room?.description}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleBookRoom}
            >
              <Text style={styles.actionButtonText}>Book Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleBackToRooms}
            >
              <Text style={styles.actionButtonText}>Back to Rooms</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.mapLink}
            onPress={handleViewMap}
          >
            <Text style={styles.mapLinkText}>View Escape Room Map</Text>
          </TouchableOpacity>
        </ScrollView>
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
    padding: 20,
  },
  roomTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    width: '45%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#ccc',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 16,
  },
  actionButton: {
    height: 56,
    backgroundColor: '#ff4b8c',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4b8c',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,75,140,0.2)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapLink: {
    alignSelf: 'center',
    marginBottom: 24,
    padding: 8,
  },
  mapLinkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});