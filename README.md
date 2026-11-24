# TERMINAL//WORD

A zero-dependency, offline-first daily 5-letter word game with a dark terminal UI.

## Features
- Shared daily puzzle synced to local midnight (no backend required)
- Two-pass duplicate-letter evaluation + Hard Mode enforcement
- Unlimited Practice mode unlocked after completing the daily word
- Persistent local stats, streaks, distribution chart, and emoji share grid
- Installable PWA with offline Service Worker caching
- High-contrast colorblind mode, Matrix theme variant, Web Audio synth, and haptics

## Deploy on GitHub Pages
1. Create a new GitHub repository and push all files to the `main` branch.
2. Open **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

## Deploy on Netlify
1. Put all files in a single folder.
2. Drag and drop the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) (or connect your Git repo with no build command and publish directory `.`).
