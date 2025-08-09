# Quasar Mobile Wallet

A secure, feature-rich mobile wallet for Stellaris and Stellaris-based chains built with React Native and Expo.

## Features

### 🔐 Security First
- **Secure Storage**: All sensitive data encrypted with Expo SecureStore
- **Biometric Authentication**: Fingerprint and Face ID support
- **PIN Protection**: Additional layer of security
- **Mnemonic Backup**: 12-word recovery phrase generation and import
- **Auto-lock**: Configurable auto-lock timeout

### 💰 Wallet Management
- **Multi-wallet Support**: Create and manage multiple wallets
- **Easy Import/Export**: Import from mnemonic or export recovery phrase
- **Address Generation**: Secure address generation using proven cryptography
- **Balance Tracking**: Real-time balance updates

### 🚀 User Experience
- **Modern UI**: Clean, intuitive interface with dark/light theme support
- **Navigation**: Tab-based navigation with stack navigation for flows
- **QR Codes**: Generate QR codes for receiving payments (coming soon)
- **Transaction History**: View past transactions (coming soon)

### 🔗 Blockchain Integration
- **Stellaris Network**: Full support for Stellaris blockchain
- **Token Support**: Support for STE and compatible tokens
- **Transaction Sending**: Secure transaction creation and broadcasting
- **Fee Estimation**: Automatic network fee calculation

## Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── lib/               # Utility libraries and wallet functions
├── screens/           # Screen components
├── types/             # TypeScript type definitions
└── utils/             # Helper utilities
```

### Technology Stack
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and SDK
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Expo SecureStore**: Encrypted storage
- **Expo LocalAuthentication**: Biometric authentication

### Wallet Library Integration
The mobile app reuses the battle-tested wallet library from the browser extension:
- **Cryptographic Functions**: Reuses `quasar/src/lib/cryptographic_utils.ts`
- **Wallet Generation**: Reuses `quasar/src/lib/wallet_generation_utils.ts`
- **Transaction Handling**: Reuses `quasar/src/lib/wallet_client.ts`
- **Data Types**: Reuses type definitions from browser extension

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio & Emulator (for Android development)

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   # or
   expo start
   ```

3. **Run on Device/Simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android  
   npm run android
   
   # Web (for testing)
   npm run web
   ```

### Building for Production

1. **Configure EAS Build**
   ```bash
   npx eas build:configure
   ```

2. **Build for Android**
   ```bash
   npm run build:android
   ```

3. **Build for iOS**
   ```bash
   npm run build:ios
   ```

## Security Considerations

### Data Protection
- Private keys are encrypted and stored in Expo SecureStore
- Mnemonic phrases are only shown during wallet creation/export
- Biometric authentication guards wallet access
- PIN provides fallback authentication method

### Code Security
- TypeScript provides compile-time type checking
- Reuses proven cryptographic functions from browser extension
- Secure random number generation for key derivation
- Input validation on all user inputs

### Operational Security
- Supports hardware-backed security on supported devices
- Auto-lock prevents unauthorized access
- Warning messages educate users about security best practices
- Recovery phrase verification during wallet creation

## Development Guidelines

### Adding New Features
1. Create type definitions in `src/types/`
2. Implement business logic in `src/lib/`
3. Create UI components in `src/components/`
4. Add screens to `src/screens/`
5. Update navigation in `App.tsx`

### Testing
- Unit tests for utility functions
- Integration tests for wallet operations
- UI tests for critical user flows
- Security testing for cryptographic functions

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive JSDoc comments

## Deployment

### App Store Guidelines
- Follows React Native and Expo best practices
- Complies with mobile app store requirements
- Includes proper app metadata and icons
- Implements required privacy policies

### Configuration
- Update `app.json` with production settings
- Configure proper app icons and splash screens
- Set up deep linking for wallet URLs
- Configure push notifications (if needed)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Update documentation
5. Submit a pull request

## License

Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

## Support

For issues and questions:
- Check the documentation
- Search existing issues
- Create a new issue with detailed information
- Contact the development team

---

**⚠️ Security Notice**: This is wallet software that handles real cryptocurrency. Always verify the code, use on testnets first, and never share your private keys or recovery phrases.
Quasar Wallet ported to Mobile Targets via Expo
