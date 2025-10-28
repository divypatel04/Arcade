module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@context': './src/context',
          '@config': './src/config',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@services': './src/services',
          '@theme': './src/theme',
          '@types': './src/types',
          '@assets': './src/assets',
          '@lib': './src/lib',
          '@constants': './src/constants',
        },
      },
    ],
  ],
};
