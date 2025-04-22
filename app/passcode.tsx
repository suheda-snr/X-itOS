import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { logout, getCompanyUserInfo, loginWithAccessCode } from '../api/authApi';
import { getRoomsByCompanyId } from '@/api/companyApi';
import commonStyles, { colors } from '@/styles/common';
import { PasswordInputField } from '@/components/elements/PasswordInputField';
import { Button } from '@/components/elements/Button';
import { IconButton } from '@/components/elements/IconButton';
import { User } from '@/types/user';

const PasscodeScreen: React.FC = () => {
  const [passcode, setPasscode] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCompanyId = async (): Promise<void> => {
    try {
      const companyUser: User = await getCompanyUserInfo();
      setCompanyId(companyUser.companyId);
    } catch (error) {
      console.error("Error fetching company ID:", error);
    }
  };

  // Function to fetch rooms for the company
  const fetchRooms = async (): Promise<void> => {
    try {
      await getRoomsByCompanyId();
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  useEffect(() => {
    fetchCompanyId();
  }, []);

  const handleSubmit = async (): Promise<void> => {

    try {
      setLoading(true);
      const token = await loginWithAccessCode(passcode, companyId, 'admin');

      await fetchRooms();
      setLoading(false);
      router.replace('/room');
    } catch (error) {
      alert(`Login failed: ${(error as Error).message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout('company');
    router.push('/login');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
      style={commonStyles.container}
    >
     
        <View style={commonStyles.header}></View>

        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <View style={commonStyles.layoutTitleContainer}>
            <Text style={commonStyles.subtitle}>
              Please enter the admin passcode to access the admin panel.
            </Text>
          </View>

          <View style={commonStyles.form}>
            <PasswordInputField
              label="Passcode"
              value={passcode}
              onChangeText={setPasscode}
              maxLength={6}
              showToggle={false}
              placeholder="Enter passcode"
              style={{ textAlign: 'center' }}
            />

            <Button
              title={loading ? "Loading..." : "Login"}
              onPress={handleSubmit}
              disabled={loading}
            />

            <IconButton
              title="Logout"
              onPress={handleLogout}
              iconName="log-out-outline"
            />
          </View>
        </View>
   
    </ImageBackground>
  );
};

export default PasscodeScreen;