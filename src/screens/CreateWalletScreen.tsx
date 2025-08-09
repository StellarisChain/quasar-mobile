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

type CreateWalletScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateWallet'>;

export default function CreateWalletScreen() {
    const navigation = useNavigation<CreateWalletScreenNavigationProp>();
    const { theme } = useTheme();
    const { createWallet } = useWallet();

    const [walletName, setWalletName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Name, 2: Mnemonic Display, 3: Mnemonic Verification
    const [mnemonic, setMnemonic] = useState('');
    const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
    const [verificationWords, setVerificationWords] = useState<{ [key: number]: string }>({});
    const [randomIndices, setRandomIndices] = useState<number[]>([]);

    const handleCreateWallet = async () => {
        setIsLoading(true);
        try {
            const wallet = await createWallet(walletName || undefined);
            setMnemonic(wallet.mnemonic || '');
            setMnemonicWords((wallet.mnemonic || '').split(' '));

            // Generate random indices for verification (3 words)
            const indices = [];
            while (indices.length < 3) {
                const randomIndex = Math.floor(Math.random() * 12);
                if (!indices.includes(randomIndex)) {
                    indices.push(randomIndex);
                }
            }
            setRandomIndices(indices.sort((a, b) => a - b));

            setStep(2);
        } catch (error) {
            Alert.alert('Error', 'Failed to create wallet. Please try again.');
            console.error('Create wallet error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyMnemonic = () => {
        const isValid = randomIndices.every(
            index => verificationWords[index]?.toLowerCase() === mnemonicWords[index].toLowerCase()
        );

        if (isValid) {
            Alert.alert(
                'Success!',
                'Your wallet has been created successfully.',
                [{ text: 'Continue', onPress: () => navigation.replace('Main') }]
            );
        } else {
            Alert.alert('Error', 'Verification failed. Please check the words and try again.');
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
        mnemonicContainer: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
        },
        mnemonicGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        mnemonicWord: {
            backgroundColor: theme.colors.background,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
            minWidth: '30%',
            alignItems: 'center',
        },
        mnemonicWordText: {
            color: theme.colors.text,
            fontSize: 14,
            fontWeight: '500',
        },
        mnemonicWordNumber: {
            color: theme.colors.textSecondary,
            fontSize: 12,
            marginBottom: 2,
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
        verificationContainer: {
            gap: 15,
        },
        verificationItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        verificationLabel: {
            fontSize: 16,
            color: theme.colors.text,
            minWidth: 80,
        },
        verificationInput: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: theme.colors.text,
        },
    });

    const renderStep1 = () => (
        <>
            <Text style={styles.title}>Create Your Wallet</Text>
            <Text style={styles.subtitle}>
                Give your wallet a name to help you identify it later. This is optional.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Wallet name (optional)"
                placeholderTextColor={theme.colors.textSecondary}
                value={walletName}
                onChangeText={setWalletName}
                maxLength={50}
            />

            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleCreateWallet}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Creating Wallet...' : 'Create Wallet'}
                </Text>
            </TouchableOpacity>
        </>
    );

    const renderStep2 = () => (
        <>
            <Text style={styles.title}>Backup Your Wallet</Text>
            <Text style={styles.subtitle}>
                Write down these 12 words in order. This is your recovery phrase and the only way to restore your wallet.
            </Text>

            <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                    ⚠️ Never share your recovery phrase with anyone. Store it securely offline.
                </Text>
            </View>

            <View style={styles.mnemonicContainer}>
                <View style={styles.mnemonicGrid}>
                    {mnemonicWords.map((word, index) => (
                        <View key={index} style={styles.mnemonicWord}>
                            <Text style={styles.mnemonicWordNumber}>{index + 1}</Text>
                            <Text style={styles.mnemonicWordText}>{word}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => setStep(3)}
            >
                <Text style={styles.buttonText}>I've Written It Down</Text>
            </TouchableOpacity>
        </>
    );

    const renderStep3 = () => (
        <>
            <Text style={styles.title}>Verify Your Recovery Phrase</Text>
            <Text style={styles.subtitle}>
                Please enter the following words from your recovery phrase to verify you've written them down correctly.
            </Text>

            <View style={styles.verificationContainer}>
                {randomIndices.map((index) => (
                    <View key={index} style={styles.verificationItem}>
                        <Text style={styles.verificationLabel}>Word {index + 1}:</Text>
                        <TextInput
                            style={styles.verificationInput}
                            placeholder="Enter word"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={verificationWords[index] || ''}
                            onChangeText={(text) =>
                                setVerificationWords(prev => ({ ...prev, [index]: text }))
                            }
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyMnemonic}
            >
                <Text style={styles.buttonText}>Verify & Complete</Text>
            </TouchableOpacity>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </ScrollView>
        </SafeAreaView>
    );
}
