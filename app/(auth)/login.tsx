import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../../api/authApi';
import { getCompanyName } from '@/api/companyApi';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Step 1: Check if email and password are provided
    console.log('Email:', email);
    console.log('Password:', password);

    if (email && password) {
      try {
        // Step 2: Call the login function and pass email and password
        console.log('Attempting to log in with email and password...');
        const token = await login(email, password);

        // Step 3: Check if token is received
        console.log('Received token:', token);

        if (token) {
          // Step 4: Successful login, navigate to the welcome screen
          console.log('Login successful, navigating to welcome screen...');
          // my imposter function :) if the login is successfull, gets the company data based on companyID
          await getCompanyName()
          router.replace('/welcome');
        } else {
          console.log('Login failed, no token received.');
        }
      } catch (error) {
        // Step 5: Catch and log any errors that occur during the login process
        console.error('Error during login:', error);
      }
    } else {
      // Step 6: Handle the case where email or password is missing
      console.error('Email or password missing');
    }
  };


  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your company account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, email && password ? styles.loginButtonActive : null]}
              onPress={handleLogin}
            >
              <Text style={[styles.loginButtonText, email && password ? styles.loginButtonTextActive : null]}>
                ENTER
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ff4b8c',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    height: 56,
    backgroundColor: 'rgba(255, 75, 140, 0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ff4b8c',
  },
  loginButtonActive: {
    backgroundColor: '#ff4b8c',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
  },
  loginButtonTextActive: {
    color: '#fff',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});