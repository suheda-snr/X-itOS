import { TextInput, Text, View } from 'react-native';
import commonStyles from '@/styles/common';
import React from 'react';
import { InputFieldProps } from '@/types/componentInterfaces';

export const InputField = ({
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    placeholder,
}: InputFieldProps) => (
    <View style={{ gap: 8 }}>
        <Text style={commonStyles.label}>{label}</Text>
        <TextInput
            style={commonStyles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize="none"
            placeholderTextColor="#999"
        />
    </View>
);
