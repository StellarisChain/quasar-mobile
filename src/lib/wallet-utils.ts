// Mobile wallet utilities that wrap the browser extension's wallet generation
import {
    generate,
    generateMnemonic,
    isValidMnemonic,
    generateFromPrivateKey
} from '../../quasar/src/lib/wallet_generation_utils';
import type { Wallet } from '../../quasar/src/pages/Popup/DataTypes';

export interface WalletGenerationResult {
    id: string;
    mnemonic: string;
    private_key: string;
    public_key: string;
    address: string;
}

export function generateWallet(): WalletGenerationResult {
    const mnemonic = generateMnemonic();
    const walletData = generate({
        mnemonicPhrase: mnemonic,
        deterministic: false,
        fields: ['mnemonic', 'private_key', 'public_key', 'address']
    });

    return {
        id: Date.now().toString(),
        mnemonic: walletData.mnemonic,
        private_key: walletData.private_key,
        public_key: walletData.public_key,
        address: walletData.address,
    };
}

export function importWalletFromMnemonic(mnemonic: string): WalletGenerationResult {
    if (!isValidMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
    }

    const walletData = generate({
        mnemonicPhrase: mnemonic,
        deterministic: false,
        fields: ['mnemonic', 'private_key', 'public_key', 'address']
    });

    return {
        id: Date.now().toString(),
        mnemonic: walletData.mnemonic,
        private_key: walletData.private_key,
        public_key: walletData.public_key,
        address: walletData.address,
    };
}

export function importWalletFromPrivateKey(privateKey: string): Omit<WalletGenerationResult, 'mnemonic'> {
    const walletData = generateFromPrivateKey(privateKey, ['private_key', 'public_key', 'address']);

    return {
        id: Date.now().toString(),
        private_key: walletData.private_key,
        public_key: walletData.public_key,
        address: walletData.address,
    };
}

export function validateMnemonic(mnemonic: string): boolean {
    return isValidMnemonic(mnemonic);
}

export { generateMnemonic, isValidMnemonic };
