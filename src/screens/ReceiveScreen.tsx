import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Share,
    Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ReceiveScreen() {
    const { theme } = useTheme();
    const { state } = useWallet();

    const currentWallet = state.currentWallet;

    const handleCopyAddress = async () => {
        if (!currentWallet?.address) return;

        // TODO: Implement clipboard functionality
        Alert.alert('Copied', 'Wallet address copied to clipboard');
    };

    const handleShareAddress = async () => {
        if (!currentWallet?.address) return;

        try {
            await Share.share({
                message: `My Stellaris wallet address: ${currentWallet.address}`,
                title: 'Wallet Address',
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleRequestSpecificAmount = () => {
        // TODO: Implement specific amount request with QR code
        Alert.alert('Feature Coming Soon', 'Request specific amount will be implemented soon.');
    };

    const formatAddress = (address: string) => {
        if (!address) return '';
        // Split address into chunks for better readability
        const chunks = [];
        for (let i = 0; i < address.length; i += 6) {
            chunks.push(address.slice(i, i + 6));
        }
        return chunks.join('\n');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            flex: 1,
            padding: 20,
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 10,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 40,
            textAlign: 'center',
            lineHeight: 22,
        },
        qrContainer: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 30,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        qrPlaceholder: {
            width: 200,
            height: 200,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 2,
            borderColor: theme.colors.border,
        },
        qrPlaceholderText: {
            color: theme.colors.textSecondary,
            fontSize: 16,
            textAlign: 'center',
        },
        walletName: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        addressContainer: {
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            padding: 16,
            marginBottom: 30,
            width: '100%',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        addressLabel: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.textSecondary,
            marginBottom: 8,
            textAlign: 'center',
        },
        address: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: 'center',
            fontFamily: 'monospace',
            lineHeight: 20,
        },
        actionButtons: {
            flexDirection: 'row',
            gap: 15,
            width: '100%',
            marginBottom: 30,
        },
        actionButton: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        secondaryButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        actionButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
        },
        secondaryButtonText: {
            color: theme.colors.text,
        },
        requestButton: {
            backgroundColor: theme.colors.secondary,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
            width: '100%',
        },
        requestButtonText: {
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
            marginTop: 20,
            width: '100%',
        },
        warningText: {
            color: theme.colors.warning,
            fontSize: 14,
            fontWeight: '500',
            textAlign: 'center',
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
            <View style={styles.content}>
                <Text style={styles.title}>Receive Stellaris</Text>
                <Text style={styles.subtitle}>
                    Share your wallet address or QR code to receive payments
                </Text>

                <View style={styles.qrContainer}>
                    <View style={styles.qrPlaceholder}>
                        <Ionicons name="qr-code" size={64} color={theme.colors.textSecondary} />
                        <Text style={styles.qrPlaceholderText}>QR Code{'\n'}Coming Soon</Text>
                    </View>
                    <Text style={styles.walletName}>
                        {currentWallet.name || 'My Wallet'}
                    </Text>
                </View>

                <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>Your Wallet Address</Text>
                    <Text style={styles.address}>
                        {formatAddress(currentWallet.address)}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleCopyAddress}
                    >
                        <Ionicons name="copy" size={20} color="#ffffff" />
                        <Text style={styles.actionButtonText}>Copy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={handleShareAddress}
                    >
                        <Ionicons name="share" size={20} color={theme.colors.text} />
                        <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Share</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.requestButton}
                    onPress={handleRequestSpecificAmount}
                >
                    <Text style={styles.requestButtonText}>Request Specific Amount</Text>
                </TouchableOpacity>

                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                        ⚠️ Only send Stellaris (STE) and compatible tokens to this address.
                        Sending other cryptocurrencies may result in loss of funds.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
