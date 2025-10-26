#!/bin/bash

# BeeDoc Desktop Build Script
# This script builds the desktop application by:
# 1. Building the web version to dist/
# 2. Adding build number to UI
# 3. Running Pake to package the local files

set -e

# Generate build number from timestamp
BUILD_NUMBER=$(date +%Y%m%d%H%M)
VERSION="0.1.2"

echo "🐝 Building BeeDoc Desktop Application..."
echo "📋 Version: ${VERSION} Build: ${BUILD_NUMBER}"

# Step 1: Build web version
echo "📦 Step 1: Building web version..."
pnpm run build:web

# Step 2: Update version in about dialog
echo "🔖 Step 2: Adding build number to UI..."
sed -i "s/<div class=\"about-version\">Version 0\.1\.1<\/div>/<div class=\"about-version\">Version ${VERSION} (Build ${BUILD_NUMBER})<\/div>/" dist/index.html

# Step 3: Build with Pake using local files
echo "🔨 Step 3: Building desktop application with Pake..."
pake dist/index.html --name BeeDoc --title "BeeDoc v${VERSION} (Build ${BUILD_NUMBER})" --app-version ${VERSION} --width 1200 --height 800 --use-local-file

# Move .deb to root if it exists
if [ -f "beedoc.deb" ]; then
    echo "✅ Build complete! Package: beedoc.deb"
else
    echo "⚠️  Package may be in a different location"
    find . -name "beedoc*.deb" -type f
fi

echo ""
echo "🎉 Build complete!"
echo ""
echo "To install:"
echo "  sudo dpkg -i beedoc.deb"
echo ""
echo "To run:"
echo "  pake-beedoc"
