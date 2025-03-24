import React from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from '@/styles/common';
import { PasswordInputFieldProps } from '@/types/componentInterfaces';

export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
    label,
    value,
    onChangeText,
    showPassword = false,
    setShowPassword,
    centered = false,
    maxLength,
    showToggle = true,
    placeholder = "Enter your password",
    style,
}) => (
    <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.label}>{label}</Text>
        <View style={commonStyles.passwordContainer}>
            <TextInput
                style={[
                    commonStyles.input,
                    commonStyles.passwordInput,
                    centered && { textAlign: 'center', width: 200, alignSelf: 'center' },
                    style, // Apply custom style here
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
                keyboardType="default"
                maxLength={maxLength}
            />
            {showToggle && setShowPassword && (
                <TouchableOpacity
                    style={commonStyles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            )}
        </View>
    </View>
);