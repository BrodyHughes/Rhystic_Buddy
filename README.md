<div align="center">
  <img src="assets/ICON_NO_BCKGRND.png" alt="Rhystic Buddy Logo" width="150" />
  <h1>Rhystic Buddy</h1>
  <p>A life counter and game utility app for Magic: The Gathering's Commander (EDH) format, built with React Native.</p>
  
  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/github/package-json/v/BrodyHughes/commander-counter?style=flat-square" alt="Version" />
    <img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  </p>
</div>

---

**Rhystic Buddy** is an app designed to be a simple, but feature-rich companion for your Commander games. It features life trackin and also offers a suite of tools to manage board states and streamline gameplay, all wrapped in a clean, gesture-driven interface.

## ✨ Key Features

- **Multi-Player Life Tracking**: Supports games from 2 to 6 players, with clear, easily adjustable life totals.
- **Commander Damage**: Dedicated interface to track commander damage dealt by each player to their opponents.
- **Turn Order Randomizer**: Quickly determine who goes first with a single tap.
- **In-App Rulings**: Integrated Scryfall search to look up card rulings without leaving the app.
- **Customizable Backgrounds**: Personalize your player panel by searching for and setting your favorite Magic card art as a background.
- **Counter Tracking**: Easily manage counters like poison, energy, and floating mana.
- **Intuitive Gestures**: A smooth, carousel-based UI for navigating between different utility views.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack Query](https://tanstack.com/query/latest)
- **Animation & Gestures**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **UI**: [React Native SVG](https://github.com/react-native-svg/react-native-svg) for custom components & [Lucide](https://lucide.dev/) for icons.

## 📂 Project Structure

The project uses a feature-sliced architecture to keep the codebase modular, scalable, and easy to navigate.

```
src/
├── consts/         # Application-wide constants (colors, layout values)
├── features/       # Self-contained feature modules
│   ├── central-menu/
│   ├── commander-damage/
│   ├── counters-menu/
│   └── player-panel/
├── helpers/        # Utility functions (e.g., API helpers)
├── hooks/          # Shared custom React Hooks
├── lib/            # Core libraries and managers (e.g., queryClient)
├── styles/         # Global styles and design tokens
└── types/          # Shared TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>=18)
- Yarn (v1.x)
- Watchman (macOS)
- Ruby & Bundler (iOS)
- JDK (Android)
- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) completed for your OS.

### Installation & Running

1.  **Clone the repository:**

    ```sh
    git clone git@github.com:BrodyHughes/Rhystic_Buddy.git
    cd Rhystic_Buddy
    ```

2.  **Install all dependencies:**
    This command handles Yarn packages, Ruby gems, and CocoaPods in one go.

    ```sh
    yarn install-all
    ```

3.  **Start the Metro server:**

    ```sh
    yarn start
    ```

4.  **Run on a simulator or device:**
    Keep the Metro server running in a separate terminal.
    - **For iOS:**
      ```sh
      yarn ios
      ```
    - **For Android (still in development):**
      ```sh
      yarn android
      ```

## 📜 Available Scripts

| Command            | Description                                               |
| :----------------- | :-------------------------------------------------------- |
| `yarn start`       | Starts the Metro bundler.                                 |
| `yarn ios`         | Builds and runs the app on the iOS Simulator.             |
| `yarn android`     | Builds and runs the app on an Android emulator or device. |
| `yarn install-all` | Installs all JS, Ruby, and CocoaPods dependencies.        |
| `yarn lint`        | Lints the codebase with ESLint.                           |
| `yarn lint:fix`    | Lints and automatically fixes issues.                     |
| `yarn typecheck`   | Runs the TypeScript compiler to check for type errors.    |
| `yarn format`      | Formats code with Prettier.                               |
| `yarn clean`       | Removes all generated files and caches.                   |

## 🤝 Contributing

Contributions are welcome! Whether it's a bug report, a new feature, or a suggestion, please feel free to open an issue or submit a pull request.

1.  **Fork the repository** and create your feature branch:
    `git checkout -b <your-username>/<short-description>`
2.  **Make your changes.**
3.  **Ensure your code passes local checks** before pushing:
    ```sh
    yarn lint:fix && yarn typecheck
    ```
4.  **Push your branch** and open a Pull Request against the `main` branch.

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Icons by [Lucide](https://lucide.dev/)
- Card data and images via the [Scryfall API](https://scryfall.com/docs/api)

## ⚖️ Disclaimer

Rhystic Buddy is unofficial Fan Content permitted under the [Wizards of the Coast Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy). Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.

This application uses data from the [Scryfall API](https://scryfall.com/docs/api), but is not produced by, endorsed by, supported by, or affiliated with Scryfall.
