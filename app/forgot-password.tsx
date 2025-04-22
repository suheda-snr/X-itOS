// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function ForgotPasswordScreen() {
//   const [email, setEmail] = useState('');

//   const handleResetPassword = () => {
//     // Handle password reset logic here
//     router.back();
//   };

//   return (
//     <ImageBackground
//       source={{ uri: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
//       style={styles.container}
//     >
//       <LinearGradient
//         colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
//         style={styles.overlay}
//       >
//         {/* <View style={styles.header}>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => router.back()}
//           >
//             <Ionicons name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//         </View> */}

//         <View style={styles.content}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.title}>Forgot Password?</Text>
//             <Text style={styles.subtitle}>
//               Don't worry! It happens. Please enter the email address associated with your account.
//             </Text>
//           </View>

//           <View style={styles.form}>
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Email Address</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your email"
//                 placeholderTextColor="#999"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             </View>

//             <TouchableOpacity 
//               style={[styles.resetButton, email ? styles.resetButtonActive : null]}
//               onPress={handleResetPassword}
//               disabled={!email}
//             >
//               <Text style={styles.resetButtonText}>Reset Password</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.backToLogin}
//               onPress={() => router.back()}
//             >
//               <Text style={styles.backToLoginText}>Back to Login</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     padding: 24,
//   },
//   header: {
//     marginTop: 40,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     gap: 40,
//   },
//   titleContainer: {
//     gap: 16,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#ccc',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   form: {
//     gap: 24,
//   },
//   inputContainer: {
//     gap: 8,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#fff',
//     marginLeft: 4,
//   },
//   input: {
//     height: 56,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: '#fff',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   resetButton: {
//     height: 56,
//     backgroundColor: 'rgba(255, 75, 140, 0.5)',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ff4b8c',
//   },
//   resetButtonActive: {
//     backgroundColor: '#ff4b8c',
//   },
//   resetButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   backToLogin: {
//     alignSelf: 'center',
//     padding: 8,
//   },
//   backToLoginText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//     textDecorationLine: 'underline',
//   },
// });

import { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { sendPasswordReset } from './firebase/firebaseAuthApi';  // Make sure this is the correct path
import { InputField } from '../components/elements/InputField';
import { Button } from '../components/elements/Button';
import commonStyles from '../styles/common';
import { router } from 'expo-router';
import React from 'react';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle the password reset process
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const message = await sendPasswordReset(email); // Call the function to send the reset email
      Alert.alert('Success', message);
      router.push('/');  // Navigate back to login screen
    } catch (error) {
      Alert.alert('Error', (error instanceof Error ? error.message : 'Failed to send reset email.'));
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={commonStyles.container}
    >
      <View style={commonStyles.overlay}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Reset Password</Text>
          <Text style={commonStyles.subtitle}>Enter your email to receive a reset link</Text>

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <Button
            title="SEND RESET LINK"
            onPress={handleResetPassword}
            disabled={loading}
          />

          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={commonStyles.forgotPasswordText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
