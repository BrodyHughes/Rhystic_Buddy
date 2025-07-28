const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Enabling inlineRequires gives Hermes more opportunities to lazy-load modules
    // and reduces initial memory footprint.
    inlineRequires: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
