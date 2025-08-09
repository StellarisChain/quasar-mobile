const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript path mapping
config.resolver.alias = {
    '@': './src',
    '@/lib': './quasar/src/lib',
};

module.exports = config;
