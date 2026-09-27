# 🎡 Wheel of Unfortune

👉 **[Play it online here!](https://endurovojta173.github.io/Wheel_of_unfortune/)** 👈

Spin the wheel for your daily dose of misery! This web application serves as an interactive and visually catchy "Wheel of Unfortune", created especially for developer teams or anyone who wants to spice up their day with a bit of dark humor. 

## ✨ Features

- **PWA (Progressive Web App):** Install the game directly to your phone or desktop! The app functions 100% offline thanks to its Service Worker caching. An in-app "Install" button dynamically appears in the sidebar for compatible devices.
- **Dynamic Sound Effects:** Uses the browser's native **Web Audio API** to generate a ticking sound during spins and one of three random victory fanfares (Epic Brass, Retro 8-bit, or Cavalry Charge) upon finishing—all without needing external audio files!
- **Multiple Visual Themes:** Switch instantly between the Neon Cyberpunk (Default), Circus (Classic), or Folklore themes.
- **Custom Categories:** Create, edit, and delete your own sets of tasks or challenges directly within the app! No coding required.
- **Persistent Storage:** Your custom categories and selected themes are automatically saved in the browser's `localStorage`.
- **Share via Link:** Generate a unique link to instantly share your custom wheels with friends. The category data is base64 encoded into the URL, allowing instant import on opening!
- **Session History:** A built-in history modal tracks all the unfortunate tasks you rolled during your current session.
- **Category Info:** View all the items in your currently selected category at a glance.
- **Dark Confetti:** A unique visual confetti effect that triggers after you "win" your daily disaster.
- **Fully Responsive & TV Ready:** The wheel and side menus scale perfectly on any device, from mobiles to desktops, and features full D-pad keyboard/remote navigation support for smart TVs.

## 🧠 How It Works Under the Hood

The app is built as a pure Vanilla JavaScript SPA (Single Page Application). Here is how the core systems operate:

1. **Canvas Rendering:** The wheel is dynamically drawn using the HTML5 `<canvas>` API. Text wraps automatically depending on the number of segments, and everything is scaled for high-DPI displays.
2. **CSS-Driven Animation:** Instead of redrawing the canvas every frame to simulate spinning, the app calculates a random rotation target and applies a `transform: rotate()` CSS transition. This offloads the heavy lifting to the GPU (Hardware Acceleration) for buttery smooth 60fps animations.
3. **Audio Generation:** No `.mp3` files are used. The Web Audio API synthesizes waveforms (sine, sawtooth, triangle) to generate sound effects entirely through mathematics on the fly.
4. **Service Worker (Offline Mode):** `sw.js` caches all core assets (HTML, JS, CSS, icons). When a user opens the app without an internet connection, the Service Worker intercepts the network requests and serves the files locally.
5. **State Management:** All UI state (active theme, active category, custom categories) is tightly synchronized with `localStorage`.

## 🚀 How to Deploy (GitHub Pages)

The app consists of pure HTML, CSS, and JavaScript (Vanilla JS) and does not require any complex build processes.

1. Upload these files to your GitHub repository.
2. Go to **Settings** -> **Pages** in your repository.
3. Under *Build and deployment*, select the `main` branch and the `/ (root)` folder.
4. Click **Save** and you are live!

## 🛠️ How to Customize (Hardcoding default categories)

While users can create custom categories in the UI, you can still add new built-in sets by modifying the `questionSets` object at the top of `script.js`:

```javascript
const questionSets = {
    "Základní": [
        "Udělej 10 poctivých dřepů!",
        "Spadl internet",
        "Rozlitá káva"
    ]
};
```

## 💻 Tech Stack

- **HTML5** (Semantic structure, Canvas API)
- **CSS3** (Responsive layout, CSS Variables, Flexbox, GPU-accelerated transitions)
- **Vanilla JavaScript** (Web Audio API, DOM manipulation, Clipboard API)
- **PWA** (Manifest, Service Worker)
- [canvas-confetti](https://github.com/catdad/canvas-confetti) (External library for falling dark confetti)
