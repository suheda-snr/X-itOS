import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    passcode: string;
    setPasscode: (passcode: string) => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ visible, onClose, onSubmit, passcode, setPasscode }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Enter Company Passcode</Text>
                    <TextInput
                        style={styles.input}
                        value={passcode}
                        onChangeText={setPasscode}
                        placeholder="Enter passcode"
                        placeholderTextColor="#aaa"
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={6}
                    />
                    <TouchableOpacity style={styles.modalSubmitButton} onPress={onSubmit}>
                        <Text style={styles.modalSubmitButtonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
                        <Text style={styles.modalCloseButtonText}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#333',
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        color: '#fff',
    },
    modalSubmitButton: {
        backgroundColor: '#ff4b8c',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    modalSubmitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ModalComponent;