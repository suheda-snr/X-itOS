import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const { code } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome</Text>
          
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#ff4b8c" />
          </View>
          
          <Text style={styles.title}>Welcome to ESCAPE MASTER!</Text>
          <Text style={styles.subtitle}>
            Your booking has been confirmed. Get ready for an exciting adventure!
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Booking Reference:</Text>
            <Text style={styles.codeValue}>{code}</Text>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/passcode')}
          >
            <Text style={styles.startButtonText}>Start Your Experience</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  codeContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
  },
  codeLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  codeValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
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