import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WalletScreen() {
    const { theme } = useTheme();
    const { state, updateBalance, selectWallet } = useWallet();
    const [refreshing, setRefreshing] = useState(false);

    const currentWallet = state.currentWallet;

    useEffect(() => {
        if (currentWallet) {
            updateBalance(currentWallet.id);
        }
    }, [currentWallet]);

    const onRefresh = async () => {
        if (!currentWallet) return;

        setRefreshing(true);
        try {
            await updateBalance(currentWallet.id);
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const formatAddress = (address: string) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    const formatBalance = (balance: number) => {
        return balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            backgroundColor: theme.colors.primary,
            paddingTop: 20,
            paddingBottom: 30,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
        },
        headerContent: {
            alignItems: 'center',
        },
        walletName: {
            fontSize: 18,
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: 8,
        },
        address: {
            fontSize: 14,
            color: '#ffffff80',
            marginBottom: 20,
        },
        balanceContainer: {
            alignItems: 'center',
        },
        balanceLabel: {
            fontSize: 14,
            color: '#ffffff80',
            marginBottom: 4,
        },
        balance: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        balanceUnit: {
            fontSize: 16,
            color: '#ffffff80',
            marginTop: 4,
        },
        content: {
            flex: 1,
            padding: 20,
        },
        quickActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
            gap: 15,
        },
        actionButton: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            paddingVertical: 20,
            paddingHorizontal: 16,
            borderRadius: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        actionIcon: {
            marginBottom: 8,
        },
        actionText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 16,
        },
        tokensList: {
            gap: 12,
        },
        tokenItem: {
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        tokenLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        tokenIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        tokenIconText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        tokenInfo: {
            flex: 1,
        },
        tokenSymbol: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        tokenName: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        tokenBalance: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        tokenValue: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
        },
        activitySection: {
            marginBottom: 20,
        },
        activityItem: {
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        activityIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        activityInfo: {
            flex: 1,
        },
        activityType: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        activityTime: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        activityAmount: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
    });

    if (!currentWallet) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyState}>
                    <Ionicons name="wallet-outline" size={64} color={theme.colors.textSecondary} />
                    <Text style={styles.emptyText}>No wallet selected</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.walletName}>
                        {currentWallet.name || 'My Wallet'}
                    </Text>
                    <Text style={styles.address}>
                        {formatAddress(currentWallet.address)}
                    </Text>

                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <Text style={styles.balance}>0.00</Text>
                        <Text style={styles.balanceUnit}>STE</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                            name="send"
                            size={24}
                            color={theme.colors.primary}
                            style={styles.actionIcon}
                        />
                        <Text style={styles.actionText}>Send</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                            name="download"
                            size={24}
                            color={theme.colors.primary}
                            style={styles.actionIcon}
                        />
                        <Text style={styles.actionText}>Receive</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                            name="swap-horizontal"
                            size={24}
                            color={theme.colors.primary}
                            style={styles.actionIcon}
                        />
                        <Text style={styles.actionText}>Swap</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Assets</Text>
                    <View style={styles.tokensList}>
                        <View style={styles.tokenItem}>
                            <View style={styles.tokenLeft}>
                                <View style={styles.tokenIcon}>
                                    <Text style={styles.tokenIconText}>S</Text>
                                </View>
                                <View style={styles.tokenInfo}>
                                    <Text style={styles.tokenSymbol}>STE</Text>
                                    <Text style={styles.tokenName}>Stellaris</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.tokenBalance}>0.00</Text>
                                <Text style={styles.tokenValue}>$0.00</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.emptyState}>
                        <Ionicons name="time-outline" size={48} color={theme.colors.textSecondary} />
                        <Text style={styles.emptyText}>No recent transactions</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
