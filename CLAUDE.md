# CLAUDE.md

Rhystic Buddy is a React Native life counter for Magic: The Gathering Commander. See `CODEBASE.md` for the architecture overview.

## Environment

- Node 22.13+ or 24.3+ (`.nvmrc` pins 24; run `nvm use`). Yarn 1.x.
- iOS: Xcode + CocoaPods via Bundler. `ios/.xcode.env.local` (gitignored) sets `NODE_BINARY` and must point at a Node 22.13+/24.3+.
- Android: JDK 17, Android SDK 37.
- RN 0.88, New Architecture + Hermes, Reanimated 4 + react-native-worklets, TypeScript 6.

## Commands

```bash
yarn install-all     # yarn + bundle install + pod install
yarn start           # Metro (add --reset-cache after dependency changes)
yarn ios / yarn android
yarn typecheck       # tsc --noEmit
yarn lint            # eslint
cd android && ./gradlew assembleDebug
```

The pre-commit hook runs eslint, prettier and `tsc --noEmit` (via npx, so it works without yarn on the active Node) on staged files. Typecheck covers every `.ts/.tsx` in the repo, so stray files (even outside `src/`) will fail commits.

## Conventions

- `@/` resolves to `src/` (babel module-resolver and tsconfig `paths`).
- Zustand stores live in `src/features/*/store`. Subscribe with selectors (`useStore((s) => s.x)`), never by destructuring the whole store; whole-store subscriptions re-render every player panel.
- Inside gesture/animation worklets, call JS functions with `scheduleOnRN(fn, ...args)` from `react-native-worklets` (not `runOnJS`).
- Reanimated 4 changed `withSpring` defaults. Pass `Reanimated3DefaultSpringConfig` (or a full mass/stiffness/damping config) to keep the existing feel.
- Don't gate interactivity on an animated value reaching an exact target (e.g. `progress.value === 1`). Reanimated 4 springs only snap to the target after settling (~1s), so drive `pointerEvents` etc. from React state instead.
- Colors and shared tokens: `src/consts/consts.ts`, `src/consts/counters.ts`, `src/styles/global.tsx`.

## Layout & rotation invariants (fragile — read before touching)

Players sit around a table. Each panel is rotated so its owner reads it from their seat. This logic is spread across `src/App.tsx`, `PlayerPanel.tsx`, `src/hooks/useCarousel.ts` and `GlobalDamageOverlays.tsx`, and the four must agree.

**Grid** (`layoutConfigurations` in `App.tsx`): 2p = 1×2 (stacked), 3p/4p = 2 cols × 2 rows, 5p/6p = 2 cols × 3 rows. In 3p and 5p the last player (index 2 or 4) gets a full-width row of their own (`isLastPlayerOddLayout`).

**Panel rotation** (`PlayerPanel.tsx`, `finalRot`):

| Case                                 | Even index | Odd index |
| ------------------------------------ | ---------- | --------- |
| 2 players                            | 90°        | 270°      |
| 3–6 players (grid)                   | 0°         | 180°      |
| Odd last player (3p idx 2, 5p idx 4) | 270°       | —         |

**Pre-rotation size swap.** A rotated View is laid out _before_ rotation, so for 90°/270° panels width and height are passed swapped: `panelW` is the visual height and `panelH` the visual width. 2p panels also get `marginVertical = (panelW - panelH) / 2` so the rotated box fits its flex slot. The odd last player uses `panelW = usableH / rows`, `panelH = W - 2*gap`.

**Content rotation.** Panel content (LifeView, CountersView, the commander label) is rotated a further 90° inside the panel, which is why `LifeView` receives `panelWidth={panelH}`.

**Swipe mapping** (`useCarousel.ts`). The carousel is a 4×4 grid of panel-sized cells: horizontal track Life ↔ Counters, vertical track Life ↔ Commander (vertical only with >2 players), with dummy cells at each end for looping. Gesture translation is in _screen_ space, so:

- `swapAxes` (2p or odd last player) swaps which screen axis means "horizontal" for the panel.
- `flipFactor` (+1 even / −1 odd index) inverts direction for upside-down panels.
- The odd last player inverts the vertical flip again because it sits at 270°, not 180°.

**Duplicated geometry.** `GlobalDamageOverlays.tsx` independently recomputes every panel's absolute position, size and rotation to draw commander-damage incrementers over the other players. Any change to grid, gap, panel sizing or rotation in `App.tsx`/`PlayerPanel.tsx` must be mirrored there.

**Gap.** 2-player mode uses `GAP * 1.1` on iOS and `GAP` on Android (`App.tsx`).

### Verifying layout changes

Never change the above without checking 2, 3, 4, 5 and 6 players on a simulator, including swiping each direction on a 0° panel, a 180° panel and the odd last panel, and opening commander damage (swipe to the Commander view with 3+ players). Before/after screenshots compared at the same resolution are the reliable check.
