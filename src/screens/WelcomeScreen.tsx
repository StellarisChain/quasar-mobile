import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const { theme } = useTheme();
    const { state } = useWallet();

    React.useEffect(() => {
        // If user already has wallets, navigate to main app
        if (state.wallets.length > 0) {
            navigation.replace('Main');
        }
    }, [state.wallets, navigation]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 60,
        },
        logo: {
            width: 120,
            height: 120,
            marginBottom: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 18,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: 40,
        },
        buttonContainer: {
            width: '100%',
            gap: 15,
        },
        primaryButton: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
        },
        primaryButtonText: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: '600',
        },
        secondaryButton: {
            backgroundColor: 'transparent',
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.colors.border,
        },
        secondaryButtonText: {
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: '600',
        },
        footer: {
            position: 'absolute',
            bottom: 40,
            alignItems: 'center',
        },
        footerText: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            textAlign: 'center',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Placeholder for logo - you can add the actual logo image here */}
                <View
                    style={[
                        styles.logo,
                        {
                            backgroundColor: theme.colors.primary,
                            borderRadius: 60,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <Text style={{ color: '#fff', fontSize: 48, fontWeight: 'bold' }}>Q</Text>
                </View>
                <Text style={styles.title}>Quasar Wallet</Text>
                <Text style={styles.subtitle}>
                    Secure, fast, and easy way to manage your Stellaris tokens
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('CreateWallet')}
                >
                    <Text style={styles.primaryButtonText}>Create New Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('ImportWallet')}
                >
                    <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </SafeAreaView>
    );
}
