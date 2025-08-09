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
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import { Ionicons } from '@expo/vector-icons';

export default function SendScreen() {
    const { theme } = useTheme();
    const { state } = useWallet();

    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const currentWallet = state.currentWallet;

    const handleSend = async () => {
        if (!currentWallet) {
            Alert.alert('Error', 'No wallet selected');
            return;
        }

        if (!recipientAddress.trim()) {
            Alert.alert('Error', 'Please enter a recipient address');
            return;
        }

        if (!amount.trim() || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        // TODO: Implement actual transaction sending using wallet client
        Alert.alert('Feature Coming Soon', 'Transaction sending will be implemented soon.');
    };

    const handleScanQR = () => {
        // TODO: Implement QR code scanning
        Alert.alert('Feature Coming Soon', 'QR code scanning will be implemented soon.');
    };

    const handleMaxAmount = () => {
        // TODO: Set max amount based on current balance
        setAmount('0.00');
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
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 12,
        },
        inputContainer: {
            position: 'relative',
        },
        input: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: theme.colors.text,
        },
        inputWithButton: {
            paddingRight: 50,
        },
        inputButton: {
            position: 'absolute',
            right: 12,
            top: 12,
            padding: 8,
        },
        amountInput: {
            fontSize: 24,
            fontWeight: '600',
            textAlign: 'center',
        },
        maxButton: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            alignSelf: 'flex-end',
            marginTop: 8,
        },
        maxButtonText: {
            color: '#ffffff',
            fontSize: 12,
            fontWeight: '600',
        },
        balanceInfo: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        balanceLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 4,
        },
        balanceAmount: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.text,
        },
        sendButton: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
        },
        sendButtonDisabled: {
            backgroundColor: theme.colors.textSecondary,
        },
        sendButtonText: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: '600',
        },
        feeInfo: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            marginTop: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        feeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        feeLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        feeValue: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
        },
        totalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        totalLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        totalValue: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
    });

    if (!currentWallet) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.textSecondary }}>No wallet selected</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.balanceInfo}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>0.00 STE</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recipient</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, styles.inputWithButton]}
                            placeholder="Enter wallet address or scan QR"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={recipientAddress}
                            onChangeText={setRecipientAddress}
                            multiline
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={styles.inputButton}
                            onPress={handleScanQR}
                        >
                            <Ionicons name="qr-code" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Amount</Text>
                    <TextInput
                        style={[styles.input, styles.amountInput]}
                        placeholder="0.00"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                    />
                    <TouchableOpacity style={styles.maxButton} onPress={handleMaxAmount}>
                        <Text style={styles.maxButtonText}>MAX</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Memo (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a note for this transaction"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={memo}
                        onChangeText={setMemo}
                        maxLength={100}
                    />
                </View>

                <View style={styles.feeInfo}>
                    <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Network Fee</Text>
                        <Text style={styles.feeValue}>0.001 STE</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            {amount ? (parseFloat(amount) + 0.001).toFixed(6) : '0.001'} STE
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!recipientAddress.trim() || !amount.trim() || isLoading) && styles.sendButtonDisabled
                    ]}
                    onPress={handleSend}
                    disabled={!recipientAddress.trim() || !amount.trim() || isLoading}
                >
                    <Text style={styles.sendButtonText}>
                        {isLoading ? 'Sending...' : 'Send Transaction'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
