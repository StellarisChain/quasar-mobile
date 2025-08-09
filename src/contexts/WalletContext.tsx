import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import type { MobileWalletState, Wallet, SecuritySettings } from '../types';

// Import wallet utilities from mobile lib
import {
    generateWallet,
    importWalletFromMnemonic,
    validateMnemonic
} from '../lib/wallet-utils';
import { getBalanceInfo } from '../../quasar/src/lib/wallet_client';

interface WalletAction {
    type: string;
    payload?: any;
}

interface WalletContextType {
    state: MobileWalletState;
    createWallet: (name?: string) => Promise<Wallet>;
    importWallet: (mnemonic: string, name?: string) => Promise<Wallet>;
    selectWallet: (walletId: string) => void;
    lockWallet: () => void;
    unlockWallet: (pin?: string) => Promise<boolean>;
    updateBalance: (walletId: string) => Promise<void>;
    deleteWallet: (walletId: string) => Promise<void>;
    updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
}

const initialState: MobileWalletState = {
    isInitialized: false,
    isLocked: true,
    currentWallet: null,
    wallets: [],
    biometricEnabled: false,
    pinEnabled: false,
};

function walletReducer(state: MobileWalletState, action: WalletAction): MobileWalletState {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                ...state,
                isInitialized: true,
                wallets: action.payload.wallets || [],
                biometricEnabled: action.payload.biometricEnabled || false,
                pinEnabled: action.payload.pinEnabled || false,
            };
        case 'ADD_WALLET':
            return {
                ...state,
                wallets: [...state.wallets, action.payload],
                currentWallet: action.payload,
            };
        case 'SELECT_WALLET':
            return {
                ...state,
                currentWallet: action.payload,
            };
        case 'LOCK_WALLET':
            return {
                ...state,
                isLocked: true,
            };
        case 'UNLOCK_WALLET':
            return {
                ...state,
                isLocked: false,
            };
        case 'UPDATE_WALLET':
            return {
                ...state,
                wallets: state.wallets.map(wallet =>
                    wallet.id === action.payload.id ? action.payload : wallet
                ),
                currentWallet: state.currentWallet?.id === action.payload.id ? action.payload : state.currentWallet,
            };
        case 'DELETE_WALLET':
            const updatedWallets = state.wallets.filter(wallet => wallet.id !== action.payload);
            return {
                ...state,
                wallets: updatedWallets,
                currentWallet: state.currentWallet?.id === action.payload ?
                    (updatedWallets.length > 0 ? updatedWallets[0] : null) : state.currentWallet,
            };
        case 'UPDATE_SECURITY':
            return {
                ...state,
                biometricEnabled: action.payload.biometricEnabled ?? state.biometricEnabled,
                pinEnabled: action.payload.pinEnabled ?? state.pinEnabled,
            };
        default:
            return state;
    }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(walletReducer, initialState);

    useEffect(() => {
        initializeWallet();
    }, []);

    const initializeWallet = async () => {
        try {
            // Load stored wallets
            const walletsJson = await SecureStore.getItemAsync('wallets');
            const wallets = walletsJson ? JSON.parse(walletsJson) : [];

            // Load security settings
            const securityJson = await SecureStore.getItemAsync('security');
            const security = securityJson ? JSON.parse(securityJson) : {};

            dispatch({
                type: 'INITIALIZE',
                payload: {
                    wallets,
                    biometricEnabled: security.biometricEnabled || false,
                    pinEnabled: security.pinEnabled || false,
                },
            });
        } catch (error) {
            console.error('Failed to initialize wallet:', error);
            dispatch({ type: 'INITIALIZE', payload: {} });
        }
    };

    const saveWallets = async (wallets: Wallet[]) => {
        try {
            await SecureStore.setItemAsync('wallets', JSON.stringify(wallets));
        } catch (error) {
            console.error('Failed to save wallets:', error);
        }
    };

    const createWallet = async (name?: string): Promise<Wallet> => {
        try {
            const wallet = await generateWallet();
            const newWallet: Wallet = {
                id: Date.now().toString(),
                name: name || `Wallet ${state.wallets.length + 1}`,
                address: wallet.address,
                public_key: wallet.public_key,
                private_key: wallet.private_key,
                mnemonic: wallet.mnemonic,
                chains: [],
            };

            dispatch({ type: 'ADD_WALLET', payload: newWallet });
            await saveWallets([...state.wallets, newWallet]);

            return newWallet;
        } catch (error) {
            console.error('Failed to create wallet:', error);
            throw error;
        }
    };

    const importWallet = async (mnemonic: string, name?: string): Promise<Wallet> => {
        try {
            if (!validateMnemonic(mnemonic)) {
                throw new Error('Invalid mnemonic phrase');
            }

            const wallet = await importWalletFromMnemonic(mnemonic);
            const newWallet: Wallet = {
                id: Date.now().toString(),
                name: name || `Imported Wallet ${state.wallets.length + 1}`,
                address: wallet.address,
                public_key: wallet.public_key,
                private_key: wallet.private_key,
                mnemonic: wallet.mnemonic,
                chains: [],
            };

            dispatch({ type: 'ADD_WALLET', payload: newWallet });
            await saveWallets([...state.wallets, newWallet]);

            return newWallet;
        } catch (error) {
            console.error('Failed to import wallet:', error);
            throw error;
        }
    };

    const selectWallet = (walletId: string) => {
        const wallet = state.wallets.find(w => w.id === walletId);
        if (wallet) {
            dispatch({ type: 'SELECT_WALLET', payload: wallet });
        }
    };

    const lockWallet = () => {
        dispatch({ type: 'LOCK_WALLET' });
    };

    const unlockWallet = async (pin?: string): Promise<boolean> => {
        try {
            // TODO: Implement biometric or PIN authentication
            dispatch({ type: 'UNLOCK_WALLET' });
            return true;
        } catch (error) {
            console.error('Failed to unlock wallet:', error);
            return false;
        }
    };

    const updateBalance = async (walletId: string) => {
        try {
            const wallet = state.wallets.find(w => w.id === walletId);
            if (!wallet) return;

            // TODO: Configure node URL from settings
            const nodeUrl = 'https://node.stellaris.network';
            const [balance] = await getBalanceInfo(wallet.address, nodeUrl);

            if (balance !== null) {
                const updatedWallet = {
                    ...wallet,
                    // Update balance in wallet structure
                };
                dispatch({ type: 'UPDATE_WALLET', payload: updatedWallet });
            }
        } catch (error) {
            console.error('Failed to update balance:', error);
        }
    };

    const deleteWallet = async (walletId: string) => {
        try {
            const updatedWallets = state.wallets.filter(w => w.id !== walletId);
            dispatch({ type: 'DELETE_WALLET', payload: walletId });
            await saveWallets(updatedWallets);
        } catch (error) {
            console.error('Failed to delete wallet:', error);
            throw error;
        }
    };

    const updateSecuritySettings = async (settings: Partial<SecuritySettings>) => {
        try {
            const currentSecurity = await SecureStore.getItemAsync('security');
            const updatedSecurity = {
                ...(currentSecurity ? JSON.parse(currentSecurity) : {}),
                ...settings,
            };

            await SecureStore.setItemAsync('security', JSON.stringify(updatedSecurity));
            dispatch({ type: 'UPDATE_SECURITY', payload: settings });
        } catch (error) {
            console.error('Failed to update security settings:', error);
            throw error;
        }
    };

    const value: WalletContextType = {
        state,
        createWallet,
        importWallet,
        selectWallet,
        lockWallet,
        unlockWallet,
        updateBalance,
        deleteWallet,
        updateSecuritySettings,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
