import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import { validateMnemonic } from '../lib/wallet-utils';

type ImportWalletScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImportWallet'>;

export default function ImportWalletScreen() {
    const navigation = useNavigation<ImportWalletScreenNavigationProp>();
    const { theme } = useTheme();
    const { importWallet } = useWallet();

    const [walletName, setWalletName] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImportWallet = async () => {
        if (!mnemonic.trim()) {
            Alert.alert('Error', 'Please enter your recovery phrase.');
            return;
        }

        const mnemonicWords = mnemonic.trim().split(/\s+/);
        if (mnemonicWords.length !== 12) {
            Alert.alert('Error', 'Recovery phrase must be exactly 12 words.');
            return;
        }

        if (!validateMnemonic(mnemonic.trim())) {
            Alert.alert('Error', 'Invalid recovery phrase. Please check and try again.');
            return;
        }

        setIsLoading(true);
        try {
            await importWallet(mnemonic.trim(), walletName || undefined);

            Alert.alert(
                'Success!',
                'Your wallet has been imported successfully.',
                [{ text: 'Continue', onPress: () => navigation.replace('Main') }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to import wallet. Please check your recovery phrase and try again.');
            console.error('Import wallet error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            flex: 1,
            padding: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 30,
            textAlign: 'center',
            lineHeight: 22,
        },
        input: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 20,
        },
        mnemonicInput: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 20,
            minHeight: 120,
            textAlignVertical: 'top',
        },
        button: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
        },
        buttonDisabled: {
            backgroundColor: theme.colors.textSecondary,
        },
        buttonText: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: '600',
        },
        warningBox: {
            backgroundColor: theme.colors.warning + '20',
            borderWidth: 1,
            borderColor: theme.colors.warning,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
        },
        warningText: {
            color: theme.colors.warning,
            fontSize: 14,
            fontWeight: '500',
        },
        infoBox: {
            backgroundColor: theme.colors.primary + '20',
            borderWidth: 1,
            borderColor: theme.colors.primary,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
        },
        infoText: {
            color: theme.colors.primary,
            fontSize: 14,
            fontWeight: '500',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Import Your Wallet</Text>
                <Text style={styles.subtitle}>
                    Enter your 12-word recovery phrase to restore your wallet.
                </Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        💡 Your recovery phrase is case-insensitive and extra spaces will be ignored.
                    </Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Wallet name (optional)"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={walletName}
                    onChangeText={setWalletName}
                    maxLength={50}
                />

                <TextInput
                    style={styles.mnemonicInput}
                    placeholder="Enter your 12-word recovery phrase..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={mnemonic}
                    onChangeText={setMnemonic}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                />

                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                        ⚠️ Make sure you're in a private place. Never enter your recovery phrase on an untrusted device.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, (isLoading || !mnemonic.trim()) && styles.buttonDisabled]}
                    onPress={handleImportWallet}
                    disabled={isLoading || !mnemonic.trim()}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Importing Wallet...' : 'Import Wallet'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
