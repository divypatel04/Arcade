module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './src/components',
          '@assets': './src/assets',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@services': './src/services',
          '@theme': './src/theme',
          '@navigation': './src/navigation',
          '@types': './src/types',
          '@context': './src/context',
          '@lib': './src/lib',
        }
      }
    ]
  ]
};
