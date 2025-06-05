# 📘 MeDit Documentation

## 📦 What is MeDit?

**MeDit** is a browser-based video editor inspired by CapCut. It uses `ffmpeg.wasm` to apply real-time video effects and export real `.mp4` files — no server required.

---

## 🚀 Features

- Upload video (MP4 or compatible)
- Apply effects:
  - Grayscale
  - Invert
  - Brightness
  - Contrast
- Preview effects live
- Export video using FFmpeg (WebAssembly version)
- Offline support (open `index.html` locally)
- Works on desktop and mobile (Chrome, Firefox, Kiwi Browser)

---

## 🧠 How It Works

- Loads video using `input[type="file"]`
- Applies CSS filters for preview
- When exporting, `ffmpeg.wasm`:
  - Loads video into memory
  - Applies real FFmpeg video filters
  - Exports `.mp4` with effect
  - Downloads the file

---

## 📁 Folder Structure
MeDit/
├── index.html
├── script.js
├── README.md         ← Redirects to Documentation
├── documentation.md  ← Full technical & usage docs
└── images/
    ├── logo.png
    └── screenshot.png
---

## 🛠 How to Use

1. Download the whole folder
2. Open `index.html` in browser (Chrome, Firefox, or Kiwi Browser)
3. Upload your video
4. Select an effect
5. Click "Export Edited Video"
6. Your new video downloads as `edited_video.mp4`

---

## 💾 Supported Browsers

| Browser     | Supported |
|-------------|-----------|
| Chrome      | ✅ Yes     |
| Firefox     | ✅ Yes     |
| Safari      | ⚠️ Partial (WASM issues) |
| Kiwi (Android) | ✅ Yes     |
| Samsung Internet | ❌ Not fully tested |

---

## ⚠️ Notes

- Video export may take time depending on length and resolution.
- ffmpeg.wasm uses memory — avoid exporting large videos on mobile.
- Works offline, but must be opened in a browser (not a file explorer).

---

## 📄 License

This project is under the **MIT License**. Free to use, share, and modify.

---

> Made for GitHub use, designed for mobile devs like you.
