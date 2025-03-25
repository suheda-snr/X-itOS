import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import useAuthStore from '@/stateStore/authStore';
import { useCompanyStore } from '@/stateStore/companyStore';
import { LinearGradient } from 'expo-linear-gradient';
import { loginWithAccessCode } from '../api/authApi';
import ModalComponent from '@/components/Modal';
import { Button } from '@/components/elements/Button';
import commonStyles, { colors } from '@/styles/common';

export default function WelcomeScreen() {
  const [count, setCount] = useState<number>(1);
  const isRoomSet = useCompanyStore((state) => state.isRoomSet);
  const companyName = useCompanyStore.getState().companyData?.name;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [companyPasscode, setCompanyPasscode] = useState<string>('');
  const companyId = useAuthStore.getState().companyUser?.companyId;
  const room = useCompanyStore(state => state.selectedRoomForGame);

  function navigateToPasscode() {
    if (count >= 5) {
      setCount(1);
      setShowModal(true);
    } else {
      setCount((prevCount) => prevCount + 1);
    }
  }

  const handlePasscodeSubmit = async () => {
    try {
      if (!companyId) {
        throw new Error('Company ID is undefined');
      }
      const token = await loginWithAccessCode(companyPasscode, companyId, 'company');
      router.push('/passcode');
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setCompanyPasscode('');
    }
  };

  useFocusEffect(
    useCallback(() => {
      setShowModal(false);
      setCompanyPasscode('');
    }, [])
  );

  return (
    <View style={commonStyles.container}>
      <LinearGradient colors={[colors.dark1, colors.dark2]} style={commonStyles.container}>
        <View style={commonStyles.layoutHeaderSection}>
          <Pressable onPress={navigateToPasscode} style={commonStyles.headerPressable}>
            <Text style={commonStyles.layoutLargeTitle}>{companyName}</Text>
          </Pressable>

          <View style={commonStyles.layoutTitleContainer}>
            <Text style={commonStyles.title}>
              {isRoomSet ? `Welcome to ${room?.name}` : 'Welcome'}
            </Text>
          </View>
        </View>

        <View style={commonStyles.content}>
          {isRoomSet ? (
            <>
              <Text style={commonStyles.subtitle}>
                Scan your ticket QR code to begin your adventure in {room?.name}
              </Text>
              <Button title="Begin Your Adventure" onPress={() => router.push('/playersinfoadding')} />
            </>
          ) : (
            <Text style={commonStyles.subtitle}>
              Room is not set for this device. Please navigate to the admin panel.
            </Text>
          )}
        </View>
      </LinearGradient>

      <ModalComponent
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePasscodeSubmit}
        passcode={companyPasscode}
        setPasscode={setCompanyPasscode}
      />
    </View>
  );
}