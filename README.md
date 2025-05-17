# 🎮 Arcade - Valorant Stats Tracker

![Version](https://img.shields.io/badge/version-2.1.1-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

A comprehensive Valorant statistics tracking app built with [**React Native**](https://reactnative.dev), providing players with detailed insights about their performance.

## 📱 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="[ADD_SCREENSHOT_URL_HERE]" width="200" alt="Dashboard"/>
        <br />
        <em>Dashboard</em>
      </td>
      <td align="center">
        <img src="[ADD_SCREENSHOT_URL_HERE]" width="200" alt="Agent Stats"/>
        <br />
        <em>Agent Stats</em>
      </td>
      <td align="center">
        <img src="[ADD_SCREENSHOT_URL_HERE]" width="200" alt="Match History"/>
        <br />
        <em>Match History</em>
      </td>
    </tr>
  </table>
</div>

## ✨ Features

- 📊 Comprehensive player statistics and performance metrics
- 🕵️ Detailed agent performance and usage analysis
- 🗺️ Map-specific statistics and win rates
- 🔫 Weapon accuracy and elimination data
- 📜 Match history and detailed match breakdowns
- 🌙 Dark mode support
- 🔄 Offline data viewing capabilities
- 🎨 Customizable dashboard and stat displays

## 🚀 Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions before proceeding.

### Prerequisites

- Node.js >= 14
- npm or yarn
- iOS: XCode 12+ (for iOS development)
- Android: Android Studio (for Android development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/arcade.git
cd arcade
```

2. Install dependencies
```bash
# using npm
npm install

# OR using Yarn
yarn install
```

## 📱 Running the App

### Start Metro Server

First, start Metro, the JavaScript bundler:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Launch on Device/Simulator

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

## 🛠️ Development

### Modifying the App

1. Open `App.tsx` in your text editor and make your changes
2. For **Android**: Press <kbd>R</kbd> twice or select "Reload" from the Developer Menu
3. For **iOS**: Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in the iOS Simulator

### Running Tests

```bash
# using npm
npm test

# OR using Yarn
yarn test
```

## 📋 Project Structure

```
arcade/
├── android/          # Android native code
├── ios/              # iOS native code
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable components
│   ├── screens/      # Screen components
│   ├── navigation/   # Navigation configurations
│   ├── services/     # API services for Valorant data
│   ├── utils/        # Utility functions
│   └── App.tsx       # Entry point
├── __tests__/        # Test files
└── README.md         # This file
```

## 📝 Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for details on version updates.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev) for the amazing framework
- [React Navigation](https://reactnavigation.org) for the navigation solution
- [Valorant API](https://valorant-api.com) for providing game data
- All our contributors and supporters

---

<div align="center">
  <sub>Built with ❤️ by the Arcade Team</sub>
</div>
