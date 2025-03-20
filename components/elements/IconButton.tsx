import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from '@/styles/common';
import { IconButtonProps } from '@/types/componentInterfaces';

export const IconButton: React.FC<IconButtonProps> = ({ title, onPress, iconName, disabled = false }) => (
    <TouchableOpacity
        style={[
            commonStyles.iconButton,
            disabled ? commonStyles.buttonDisabled : commonStyles.buttonActive,
            styles.fullWidth,
        ]}
        onPress={onPress}
        disabled={disabled}
    >
        <Ionicons name={iconName} size={20} color="#fff" style={commonStyles.iconButtonIcon} />
        <Text style={commonStyles.iconButtonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    fullWidth: {
        width: 200,
        alignSelf: 'flex-end',
    }
});