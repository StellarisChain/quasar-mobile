import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    fullWidth?: boolean;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
}: ButtonProps) {
    const { theme } = useTheme();

    const getButtonStyle = () => {
        const baseStyle = {
            borderRadius: 12,
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            gap: 8,
        };

        const sizeStyles = {
            small: { paddingVertical: 8, paddingHorizontal: 16 },
            medium: { paddingVertical: 12, paddingHorizontal: 20 },
            large: { paddingVertical: 16, paddingHorizontal: 24 },
        };

        const variantStyles = {
            primary: {
                backgroundColor: theme.colors.primary,
            },
            secondary: {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
            },
            danger: {
                backgroundColor: theme.colors.error,
            },
            ghost: {
                backgroundColor: 'transparent',
            },
        };

        const disabledStyle = disabled || loading ? {
            backgroundColor: theme.colors.textSecondary,
            opacity: 0.6,
        } : {};

        const widthStyle = fullWidth ? { width: '100%' } : {};

        return [
            baseStyle,
            sizeStyles[size],
            variantStyles[variant],
            disabledStyle,
            widthStyle,
        ];
    };

    const getTextStyle = () => {
        const baseStyle = {
            fontWeight: '600' as const,
        };

        const sizeStyles = {
            small: { fontSize: 14 },
            medium: { fontSize: 16 },
            large: { fontSize: 18 },
        };

        const variantStyles = {
            primary: { color: '#ffffff' },
            secondary: { color: theme.colors.text },
            danger: { color: '#ffffff' },
            ghost: { color: theme.colors.primary },
        };

        return [
            baseStyle,
            sizeStyles[size],
            variantStyles[variant],
        ];
    };

    const getIconSize = () => {
        const sizeMap = {
            small: 16,
            medium: 20,
            large: 24,
        };
        return sizeMap[size];
    };

    const getIconColor = () => {
        const variantMap = {
            primary: '#ffffff',
            secondary: theme.colors.text,
            danger: '#ffffff',
            ghost: theme.colors.primary,
        };
        return variantMap[variant];
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <Ionicons
                    name="refresh"
                    size={getIconSize()}
                    color={getIconColor()}
                />
            ) : (
                icon && (
                    <Ionicons
                        name={icon}
                        size={getIconSize()}
                        color={getIconColor()}
                    />
                )
            )}
            <Text style={getTextStyle()}>
                {loading ? 'Loading...' : title}
            </Text>
        </TouchableOpacity>
    );
}
