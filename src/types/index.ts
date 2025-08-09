// Re-export types from the browser extension
export type { Wallet, Token, ChainData, JsonWallet } from '../../quasar/src/pages/Popup/DataTypes';
import type { Wallet } from '../../quasar/src/pages/Popup/DataTypes';

// Additional mobile-specific types
export interface MobileWalletState {
    isInitialized: boolean;
    isLocked: boolean;
    currentWallet: Wallet | null;
    wallets: Wallet[];
    biometricEnabled: boolean;
    pinEnabled: boolean;
}

export interface SecuritySettings {
    biometricEnabled: boolean;
    pinEnabled: boolean;
    autoLockTime: number; // in minutes
    requireAuthForSend: boolean;
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'auto';
    currency: string;
    language: string;
    notifications: boolean;
    security: SecuritySettings;
}

export interface TransactionRequest {
    to: string;
    amount: string;
    fee?: string;
    memo?: string;
}

export interface QRCodeData {
    address: string;
    amount?: string;
    memo?: string;
}

// Navigation types
export type RootStackParamList = {
    Welcome: undefined;
    CreateWallet: undefined;
    ImportWallet: undefined;
    Main: undefined;
};

export type MainTabParamList = {
    Wallet: undefined;
    Send: undefined;
    Receive: undefined;
    Settings: undefined;
};
