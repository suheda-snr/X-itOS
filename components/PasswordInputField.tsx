import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from '@/styles/common';
import React from 'react';
import { PasswordInputProps } from '@/types/componentInterfaces';

export const PasswordInputField = ({
    label,
    value,
    onChangeText,
    showPassword,
    setShowPassword
}: PasswordInputProps) => (
    <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.label}>{label}</Text>
        <View style={commonStyles.passwordContainer}>
            <TextInput
                style={[commonStyles.input, commonStyles.passwordInput]}
                placeholder="Enter your password"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
            />
            <TouchableOpacity
                style={commonStyles.eyeIcon}
                onPress={setShowPassword}
            >
                <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#fff"
                />
            </TouchableOpacity>
        </View>
    </View>
);
