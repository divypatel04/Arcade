const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Use the default serializer configuration but ensure JSON format
config.serializer = {
  ...config.serializer,
  customSerializer: null // Use the default JSON serializer
};

// Add node modules polyfills and extraNodeModules
config.resolver = {
  ...config.resolver,
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  extraNodeModules: {
    // Core Node.js modules polyfills
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('@tradle/react-native-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    fs: require.resolve('react-native-fs'),
    path: require.resolve('path-browserify'),
    zlib: require.resolve('browserify-zlib'),
    // Point to our local empty polyfills for net and tls
    net: path.resolve(__dirname, './src/polyfills/net-polyfill.js'),
    tls: path.resolve(__dirname, './src/polyfills/tls-polyfill.js'),
    // Add URL polyfill
    url: path.resolve(__dirname, './src/polyfills/url-polyfill.js'),
  }
};

module.exports = config;
