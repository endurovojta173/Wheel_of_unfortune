# 🎡 Wheel of Unfortune

👉 **[Play it online here!](https://endurovojta173.github.io/wheel_of_unfortune/)** 👈

Spin the wheel for your daily dose of misery! This web application serves as an interactive and visually catchy "Wheel of Unfortune", created especially for developer teams or anyone who wants to spice up their day with a bit of dark humor.

## ✨ Features

- **Multiple Visual Themes:** Switch instantly between the default Neon Cyberpunk, classic Circus, or traditional Folklore themes.
- **Custom Categories:** Create your own set of tasks or challenges directly within the app! No coding required.
- **Persistent Storage:** Your custom categories are automatically saved in the browser's `localStorage`, so they never get lost.
- **Share via Link:** Generate a unique link to instantly share your custom wheels with friends. When they open it, it saves into their browser automatically!
- **Dark Confetti:** A unique visual confetti effect that triggers after you "win" your daily disaster.
- **Fully Responsive:** The wheel and side menus scale perfectly on any device, from mobiles (with native app-like sidebar feeling) to desktops.
- **TV & Gamepad Ready:** Full D-pad navigation support for smart TVs.

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
    ],
    "My New Category": [
        "Item 1",
        "Item 2",
        "Item 3"
    ]
};
```

## 💻 Tech Stack

- **HTML5** (Semantic structure and Canvas for rendering the wheel)
- **CSS3** (Responsive layout, CSS variables, animations, Flexbox)
- **Vanilla JavaScript** (Logic for drawing slices and spinning the wheel, no framework)
- [canvas-confetti](https://github.com/catdad/canvas-confetti) (External library for falling dark confetti)
