import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    SafeAreaView,
    Switch,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const { theme, themeMode, setThemeMode } = useTheme();
    const { state, deleteWallet, lockWallet, updateSecuritySettings } = useWallet();

    const [biometricEnabled, setBiometricEnabled] = useState(state.biometricEnabled);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
        setThemeMode(newTheme);
    };

    const handleBiometricToggle = async (value: boolean) => {
        try {
            await updateSecuritySettings({ biometricEnabled: value });
            setBiometricEnabled(value);
        } catch (error) {
            Alert.alert('Error', 'Failed to update biometric settings');
        }
    };

    const handleExportWallet = () => {
        if (!state.currentWallet) return;

        Alert.alert(
            'Export Wallet',
            'This will show your recovery phrase. Make sure you\'re in a private place.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Continue', onPress: showRecoveryPhrase },
            ]
        );
    };

    const showRecoveryPhrase = () => {
        if (!state.currentWallet?.mnemonic) {
            Alert.alert('Error', 'Recovery phrase not available for this wallet');
            return;
        }

        Alert.alert(
            'Recovery Phrase',
            state.currentWallet.mnemonic,
            [{ text: 'Done', style: 'default' }]
        );
    };

    const handleDeleteWallet = () => {
        if (!state.currentWallet) return;

        Alert.alert(
            'Delete Wallet',
            'Are you sure you want to delete this wallet? This action cannot be undone. Make sure you have backed up your recovery phrase.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => confirmDeleteWallet()
                },
            ]
        );
    };

    const confirmDeleteWallet = () => {
        Alert.alert(
            'Final Confirmation',
            'Type "DELETE" to confirm wallet deletion',
            [
                { text: 'Cancel', style: 'cancel' },
                // TODO: Add text input for confirmation
                {
                    text: 'Confirm Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (state.currentWallet) {
                                await deleteWallet(state.currentWallet.id.toString());
                                Alert.alert('Success', 'Wallet deleted successfully');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete wallet');
                        }
                    }
                },
            ]
        );
    };

    const handleLockWallet = () => {
        lockWallet();
        Alert.alert('Wallet Locked', 'Your wallet has been locked for security.');
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
            marginBottom: 32,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 16,
        },
        settingItem: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        settingIcon: {
            marginRight: 12,
        },
        settingInfo: {
            flex: 1,
        },
        settingTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text,
            marginBottom: 2,
        },
        settingDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        themeOptions: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 12,
        },
        themeOption: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.colors.border,
        },
        themeOptionActive: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary + '20',
        },
        themeOptionText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
        },
        dangerButton: {
            backgroundColor: theme.colors.error + '20',
            borderColor: theme.colors.error,
        },
        dangerText: {
            color: theme.colors.error,
        },
        walletInfo: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        walletName: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        walletAddress: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            fontFamily: 'monospace',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {state.currentWallet && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Current Wallet</Text>
                        <View style={styles.walletInfo}>
                            <Text style={styles.walletName}>
                                {state.currentWallet.name || 'My Wallet'}
                            </Text>
                            <Text style={styles.walletAddress}>
                                {state.currentWallet.address}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>

                    <View style={styles.themeOptions}>
                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                themeMode === 'light' && styles.themeOptionActive
                            ]}
                            onPress={() => handleThemeChange('light')}
                        >
                            <Ionicons name="sunny" size={20} color={theme.colors.text} />
                            <Text style={styles.themeOptionText}>Light</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                themeMode === 'dark' && styles.themeOptionActive
                            ]}
                            onPress={() => handleThemeChange('dark')}
                        >
                            <Ionicons name="moon" size={20} color={theme.colors.text} />
                            <Text style={styles.themeOptionText}>Dark</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                themeMode === 'auto' && styles.themeOptionActive
                            ]}
                            onPress={() => handleThemeChange('auto')}
                        >
                            <Ionicons name="phone-portrait" size={20} color={theme.colors.text} />
                            <Text style={styles.themeOptionText}>Auto</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="finger-print"
                                size={24}
                                color={theme.colors.primary}
                                style={styles.settingIcon}
                            />
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                                <Text style={styles.settingDescription}>
                                    Use fingerprint or face recognition
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={biometricEnabled}
                            onValueChange={handleBiometricToggle}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem} onPress={handleLockWallet}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="lock-closed"
                                size={24}
                                color={theme.colors.primary}
                                style={styles.settingIcon}
                            />
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Lock Wallet</Text>
                                <Text style={styles.settingDescription}>
                                    Immediately lock your wallet
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Wallet Management</Text>

                    <TouchableOpacity style={styles.settingItem} onPress={handleExportWallet}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="download"
                                size={24}
                                color={theme.colors.primary}
                                style={styles.settingIcon}
                            />
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Export Recovery Phrase</Text>
                                <Text style={styles.settingDescription}>
                                    View your wallet's recovery phrase
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="notifications"
                                size={24}
                                color={theme.colors.primary}
                                style={styles.settingIcon}
                            />
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Notifications</Text>
                                <Text style={styles.settingDescription}>
                                    Transaction and security alerts
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Danger Zone</Text>

                    <TouchableOpacity
                        style={[styles.settingItem, styles.dangerButton]}
                        onPress={handleDeleteWallet}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="trash"
                                size={24}
                                color={theme.colors.error}
                                style={styles.settingIcon}
                            />
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, styles.dangerText]}>
                                    Delete Wallet
                                </Text>
                                <Text style={styles.settingDescription}>
                                    Permanently remove this wallet
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
