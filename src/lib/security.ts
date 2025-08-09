import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export class SecurityManager {
    private static instance: SecurityManager;

    static getInstance(): SecurityManager {
        if (!SecurityManager.instance) {
            SecurityManager.instance = new SecurityManager();
        }
        return SecurityManager.instance;
    }

    async isBiometricAvailable(): Promise<boolean> {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            return hasHardware && isEnrolled;
        } catch (error) {
            console.error('Biometric check error:', error);
            return false;
        }
    }

    async authenticateWithBiometrics(): Promise<boolean> {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to access your wallet',
                cancelLabel: 'Cancel',
                fallbackLabel: 'Use PIN',
            });

            return result.success;
        } catch (error) {
            console.error('Biometric authentication error:', error);
            return false;
        }
    }

    async secureStore(key: string, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error('Secure store error:', error);
            throw new Error('Failed to store data securely');
        }
    }

    async secureRetrieve(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error('Secure retrieve error:', error);
            return null;
        }
    }

    async secureDelete(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error('Secure delete error:', error);
            throw new Error('Failed to delete data securely');
        }
    }

    generatePIN(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async hashPIN(pin: string): Promise<string> {
        // Simple hash function for PIN - in production, use a proper crypto library
        const encoder = new TextEncoder();
        const data = encoder.encode(pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async verifyPIN(pin: string, hashedPIN: string): Promise<boolean> {
        try {
            const inputHash = await this.hashPIN(pin);
            return inputHash === hashedPIN;
        } catch (error) {
            console.error('PIN verification error:', error);
            return false;
        }
    }
}
