export interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'email-address' | 'default';
    placeholder: string;
}

export interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    showPassword: boolean;
    setShowPassword: () => void;
    label: string;
}

export interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}