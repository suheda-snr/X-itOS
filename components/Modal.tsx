import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ImageBackground } from 'react-native';
import commonStyles from '@/styles/common';
import { PasswordInputField } from '@/components/elements/PasswordInputField';
import { Button } from '@/components/elements/Button';
import { ModalComponentProps } from '@/types/componentInterfaces';
import { modalStyles } from '@/styles/modal';

const ModalComponent: React.FC<ModalComponentProps> = ({ visible, onClose, onSubmit, passcode, setPasscode }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit();
        } finally {
            setLoading(false);
        }
    };

    return (
        // <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        // style={commonStyles.container}>

        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={[modalStyles.centeredContainer]}>
                <View style={modalStyles.modalContainer}>
                    <Text style={commonStyles.title}>Passcode</Text>

                    <View style={commonStyles.form}>
                        <PasswordInputField
                            label="Passcode"
                            value={passcode}
                            onChangeText={setPasscode}
                            maxLength={6}
                            showToggle={false}
                            placeholder="Enter passcode"
                            centered={true}
                            style={{ textAlign: 'center', width: 800 }}
                        />

                        <Button
                            title={loading ? "Loading..." : "Login"}
                            onPress={handleSubmit}
                            disabled={loading}
                        />
                    </View>

                    <TouchableOpacity style={modalStyles.modalCloseButton} onPress={onClose}>
                        <Text style={commonStyles.buttonText}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        // </ImageBackground>
    );
};

export default ModalComponent;