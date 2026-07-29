# AGENTS.md — Pico & Pala App

> This file defines the architecture, conventions, and rules for any coding agent working on this project. **Read this before making any changes.**

---

## Project Overview

| Property | Value |
|----------|-------|
| **Name** | Pico & Pala (picopalaapp) |
| **Type** | React Native mobile app (iOS + Android) |
| **Framework** | Expo SDK 56 |
| **Language** | TypeScript (strict mode) |
| **Styling** | NativeWind v4 (TailwindCSS for React Native) |
| **Routing** | Expo Router v6 (file-based) |
| **State** | Zustand v5 |
| **Data Fetching** | TanStack Query v4 |
| **i18n** | i18next + react-i18next |
| **Secure Storage** | expo-secure-store (via adapter) |
| **Backend** | NestJS (planned) |
| **Package Manager** | npm |
| **Publisher** | Auron Tale Games |
| **Bundle ID** | com.auronTaleGames.picopalaapp |

---

## Architecture: Three-Layer Modular Structure

```
picopalaapp/
├── app/                    # Layer 1: Routing & Screens (Expo Router)
├── core/                   # Layer 2: Business Logic & Data
│   ├── actions/            # API call functions by domain
│   ├── adapters/           # External service wrappers
│   ├── helper/             # App-level helpers
│   ├── interfaces/         # TypeScript interfaces by domain
│   └── utils/              # Pure utility functions
├── presentation/           # Layer 3: UI Layer
│   ├── assets/             # Images, fonts
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Translation files & config
│   └── store/              # Zustand stores
├── app.json                # Expo metadata
├── tailwind.config.js      # NativeWind/Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── .env.local              # Environment variables
```

### Layer Rules

| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| `app/` | Layouts, screens, route groups, navigation guards | Business logic, API calls, state definitions |
| `core/` | API actions, interfaces, utilities, adapters | React components, JSX, hooks with UI |
| `presentation/` | Components, hooks, stores, i18n, assets | API calls, business logic, route definitions |

**Path Aliases** (from `tsconfig.json`):
```
@/*             → ./*
@presentation/* → presentation/*
@core/*         → core/*
@assets/*       → presentation/assets/*
```

---

## Product Description

**Pico & Pala** is a number deduction game where two players try to guess each other's 4-digit number.

### Game Rules
- Each player generates a 4-digit number (digits 1-9, no repeats, no zeros).
- Players take turns guessing the opponent's number.
- After each guess, the opponent provides feedback:
  - **Pala**: correct digit in correct position.
  - **Pico**: correct digit in wrong position.
- First player to guess all 4 digits (4 Palas) wins.

### Game Modes
1. **Versus AI**: Play against a bot (offline-first, no backend required).
2. **Private Room**: Challenge a friend online (requires backend).
3. **Global Room**: Matchmaking with random players worldwide (requires backend).

### Product Rules
- **Offline-first**: Versus AI mode works without internet connection.
- **No ads in MVP**.
- **All user-facing text must use i18n** (no hardcoded strings).
- **No repeated digits or zeros** in generated numbers.

---

## Routing & Navigation (Expo Router v6)

### Root Layout
- **File:** `app/_layout.tsx`
- Uses `<Slot />` for child routes.
- Wraps app in `QueryClientProvider`, `GestureHandlerRootView`, `SafeAreaProvider`.
- Initializes fonts (Cairo family), i18n, and global `ModalManager`.

### Main Layout
- **File:** `app/(main)/index.tsx`
- Redirects to `/(main)/initialScreen`.

### Initial Screen
- **File:** `app/(main)/initialScreen/index.tsx`
- Entry point with "Ir a Home" button (placeholder).
- Redirects to `/(main)/private/(tabs)/home`.

### Tab Navigation
- **File:** `app/(main)/private/(tabs)/_layout.tsx`
- 4 tabs using `expo-router/unstable-native-tabs`:
  - `home` — Main menu
  - `game` — Game modes selection
  - `record` — Player statistics
  - `config` — Settings

### Navigation Conventions
- Use `router.push()` for forward navigation.
- Use `router.replace()` for redirects (e.g., after game ends).
- Use `router.navigate()` for deep links.
- **Modals are NOT Expo Router modal routes.** They are global overlay components controlled by Zustand state.

---

## State Management (Zustand v5)

### Store Files
Location: `presentation/store/`

| Store | File | Purpose |
|-------|------|---------|
| `useMainStore` | `useMainStore.ts` | Global UI state: language, modal visibility flags. |
| `useModalStore` | `useModalStore.ts` | Modal visibility flags (e.g., `viewModalNewGame`). |

### Planned Stores
| Store | Purpose |
|-------|---------|
| `useGameStore` | Current game state: player number, opponent number, turns, score. |
| `usePlayerStore` | Player profile, stats, match history. |
| `useAuthStore` | Authentication state (when backend is implemented). |

### Naming Convention
- Files: `use<Domain>Store.ts` (camelCase with `use` prefix).
- State + actions in one file using `create<State>((set, get) => ({ ... }))`.

### Persistence
- **NO Zustand persistence middleware.** Persistence is handled manually via `SecureStorageAdapter`.
- On logout: remove all user-related keys and call `queryClient.clear()`.

### Cross-Store Communication
- Allowed: `useAuthStore` accesses `useMainStore.getState().setLanguage` directly.
- Keep cross-store access minimal and documented.

---

## API & Data Fetching

### Central Fetch Utility (planned)
- **File:** `core/actions/api/fetchGeneral.ts`
- `fetchGeneral<T>(url, method, body?)` wraps native `fetch`.
- Base URL: `process.env.EXPO_PUBLIC_REACT_API`.
- Automatically attaches `Authorization: Bearer <token>` from SecureStore.
- Handles `FormData` vs JSON body detection.
- **Auth handling:** If `response.statusCode === 401`, calls `forceLogout()`.
- **NEVER** use `fetch` directly in components or hooks. Always go through `fetchGeneral`.

### Domain Actions (planned)
Location: `core/actions/<domain>/<domain>-action.ts`

| Domain | File | Example |
|--------|------|---------|
| Auth | `auth/auth-action.ts` | `loginAction`, `registerAction`, `logoutAction` |
| Player | `player/player-action.ts` | `getPlayerStatsAction`, `updatePlayerAction` |
| Match | `match/match-action.ts` | `createMatchAction`, `submitMoveAction`, `getMatchHistoryAction` |
| Room | `room/room-action.ts` | `createPrivateRoomAction`, `joinRoomAction`, `getPublicRoomsAction` |

### Function Naming
- `<verb><Noun>Action` (e.g., `getPlayerStatsAction`, `submitMoveAction`).
- Typed responses: Import interfaces from `@core/interfaces/...`.

### Custom Hooks (TanStack Query)
Location: `presentation/hooks/use<Noun>.ts`

| Hook | File | Query Key Pattern |
|------|------|-------------------|
| `usePlayerStats` | `usePlayerStats.ts` | `['playerStats', playerId]` |
| `useMatchHistory` | `useMatchHistory.ts` | `['matchHistory', playerId, limit]` |
| `useActiveMatch` | `useActiveMatch.ts` | `['activeMatch', matchId]` |

### TanStack Query Patterns
- **Query keys:** Arrays with domain and params.
- **Stale time:** `1000 * 60 * 5` (5 minutes) for most queries.
- **Mutations:** Invalidate queries on success or refetch manually.

---

## Local Storage / SecureStore

### Adapter Pattern
- **File:** `core/adapters/secure-storage.adapter.ts`
- Class `SecureStorageAdapter` with static methods: `setItem`, `getItem`, `removeItem`.
- Wraps all calls in `try/catch` and logs errors.

### Rules
1. **NEVER** use `expo-secure-store` directly in components.
2. **ALWAYS** use `SecureStorageAdapter`.
3. Keys are standardized (see below).

### Stored Keys
| Key | Purpose |
|-----|---------|
| `token` | JWT auth token |
| `appLanguage` | Selected language (`en`, `es`) |
| `playerNumber` | Current game's player number (for offline play) |
| `activeMatchId` | ID of ongoing match (for reconnection) |

---

## Modals

### Global Modal Manager
- **File:** `presentation/components/modals/ModalManager.tsx`
- Rendered in `app/_layout.tsx`.
- Conditionally renders modals based on boolean flags from `useModalStore`.

### Modal Types
| Modal | File | Trigger |
|-------|------|---------|
| New Game Selection | `ModalNewGame.tsx` | `openModalNewGame()` |

### Planned Modals
| Modal | Purpose |
|-------|---------|
| `ModalGameResult` | Show match result (win/loss/draw). |
| `ModalLeaveGame` | Confirm leaving an active game. |
| `ModalSettings` | Quick settings overlay. |

### Technical Details
- Uses React Native `<Modal>` with `animationType="slide"` or `"fade"`.
- Backdrop: `<Pressable>` with `bg-darkPurple/50`.
- **Modals are NOT Expo Router modal routes.** They are global overlay components.

---

## Screens (Pages)

### Location
- `app/(main)/...` for auth/public screens.
- `app/(main)/private/(tabs)/...` for authenticated screens.

### Structure
- Each screen is a **default-exported** React component.
- File naming: `index.tsx` for standard screens, `[slug].tsx` for dynamic routes.

### UI Composition Patterns
- **Background:** `bg-background` (`#1A1C22`) on most screens.
- **Safe area:** Handled by `SafeAreaProvider` in root layout.
- **Keyboard handling:** `KeyboardAvoidingView` with `behavior='padding'`.

---

## UI Components

### Location
`presentation/components/`

### Organization
| Folder | Purpose |
|--------|---------|
| `ui/` | General reusable UI components |
| `modals/` | Global modal components |

### Base UI Components (`ui/`)
| Component | Purpose |
|-----------|---------|
| `ButtonGeneral` | Primary, secondary, tertiary, disabled button variants with gradients. |
| `GameModeCard` | Card for selecting game mode (Versus AI, Private, Global). |
| `StatsCard` | Card for displaying player statistics. |

### Planned UI Components
| Component | Purpose |
|-----------|---------|
| `NumberPad` | Input pad for entering guesses (digits 1-9). |
| `GuessRow` | Row displaying a guess with feedback (pico/pala/fija). |
| `GameBoard` | Container for all guess rows. |
| `TurnIndicator` | Shows whose turn it is. |
| `ScoreBoard` | Displays current score/status. |
| `HeaderPage` | Page header with back button and title. |
| `LoadingPageComponent` | Full-screen loading spinner. |
| `ErrorPageComponent` | Error state with retry button. |
| `EmptyListComponent` | Empty state for lists. |

### Naming Conventions
- **PascalCase** for component files and component names.
- **Default exports** for most components.
- **NO `index.ts` barrels** within component folders — import directly from file path.

---

## Styling & Theming (NativeWind v4)

### Framework
- NativeWind v4 (TailwindCSS for React Native).
- Global CSS: `app/global.css` with `@tailwind base/components/utilities`.

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#1A1C22` | Main app background |
| `surface` | `#2D303E` | Card backgrounds |
| `surfaceLight` | `#3E4251` | Lighter card elements |
| `modalSurface` | `#2D303E` | Modal backgrounds |
| `white` | `#FFFFFF` | Pure white |
| `cream` | `#FFF4E0` | Warm white for text |
| `mainRed` | `#FF5959` | Primary brand red |
| `darkRed` | `#C31432` | Dark red accents |
| `shadowRed` | `#7B0000` | Shadow red |
| `mainRose` | `#FF2E95` | Primary brand rose |
| `darkRose` | `#BC005B` | Dark rose accents |
| `shadowRose` | `#C51B6A` | Shadow rose |
| `mainPurple` | `#9D4EDD` | Primary brand purple |
| `darkPurple` | `#5A189A` | Dark purple accents |
| `shadowPurple` | `#5E35B1` | Shadow purple |
| `limeGreen` | `#84CC16` | Accent green |
| `mainGreen` | `#15803D` | Primary brand green |
| `shadowGreen` | `#008CA3` | Shadow green |
| `gold` | `#FFD600` | Gold/yellow accents |
| `cian` | `#00D2FF` | Cyan accents |
| `seaBlue` | `#00457C` | Deep blue |
| `success` | `#A2D729` | Success state |
| `error` | `#FF4D4D` | Error state |
| `warning` | `#FFC800` | Warning state |
| `textMain` | `#FFFFFF` | Primary text |
| `textMuted` | `#94959B` | Secondary text |
| `border` | `#4A4D57` | Borders |

### Fonts
- **Family:** Cairo (ExtraLight, Light, Regular, SemiBold, Bold, Black).
- **Usage:** `font-CairoRegular`, `font-CairoBold`, etc.
- **Registration:** Loaded via `expo-font` in `app/_layout.tsx`.

### Styling Rules
1. **ALWAYS** use Tailwind classes via NativeWind.
2. **NEVER** use `StyleSheet.create` **EXCEPT** when styling `LinearGradient` components (they don't support NativeWind's `className`).
3. **NEVER** hardcode hex colors in screens — use Tailwind tokens from `tailwind.config.js`.
4. **Platform-specific styling:** `Platform.OS === 'ios' ? 'pt-20' : 'pt-16'`.

---

## Internationalization (i18n)

### Setup
- Libraries: `i18next` + `react-i18next` + `expo-localization`.
- Config: `presentation/i18n/index.ts`.
- Supported languages: `en` (default), `es` (Latin American Spanish).
- Language detection order:
  1. Stored language from SecureStore (`appLanguage`).
  2. Device locale from `expo-localization`.
  3. Fallback to `en`.

### Translation Files
- Location: `presentation/i18n/` (`en.json`, `es.json`).
- Structured by feature/screen keys: `home`, `game`, `settings`, `common`, etc.
- Type safety: `presentation/i18n/type.d.ts` extends i18next's `CustomTypeOptions`.

### Usage
```tsx
const { t } = useTranslation();
// Keys are camelCase:
t('home.buttonNewGame');
t('game.title');
// Pass t as prop to children:
<Component lang={t} />;
```

### Language Switching
- `useMainStore.setLanguage(lang)` updates Zustand, SecureStore, and i18n.
- i18n initialized in `app/_layout.tsx` with `initI18n().then(() => setI18nReady(true))`.

---

## Offline-First Strategy

### Versus AI Mode (100% Offline)
- All game logic runs locally: number generation, turn validation, feedback calculation.
- Game state persisted in Zustand + SecureStore.
- No backend required.

### Private Room Mode (Async Online)
- **Async turns:** each player makes their move and it's saved locally.
- **Pending moves queue:** if offline, moves are queued and synced when connection restores.
- **Push notifications:** notify opponent when their turn is ready.

### Global Room Mode (Real-time)
- Requires connection for matchmaking and real-time synchronization.
- If connection is lost during a match, state is saved locally and reconnection is attempted.

### Implementation
- Zustand for in-memory state.
- `SecureStorageAdapter` for persisting active games.
- TanStack Query with mutation queuing for offline moves.
- `useNetworkStatus` hook for connectivity detection.

---

## Types & Interfaces

### Location
`core/interfaces/`

### Organization
Each domain has its own folder and file:
```
core/interfaces/
├── IPlayer/IPlayer.ts
├── IMatch/IMatch.ts
├── IMove/IMove.ts
├── IRoom/IRoom.ts
├── IStats/IStats.ts
└── IAuth/IAuth.ts
```

### Naming Conventions
- Interfaces: `I<PascalCase>` (e.g., `IPlayerResponse`, `IMatchState`).
- Response wrappers: `IResponse<Domain>` (e.g., `IResponsePlayerStats`).
- Types: `T<PascalCase>` (e.g., `TGameMode`, `TMoveFeedback`).

### Type Declarations
- `declarations.d.ts` declares modules for image assets (`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`) and `.json`.

---

## Environment Variables

### Required
- `EXPO_PUBLIC_REACT_API` — Backend API URL (NestJS).

### File
- `.env.local` (do not commit).
- Uses Expo's `EXPO_PUBLIC_` prefix for client-side variables.

---

## Versioning & Release Policy

### Semantic Versioning (SemVer) — MANDATORY

All version changes MUST follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

| Bump | When | Example |
|------|------|---------|
| **MAJOR** | Breaking API changes, incompatible UI changes, migration requirements | `1.2.2` → `2.0.0` |
| **MINOR** | New features, new screens, new functionality (backward compatible) | `1.2.2` → `1.3.0` |
| **PATCH** | Bug fixes, minor improvements, text corrections (backward compatible) | `1.2.2` → `1.2.3` |

### PR Versioning Checklist

Before merging any PR that prepares a release:

1. **Analyze the changes** to determine the correct version bump (MAJOR/MINOR/PATCH).
2. **Update `app.json`** with the new version number.
3. **Update `CHANGELOG.md`** (Spanish) following Keep a Changelog format:
   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### Added
   - New feature description
   ### Changed
   - Modified behavior description
   ### Fixed
   - Bug fix description
   ### Removed
   - Removed feature description
   ```
4. **Verify consistency** between `app.json` version and the latest changelog entry.

---

## Code Quality Rules

1. **NO direct `fetch` calls** — always use `fetchGeneral` (when implemented).
2. **NO direct `expo-secure-store` calls** — always use `SecureStorageAdapter`.
3. **NO `StyleSheet.create`** — use NativeWind/Tailwind classes, **EXCEPT** for `LinearGradient` or other native components that don't support `className`.
4. **NO hardcoded hex colors** — use Tailwind tokens.
5. **NO `index.ts` barrels** in component folders — import directly.
6. **NO business logic in `app/`** — keep it in `core/`.
7. **NO React components in `core/`** — keep them in `presentation/`.
8. **ALWAYS** use i18n keys for user-facing text — no hardcoded strings.
9. **ALWAYS** update `CHANGELOG.md` when preparing a release.
10. **NO `console.log` or `console.error`** in production code — remove before commit.
11. **NO `throw 'string'`** — always use `throw new Error('...')` for proper stack traces.

---

## Quick Reference

| Need | Go To |
|------|-------|
| Add a new screen | `app/(main)/...` (file-based routing) |
| Add a new API call | `core/actions/<domain>/<domain>-action.ts` |
| Add a new data hook | `presentation/hooks/use<Noun>.ts` (TanStack Query) |
| Add a new store | `presentation/store/use<Domain>Store.ts` |
| Add a new component | `presentation/components/<category>/<ComponentName>.tsx` |
| Add a new interface | `core/interfaces/<Domain>/I<Name>.ts` |
| Add a new translation | `presentation/i18n/{en,es}.json` |
| Add a new utility | `core/utils/<UtilityName>.ts` |
| Change a color | `tailwind.config.js` (not in screens) |
| Add a new modal | `presentation/components/modals/` + update `ModalManager.tsx` + `useModalStore` |
| Install a package | `npm install <package>` |
