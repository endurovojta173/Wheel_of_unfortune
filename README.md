# 🎡 Wheel of Unfortune

Spin the wheel for your daily dose of misery! This web application serves as an interactive and visually catchy "Wheel of Unfortune", created especially for developer teams or anyone who wants to spice up their day with a bit of dark humor.

## ✨ Features

- **Dark Cyberpunk Design:** Neon colors, "glitch" effect on the title, and dynamic shadows.
- **Dark Confetti:** A unique visual confetti effect that triggers after you "win" your daily disaster.
- **Fully Responsive (Mobile First):** The wheel dynamically scales without losing sharpness on any device (including High-DPI Retina displays).
- **TV & Gamepad Ready (tvOS / WebOS):** 
  - Full navigation support using a D-pad or Smart Remote (clearly visible `focus` states on interactive elements).
  - Forced HW (GPU) acceleration (`translateZ`) ensuring smooth spinning even on older and low-end TVs.
  - Graphic fallbacks for devices that struggle with demanding effects like background blurring (`backdrop-filter`).

## 🚀 How to Deploy (GitHub Pages)

The app consists of pure HTML, CSS, and JavaScript (Vanilla JS) and does not require any complex build processes.

1. Upload these files to your GitHub repository.
2. Go to **Settings** -> **Pages** in your repository.
3. Under *Build and deployment*, select the `main` (or `master`) branch and the `/ (root)` folder.
4. Click **Save**.
5. After a few minutes, your Wheel of Unfortune will be live online!

## 🛠️ How to Customize (Adding custom misfortunes)

The wheel can be easily customized without extensive programming knowledge. Just open the `script.js` file and modify the `misfortunes` array at the top of the file:

```javascript
const misfortunes = [
    "Smazaná produkční DB",
    "Páteční deploy spadnul",
    "Nekonečná smyčka",
    "Merge konflikt (50+)",
    "Rozlitá káva",
    "Spadl internet",
    "Zapomenuté heslo",
    "Klient změnil zadání",
    // ⬇️ Add your custom disasters here ⬇️
    "You are paying for lunch today"
];
```

*Note: The wheel automatically recalculates the angles of the slices and assigns the correct colors based on the number of items. You can have as many as you want!*

## 💻 Tech Stack

- **HTML5** (Semantic structure and Canvas for rendering the wheel)
- **CSS3** (Responsive layout, CSS variables, animations, Flexbox)
- **Vanilla JavaScript** (Logic for drawing slices and spinning the wheel, no framework)
- [canvas-confetti](https://github.com/catdad/canvas-confetti) (External library for falling dark confetti)
