import { TouchableOpacity, Text } from 'react-native';
import commonStyles from '@/styles/common';
import React from 'react';
import { ButtonProps } from '@/types/componentInterfaces';

export const Button = ({ title, onPress, disabled = false }: ButtonProps) => (
    <TouchableOpacity
        style={[commonStyles.button, disabled ? commonStyles.buttonDisabled : commonStyles.buttonActive]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={commonStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
);
