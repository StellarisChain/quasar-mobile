import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helper?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export default function Input({
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    style,
    ...props
}: InputProps) {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
            marginBottom: 8,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
        },
        input: {
            flex: 1,
            paddingVertical: 16,
            fontSize: 16,
            color: theme.colors.text,
        },
        iconContainer: {
            marginHorizontal: 8,
        },
        helperText: {
            fontSize: 12,
            color: error ? theme.colors.error : theme.colors.textSecondary,
            marginTop: 4,
            marginLeft: 4,
        },
    });

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputContainer}>
                {leftIcon && (
                    <View style={styles.iconContainer}>{leftIcon}</View>
                )}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={theme.colors.textSecondary}
                    {...props}
                />
                {rightIcon && (
                    <View style={styles.iconContainer}>{rightIcon}</View>
                )}
            </View>
            {(error || helper) && (
                <Text style={styles.helperText}>{error || helper}</Text>
            )}
        </View>
    );
}
