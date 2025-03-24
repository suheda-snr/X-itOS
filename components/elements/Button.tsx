import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import commonStyles from '@/styles/common';

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled = false, style }) => {
    return (
        <TouchableOpacity
            style={[
                commonStyles.button,
                !disabled && commonStyles.buttonActive,
                disabled && commonStyles.buttonDisabled,
                style, // Apply custom style here
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[commonStyles.buttonText, !disabled && commonStyles.buttonTextActive]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};