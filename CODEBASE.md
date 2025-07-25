# Rhystic Buddy Codebase Documentation

## Overview

Rhystic Buddy is a React Native life counter app for Magic: The Gathering Commander (EDH) format. The app provides an intuitive interface for tracking life totals, commander damage, and various counters during gameplay.

## Architecture

### Technology Stack

- **Framework**: React Native 0.79.2
- **Language**: TypeScript (strict mode enabled)
- **State Management**: Zustand (persistent storage with AsyncStorage)
- **Navigation**: Custom carousel-based navigation using React Native Reanimated
- **UI Libraries**:
  - React Native Reanimated for animations
  - React Native Gesture Handler for gestures
  - React Native SVG for icons (via Lucide)
  - Linear Gradient and Blur effects

### Project Structure

```
src/
├── App.tsx                    # Main app component with layout logic
├── consts/                    # Application constants
│   ├── consts.ts             # Colors, dimensions, and other constants
│   ├── counters.ts           # Counter types and configurations
│   └── licenses.ts           # Third-party license information
├── features/                  # Feature-based modules (Feature-Sliced Design)
│   ├── central-menu/         # Central menu button and modals
│   │   ├── components/       # Menu components
│   │   ├── hooks/           # Feature-specific hooks
│   │   ├── modals/          # Modal components
│   │   └── store/           # Zustand stores
│   ├── commander-damage/     # Commander damage tracking
│   ├── counters-menu/        # Counter management
│   └── player-panel/         # Player life panels
├── helpers/                  # Utility functions
│   ├── api.ts               # HTTP request helpers
│   └── scryfallFetch.ts     # Scryfall API integration
├── hooks/                    # Shared React hooks
│   ├── useCarousel.ts       # Carousel gesture handling
│   └── useResetAllCarousels.ts
├── lib/                      # Core libraries
│   ├── PlayerCarouselManager.ts  # Carousel state management
│   └── queryClient.ts       # React Query configuration
├── styles/                   # Global styles
│   └── global.tsx           # Design tokens (typography, spacing, etc.)
└── types/                    # TypeScript type definitions
    ├── app.ts               # Application-wide types
    └── scryfall.ts          # Scryfall API types
```

## Key Concepts

### 1. Player Panels

- Each player has a panel that can be swiped between different views
- Views: Life tracking, Commander damage, Counters
- Panels rotate based on player position for optimal viewing
- Support for 2-6 players with dynamic layouts

### 2. State Management

- **Zustand stores** handle all application state
- Persistent storage using AsyncStorage for:
  - Player life totals
  - Commander damage matrix
  - Player backgrounds
- Timer management for life change deltas

### 3. Gesture System

- Custom carousel implementation using Reanimated
- Swipe gestures to navigate between views
- Long press for continuous life changes
- Centralized carousel reset management

### 4. Layout System

- Dynamic grid layout based on player count:
  - 2 players: 1x2 (side by side, rotated)
  - 3 players: 2x2 with one full-width
  - 4 players: 2x2 grid
  - 5 players: 2x3 with one rotated
  - 6 players: 2x3 grid
- Safe area handling for different devices

## Core Components

### PlayerPanel (`src/features/player-panel/components/PlayerPanel.tsx`)

The main component for each player's interface. Features:

- Gesture-based view switching
- Background image support with grayscale for "dead" players
- Life change handling with long-press support
- Turn order overlay effects

### CentralMenuButton (`src/features/central-menu/components/CentralMenuButton.tsx`)

Floating action button that provides access to:

- Player count selection
- Turn order randomization
- Game reset
- Additional settings

### Counter System

- Default counters: Tax, Charge
- Extra counters: Poison, Storm, Mana (5 colors)
- Dynamic counter management with animations
- Centralized configuration in `consts/counters.ts`

## Data Flow

1. **User Input** → Gesture Handler → Component Event
2. **Component** → Zustand Store Action
3. **Store** → State Update → AsyncStorage (if persistent)
4. **Store** → React Re-render → UI Update

## Performance Optimizations

1. **Memoization**: Heavy use of React.memo and useCallback
2. **Animated Values**: Shared values for smooth animations
3. **Lazy Loading**: Modals loaded on-demand
4. **Efficient Renders**: Granular subscriptions to store slices

## API Integration

### Scryfall API

- Used for card art backgrounds
- Card rulings search
- Implemented with React Query for caching
- Rate limiting considerations

## Design Patterns

### 1. Feature-Sliced Design

Each feature is self-contained with its own:

- Components
- Stores
- Hooks
- Types

### 2. Composition Over Inheritance

- Small, focused components
- Shared hooks for common logic
- Props drilling minimized with stores

### 3. Type Safety

- Strict TypeScript configuration
- Explicit typing for all props and state
- Type guards for API responses

## Common Tasks

### Adding a New Counter Type

1. Add to `CounterType` in `src/consts/counters.ts`
2. Add icon mapping in `COUNTER_ICONS`
3. Add color mapping in `COUNTER_COLORS`
4. Add to appropriate array (`DEFAULT_COUNTERS` or `EXTRA_COUNTERS`)

### Adding a New Player View

1. Add enum value to `ViewMode` in `src/types/app.ts`
2. Update carousel logic in `PlayerPanel`
3. Add view component and conditional rendering
4. Update `numRealViews` calculation

### Modifying Player Layouts

1. Update `layoutConfigurations` in `App.tsx`
2. Adjust panel dimensions calculation
3. Update rotation logic if needed

## Debugging Tips

1. **Gesture Issues**: Check `useCarousel` hook and gesture configuration
2. **State Persistence**: Verify AsyncStorage keys and migrations
3. **Animation Glitches**: Check worklet functions and shared values
4. **Layout Problems**: Use React Native debugger for flex inspection

## Code Style Guidelines

- Functional components with TypeScript FC type
- Hooks for all stateful logic
- Memoization for expensive computations
- Descriptive variable names (prefer clarity over brevity)
- Comments for complex logic only
- Consistent file naming: PascalCase for components, camelCase for others

## Future Considerations

1. **Performance**: Monitor bundle size as features grow
2. **Testing**: Add unit tests for stores and integration tests for components
3. **Accessibility**: Enhance screen reader support
4. **Offline**: Better offline capability for background images
5. **Multiplayer**: Potential for networked games
