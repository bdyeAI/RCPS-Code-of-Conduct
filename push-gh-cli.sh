#!/usr/bin/env bash
set -e
git init
git add .
git commit -m "Initial commit"
git branch -M main
gh repo create RCPS-Code-of-Conduct --public --source=. --remote=origin --push
echo "Now enable GitHub Pages in Settings → Pages (Deploy from branch: main / root)." 