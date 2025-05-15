# Commander Counter

&#x20;

*A lightweight life & game‑state tracker for Magic: The Gathering™ Commander nights. Built with ****React Native**** + ****TypeScript****.*

## Prerequisites

| Tool             | Minimum version | Install guide                                                   |
| ---------------- | --------------- | --------------------------------------------------------------- |
| Node.js          | 18 LTS          | [nodejs.org](https://nodejs.org)                                |
| Yarn             | 1.x (classic)   | `corepack enable` then `corepack prepare yarn@stable —activate` |
| Xcode            | 15              | [Apple Dev](https://developer.apple.com/xcode/)                 |
| Android Studio   | Hedgehog        | [Android Studio](https://developer.android.com/studio)          |
| Watchman (macOS) | –               | `brew install watchman`                                         |
| CocoaPods (iOS)  | 1.14            | `sudo gem install cocoapods`                                    |

> **Expo?** We’re using the React Native CLI for fine‑grained native control. Expo users are welcome but may need extra configuration.

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/BrodyHughes/commander-counter.git
cd commander-counter
yarn install

# 2. Start Metro (in a new terminal)
yarn start
```

## Running the App

### iOS

```bash
# first time (installs pods)
bundle install && bundle exec pod install
yarn ios            # builds & runs in iOS Simulator
```

### Android

```bash
yarn android        # builds & runs on Android emulator or device
```

*Pro‑tip*: press R twice to reload on Android, or ⌘ R in the iOS Simulator.

## Project Structure

```
.
├── android/            # native Android project
├── ios/                # native iOS project
├── src/
│   ├── components/     # reusable UI pieces
│   ├── screens/        # feature screens
│   ├── hooks/          # shared hooks
│   └── theme/          # theming & design‑system tokens
└── app.json            # RN config
```

## Scripts

| Command                     | Description                  |
| --------------------------- | ---------------------------- |
| `yarn start`                | Launch Metro bundler         |
| `yarn ios` / `yarn android` | Build & run on iOS / Android |
| `yarn lint`                 | ESLint + Prettier            |
| `yarn typecheck`            | `tsc --noEmit`               |
| `yarn test`                 | Jest unit tests              |

## Contributing

Follow these steps to get a pull request merged:

1. **Fork** the repo & create a feature branch:
   `git checkout -b feat/<scope>`
2. Commit using [Conventional Commits](https://www.conventionalcommits.org).
3. **Push** and open a PR against `main`.
4. Our **Blacksmith CI** pipeline will run lint, type‑check, tests and build.
5. Request a review from @brody or another maintainer.
6. Squash‑merge once CI is green ✅.

Local sanity check:

```bash
yarn lint && yarn typecheck && yarn test
```

## Roadmap

*

Feel free to open an issue or PR for anything you’d like to tackle.

## Troubleshooting

* **Metro stuck on “Loading dependency graph”** – run `npx react-native-clean-project` then `yarn start --reset-cache`.
* **iOS build fails with Ruby gems** – `brew install ruby` then `sudo gem install cocoapods bundler`.
* More tips in the official [React Native Troubleshooting guide](https://reactnative.dev/docs/troubleshooting).


## Acknowledgements

* [React Native](https://reactnative.dev) & the awesome OSS community
* Iconography by [lucide.dev](https://lucide.dev)
