import { Ionicons } from "@expo/vector-icons";

export interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'email-address' | 'default';
    placeholder: string;
}

export interface PasswordInputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    showPassword?: boolean;
    setShowPassword?: (show: boolean) => void;
    centered?: boolean;
    maxLength?: number;
    showToggle?: boolean;
    placeholder?: string;
    style?: object;
}

export interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

export interface IconButtonProps {
    title: string;
    onPress: () => void;
    iconName: React.ComponentProps<typeof Ionicons>['name'];
    disabled?: boolean;
}

export interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    passcode: string;
    setPasscode: (passcode: string) => void;
}