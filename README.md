# RCPS-Code-of-Conduct

A static, installable **Progressive Web App** for the RCPS Code of Conduct.

## Quick Start (GitHub web UI)

1. Create a new repo named **RCPS-Code-of-Conduct** in your GitHub account.
2. Upload *all files and folders in this directory* to the repo root.
3. In the repo, open **Settings → Pages**.
   - Build and deployment: **Deploy from a branch**
   - Branch: **main** (root)
4. Visit the Pages URL shown (it will look like `https://<USER>.github.io/RCPS-Code-of-Conduct/`).

The app works offline and is installable (Add to Home Screen).

## Command line (HTTPS)

```bash
# inside this folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/RCPS-Code-of-Conduct.git
git push -u origin main
# then enable Pages in Settings → Pages as above
```

## Command line using GitHub CLI

```bash
# inside this folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
gh repo create RCPS-Code-of-Conduct --public --source=. --remote=origin --push
# then enable Pages in Settings → Pages as above
```

## Notes
- Paths are set to **relative** for GitHub Pages (`start_url: "."`, `scope: "."`) and the service worker caches relative assets.
- Routing uses hash (`#/`), so no custom rewrites are needed.
- A `.nojekyll` file is included.
