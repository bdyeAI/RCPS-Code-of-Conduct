#!/usr/bin/env bash
set -e
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/RCPS-Code-of-Conduct.git
git push -u origin main
echo "Now enable GitHub Pages in Settings → Pages (Deploy from branch: main / root)." 