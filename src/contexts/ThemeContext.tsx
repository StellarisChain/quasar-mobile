import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    accent: string;
}

export interface Theme {
    colors: ThemeColors;
    dark: boolean;
}

const lightTheme: Theme = {
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        accent: '#06b6d4',
    },
    dark: false,
};

const darkTheme: Theme = {
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        accent: '#06b6d4',
    },
    dark: true,
};

interface ThemeState {
    theme: Theme;
    themeMode: 'light' | 'dark' | 'auto';
}

interface ThemeAction {
    type: 'SET_THEME' | 'SET_THEME_MODE' | 'SYSTEM_THEME_CHANGED';
    payload?: any;
}

interface ThemeContextType {
    theme: Theme;
    themeMode: 'light' | 'dark' | 'auto';
    setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
    switch (action.type) {
        case 'SET_THEME':
            return {
                ...state,
                theme: action.payload,
            };
        case 'SET_THEME_MODE':
            return {
                ...state,
                themeMode: action.payload,
            };
        case 'SYSTEM_THEME_CHANGED':
            if (state.themeMode === 'auto') {
                return {
                    ...state,
                    theme: action.payload === 'dark' ? darkTheme : lightTheme,
                };
            }
            return state;
        default:
            return state;
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(themeReducer, {
        theme: lightTheme,
        themeMode: 'auto',
    });

    useEffect(() => {
        loadThemePreference();

        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            dispatch({
                type: 'SYSTEM_THEME_CHANGED',
                payload: colorScheme,
            });
        });

        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        updateTheme();
    }, [state.themeMode]);

    const loadThemePreference = async () => {
        try {
            const savedThemeMode = await SecureStore.getItemAsync('themeMode');
            if (savedThemeMode && ['light', 'dark', 'auto'].includes(savedThemeMode)) {
                dispatch({
                    type: 'SET_THEME_MODE',
                    payload: savedThemeMode as 'light' | 'dark' | 'auto',
                });
            }
        } catch (error) {
            console.error('Failed to load theme preference:', error);
        }
    };

    const updateTheme = () => {
        let newTheme: Theme;

        switch (state.themeMode) {
            case 'light':
                newTheme = lightTheme;
                break;
            case 'dark':
                newTheme = darkTheme;
                break;
            case 'auto':
                const systemColorScheme = Appearance.getColorScheme();
                newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
                break;
            default:
                newTheme = lightTheme;
        }

        dispatch({
            type: 'SET_THEME',
            payload: newTheme,
        });
    };

    const setThemeMode = async (mode: 'light' | 'dark' | 'auto') => {
        try {
            await SecureStore.setItemAsync('themeMode', mode);
            dispatch({
                type: 'SET_THEME_MODE',
                payload: mode,
            });
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const value: ThemeContextType = {
        theme: state.theme,
        themeMode: state.themeMode,
        setThemeMode,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
