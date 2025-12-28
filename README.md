# macOS-style Portfolio

A high-fidelity personal portfolio website that recreates the macOS user interface using Vue 3. This project focuses on authentic interaction design, system architecture simulation, and cross-device responsiveness.

Currently hosted at https://7wik-pk.github.io/portfolio/

Long-time Mac users might notice some inconsistencies - various visual elements were borrowed from different macOS versions, so it's a mixture of things that never existed in the same version. This is by design - I borrowed whatever I liked best in some places and whatever seemed appropriate in others - from different versions - and combined them into a cohesive experience.

## Screenshots

### Desktop
![Desktop](src/assets/img/screenshots/desktop.png)

### Launchpad (App Drawer)
![Launchpad](src/assets/img/screenshots/launchpad.png)

### Finder
![Finder](src/assets/img/screenshots/finder.png)

## 🏗️ Architecture & Technical Implementation

### Dynamic Window Management 🪟
The core of the desktop experience is a robust window management system handled in `App.vue`:
- **Registry & State**: Windows are tracked in an `openWindows` array and rendered dynamically via `<component :is="...">`.
- **Z-Index Stacking**: A separate `windowStack` array tracks the focus order. The currently focused window is always at the end of the array, with a computed `z-index` starting from 2000.
- **Project Structure**: Organized into `views/` (major application screens) and `components/` (reusable UI elements), ensuring a clear separation of concerns.

### System Registries & Unified Launch 🗄️
The application is strictly data-driven, leveraging dry configuration patterns:
- **`config/apps.js`**: Centralized registry for all applications, defining icons, responsive behavior, and launch actions.
- **`config/finder.js`**: Defines the mock file system and the **`contentMap`**—the single source of truth for all system entities.
- **Unified Launch Engine**: Refactored logic to use a single `handleLaunch` function in `App.vue`. This engine handles all content types (files, folders, apps, URLs, and info views) through a standardized interface.
- **`data/projects.json`**: Decoupled project metadata allowing for easier content updates without touching core logic.

## ✨ Key Features

### 1. Desktop Experience 🖥️
- **Functional Icons**: High-fidelity desktop icons for "My Projects" and "My Resume".
  - *Interaction*: Supports single-click selection (blue label highlight) and double-click/double-tap launching.
  - *Accessibility*: High-contrast multi-layer text shadows ensure legibility on any wallpaper.
- **About Me (InfoView) 👤**: Recreated the "About This Mac" experience using a generic `InfoView` component. It supports circular headshots, structured metadata details, and multiple system-integrated action buttons (e.g., "Email Me" or "My Resume").
- **Interactive Stickies 📝**: Draggable, editable sticky note components. Now supports internal hyperlinking (via `v-html` and delegated event handling) that can trigger system actions like launching the About Me view.
- **Dynamic Wallpapers 🌅**: Includes a smooth **cross-fade transition system** when changing wallpapers via the Control Center.

### 2. The Dock & Menu Bar 🚀
- **Launch Simulation**: Implements a "bounce" physics animation and a realistic delay before windows appear.
- **Typography Polish**: Uses SF Pro Display with standardized Medium (500) weights across the Menu Bar and dropdowns for a more premium system feel.
- **Context-Aware Menus**: The Apple and File menus update states dynamically based on window focus.

### 3. Finder (File System) 📂
- **Smart Navigation**: Full breadcrumb support and a sidebar that automatically highlights the most specific active favorite.
- **Automated Favorites**: Sidebar items are rendered from a registry that maps IDs to canonical folder paths.
- **Responsive Details**: A details side panel that displays metadata (size, kind, modified date) for selected files.

### 4. Control Center & Aesthetics ⚡
- **Wallpaper Switcher**: A refined submenu with rotating indicators, checkmarks for active selections, and hover tooltips for names.
- **Sonoma Glassmorphism**: Refined the UI with "Sequoia/Sonoma" style glassmorphism—using `0.5` opacity backgrounds and layered `backdrop-filter` blurs for a depth-heavy, vibrant "glass" effect.

## 📱 Responsiveness & Tablet Optimization
- **Smart Tap Logic**: Robust double-tap detection for tablets (within 300ms) alongside native mouse support.
- **Granular Resizing**: Added a per-window `resizable` property. This allows productivity apps (like Finder) to scale to **85% width** and **75% height** on smaller screens while keeping utility cards (like About Me) at their precise native dimensions.
- **Touch Awareness**: Hover effects are conditionally disabled on touch devices using `@media (hover: hover)` to prevent "sticky" highlights.
- **Mobile Optimized**: The Dock shrinks, specific apps hide, and the `InfoView` components automatically reformat into vertical stacks with scrollability to prevent header clipping.

## 🛠️ Tech Stack
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Scoped)
- **Asset Management**: Eager glob importing for wallpapers and dynamic icon resolution.

## Acknowledgements

I found most of the MacOS icons on https://www.macosicongallery.com/ and https://macosicons.com/ - I'm naturally grateful to the creators responsible for making them available on these sites.

This project was heavily vibe-coded, thanks to Google Antigravity & several models (I jump from one to another when I exceed free usage quotas because I'm stingier than an Indian housewife in the Sunday market).

## Setup
```bash
npm install
npm run dev
```
