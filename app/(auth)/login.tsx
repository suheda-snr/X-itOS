import { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { login } from '../../api/authApi';
import { getCompanyName } from '@/api/companyApi';
import { InputField } from '../../components/InputField';
import { PasswordInputField } from '../../components/PasswordInputField';
import { Button } from '../../components/Button';
import commonStyles from '../../styles/common';
import React from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      try {
        const token = await login(email, password);
        if (token) {
          await getCompanyName();
          router.replace('/welcome');
        } else {
          console.log('Login failed, no token received.');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    } else {
      console.error('Email or password missing');
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={commonStyles.container}
    >
      <View style={commonStyles.overlay}>
        <View style={commonStyles.content}>
          <View style={commonStyles.header}>
            <Text style={commonStyles.title}>Welcome Back!</Text>
            <Text style={commonStyles.subtitle}>Login to your company account</Text>
          </View>

          <View style={commonStyles.form}>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter your email"
            />

            <PasswordInputField
              value={password}
              onChangeText={setPassword}
              showPassword={showPassword}
              label="Password"
              setShowPassword={() => setShowPassword(!showPassword)}
            />

            <Button
              title="ENTER"
              onPress={handleLogin}
              disabled={!(email && password)}
            />

            <TouchableOpacity
              style={commonStyles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={commonStyles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
